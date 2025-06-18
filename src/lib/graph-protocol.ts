/**
 * DeFi Protocol integration using real data providers
 * Replaces deprecated The Graph Protocol with Alchemy/Moralis data
 */

import { defiDataProvider } from './defi-provider';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AavePosition {
  id: string;
  user: string;
  reserve: {
    symbol: string;
    name: string;
    decimals: number;
    underlyingAsset: string;
  };
  currentATokenBalance: string;
  currentStableDebt: string;
  currentVariableDebt: string;
  liquidityRate: string;
  stableBorrowRate: string;
  variableBorrowRate: string;
}

export interface CompoundPosition {
  id: string;
  account: string;
  market: {
    symbol: string;
    name: string;
    underlyingSymbol: string;
    underlyingAddress: string;
  };
  enteredMarket: boolean;
  cTokenBalance: string;
  totalUnderlyingSupplied: string;
  totalUnderlyingBorrowed: string;
  totalUnderlyingRedeemed: string;
  totalUnderlyingRepaid: string;
  supplyBalanceUnderlying: string;
  borrowBalanceUnderlying: string;
}

export interface LiquidationRisk {
  protocol: 'aave' | 'compound';
  healthFactor?: number;
  collateralValue: number;
  borrowValue: number;
  liquidationThreshold: number;
  riskLevel: RiskLevel;
  recommendations: string[];
}

class GraphProtocolService {
  async getDeFiAnalysis(address: string): Promise<{
    aave: {
      positions: AavePosition[];
      liquidationRisk: LiquidationRisk;
    };
    compound: {
      positions: CompoundPosition[];
      liquidationRisk: LiquidationRisk;
    };
    totalRisk: RiskLevel;
    overallRecommendations: string[];
  }> {
    try {
      const defiAnalysis = await defiDataProvider.getDeFiAnalysis(address, 1);

      const aavePositions: AavePosition[] = defiAnalysis.positions
        .filter((pos) => pos.protocol === 'aave')
        .map((pos) => this.transformToAavePosition(pos));

      const compoundPositions: CompoundPosition[] = defiAnalysis.positions
        .filter((pos) => pos.protocol === 'compound')
        .map((pos) => this.transformToCompoundPosition(pos));

      const aaveSupplied = defiAnalysis.positions
        .filter((pos) => pos.protocol === 'aave')
        .reduce((sum, pos) => sum + pos.suppliedUsd, 0);

      const aaveBorrowed = defiAnalysis.positions
        .filter((pos) => pos.protocol === 'aave')
        .reduce((sum, pos) => sum + pos.borrowedUsd, 0);

      const compoundSupplied = defiAnalysis.positions
        .filter((pos) => pos.protocol === 'compound')
        .reduce((sum, pos) => sum + pos.suppliedUsd, 0);

      const compoundBorrowed = defiAnalysis.positions
        .filter((pos) => pos.protocol === 'compound')
        .reduce((sum, pos) => sum + pos.borrowedUsd, 0);

      const aaveLiquidationRisk: LiquidationRisk = {
        protocol: 'aave',
        healthFactor: defiAnalysis.liquidationRisk.healthFactor,
        collateralValue: aaveSupplied,
        borrowValue: aaveBorrowed,
        liquidationThreshold: 0.85,
        riskLevel: defiAnalysis.liquidationRisk.riskLevel,
        recommendations: defiAnalysis.liquidationRisk.recommendations,
      };

      const compoundLiquidationRisk: LiquidationRisk = {
        protocol: 'compound',
        healthFactor: defiAnalysis.liquidationRisk.healthFactor,
        collateralValue: compoundSupplied,
        borrowValue: compoundBorrowed,
        liquidationThreshold: 0.8,
        riskLevel: defiAnalysis.liquidationRisk.riskLevel,
        recommendations: defiAnalysis.liquidationRisk.recommendations,
      };

      return {
        aave: {
          positions: aavePositions,
          liquidationRisk: aaveLiquidationRisk,
        },
        compound: {
          positions: compoundPositions,
          liquidationRisk: compoundLiquidationRisk,
        },
        totalRisk: defiAnalysis.liquidationRisk.riskLevel,
        overallRecommendations: defiAnalysis.recommendations,
      };
    } catch (error) {
      console.error('❌ Error fetching real DeFi data:', error);

      return {
        aave: {
          positions: [],
          liquidationRisk: {
            protocol: 'aave',
            collateralValue: 0,
            borrowValue: 0,
            liquidationThreshold: 0.85,
            riskLevel: 'low',
            recommendations: ['No Aave positions detected or data unavailable.'],
          },
        },
        compound: {
          positions: [],
          liquidationRisk: {
            protocol: 'compound',
            collateralValue: 0,
            borrowValue: 0,
            liquidationThreshold: 0.8,
            riskLevel: 'low',
            recommendations: ['No Compound positions detected or data unavailable.'],
          },
        },
        totalRisk: 'low',
        overallRecommendations: [
          'Unable to fetch DeFi data. Please check your API configuration.',
          'Ensure Alchemy or Moralis API keys are properly configured.',
        ],
      };
    }
  }

  async getAavePositions(address: string): Promise<AavePosition[]> {
    const analysis = await this.getDeFiAnalysis(address);
    return analysis.aave.positions;
  }

  async getCompoundPositions(address: string): Promise<CompoundPosition[]> {
    const analysis = await this.getDeFiAnalysis(address);
    return analysis.compound.positions;
  }

  private transformToAavePosition(position: {
    id: string;
    user: string;
    asset: { symbol: string; name: string; decimals: number; address: string };
    supplied: string;
    borrowed: string;
    apy: number;
  }): AavePosition {
    return {
      id: position.id,
      user: position.user,
      reserve: {
        symbol: position.asset.symbol,
        name: position.asset.name,
        decimals: position.asset.decimals,
        underlyingAsset: position.asset.address,
      },
      currentATokenBalance: position.supplied,
      currentStableDebt: '0',
      currentVariableDebt: position.borrowed,
      liquidityRate: '0',
      stableBorrowRate: '0',
      variableBorrowRate: position.apy.toString(),
    };
  }

  private transformToCompoundPosition(position: {
    id: string;
    user: string;
    asset: { symbol: string; name: string; decimals: number; address: string };
    supplied: string;
    borrowed: string;
    apy: number;
  }): CompoundPosition {
    return {
      id: position.id,
      account: position.user,
      market: {
        symbol: `c${position.asset.symbol}`,
        name: `Compound ${position.asset.name}`,
        underlyingSymbol: position.asset.symbol,
        underlyingAddress: position.asset.address,
      },
      enteredMarket: true,
      cTokenBalance: position.supplied,
      totalUnderlyingSupplied: position.supplied,
      totalUnderlyingBorrowed: position.borrowed,
      totalUnderlyingRedeemed: '0',
      totalUnderlyingRepaid: '0',
      supplyBalanceUnderlying: position.supplied,
      borrowBalanceUnderlying: position.borrowed,
    };
  }
}

export const graphProtocolService = new GraphProtocolService();
