# 🐋 Web3 Whale & Liquidation Risk Analyzer

A production-ready, AI-powered Web3 analytics platform that analyzes wallet behavior, detects whale activity, and assesses DeFi liquidation risks across multiple blockchains using real data providers.

![Web3 Whale Analyzer](https://via.placeholder.com/800x400/6366f1/ffffff?text=Web3+Whale+Analyzer)

## ✨ Features

### 🔍 **Multi-Chain Wallet Analyzer**

- **Real-time Analysis**: Live wallet balance and transaction tracking across 10+ blockchains
- **Advanced Portfolio Insights**: Token diversity, risk metrics, and allocation analysis
- **Multi-Provider Architecture**: Production-grade redundancy with Covalent, Alchemy, and Moralis APIs
- **Intelligent Failover**: Automatic provider switching with rate limiting and error handling
- **Interactive Charts**: Beautiful visualizations with ApexCharts for portfolio distribution and activity

### 🐋 **Intelligent Whale Detection**

- **Advanced Scoring Algorithm**: 0-100 point whale score based on multiple factors
- **Tier Classification**: Fish → Dolphin → Whale → Mega Whale → Legendary Whale
- **Cross-Chain Activity**: Unified whale scoring across all supported networks
- **Real-Time Monitoring**: Live transaction tracking and whale activity alerts

### ⚠️ **DeFi Liquidation Risk Assessment**

- **Real-Time Monitoring**: Live DeFi lending position tracking using production data providers
- **Multi-Protocol Support**: Aave, Compound, and other major lending protocols
- **Health Factor Calculations**: Precise risk assessment with early warning system
- **Production Data Sources**: Migrated from deprecated Graph Protocol to reliable API providers

### 🤖 **AI-Powered Intelligence**

- **GPT-4 Analysis**: Advanced wallet behavior interpretation and risk assessment
- **Smart Fallbacks**: Multiple AI analysis layers for reliability
- **Contextual Insights**: Deep analysis of trading patterns and portfolio behavior
- **Confidence Scoring**: AI prediction reliability metrics
- **Production-Ready**: Clean logging with all debug statements removed

### 📊 **Professional Dashboard**

- **Server-Side Rendering**: Lightning-fast performance with Next.js 15
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-Time Charts**: Interactive portfolio and transaction visualizations
- **Clean UI**: Modern design with shadcn/ui components
- **Production Optimized**: Zero console logging for clean production environment

### 🚨 **Smart Alert System**

- **Telegram Integration**: Real-time notifications for critical events with tested endpoints
- **Risk-Based Alerts**: Automated warnings for liquidation risks and whale activity
- **Customizable Thresholds**: Personalized alert settings
- **Multi-Channel Support**: Extensible notification system
- **Test Endpoints**: Built-in testing via `/api/defi-analysis?test=telegram`

### 🌐 **Multi-Chain Support**

- **10+ Blockchains**: Ethereum, Polygon, BSC, Arbitrum, Optimism, Base, Fantom, Cronos, Gnosis, Avalanche
- **Unified Analysis**: Cross-chain portfolio aggregation and risk assessment
- **Chain-Specific Metrics**: Detailed per-chain analysis and performance tracking

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **pnpm** package manager
- **API Keys** for blockchain data providers (Covalent, Alchemy, Moralis)
- **OpenAI API Key** for AI-powered analysis
- **Telegram Bot** (optional, for alerts)

### 1. Clone and Install

```bash
git clone <your-repo>
cd web3-whale-analyzer
pnpm install
```

### 2. Get API Keys

Before setting up the environment, you'll need to obtain API keys from these providers:

- **[Covalent](https://www.covalenthq.com/)**: Sign up for a free account and get your API key
- **[Alchemy](https://www.alchemy.com/)**: Create an account and generate an API key
- **[Moralis](https://moralis.io/)**: Register and obtain your Web3 API key
- **[OpenAI](https://platform.openai.com/)**: Get an API key for GPT-4 analysis
- **[Telegram Bot](https://core.telegram.org/bots#botfather)** (optional): Create a bot with BotFather

### 3. Environment Setup

Create `.env.local` with your API keys:

```bash
# 🔐 Core API Keys (required for all features)
COVALENT_API_KEY=your_covalent_key_here
ALCHEMY_API_KEY=your_alchemy_key_here
MORALIS_API_KEY=your_moralis_key_here
OPENAI_API_KEY=your_openai_key_here

# 📱 Telegram Bot (optional, for alerts)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Test API Endpoints

```bash
# Test wallet analysis
curl "http://localhost:3000/api/wallet/analyze" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}'

# Test Telegram bot
curl "http://localhost:3000/api/defi-analysis?test=telegram"

# Test provider status
curl "http://localhost:3000/api/providers/status"
```

## 🛠️ Architecture

### 🏗️ **Production-Ready Architecture**

- **🔥 Full Server-Side Rendering (SSR)**: Complete security with zero client-side API key exposure
- **⚡ Multi-Provider Redundancy**: Automatic failover between Covalent, Alchemy, and Moralis
- **🛡️ Advanced Rate Limiting**: Intelligent request management with exponential backoff
- **🌐 Multi-Chain Analysis**: Unified data aggregation across 10+ blockchains
- **🔄 Real Data Providers**: Production-grade APIs replacing deprecated Graph Protocol
- **📊 Interactive Visualizations**: Advanced charts with ApexCharts and real-time updates
- **✅ Production Clean**: All console.log statements removed for clean production logs

### Core Modules

| Module                      | Description                              | Technologies                         |
| --------------------------- | ---------------------------------------- | ------------------------------------ |
| **🔍 Multi-Chain Analyzer** | Fetches and analyzes cross-chain data   | Covalent, Alchemy, Moralis APIs     |
| **🐋 Whale Detection**      | Advanced whale activity scoring         | TypeScript algorithms, Multi-chain  |
| **⚠️ Liquidation Risk**     | Real-time DeFi position monitoring      | Live data providers, Aave/Compound  |
| **🤖 AI Analysis**          | Intelligent behavior analysis           | OpenAI GPT-4, Fallback systems      |
| **📊 Dashboard**            | Interactive charts and visualizations   | Next.js 15, ApexCharts, shadcn/ui   |
| **🚨 Alert System**         | Real-time notifications                  | Telegram Bot API, Webhook support   |
| **🛡️ Security Layer**       | Rate limiting and API protection        | Server-side validation, CORS        |

### Tech Stack

- **🖥️ Frontend**: Next.js 15, React 19, TypeScript 5.x
- **🎨 Styling**: Tailwind CSS, shadcn/ui, Radix UI primitives
- **📈 Charts**: ApexCharts with react-apexcharts
- **🔄 State**: Zustand for client state management
- **🌐 APIs**: Multi-provider architecture (Covalent, Alchemy, Moralis)
- **🤖 AI**: OpenAI GPT-4 with intelligent fallbacks
- **📱 Notifications**: Telegram Bot API
- **🚀 Deployment**: Vercel-optimized with Edge Runtime

### 🔧 **Advanced Features**

- **✅ Console-Free Production**: All debug logging removed for clean production logs
- **🔄 Automatic Provider Failover**: Seamless switching when APIs are down or rate-limited
- **⚡ Optimized Rate Limiting**: Prevents 429 errors with smart request scheduling
- **📊 Real-Time Charts**: Live portfolio and transaction visualizations
- **🎯 ENS Support**: Ethereum Name Service resolution for user-friendly addresses
- **🚨 Tested Alert System**: Telegram integration with built-in test endpoints
- **🔧 Production Architecture**: Class-based providers with proper error handling

## 📖 API Documentation

### 🔍 **Wallet Analysis API**

```typescript
// POST /api/wallet/analyze
const response = await fetch('/api/wallet/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' })
});

// Response structure
interface WalletData {
  address: string;
  totalBalance: number;
  tokenBalances: TokenBalance[];
  transactions: Transaction[];
  whaleScore: number;
  liquidationRisk: LiquidationRisk;
  aiSummary?: string;
  chains: ChainData[];
  crossChainMetrics: CrossChainMetrics;
  whaleMetrics?: WhaleMetrics;
}
```

### 🚨 **Alert System API**

```typescript
// Test Telegram bot connection
GET /api/defi-analysis?test=telegram

// Response
{
  "success": true,
  "message": "Telegram bot test successful! Check your chat for the test message."
}
```

### 📊 **Provider Status API**

```typescript
// Check data provider availability
GET /api/providers/status

// Response
{
  "covalent": { "available": true, "supportedChains": [1, 137, 56, ...] },
  "moralis": { "available": true, "supportedChains": [1, 137, 56, ...] },
  "alchemy": { "available": true, "supportedChains": [1, 137, 56, ...] }
}
```

### Whale Score Calculation

The whale score (0-100) is calculated based on:

- **Portfolio Value** (40 points max)
- **Large Transactions** (20 points max)
- **DeFi Activity** (20 points max)
- **Token Diversity** (10 points max)
- **Average Transaction Size** (10 points max)

### Risk Levels

- **MINIMAL** (0-19): Low risk, standard activity
- **LOW** (20-39): Some notable activity
- **MEDIUM** (40-59): Moderate risk/whale activity
- **HIGH** (60-79): High risk/significant whale
- **CRITICAL** (80-100): Maximum risk/legendary whale

## 🔧 Configuration

### Whale Detection Thresholds

```typescript
const WHALE_THRESHOLDS = {
  TOTAL_VALUE: 1000000, // $1M USD
  LARGE_TRANSACTION: 100000, // $100K USD
  MIN_STAKING_VALUE: 32, // 32 ETH
  MIN_LENDING_VALUE: 50000, // $50K USD
  UNIQUE_TOKENS_THRESHOLD: 20,
  TRANSACTION_FREQUENCY: 100,
};
```

### Alert Configuration

```typescript
// Configure Telegram alerts
AlertSystem.configure({
  botToken: process.env.TELEGRAM_BOT_TOKEN!,
  chatId: process.env.TELEGRAM_CHAT_ID!,
});
```

## 🚀 Performance & API Management

### Production Data Provider Strategy

The application uses a robust multi-provider architecture for reliable data access:

- **Primary Providers**: Covalent, Alchemy, and Moralis APIs
- **Intelligent Failover**: Automatic switching between providers on failures
- **Rate Limiting**: Conservative request limits with exponential backoff
- **Error Handling**: Graceful degradation with detailed error logging

### Rate Limiting Strategy

**Conservative API Usage**:
- **30 requests per minute** to each provider
- **Sequential chain processing** to prevent API overwhelming
- **2-20 second retry delays** with exponential backoff
- **Graceful failures** - continue analysis with available data

### Multi-Chain Optimization

**Supported Chains**: Ethereum, Polygon, BSC, Arbitrum, Optimism, Base, Fantom, Cronos, Gnosis, Avalanche

**Analysis Priority**:
1. **Ethereum** (primary DeFi ecosystem)
2. **Polygon** (L2 scaling solution)
3. **BSC** (alternative DeFi ecosystem)
4. **Additional chains** (based on provider availability)

### Error Handling & Reliability

- **API Failures**: Automatic fallback to available providers
- **Network Issues**: Intelligent retry with exponential backoff
- **Invalid Addresses**: Clear validation and user-friendly error messages
- **Rate Limits**: Smart request scheduling and provider rotation
- **Production Logging**: Clean logs with all debug statements removed

## 🧪 Testing

### Demo Wallets

Try these well-known addresses:

- **Vitalik.eth**: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
- **Binance Hot Wallet**: `0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503`

### Running Tests

```bash
pnpm test           # Run unit tests
pnpm test:e2e       # Run end-to-end tests
pnpm lint           # Check code quality
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Docker

```bash
# Build image
docker build -t whale-analyzer .

# Run container
docker run -p 3000:3000 whale-analyzer
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and informational purposes only. Always conduct your own research and consult with financial professionals before making investment decisions. The AI analysis should be used as supplementary information only.

## 🙏 Acknowledgments

- [Covalent API](https://www.covalenthq.com/) for comprehensive blockchain data
- [Alchemy](https://www.alchemy.com/) for reliable Web3 infrastructure
- [Moralis](https://moralis.io/) for multi-chain Web3 APIs
- [OpenAI](https://openai.com/) for AI analysis capabilities
- [Vercel](https://vercel.com/) for hosting and deployment
- [Next.js](https://nextjs.org/) for the React framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

## 📞 Support

- 📧 Email: support@whaleanalyzer.com
- 🐦 Twitter: [@WhaleAnalyzer](https://twitter.com/WhaleAnalyzer)
- 💬 Discord: [Join our community](https://discord.gg/whaleanalyzer)

---

Built with ❤️ by the Web3 Analytics Team
