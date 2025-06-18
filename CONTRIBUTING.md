# Contributing to Web3 Whale Analyzer

Thank you for your interest in contributing to the Web3 Whale Analyzer! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork** locally
3. **Set up the development environment** (see README.md)
4. **Create a feature branch** from `main`
5. **Make your changes**
6. **Test thoroughly**
7. **Submit a pull request**

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful in all interactions.

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- API keys for Covalent, Alchemy, Moralis, and OpenAI
- Git

### Local Setup

```bash
# Clone your fork
git clone https://github.com/tedy69/whale-analyzer.git
cd whale-analyzer

# Install dependencies
pnpm install

# Set up environment variables (see README.md)
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev
```

## 🎯 How to Contribute

### 🐛 Reporting Bugs

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, Node.js version, etc.)
- **Screenshots or logs** if applicable

### 💡 Suggesting Features

For feature requests:

- **Check existing issues** to avoid duplicates
- **Provide clear use case** and rationale
- **Consider implementation complexity**
- **Discuss in issues** before large changes

### 🔧 Pull Request Process

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow coding standards**:

   - Use TypeScript for type safety
   - Follow existing code style
   - Add comments for complex logic
   - No console.log statements (production-ready)

3. **Test your changes**:

   ```bash
   pnpm lint          # Check code style
   pnpm build         # Ensure it builds
   pnpm dev           # Test locally
   ```

4. **Write descriptive commits**:

   ```bash
   git commit -m "feat: add multi-chain whale detection"
   git commit -m "fix: resolve rate limiting issue in Covalent provider"
   git commit -m "docs: update API documentation"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📁 Project Structure

```
src/
├── app/                  # Next.js 15 app router
├── components/           # React components
│   ├── client/          # Client-side components
│   ├── server/          # Server-side components
│   └── ui/              # shadcn/ui components
├── lib/                 # Core business logic
│   └── providers/       # Data provider implementations
├── store/               # Zustand state management
└── types/               # TypeScript type definitions
```

## 🎨 Coding Standards

### TypeScript

- **Use strict typing** - avoid `any` type
- **Export interfaces** for reusable types
- **Use proper error handling** with try/catch blocks
- **Follow naming conventions**: camelCase for variables, PascalCase for components

### React Components

- **Use functional components** with hooks
- **Implement proper prop types** with TypeScript interfaces
- **Handle loading and error states**
- **Use server components** when possible for better performance

### API Routes

- **Implement proper error handling**
- **Use rate limiting** for external API calls
- **Return consistent response formats**
- **Add input validation**

### Data Providers

- **Implement class-based providers** following existing patterns
- **Add rate limiting and retry logic**
- **Handle API failures gracefully**
- **Use proper error logging** (no console.log in production)

## 🧪 Testing Guidelines

### Manual Testing

- **Test wallet analysis** with known addresses
- **Verify multi-chain support** across different networks
- **Check error handling** with invalid inputs
- **Test Telegram integration** using test endpoints

### Test Addresses

Use these for testing:

- **Vitalik.eth**: `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
- **Binance Hot Wallet**: `0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503`

### API Testing

```bash
# Test wallet analysis
curl -X POST "http://localhost:3000/api/wallet/analyze" \
  -H "Content-Type: application/json" \
  -d '{"address":"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"}'

# Test Telegram bot
curl "http://localhost:3000/api/defi-analysis?test=telegram"

# Test provider status
curl "http://localhost:3000/api/providers/status"
```

## 🔍 Areas for Contribution

### High Priority

- **🔧 New Data Providers**: Integrate additional blockchain APIs
- **📊 Enhanced Analytics**: Improve whale detection algorithms
- **🚨 Alert System**: Expand notification channels
- **⚡ Performance**: Optimize API response times
- **🧪 Testing**: Add comprehensive test coverage

### Medium Priority

- **🎨 UI/UX Improvements**: Enhance dashboard visualizations
- **📱 Mobile Optimization**: Improve responsive design
- **🔗 Chain Support**: Add new blockchain networks
- **📖 Documentation**: Expand API documentation

### Good First Issues

- **🐛 Bug fixes**: Small improvements and fixes
- **📝 Documentation**: README and code comments
- **🎨 Styling**: CSS and component improvements
- **🔧 Configuration**: Environment and setup enhancements

## 📝 Commit Message Guidelines

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(providers): add Polygon support to Alchemy provider
fix(whale-detector): resolve scoring calculation for large portfolios
docs(api): update wallet analysis endpoint documentation
refactor(components): migrate Dashboard to server component
```

## 🔒 Security Considerations

- **Never commit API keys** or sensitive data
- **Use environment variables** for configuration
- **Implement rate limiting** for API endpoints
- **Validate user inputs** properly
- **Handle errors gracefully** without exposing internals

## 🆘 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: gmail@tedyfazrin.com

## 📄 License

By contributing to Web3 Whale Analyzer, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Special thanks in documentation

---

Thank you for contributing to Web3 Whale Analyzer! 🐋✨
