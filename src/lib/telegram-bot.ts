/**
 * Telegram Bot Service for sending notifications
 */

export interface TelegramMessage {
  text: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disableWebPagePreview?: boolean;
}

export interface WalletAlert {
  address: string;
  alertType: 'high_risk' | 'liquidation_warning' | 'whale_activity' | 'large_transaction';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

class TelegramBotService {
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly isEnabled: boolean;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN ?? '';
    this.chatId = process.env.TELEGRAM_CHAT_ID ?? '';
    this.isEnabled = !!(this.botToken && this.chatId);
  }

  /**
   * Check if Telegram bot is properly configured
   */
  public isConfigured(): boolean {
    return this.isEnabled;
  }

  /**
   * Send a message to Telegram
   */
  public async sendMessage(message: TelegramMessage): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Telegram bot not configured, skipping message:', message.text);
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message.text,
          parse_mode: message.parseMode ?? 'HTML',
          disable_web_page_preview: message.disableWebPagePreview ?? false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Telegram API error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('Telegram message sent successfully:', result.message_id);
      return true;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      return false;
    }
  }

  /**
   * Send wallet analysis alert
   */
  public async sendWalletAlert(alert: WalletAlert): Promise<boolean> {
    const severityEmoji = {
      low: '🟡',
      medium: '🟠',
      high: '🔴',
      critical: '🚨',
    };

    const alertTypeEmoji = {
      high_risk: '⚠️',
      liquidation_warning: '💥',
      whale_activity: '🐋',
      large_transaction: '💰',
    };

    const message: TelegramMessage = {
      text: `
${severityEmoji[alert.severity]} <b>Whale Analyzer Alert</b> ${alertTypeEmoji[alert.alertType]}

<b>Wallet:</b> <code>${alert.address}</code>
<b>Alert Type:</b> ${alert.alertType.replace('_', ' ').toUpperCase()}
<b>Severity:</b> ${alert.severity.toUpperCase()}

<b>Details:</b>
${alert.message}

<b>Time:</b> ${alert.timestamp.toISOString()}

<a href="https://whale-analyzer.tedyfazrin.com/analyze/${alert.address}">🔍 View Analysis</a>
      `.trim(),
      parseMode: 'HTML',
      disableWebPagePreview: true,
    };

    return this.sendMessage(message);
  }

  /**
   * Send DeFi liquidation risk alert
   */
  public async sendLiquidationAlert(
    address: string,
    protocol: string,
    riskLevel: string,
    details: {
      collateralValue: number;
      borrowValue: number;
      healthFactor?: number;
      recommendations: string[];
    },
  ): Promise<boolean> {
    const riskEmoji = riskLevel === 'critical' ? '🚨' : riskLevel === 'high' ? '🔴' : '🟠';

    const message: TelegramMessage = {
      text: `
${riskEmoji} <b>LIQUIDATION RISK ALERT</b> ${riskEmoji}

<b>Wallet:</b> <code>${address}</code>
<b>Protocol:</b> ${protocol.toUpperCase()}
<b>Risk Level:</b> ${riskLevel.toUpperCase()}

<b>Position Details:</b>
💎 Collateral Value: $${details.collateralValue.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })}
💸 Borrow Value: $${details.borrowValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
${details.healthFactor ? `💚 Health Factor: ${details.healthFactor.toFixed(3)}` : ''}

<b>Recommendations:</b>
${details.recommendations.map((rec) => `• ${rec}`).join('\n')}

<a href="https://whale-analyzer.tedyfazrin.com/analyze/${address}">🔍 View Full Analysis</a>
      `.trim(),
      parseMode: 'HTML',
      disableWebPagePreview: true,
    };

    return this.sendMessage(message);
  }

  /**
   * Send whale activity alert
   */
  public async sendWhaleActivityAlert(
    address: string,
    activity: {
      type: 'large_transfer' | 'defi_interaction' | 'token_swap';
      amount: number;
      token: string;
      description: string;
    },
  ): Promise<boolean> {
    const activityEmoji = {
      large_transfer: '💸',
      defi_interaction: '🏦',
      token_swap: '🔄',
    };

    const message: TelegramMessage = {
      text: `
🐋 <b>WHALE ACTIVITY DETECTED</b> 🐋

<b>Wallet:</b> <code>${address}</code>
<b>Activity:</b> ${activity.type.replace('_', ' ').toUpperCase()} ${activityEmoji[activity.type]}

<b>Details:</b>
💰 Amount: ${activity.amount.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${
        activity.token
      }
📝 Description: ${activity.description}

<b>Time:</b> ${new Date().toISOString()}

<a href="https://whale-analyzer.tedyfazrin.com/analyze/${address}">🔍 Analyze Wallet</a>
      `.trim(),
      parseMode: 'HTML',
      disableWebPagePreview: true,
    };

    return this.sendMessage(message);
  }

  /**
   * Send system status notification
   */
  public async sendSystemStatus(
    status: 'online' | 'error' | 'maintenance',
    message: string,
  ): Promise<boolean> {
    const statusEmoji = {
      online: '✅',
      error: '❌',
      maintenance: '🔧',
    };

    const notification: TelegramMessage = {
      text: `
${statusEmoji[status]} <b>Whale Analyzer System ${status.toUpperCase()}</b>

${message}

<b>Time:</b> ${new Date().toISOString()}
      `.trim(),
      parseMode: 'HTML',
    };

    return this.sendMessage(notification);
  }

  /**
   * Test Telegram bot configuration
   */
  public async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isEnabled) {
      return {
        success: false,
        message:
          'Telegram bot not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables.',
      };
    }

    try {
      const testMessage: TelegramMessage = {
        text: `
🧪 <b>Telegram Bot Test</b>

Your Whale Analyzer Telegram bot is working correctly!

<b>Configuration:</b>
✅ Bot Token: Configured
✅ Chat ID: Configured
✅ Connection: Successful

<b>Time:</b> ${new Date().toISOString()}
        `.trim(),
        parseMode: 'HTML',
      };

      const success = await this.sendMessage(testMessage);

      return {
        success,
        message: success
          ? 'Telegram bot test successful! Check your chat for the test message.'
          : 'Telegram bot test failed. Check your configuration and try again.',
      };
    } catch (error) {
      return {
        success: false,
        message: `Telegram bot test failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  }
}

export const telegramBotService = new TelegramBotService();
