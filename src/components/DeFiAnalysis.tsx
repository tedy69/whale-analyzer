import { AavePosition, CompoundPosition, LiquidationRisk, RiskLevel } from '@/lib/graph-protocol';

interface DeFiAnalysisProps {
  readonly analysis: {
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
  } | null;
}

export default function DeFiAnalysis({ analysis }: DeFiAnalysisProps) {
  if (!analysis) {
    return null;
  }

  const getRiskColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getRiskBadgeColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'low':
      default:
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    }
  };

  const formatValue = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const hasAavePositions = analysis.aave.positions.length > 0;
  const hasCompoundPositions = analysis.compound.positions.length > 0;
  const hasAnyPositions = hasAavePositions || hasCompoundPositions;

  if (!hasAnyPositions) {
    return (
      <div className='glass-card p-8 card-hover'>
        <h3 className='text-2xl font-bold gradient-text mb-6 flex items-center gap-3'>
          <span className='w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse' />
          DeFi Protocol Analysis
        </h3>

        <div className='text-center py-8'>
          <div className='w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-slate-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <p className='text-slate-600 dark:text-slate-400'>
            No active DeFi positions found in Aave or Compound protocols.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Overall DeFi Risk */}
      <div className='glass-card p-8 card-hover'>
        <h3 className='text-2xl font-bold gradient-text mb-6 flex items-center gap-3'>
          <span className='w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse' />
          DeFi Protocol Analysis
        </h3>

        <div className='grid md:grid-cols-3 gap-6 mb-6'>
          <div className='text-center'>
            <div className={`text-3xl font-bold ${getRiskColor(analysis.totalRisk)} mb-2`}>
              {analysis.totalRisk.toUpperCase()}
            </div>
            <p className='text-sm text-slate-600 dark:text-slate-400'>Overall Risk Level</p>
          </div>

          <div className='text-center'>
            <div className='text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
              {hasAavePositions ? analysis.aave.positions.length : 0}
            </div>
            <p className='text-sm text-slate-600 dark:text-slate-400'>Aave Positions</p>
          </div>

          <div className='text-center'>
            <div className='text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2'>
              {hasCompoundPositions ? analysis.compound.positions.length : 0}
            </div>
            <p className='text-sm text-slate-600 dark:text-slate-400'>Compound Positions</p>
          </div>
        </div>

        {/* Overall Recommendations */}
        {analysis.overallRecommendations.length > 0 && (
          <div>
            <h4 className='font-semibold text-slate-900 dark:text-white mb-3'>
              DeFi Recommendations
            </h4>
            <ul className='space-y-2'>
              {analysis.overallRecommendations.map((recommendation, index) => (
                <li
                  key={`rec-${index}-${recommendation.slice(0, 10)}`}
                  className='flex items-start gap-3 group'>
                  <div className='w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 group-hover:scale-125 transition-transform'></div>
                  <span className='text-slate-600 dark:text-slate-400 group-hover:text-purple-400 transition-colors'>
                    {recommendation}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Aave Analysis */}
      {hasAavePositions && (
        <div className='glass-card p-8 card-hover'>
          <div className='flex items-center justify-between mb-6'>
            <h4 className='text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center'>
                <span className='text-blue-600 dark:text-blue-400 font-bold text-sm'>A</span>
              </div>
              Aave Protocol
            </h4>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(
                analysis.aave.liquidationRisk.riskLevel,
              )}`}>
              {analysis.aave.liquidationRisk.riskLevel.toUpperCase()} RISK
            </span>
          </div>

          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <div>
              <p className='text-sm text-slate-600 dark:text-slate-400 mb-1'>Total Collateral</p>
              <p className='text-xl font-bold text-green-600 dark:text-green-400'>
                {formatValue(analysis.aave.liquidationRisk.collateralValue)}
              </p>
            </div>
            <div>
              <p className='text-sm text-slate-600 dark:text-slate-400 mb-1'>Total Borrowed</p>
              <p className='text-xl font-bold text-orange-600 dark:text-orange-400'>
                {formatValue(analysis.aave.liquidationRisk.borrowValue)}
              </p>
            </div>
          </div>

          {/* Aave Positions */}
          <div className='space-y-3'>
            <h5 className='font-semibold text-slate-900 dark:text-white'>Active Positions</h5>
            {analysis.aave.positions.slice(0, 5).map((position) => (
              <div key={position.id} className='bg-slate-50 dark:bg-slate-800 rounded-lg p-4'>
                <div className='flex justify-between items-center'>
                  <span className='font-medium text-slate-900 dark:text-white'>
                    {position.reserve.symbol}
                  </span>
                  <div className='text-right'>
                    <div className='text-sm text-slate-600 dark:text-slate-400'>
                      Supplied: {parseFloat(position.currentATokenBalance).toFixed(4)}
                    </div>
                    {parseFloat(position.currentStableDebt) +
                      parseFloat(position.currentVariableDebt) >
                      0 && (
                      <div className='text-sm text-orange-600 dark:text-orange-400'>
                        Borrowed:{' '}
                        {(
                          parseFloat(position.currentStableDebt) +
                          parseFloat(position.currentVariableDebt)
                        ).toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {analysis.aave.positions.length > 5 && (
              <p className='text-sm text-slate-500 dark:text-slate-500 text-center'>
                +{analysis.aave.positions.length - 5} more positions
              </p>
            )}
          </div>
        </div>
      )}

      {/* Compound Analysis */}
      {hasCompoundPositions && (
        <div className='glass-card p-8 card-hover'>
          <div className='flex items-center justify-between mb-6'>
            <h4 className='text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3'>
              <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center'>
                <span className='text-purple-600 dark:text-purple-400 font-bold text-sm'>C</span>
              </div>
              Compound Protocol
            </h4>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(
                analysis.compound.liquidationRisk.riskLevel,
              )}`}>
              {analysis.compound.liquidationRisk.riskLevel.toUpperCase()} RISK
            </span>
          </div>

          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <div>
              <p className='text-sm text-slate-600 dark:text-slate-400 mb-1'>Total Supplied</p>
              <p className='text-xl font-bold text-green-600 dark:text-green-400'>
                {formatValue(analysis.compound.liquidationRisk.collateralValue)}
              </p>
            </div>
            <div>
              <p className='text-sm text-slate-600 dark:text-slate-400 mb-1'>Total Borrowed</p>
              <p className='text-xl font-bold text-orange-600 dark:text-orange-400'>
                {formatValue(analysis.compound.liquidationRisk.borrowValue)}
              </p>
            </div>
          </div>

          {/* Compound Positions */}
          <div className='space-y-3'>
            <h5 className='font-semibold text-slate-900 dark:text-white'>Active Positions</h5>
            {analysis.compound.positions.slice(0, 5).map((position) => (
              <div key={position.id} className='bg-slate-50 dark:bg-slate-800 rounded-lg p-4'>
                <div className='flex justify-between items-center'>
                  <span className='font-medium text-slate-900 dark:text-white'>
                    {position.market.underlyingSymbol}
                  </span>
                  <div className='text-right'>
                    <div className='text-sm text-slate-600 dark:text-slate-400'>
                      Supplied: {parseFloat(position.supplyBalanceUnderlying).toFixed(4)}
                    </div>
                    {parseFloat(position.borrowBalanceUnderlying) > 0 && (
                      <div className='text-sm text-orange-600 dark:text-orange-400'>
                        Borrowed: {parseFloat(position.borrowBalanceUnderlying).toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {analysis.compound.positions.length > 5 && (
              <p className='text-sm text-slate-500 dark:text-slate-500 text-center'>
                +{analysis.compound.positions.length - 5} more positions
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
