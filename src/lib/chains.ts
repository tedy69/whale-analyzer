import axios from 'axios';

export interface ChainConfig {
  chainId: number;
  name: string;
  displayName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  blockExplorer: string;
  logo: string;
  logo_url?: string;
  white_logo_url?: string;
  black_logo_url?: string;
  color: string;
  isMainnet: boolean;
  covalentSupported: boolean;
  defiProtocols: string[];
}

// Covalent Chain API Response Interface - Enhanced based on actual API response
interface CovalentChain {
  name: string;
  chain_id: string;
  is_testnet: boolean;
  db_schema_name: string;
  label: string;
  category_label: string;
  logo_url: string;
  black_logo_url: string;
  white_logo_url: string;
  is_appchain: boolean;
  // Additional fields from Covalent API
  native_token?: {
    contract_decimals: number;
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    supports_erc?: string[];
    logo_url: string;
  };
  // Chain-specific metadata
  prices?: unknown[];
  synced_block_height?: number;
  synced_blocked_signed_at?: string;
}

interface CovalentChainsResponse {
  data: {
    items: CovalentChain[];
  };
  error: boolean;
  error_message: string | null;
  error_code: number | null;
}

const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
const BASE_URL = 'https://api.covalenthq.com/v1';

// Validate API key on module initialization
if (!COVALENT_API_KEY) {
  console.error('⚠️  COVALENT_API_KEY is not set in environment variables');
  console.error('Please ensure your .env.local file contains: COVALENT_API_KEY=your_api_key_here');
}

// Cache for chain data
let cachedChains: Record<number, ChainConfig> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Fallback chain configurations (used when API fails)
const FALLBACK_CHAINS: Record<number, ChainConfig> = {
  1: {
    chainId: 1,
    name: 'ethereum',
    displayName: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    logo: '🔷',
    color: '#627EEA',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['Uniswap', 'Aave', 'Compound', 'MakerDAO', 'Curve'],
  },
  137: {
    chainId: 137,
    name: 'polygon',
    displayName: 'Polygon',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrl: 'https://polygon.llamarpc.com',
    blockExplorer: 'https://polygonscan.com',
    logo: '🔮',
    color: '#8247E5',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['QuickSwap', 'Aave', 'Curve', 'SushiSwap'],
  },
  56: {
    chainId: 56,
    name: 'bsc',
    displayName: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrl: 'https://bsc.publicnode.com',
    blockExplorer: 'https://bscscan.com',
    logo: '🟡',
    color: '#F3BA2F',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['PancakeSwap', 'Venus', 'Alpaca Finance'],
  },
  43114: {
    chainId: 43114,
    name: 'avalanche',
    displayName: 'Avalanche',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    rpcUrl: 'https://avalanche.public-rpc.com',
    blockExplorer: 'https://snowtrace.io',
    logo: '🔺',
    color: '#E84142',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['Trader Joe', 'Aave', 'Benqi', 'Curve'],
  },
  250: {
    chainId: 250,
    name: 'fantom',
    displayName: 'Fantom',
    nativeCurrency: { name: 'FTM', symbol: 'FTM', decimals: 18 },
    rpcUrl: 'https://rpc.fantom.network',
    blockExplorer: 'https://ftmscan.com',
    logo: '👻',
    color: '#1969FF',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['SpookySwap', 'Geist Finance', 'Curve'],
  },
  42161: {
    chainId: 42161,
    name: 'arbitrum',
    displayName: 'Arbitrum One',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://arbitrum.public-rpc.com',
    blockExplorer: 'https://arbiscan.io',
    logo: '🔵',
    color: '#2D374B',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['Uniswap V3', 'Aave', 'Curve', 'GMX'],
  },
  10: {
    chainId: 10,
    name: 'optimism',
    displayName: 'Optimism',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://optimism.public-rpc.com',
    blockExplorer: 'https://optimistic.etherscan.io',
    logo: '🔴',
    color: '#FF0420',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['Uniswap V3', 'Aave', 'Curve', 'Synthetix'],
  },
  8453: {
    chainId: 8453,
    name: 'base',
    displayName: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: 'https://base.public-rpc.com',
    blockExplorer: 'https://basescan.org',
    logo: '🔵',
    color: '#0052FF',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['Uniswap V3', 'Aave', 'Compound'],
  },
  25: {
    chainId: 25,
    name: 'cronos',
    displayName: 'Cronos',
    nativeCurrency: { name: 'CRO', symbol: 'CRO', decimals: 18 },
    rpcUrl: 'https://evm.cronos.org',
    blockExplorer: 'https://cronoscan.com',
    logo: '🐴',
    color: '#003D6B',
    isMainnet: true,
    covalentSupported: true,
    defiProtocols: ['VVS Finance', 'Tectonic'],
  },
};

export const CHAIN_PRIORITIES = [1, 137, 56, 43114, 42161, 10, 8453, 250, 25];

// Function to fetch chains from Covalent API
export async function fetchCovalentChains(): Promise<Record<number, ChainConfig>> {
  try {
    // Check if API key is available
    if (!COVALENT_API_KEY) {
      console.warn('COVALENT_API_KEY is not available, using fallback chains');
      return FALLBACK_CHAINS;
    }

    const response = await axios.get(`${BASE_URL}/chains/`, {
      headers: {
        Authorization: `Bearer ${COVALENT_API_KEY}`,
      },
    });

    const chainsResponse: CovalentChainsResponse = response.data;

    if (chainsResponse.error) {
      console.warn('Covalent chains API error:', chainsResponse.error_message);
      return FALLBACK_CHAINS;
    }

    const supportedChains: Record<number, ChainConfig> = {};

    chainsResponse.data.items.forEach((chain: CovalentChain) => {
      // Only include mainnet chains that are not testnets
      if (!chain.is_testnet && chain.chain_id) {
        const chainId = parseInt(chain.chain_id);

        if (!isNaN(chainId)) {
          supportedChains[chainId] = {
            chainId,
            name: chain.name,
            displayName: chain.label || chain.name,
            nativeCurrency: extractNativeCurrency(chain),
            rpcUrl: generateRpcUrl(chainId, chain.name),
            blockExplorer: generateBlockExplorer(chainId, chain.name),
            logo: chain.logo_url || chain.white_logo_url || chain.black_logo_url || '⚡',
            logo_url: chain.logo_url,
            white_logo_url: chain.white_logo_url,
            black_logo_url: chain.black_logo_url,
            color: generateChainColor(chainId, chain.name),
            isMainnet: !chain.is_testnet,
            covalentSupported: true,
            defiProtocols: estimateDefiProtocols(chainId, chain.name),
          };
        }
      }
    });

    return supportedChains;
  } catch (error) {
    console.error('Failed to fetch chains from Covalent API:', error);
    return FALLBACK_CHAINS;
  }
}

// Helper functions that work with real API data
function extractNativeCurrency(chain: CovalentChain) {
  // Use native token data from API if available
  if (chain.native_token) {
    return {
      name: chain.native_token.contract_name || 'Unknown',
      symbol: chain.native_token.contract_ticker_symbol || 'UNK',
      decimals: chain.native_token.contract_decimals || 18,
    };
  }

  // Smart fallbacks based on chain name/label
  const chainName = chain.name.toLowerCase();
  const chainLabel = chain.label.toLowerCase();

  if (chainName.includes('ethereum') || chainLabel.includes('ethereum')) {
    return { name: 'Ether', symbol: 'ETH', decimals: 18 };
  }
  if (chainName.includes('polygon') || chainLabel.includes('polygon')) {
    return { name: 'MATIC', symbol: 'MATIC', decimals: 18 };
  }
  if (chainName.includes('bsc') || chainLabel.includes('binance') || chainLabel.includes('bnb')) {
    return { name: 'BNB', symbol: 'BNB', decimals: 18 };
  }
  if (chainName.includes('avalanche') || chainLabel.includes('avalanche')) {
    return { name: 'AVAX', symbol: 'AVAX', decimals: 18 };
  }
  if (chainName.includes('fantom') || chainLabel.includes('fantom')) {
    return { name: 'FTM', symbol: 'FTM', decimals: 18 };
  }
  if (chainName.includes('arbitrum') || chainLabel.includes('arbitrum')) {
    return { name: 'Ether', symbol: 'ETH', decimals: 18 };
  }
  if (chainName.includes('optimism') || chainLabel.includes('optimism')) {
    return { name: 'Ether', symbol: 'ETH', decimals: 18 };
  }
  if (chainName.includes('base') || chainLabel.includes('base')) {
    return { name: 'Ether', symbol: 'ETH', decimals: 18 };
  }
  if (chainName.includes('cronos') || chainLabel.includes('cronos')) {
    return { name: 'CRO', symbol: 'CRO', decimals: 18 };
  }

  // Default fallback
  return { name: 'Unknown', symbol: 'UNK', decimals: 18 };
}

function generateRpcUrl(chainId: number, chainName: string): string {
  // Generate RPC URLs based on chain ID and name
  const name = chainName.toLowerCase();

  if (chainId === 1 || name.includes('ethereum')) {
    return 'https://eth.llamarpc.com';
  }
  if (chainId === 137 || name.includes('polygon')) {
    return 'https://polygon.llamarpc.com';
  }
  if (chainId === 56 || name.includes('bsc') || name.includes('binance')) {
    return 'https://bsc.llamarpc.com';
  }
  if (chainId === 43114 || name.includes('avalanche')) {
    return 'https://avalanche.public-rpc.com';
  }
  if (chainId === 250 || name.includes('fantom')) {
    return 'https://rpc.ftm.tools';
  }
  if (chainId === 42161 || name.includes('arbitrum')) {
    return 'https://arbitrum.public-rpc.com';
  }
  if (chainId === 10 || name.includes('optimism')) {
    return 'https://optimism.public-rpc.com';
  }
  if (chainId === 8453 || name.includes('base')) {
    return 'https://base.public-rpc.com';
  }
  if (chainId === 25 || name.includes('cronos')) {
    return 'https://evm.cronos.org';
  }

  // Generic fallback
  return `https://rpc.chain${chainId}.com`;
}

function generateBlockExplorer(chainId: number, chainName: string): string {
  // Generate block explorer URLs based on chain ID and name
  const name = chainName.toLowerCase();

  if (chainId === 1 || name.includes('ethereum')) {
    return 'https://etherscan.io';
  }
  if (chainId === 137 || name.includes('polygon')) {
    return 'https://polygonscan.com';
  }
  if (chainId === 56 || name.includes('bsc') || name.includes('binance')) {
    return 'https://bscscan.com';
  }
  if (chainId === 43114 || name.includes('avalanche')) {
    return 'https://snowtrace.io';
  }
  if (chainId === 250 || name.includes('fantom')) {
    return 'https://ftmscan.com';
  }
  if (chainId === 42161 || name.includes('arbitrum')) {
    return 'https://arbiscan.io';
  }
  if (chainId === 10 || name.includes('optimism')) {
    return 'https://optimistic.etherscan.io';
  }
  if (chainId === 8453 || name.includes('base')) {
    return 'https://basescan.org';
  }
  if (chainId === 25 || name.includes('cronos')) {
    return 'https://cronoscan.com';
  }

  // Generic fallback
  return `https://explorer.chain${chainId}.com`;
}

function generateChainColor(chainId: number, chainName: string): string {
  // Generate colors based on chain characteristics
  const name = chainName.toLowerCase();

  if (chainId === 1 || name.includes('ethereum')) {
    return '#627EEA';
  }
  if (chainId === 137 || name.includes('polygon')) {
    return '#8247E5';
  }
  if (chainId === 56 || name.includes('bsc') || name.includes('binance')) {
    return '#F3BA2F';
  }
  if (chainId === 43114 || name.includes('avalanche')) {
    return '#E84142';
  }
  if (chainId === 250 || name.includes('fantom')) {
    return '#1969FF';
  }
  if (chainId === 42161 || name.includes('arbitrum')) {
    return '#2D374B';
  }
  if (chainId === 10 || name.includes('optimism')) {
    return '#FF0420';
  }
  if (chainId === 8453 || name.includes('base')) {
    return '#0052FF';
  }
  if (chainId === 25 || name.includes('cronos')) {
    return '#002D74';
  }

  // Generate a deterministic color based on chain ID
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#10b981',
    '#06b6d4',
    '#3b82f6',
  ];
  return colors[chainId % colors.length];
}

function estimateDefiProtocols(chainId: number, chainName: string): string[] {
  // Estimate likely DeFi protocols based on chain
  const name = chainName.toLowerCase();

  if (chainId === 1 || name.includes('ethereum')) {
    return ['Uniswap', 'Aave', 'Compound', 'MakerDAO', 'Curve'];
  }
  if (chainId === 137 || name.includes('polygon')) {
    return ['QuickSwap', 'Aave', 'Curve', 'SushiSwap'];
  }
  if (chainId === 56 || name.includes('bsc') || name.includes('binance')) {
    return ['PancakeSwap', 'Venus', 'Alpaca', 'Biswap'];
  }
  if (chainId === 43114 || name.includes('avalanche')) {
    return ['Trader Joe', 'Aave', 'Benqi', 'Pangolin'];
  }
  if (chainId === 250 || name.includes('fantom')) {
    return ['SpookySwap', 'Beethoven X', 'Geist', 'Tarot'];
  }
  if (chainId === 42161 || name.includes('arbitrum')) {
    return ['GMX', 'Uniswap', 'SushiSwap', 'Balancer'];
  }
  if (chainId === 10 || name.includes('optimism')) {
    return ['Velodrome', 'Uniswap', 'Aave', 'Synthetix'];
  }
  if (chainId === 8453 || name.includes('base')) {
    return ['Aerodrome', 'Uniswap', 'Compound', 'SushiSwap'];
  }
  if (chainId === 25 || name.includes('cronos')) {
    return ['VVS Finance', 'MM Finance', 'Tectonic', 'Ferro'];
  }

  // Generic DeFi protocols for unknown chains
  return ['Uniswap', 'SushiSwap'];
}

// Main function to get supported chains (with caching)
export async function getSupportedChains(): Promise<Record<number, ChainConfig>> {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (cachedChains && now - lastFetchTime < CACHE_DURATION) {
    return cachedChains;
  }

  try {
    // Fetch fresh data from Covalent API
    const chains = await fetchCovalentChains();
    cachedChains = chains;
    lastFetchTime = now;
    return chains;
  } catch (error) {
    console.error('Failed to get supported chains:', error);
    // Return fallback if cache is empty
    return cachedChains || FALLBACK_CHAINS;
  }
}

export class ChainUtils {
  static async getChainConfig(chainId: number): Promise<ChainConfig | null> {
    const chains = await getSupportedChains();
    return chains[chainId] ?? null;
  }

  static async getAllChains(): Promise<ChainConfig[]> {
    const chains = await getSupportedChains();
    return Object.values(chains);
  }

  static async getMainnetChains(): Promise<ChainConfig[]> {
    const chains = await getSupportedChains();
    return Object.values(chains).filter((chain) => chain.isMainnet);
  }

  static async getCovalentSupportedChains(): Promise<ChainConfig[]> {
    const chains = await getSupportedChains();
    return Object.values(chains).filter((chain) => chain.covalentSupported);
  }

  static async getChainName(chainId: number): Promise<string> {
    const config = await this.getChainConfig(chainId);
    return config?.displayName ?? `Chain ${chainId}`;
  }

  static async getChainLogo(chainId: number): Promise<string> {
    const config = await this.getChainConfig(chainId);
    return config?.logo ?? '⛓️';
  }

  static async getChainColor(chainId: number): Promise<string> {
    const config = await this.getChainConfig(chainId);
    return config?.color ?? '#6B7280';
  }

  static async formatChainValue(value: number, chainId: number): Promise<string> {
    const config = await this.getChainConfig(chainId);
    const symbol = config?.nativeCurrency.symbol ?? 'TOKEN';
    return `${value.toFixed(4)} ${symbol}`;
  }

  static async isEVMChain(chainId: number): Promise<boolean> {
    const chains = await getSupportedChains();
    return Object.keys(chains).includes(chainId.toString());
  }

  static async getExplorerUrl(
    chainId: number,
    hash: string,
    type: 'tx' | 'address' = 'tx',
  ): Promise<string> {
    const config = await this.getChainConfig(chainId);
    if (!config) return '#';

    return `${config.blockExplorer}/${type === 'tx' ? 'tx' : 'address'}/${hash}`;
  }

  static async getPriorityChains(): Promise<ChainConfig[]> {
    const chains = await getSupportedChains();
    return CHAIN_PRIORITIES.map((chainId) => chains[chainId]).filter(Boolean);
  }
}

// Helper functions to get the appropriate logo based on theme
export function getChainLogoForDarkMode(chain: ChainConfig): string {
  // For dark mode, prefer white logo, then regular logo, then black logo, then fallback
  return chain.white_logo_url ?? chain.logo_url ?? chain.black_logo_url ?? chain.logo;
}

export function getChainLogoForLightMode(chain: ChainConfig): string {
  // For light mode, prefer black logo, then regular logo, then white logo, then fallback
  return chain.black_logo_url ?? chain.logo_url ?? chain.white_logo_url ?? chain.logo;
}

// Helper functions for ChainData logo selection
export function getChainDataLogoForDarkMode(chain: {
  chainLogo: string;
  logo_url?: string;
  white_logo_url?: string;
  black_logo_url?: string;
}): string {
  // For dark mode, prefer white logo, then regular logo, then black logo, then fallback
  return chain.white_logo_url ?? chain.logo_url ?? chain.black_logo_url ?? chain.chainLogo;
}

export function getChainDataLogoForLightMode(chain: {
  chainLogo: string;
  logo_url?: string;
  white_logo_url?: string;
  black_logo_url?: string;
}): string {
  // For light mode, prefer black logo, then regular logo, then white logo, then fallback
  return chain.black_logo_url ?? chain.logo_url ?? chain.white_logo_url ?? chain.chainLogo;
}

// Legacy synchronous access to fallback chains (for backward compatibility)
export const SUPPORTED_CHAINS = FALLBACK_CHAINS;
