# AI Chat Interface

A modern, accessible chat interface built with Next.js 13, TypeScript, and Tailwind CSS. Features a clean UI with dark/light mode support, speech recognition, and responsive design.

## Features

- 🎨 Modern UI with smooth animations and transitions
- 🌓 Dark/Light mode with system preference sync
- 🎤 Speech recognition for voice input
- 📱 Fully responsive design
- ⌨️ Keyboard accessibility
- 🔄 Smart retry mechanism for API calls
- ⚡ Real-time chat with typing indicators
- 🎯 Suggested prompts for easy start
- 🎭 Hugging Face AI model integration

## Prerequisites

- Node.js 18+
- npm or yarn
- A Hugging Face API token

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone [your-repo-url]
   cd chat-interface-challenge
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment files:

   ```bash
   cp .env.example .env.local
   ```

4. Add your Hugging Face API token to `.env.local`:

   ```
   HUGGING_FACE_API_TOKEN=your_token_here
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                  # Next.js 13 app directory
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── settings/        # Settings menu components
│   ├── ChatBox.tsx     # Main chat interface
│   └── ...
├── constants/          # App constants and configurations
├── public/            # Static assets
│   └── assets/
│       └── icons/    # SVG icons
└── types/            # TypeScript type definitions
```

## Technology Stack

- **Framework**: Next.js 13
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Hugging Face's Zephyr-7b-beta
- **State Management**: React hooks
- **Icons**: Custom SVG icons
- **Animations**: CSS transitions & keyframes

## Design Decisions

- Used Next.js 13 for server-side rendering and API routes
- Implemented dark mode using Tailwind and CSS variables
- Separated settings components for better maintainability
- Used TypeScript for type safety and better developer experience
- Implemented responsive design with mobile-first approach
- Added smooth animations for better user experience

## Assumptions

- Users have a modern browser that supports:
  - Web Speech API for voice recognition
  - LocalStorage for theme persistence
  - CSS Grid and Flexbox
- The Hugging Face API is available and responsive
- Users might use the app on various devices (mobile, tablet, desktop)
- Network conditions might vary (implemented retry mechanism)

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13.1+
- iOS Safari 13.4+
- Chrome for Android 80+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
