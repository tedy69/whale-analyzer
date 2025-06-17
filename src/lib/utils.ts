import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function calculatePercentage(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

export function getRiskColor(riskScore: number): string {
  if (riskScore >= 80) return 'text-red-500';
  if (riskScore >= 60) return 'text-orange-500';
  if (riskScore >= 40) return 'text-yellow-500';
  return 'text-green-500';
}

export function getRiskLevel(riskScore: number): string {
  if (riskScore >= 80) return 'CRITICAL';
  if (riskScore >= 60) return 'HIGH';
  if (riskScore >= 40) return 'MEDIUM';
  if (riskScore >= 20) return 'LOW';
  return 'MINIMAL';
}
