# Datalytics

Datalytics is an AI-powered data analytics platform that enables users to analyze data through natural language queries. It provides an intuitive interface for managing multiple datasets and generating insights using advanced AI capabilities.

## Features

- 🤖 Natural Language Data Analysis
- 📊 Interactive Data Visualization
- 📁 Multiple Dataset Management
- 🔄 Real-time Analysis Updates
- 📱 Responsive Design

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Routing**: TanStack Router
- **State Management**: Nanostores
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **AI Integration**: Google Generative AI
- **Data Visualization**: Recharts

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Bun (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/datalytics.git
cd datalytics
```

2. Install dependencies
```bash
bun install
# or
npm install
```

3. Create a `.env` file in the root directory and add your Google AI API key:
```env
GOOGLE_AI_API_KEY=your_api_key_here
```

4. Start the development server
```bash
bun dev
# or
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Upload your dataset through the interface
3. Use natural language queries to analyze your data
4. View and interact with the generated visualizations

## Development

- `bun dev` - Start the development server
- `bun build` - Build for production
- `bun preview` - Preview production build
- `bun lint` - Run ESLint

## Project Structure

```
src/
├── app/          # App-specific components
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions
├── routes/       # Application routes
├── services/     # External service integrations
├── stores/       # State management
└── main.tsx      # Application entry point
```

## License

MIT
