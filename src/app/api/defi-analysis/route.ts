import { NextRequest, NextResponse } from 'next/server';
import { graphProtocolService } from '@/lib/graph-protocol';
import { telegramBotService } from '@/lib/telegram-bot';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const test = searchParams.get('test');

    // Test Telegram bot connection
    if (test === 'telegram') {
      const result = await telegramBotService.testConnection();
      return NextResponse.json(result);
    }

    // Test Graph Protocol integration
    if (test === 'graph' && address) {
      const defiAnalysis = await graphProtocolService.getDeFiAnalysis(address);
      return NextResponse.json({
        success: true,
        data: defiAnalysis,
      });
    }

    // Get DeFi analysis for a wallet
    if (address) {
      const defiAnalysis = await graphProtocolService.getDeFiAnalysis(address);

      // Send alert if there's high or critical risk
      if (defiAnalysis.totalRisk === 'high' || defiAnalysis.totalRisk === 'critical') {
        const alertSent = await telegramBotService.sendWalletAlert({
          address,
          alertType: 'high_risk',
          message: `DeFi liquidation risk detected. Overall risk level: ${
            defiAnalysis.totalRisk
          }. Recommendations: ${defiAnalysis.overallRecommendations.join(', ')}`,
          severity: defiAnalysis.totalRisk,
          timestamp: new Date(),
        });

        return NextResponse.json({
          success: true,
          data: defiAnalysis,
          alertSent,
        });
      }

      return NextResponse.json({
        success: true,
        data: defiAnalysis,
        alertSent: false,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Missing required parameters. Use ?address=<wallet_address> or ?test=telegram|graph',
      },
      { status: 400 },
    );
  } catch (error) {
    console.error('DeFi analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, address, alertType, message, severity } = body;

    if (action === 'send_alert' && address && alertType && message && severity) {
      const success = await telegramBotService.sendWalletAlert({
        address,
        alertType,
        message,
        severity,
        timestamp: new Date(),
      });

      return NextResponse.json({
        success,
        message: success ? 'Alert sent successfully' : 'Failed to send alert',
      });
    }

    if (action === 'send_liquidation_alert' && address) {
      const { protocol, riskLevel, details } = body;

      const success = await telegramBotService.sendLiquidationAlert(
        address,
        protocol,
        riskLevel,
        details,
      );

      return NextResponse.json({
        success,
        message: success
          ? 'Liquidation alert sent successfully'
          : 'Failed to send liquidation alert',
      });
    }

    if (action === 'send_whale_alert' && address) {
      const { activity } = body;

      const success = await telegramBotService.sendWhaleActivityAlert(address, activity);

      return NextResponse.json({
        success,
        message: success ? 'Whale activity alert sent successfully' : 'Failed to send whale alert',
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action or missing required parameters',
      },
      { status: 400 },
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    );
  }
}
