export interface WalletData {
  address: string;
  totalBalance: number;
  tokenBalances: TokenBalance[];
  transactions: Transaction[];
  whaleScore: number;
  liquidationRisk: LiquidationRisk;
  aiSummary?: string;
  chains: ChainData[];
  crossChainMetrics: CrossChainMetrics;
}

export interface ChainData {
  chainId: number;
  chainName: string;
  chainLogo: string; // URL from Covalent API (logo_url, white_logo_url, or black_logo_url)
  logo_url?: string;
  white_logo_url?: string;
  black_logo_url?: string;
  nativeCurrency: string;
  totalValue: number;
  tokenCount: number;
  transactionCount: number;
  defiValue: number;
  stakingValue: number;
  isActive: boolean;
}

export interface CrossChainMetrics {
  totalChains: number;
  dominantChain: string;
  chainDistribution: ChainDistribution[];
  bridgeActivity: BridgeActivity[];
  multiChainScore: number;
}

export interface ChainDistribution {
  chainName: string;
  chainId: number;
  percentage: number;
  value: number;
  color: string;
}

export interface BridgeActivity {
  fromChain: string;
  toChain: string;
  volume: number;
  transactionCount: number;
  lastActivity: string;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  logo?: string;
  contractAddress: string;
  chainId: number;
  chainName: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  timestamp: string;
  type: 'transfer' | 'swap' | 'stake' | 'lend' | 'borrow' | 'bridge';
  token?: string;
  gasUsed: number;
  chainId: number;
  chainName: string;
  bridgeDestination?: string;
}

export interface LiquidationRisk {
  totalBorrowed: number;
  totalCollateral: number;
  healthFactor: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  positions: LendingPosition[];
}

export interface LendingPosition {
  protocol: string;
  asset: string;
  supplied: number;
  borrowed: number;
  apy: number;
  ltv: number;
  liquidationThreshold: number;
  healthFactor: number;
}

export interface WhaleMetrics {
  totalValue: number;
  largeTransactions: number;
  stakingValue: number;
  lendingValue: number;
  nftValue: number;
  uniqueTokens: number;
  averageTransactionSize: number;
  score: number;
}

export interface AIAnalysis {
  summary: string;
  keyFindings: string[];
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
}
