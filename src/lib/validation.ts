/**
 * Validation utilities for Web3 addresses and parameters
 */

/**
 * Validates if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Remove 0x prefix if present
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;

  // Check if it's 40 hexadecimal characters
  return /^[a-fA-F0-9]{40}$/.test(cleanAddress);
}

/**
 * Validates if a chain ID is supported
 */
export function isValidChainId(chainId: number): boolean {
  const supportedChains = [1, 56, 137, 43114, 250, 42161, 10]; // Add more as needed
  return supportedChains.includes(chainId);
}

/**
 * Validates analysis mode
 */
export function isValidAnalysisMode(mode: string): mode is 'single-chain' | 'multi-chain' {
  return mode === 'single-chain' || mode === 'multi-chain';
}

/**
 * Sanitizes and validates wallet address input
 */
export function sanitizeAddress(address: string): string {
  if (!address || typeof address !== 'string') {
    throw new Error('Invalid address input');
  }

  const trimmed = address.trim();

  if (!isValidAddress(trimmed)) {
    throw new Error('Invalid Ethereum address format');
  }

  // Ensure it starts with 0x
  return trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`;
}

/**
 * Validates and sanitizes analysis parameters
 */
export interface AnalysisParams {
  address: string;
  chain?: number;
  mode: 'single-chain' | 'multi-chain';
}

export function validateAnalysisParams(params: unknown): AnalysisParams {
  if (!params || typeof params !== 'object') {
    throw new Error('Invalid parameters object');
  }

  const paramObj = params as Record<string, unknown>;
  const { address, chain, mode = 'multi-chain' } = paramObj;

  if (!address || typeof address !== 'string') {
    throw new Error('Address is required and must be a string');
  }

  const sanitizedAddress = sanitizeAddress(address);

  if (chain !== undefined) {
    if (typeof chain !== 'string' && typeof chain !== 'number') {
      throw new Error('Chain must be a string or number');
    }
    const chainId = typeof chain === 'string' ? parseInt(chain, 10) : chain;
    if (isNaN(chainId) || !isValidChainId(chainId)) {
      throw new Error('Invalid chain ID');
    }
  }

  if (typeof mode !== 'string' || !isValidAnalysisMode(mode)) {
    throw new Error('Invalid analysis mode');
  }

  return {
    address: sanitizedAddress,
    chain: chain ? (typeof chain === 'string' ? parseInt(chain, 10) : chain) : undefined,
    mode,
  };
}
