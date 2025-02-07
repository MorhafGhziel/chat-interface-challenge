# 🤖 AI Chat Assistant

A modern chat interface built with Next.js 13, TypeScript, and Tailwind CSS. Features a sleek UI with dark/light mode, voice input capabilities, and real-time chat powered by Hugging Face's AI model.

## ✨ Features

- 🎨 Modern UI with smooth animations and transitions
- 🌓 Dark/Light mode with system preference sync
- 🎤 Voice input support with speech recognition
- 📱 Fully responsive design (mobile-first)
- ⚡ Real-time chat with typing indicators
- 🔄 Smart retry mechanism for API failures
- 💭 Suggested conversation starters
- 🧠 Powered by Hugging Face's Zephyr-7b-beta model
- 🌐 Internationalization ready
- ♿ Accessibility focused

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Hugging Face API token ([Get one here](https://huggingface.co/settings/tokens))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/chat-interface-challenge.git
   cd chat-interface-challenge
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Add your Hugging Face API token to `.env.local`:

   ```
   HUGGING_FACE_API_TOKEN=your_token_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
├── app/                  # Next.js 13 app directory
│   ├── api/             # API routes for chat
│   ├── layout.tsx       # Root layout with theme provider
│   └── page.tsx         # Main chat page
├── components/          # React components
│   ├── ChatBox.tsx     # Main chat interface
│   ├── Header.tsx      # App header with settings
│   ├── Settings.tsx    # Settings menu
│   ├── Suggestions.tsx # Chat suggestions
│   └── settings/       # Settings components
├── constants/          # App constants and config
├── public/            # Static assets
│   └── assets/
│       └── icons/    # SVG icons
└── types/            # TypeScript definitions
```

## 🛠️ Technical Details

### API Integration

The app uses Hugging Face's Zephyr-7b-beta model for chat responses. Key features:

- Automatic retry mechanism for failed requests
- Rate limiting handling
- Error state management
- Streaming response support

### Voice Recognition

Built using the Web Speech API with:

- Real-time transcription
- Error handling for various scenarios
- Fallback mechanisms
- Permission management

### Theme System

Implements a dynamic theme system with:

- System preference detection
- Manual override option
- Persistent preferences
- Smooth transitions

## 🤔 Assumptions & Requirements

### Browser Support

- Modern browsers (Chrome 80+, Firefox 75+, Safari 13.1+)
- ES6+ JavaScript support
- Web Speech API for voice features
- LocalStorage for preferences

### Network

- Stable internet connection for API calls
- Reasonable latency for real-time features
- WebSocket support for future features

### Device Capabilities

- Microphone access for voice input
- Sufficient CPU for animations
- Adequate memory for chat history

### API Usage

- Valid Hugging Face API token
- Reasonable rate limits
- Expected response format

## 🔧 Configuration Options

The app can be configured through environment variables:

```env
HUGGING_FACE_API_TOKEN=   # Required: Your API token
NEXT_PUBLIC_MAX_RETRIES=  # Optional: API retry attempts (default: 3)
NEXT_PUBLIC_THEME=        # Optional: Default theme (light/dark)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

## 📝 Known Limitations

- Voice input requires HTTPS in production
- Initial API response may have latency
- Limited browser support for some features
- Rate limits on free API tier
- Memory constraints for long conversations

## 🔮 Future Improvements

- [ ] Add message persistence
- [ ] Implement user authentication
- [ ] Add conversation history
- [ ] Support file attachments
- [ ] Add typing indicators
- [ ] Implement message reactions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ and TypeScript
