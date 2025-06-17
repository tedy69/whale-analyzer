# 🐋 Web3 Whale & Liquidation Risk Analyzer

An AI-powered Web3 analytics platform that analyzes wallet behavior, detects whale activity, and assesses DeFi liquidation risks in real-time.

![Web3 Whale Analyzer](https://via.placeholder.com/800x400/6366f1/ffffff?text=Web3+Whale+Analyzer)

## ✨ Features

### 🔍 **Wallet Analyzer**

- Real-time wallet balance and transaction analysis
- Token portfolio breakdown and insights
- Portfolio diversification metrics
- Integration with Covalent, Alchemy, and Moralis APIs

### 🐋 **Whale Detection**

- Advanced scoring algorithm (0-100 points)
- Whale level classification (Fish → Dolphin → Whale → Mega Whale → Legendary Whale)
- Achievement badges and activity patterns
- Large transaction detection and analysis

### ⚠️ **Liquidation Risk Assessment**

- Real-time DeFi lending position monitoring
- Health factor calculations across protocols
- Risk scoring and level classification
- Integration with Aave and Compound via The Graph

### 🤖 **AI-Powered Analysis**

- GPT-4 powered wallet behavior analysis
- Automated risk assessment and recommendations
- Key findings and insight generation
- Confidence scoring for AI predictions

### 📊 **Interactive Dashboard**

- Beautiful, responsive UI with Tailwind CSS
- Real-time charts and visualizations
- Portfolio overview and risk metrics
- Mobile-friendly design

### 🚨 **Alert System** (Optional)

- Telegram bot notifications
- Critical liquidation risk alerts
- Whale activity notifications
- Customizable alert thresholds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- API keys for data providers
- OpenAI API key for AI analysis

### 1. Clone and Install

```bash
git clone <your-repo>
cd web3-whale-analyzer
pnpm install
```

### 2. Environment Setup

Copy `.env.local` and add your API keys:

```bash
# Server-side API Keys (secure, not exposed to browser)
COVALENT_API_KEY=your_covalent_key
ALCHEMY_API_KEY=your_alchemy_key
MORALIS_API_KEY=your_moralis_key
OPENAI_API_KEY=your_openai_key

# Security & Rate Limiting
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this
API_RATE_LIMIT_REQUESTS=100
API_RATE_LIMIT_WINDOW=3600000

# Public Configuration (safe to expose)
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_GRAPH_AAVE_URL=https://api.thegraph.com/subgraphs/name/aave/protocol-v2
NEXT_PUBLIC_GRAPH_COMPOUND_URL=https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2
```

### 3. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Architecture

### Core Modules

| Module               | Description                          | Technologies                    |
| -------------------- | ------------------------------------ | ------------------------------- |
| **Wallet Analyzer**  | Fetches and processes wallet data    | Covalent, Alchemy, Moralis APIs |
| **Whale Detector**   | Rule-based whale activity scoring    | TypeScript algorithms           |
| **Liquidation Risk** | DeFi lending position analysis       | The Graph, Aave/Compound        |
| **AI Summary**       | Intelligent wallet behavior analysis | OpenAI GPT-4                    |
| **Frontend**         | Interactive dashboard and charts     | Next.js, Tailwind, Zustand      |
| **Alert System**     | Risk notifications and monitoring    | Telegram Bot API                |

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand
- **Charts**: ApexCharts
- **APIs**: Covalent, Alchemy, The Graph, OpenAI
- **Deployment**: Vercel (recommended)

### 🏗️ **Enterprise-Grade Architecture**

- **Full Server-Side Rendering (SSR)**: Zero client-side API key exposure
- **Advanced Rate Limiting**: Intelligent API request management to prevent 429 errors
- **Multi-Chain Support**: Ethereum, Polygon, and BSC analysis
- **Robust Error Handling**: Graceful degradation when APIs are unavailable
- **Sequential Processing**: Optimized for API stability and reliability

## 📖 API Documentation

### Wallet Analysis Endpoint

```typescript
// Analyze a wallet
const walletData = await WalletAnalyzer.analyzeWallet('0x...');

// Response structure
interface WalletData {
  address: string;
  totalBalance: number;
  tokenBalances: TokenBalance[];
  transactions: Transaction[];
  whaleScore: number;
  liquidationRisk: LiquidationRisk;
  aiSummary?: string;
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

### Rate Limiting Strategy

The application implements intelligent rate limiting to ensure reliable API performance:

- **Conservative Limits**: 30 requests per minute to Covalent API
- **Sequential Processing**: Chains are analyzed one at a time to prevent overwhelming APIs
- **Exponential Backoff**: 2-20 second retry delays for failed requests
- **Graceful Degradation**: Continue analysis even if some chains fail

### Multi-Chain Optimization

**Supported Chains**: Ethereum, Polygon, BSC (optimized for stability)
**Analysis Flow**:

1. Ethereum (primary chain)
2. Polygon (L2 optimization)
3. BSC (DeFi ecosystem)

### Error Handling

- **API Failures**: Automatic fallback to available data
- **Network Issues**: Retry with exponential backoff
- **Invalid Addresses**: Clear validation and error messages
- **Rate Limits**: Intelligent request scheduling

See `RATE_LIMITING_FIX.md` for detailed technical information.

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

- [Covalent API](https://www.covalenthq.com/) for blockchain data
- [The Graph](https://thegraph.com/) for DeFi protocol data
- [OpenAI](https://openai.com/) for AI analysis capabilities
- [Alchemy](https://www.alchemy.com/) for Web3 infrastructure
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

- 📧 Email: support@whaleanalyzer.com
- 🐦 Twitter: [@WhaleAnalyzer](https://twitter.com/WhaleAnalyzer)
- 💬 Discord: [Join our community](https://discord.gg/whaleanalyzer)

---

Built with ❤️ by the Web3 Analytics Team
