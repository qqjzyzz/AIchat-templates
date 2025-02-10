<<<<<<< HEAD
# AIchat-templates
简洁的，美观的AI对话平台。核心功能：in the hood，你可以预置提示词，成为某个方面的agent对话平台。
=======
# AI Chat Assistant

A comprehensive chat application powered by LangChain and Next.js, featuring support for multiple LLM providers and document processing capabilities.

## Features

- 💬 Real-time chat interface with AI models
- 📄 Word document (.docx) upload and processing
- 🏷️ Chat session management with tags
- 🌓 Dark mode support
- 📱 Responsive design
- 💾 Multiple LLM provider support (OpenAI, Anthropic)
- 🔍 Document analysis capabilities
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- OpenAI API key and/or Anthropic API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chat-templates
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

## Development

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

Build the application:
```bash
npm run build
# or
yarn build
```

Start the production server:
```bash
npm start
# or
yarn start
```

## Usage

1. **Starting a Chat**
   - Type your message in the input field and press Enter or click the send button
   - The AI will respond based on your input

2. **Uploading Documents**
   - Click the document icon in the input area
   - Select a .docx file (max 10MB)
   - The AI will analyze the document content

3. **Managing Chat Sessions**
   - View chat history in the sidebar
   - Add/remove tags to organize conversations
   - Delete unwanted chat sessions
   - Collapse sidebar for more space

4. **Dark Mode**
   - Toggle between light and dark modes using the sun/moon icon
   - System preference is detected automatically

## Technical Details

- Built with Next.js 14 and TypeScript
- Uses LangChain for LLM integration
- Tailwind CSS for styling
- Supports OpenAI and Anthropic models
- Document processing with mammoth.js
- Error logging system for debugging

## File Structure

```
.
├── app/
│   └── page.tsx           # Main application page
├── components/
│   ├── ChatArea.tsx      # Chat interface component
│   └── Sidebar.tsx       # Sidebar component
├── lib/
│   ├── document.ts       # Document processing utilities
│   └── langchain.ts      # LangChain integration
├── styles/
│   └── globals.css       # Global styles
└── utils/
    └── logger.ts         # Error logging utility
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License 
>>>>>>> a7be8d9 (first commit)
"# Test-question-generation-system" 
"# AIchat-templates" 
