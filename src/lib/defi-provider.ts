/**
 * Real DeFi Data Provider
 * Replaces deprecated The Graph Protocol with real data from Alchemy and Moralis
 */

import { AlchemyProvider } from './providers/alchemy';
import { MoralisProvider } from './providers/moralis';

// Interface for adapting different API response formats
interface TokenBalanceData {
  contractAddress?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  balance?: number | string;
  tokenBalance?: string;
  usdValue?: number;
  value?: number;
  metadata?: {
    symbol?: string;
    name?: string;
    decimals?: number;
  };
}

interface TransactionData {
  to?: string;
  value?: number | string;
  hash?: string;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface DeFiPosition {
  id: string;
  protocol: 'aave' | 'compound' | 'makerdao' | 'uniswap-v3' | 'other';
  user: string;
  asset: {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  };
  supplied: string;
  borrowed: string;
  suppliedUsd: number;
  borrowedUsd: number;
  apy: number;
  healthFactor?: number;
}

export interface LiquidationRisk {
  protocol: string;
  healthFactor?: number;
  collateralValue: number;
  borrowValue: number;
  liquidationThreshold: number;
  riskLevel: RiskLevel;
  recommendations: string[];
}

export interface DeFiAnalysis {
  positions: DeFiPosition[];
  totalSuppliedUsd: number;
  totalBorrowedUsd: number;
  netWorthUsd: number;
  liquidationRisk: LiquidationRisk;
  protocols: string[];
  recommendations: string[];
}

// Known DeFi protocol addresses for detection
const DEFI_PROTOCOLS = {
  // Aave V3 Ethereum
  aaveV3Pool: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'.toLowerCase(),
  aaveV3PoolDataProvider: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3'.toLowerCase(),

  // Aave V2 Ethereum
  aaveV2LendingPool: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'.toLowerCase(),

  // Compound V3
  compoundV3USDC: '0xc3d688B66703497DAA19211EEdff47f25384cdc3'.toLowerCase(),
  compoundV3ETH: '0xA17581A9E3356d9A858b789D68B4d866e593aE94'.toLowerCase(),

  // Compound V2
  cUSDC: '0x39AA39c021dfbaE8faC545936693aC917d5E7563'.toLowerCase(),
  cETH: '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5'.toLowerCase(),
  cDAI: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643'.toLowerCase(),

  // MakerDAO
  daiJoin: '0x9759A6Ac90977b93B58547b4A71c78317f391A28'.toLowerCase(),
  cdpManager: '0x5ef30b9986345249bc32d8928B7ee64DE9435E39'.toLowerCase(),

  // Uniswap V3 positions
  uniswapV3Positions: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'.toLowerCase(),
} as const;

// ERC-20 token addresses for common DeFi assets
const DEFI_TOKENS = {
  USDC: '0xA0b86a33E6c08D1aa6a7e5C12f7f8a58D1e47F1a'.toLowerCase(),
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'.toLowerCase(),
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F'.toLowerCase(),
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'.toLowerCase(),
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'.toLowerCase(),
} as const;

class DeFiDataProvider {
  private static instance: DeFiDataProvider;

  static getInstance(): DeFiDataProvider {
    if (!DeFiDataProvider.instance) {
      DeFiDataProvider.instance = new DeFiDataProvider();
    }
    return DeFiDataProvider.instance;
  }

  async getDeFiAnalysis(address: string, chainId: number = 1): Promise<DeFiAnalysis> {
    try {
      // Get token balances to detect DeFi protocol tokens
      const positions = await this.detectDeFiPositions(address, chainId);

      // Calculate totals
      const totalSuppliedUsd = positions.reduce((sum, pos) => sum + pos.suppliedUsd, 0);
      const totalBorrowedUsd = positions.reduce((sum, pos) => sum + pos.borrowedUsd, 0);
      const netWorthUsd = totalSuppliedUsd - totalBorrowedUsd;

      // Assess liquidation risk
      const liquidationRisk = this.assessLiquidationRisk(
        positions,
        totalSuppliedUsd,
        totalBorrowedUsd,
      );

      // Get unique protocols
      const protocols = [...new Set(positions.map((pos) => pos.protocol))];

      // Generate recommendations
      const recommendations = this.generateRecommendations(positions, liquidationRisk);

      return {
        positions,
        totalSuppliedUsd,
        totalBorrowedUsd,
        netWorthUsd,
        liquidationRisk,
        protocols,
        recommendations,
      };
    } catch (error) {
      console.error('❌ Error analyzing DeFi positions:', error);
      throw new Error('Failed to analyze DeFi positions');
    }
  }

  private async detectDeFiPositions(address: string, chainId: number): Promise<DeFiPosition[]> {
    const positions: DeFiPosition[] = [];

    try {
      // Try Alchemy first, then fallback to Moralis
      let tokenBalances;

      if (AlchemyProvider.isAvailable() && AlchemyProvider.isChainSupported(chainId)) {
        tokenBalances = await AlchemyProvider.getTokenBalances(address, chainId);
      } else if (MoralisProvider.isAvailable() && MoralisProvider.isChainSupported(chainId)) {
        tokenBalances = await MoralisProvider.getTokenBalances(address, chainId);
      } else {
        throw new Error('No available data provider for DeFi analysis');
      }

      // Analyze token balances for DeFi protocol tokens
      for (const balance of tokenBalances) {
        const defiPosition = await this.analyzeTokenForDeFi(balance, address);
        if (defiPosition) {
          positions.push(defiPosition);
        }
      }

      // Get transaction history to detect DeFi interactions
      const defiFromTransactions = await this.detectDeFiFromTransactions(address, chainId);
      positions.push(...defiFromTransactions);

      return this.deduplicatePositions(positions);
    } catch (error) {
      console.warn('⚠️ Error detecting DeFi positions:', error);
      return [];
    }
  }

  private async analyzeTokenForDeFi(
    balance: TokenBalanceData,
    userAddress: string,
  ): Promise<DeFiPosition | null> {
    const tokenAddress = balance.contractAddress?.toLowerCase();
    const symbol = balance.symbol || balance.metadata?.symbol || 'Unknown';
    const amount =
      typeof balance.balance === 'number'
        ? balance.balance.toString()
        : balance.balance || balance.tokenBalance || '0';
    const usdValue = balance.usdValue || balance.value || 0;

    if (!tokenAddress) return null;

    // Check if this is a known DeFi protocol token
    if (this.isAaveToken(symbol)) {
      return {
        id: `${userAddress}-${tokenAddress}-aave`,
        protocol: 'aave',
        user: userAddress,
        asset: {
          symbol: symbol.replace('a', ''), // Remove 'a' prefix for underlying asset
          name: balance.name || balance.metadata?.name || symbol,
          address: tokenAddress,
          decimals: balance.decimals || balance.metadata?.decimals || 18,
        },
        supplied: amount,
        borrowed: '0', // Would need additional API calls to get borrowed amount
        suppliedUsd: usdValue,
        borrowedUsd: 0,
        apy: 0, // Would need additional API call for current APY
      };
    }

    if (this.isCompoundToken(symbol)) {
      return {
        id: `${userAddress}-${tokenAddress}-compound`,
        protocol: 'compound',
        user: userAddress,
        asset: {
          symbol: symbol.replace('c', ''), // Remove 'c' prefix for underlying asset
          name: balance.name || balance.metadata?.name || symbol,
          address: tokenAddress,
          decimals: balance.decimals || balance.metadata?.decimals || 18,
        },
        supplied: amount,
        borrowed: '0',
        suppliedUsd: usdValue,
        borrowedUsd: 0,
        apy: 0,
      };
    }

    return null;
  }

  private async detectDeFiFromTransactions(
    address: string,
    chainId: number,
  ): Promise<DeFiPosition[]> {
    const positions: DeFiPosition[] = [];

    try {
      let transactions;

      if (AlchemyProvider.isAvailable() && AlchemyProvider.isChainSupported(chainId)) {
        transactions = await AlchemyProvider.getTransactionHistory(address, chainId);
      } else if (MoralisProvider.isAvailable() && MoralisProvider.isChainSupported(chainId)) {
        transactions = await MoralisProvider.getTransactionHistory(address, chainId);
      } else {
        return positions;
      }

      // Analyze recent transactions for DeFi protocol interactions
      for (const tx of transactions.slice(0, 20)) {
        // Check last 20 transactions
        const defiInteraction = this.analyzeTransactionForDeFi(tx, address);
        if (defiInteraction) {
          positions.push(defiInteraction);
        }
      }

      return positions;
    } catch (error) {
      console.warn('⚠️ Error analyzing transactions for DeFi:', error);
      return [];
    }
  }

  private analyzeTransactionForDeFi(
    transaction: TransactionData,
    userAddress: string,
  ): DeFiPosition | null {
    const toAddress = transaction.to?.toLowerCase();

    // Check if transaction is to a known DeFi protocol
    for (const [protocolName, protocolAddress] of Object.entries(DEFI_PROTOCOLS)) {
      if (toAddress === protocolAddress) {
        const protocol = this.getProtocolFromAddress(protocolName);
        const value =
          typeof transaction.value === 'number'
            ? transaction.value.toString()
            : transaction.value || '0';

        return {
          id: `${userAddress}-${protocolAddress}-detected`,
          protocol,
          user: userAddress,
          asset: {
            symbol: 'ETH', // Default to ETH, would need input data analysis for exact asset
            name: 'Ethereum',
            address: DEFI_TOKENS.WETH,
            decimals: 18,
          },
          supplied: value,
          borrowed: '0',
          suppliedUsd: 0, // Would need price data
          borrowedUsd: 0,
          apy: 0,
        };
      }
    }

    return null;
  }

  private assessLiquidationRisk(
    positions: DeFiPosition[],
    totalSupplied: number,
    totalBorrowed: number,
  ): LiquidationRisk {
    const collateralizationRatio = totalBorrowed > 0 ? totalSupplied / totalBorrowed : Infinity;

    let riskLevel: RiskLevel;
    let recommendations: string[];

    if (totalBorrowed === 0) {
      riskLevel = 'low';
      recommendations = ['No borrowed positions detected. Risk is minimal.'];
    } else if (collateralizationRatio > 2.5) {
      riskLevel = 'low';
      recommendations = ['Good collateralization ratio. Monitor market conditions.'];
    } else if (collateralizationRatio > 1.5) {
      riskLevel = 'medium';
      recommendations = [
        'Consider increasing collateral or reducing debt.',
        'Monitor price movements of collateral assets.',
      ];
    } else if (collateralizationRatio > 1.2) {
      riskLevel = 'high';
      recommendations = [
        'HIGH RISK: Consider immediate action to improve health factor.',
        'Add more collateral or repay debt to avoid liquidation.',
        'Monitor positions closely for price volatility.',
      ];
    } else {
      riskLevel = 'critical';
      recommendations = [
        'CRITICAL: Immediate action required to avoid liquidation.',
        'Repay debt or add collateral immediately.',
        'Consider closing risky positions.',
      ];
    }

    return {
      protocol: 'multi-protocol',
      healthFactor: collateralizationRatio,
      collateralValue: totalSupplied,
      borrowValue: totalBorrowed,
      liquidationThreshold: 0.85, // Conservative estimate
      riskLevel,
      recommendations,
    };
  }

  private generateRecommendations(positions: DeFiPosition[], risk: LiquidationRisk): string[] {
    const recommendations: string[] = [...risk.recommendations];

    if (positions.length === 0) {
      recommendations.push(
        'No active DeFi positions detected. Consider exploring DeFi opportunities.',
      );
      return recommendations;
    }

    // Protocol-specific recommendations
    const protocols = [...new Set(positions.map((pos) => pos.protocol))];

    if (protocols.includes('aave')) {
      recommendations.push(
        'Monitor Aave interest rates and consider rate switching if beneficial.',
      );
    }

    if (protocols.includes('compound')) {
      recommendations.push('Track Compound governance proposals that may affect your positions.');
    }

    if (protocols.length > 2) {
      recommendations.push('Consider consolidating positions to reduce gas costs and complexity.');
    }

    return recommendations;
  }

  // Helper methods
  private isAaveToken(symbol: string): boolean {
    return symbol.startsWith('a') && symbol.length > 1 && symbol !== 'a';
  }

  private isCompoundToken(symbol: string): boolean {
    return symbol.startsWith('c') && symbol.length > 1 && symbol !== 'c';
  }

  private getProtocolFromAddress(
    protocolName: string,
  ): 'aave' | 'compound' | 'makerdao' | 'uniswap-v3' | 'other' {
    if (protocolName.includes('aave')) return 'aave';
    if (protocolName.includes('compound')) return 'compound';
    if (protocolName.includes('dai') || protocolName.includes('cdp')) return 'makerdao';
    if (protocolName.includes('uniswap')) return 'uniswap-v3';
    return 'other';
  }

  private deduplicatePositions(positions: DeFiPosition[]): DeFiPosition[] {
    const seen = new Set<string>();
    return positions.filter((position) => {
      const key = `${position.protocol}-${position.asset.address}-${position.user}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

export const defiDataProvider = DeFiDataProvider.getInstance();
