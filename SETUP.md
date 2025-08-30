# RAG Workbench Setup Guide

## Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Qdrant Vector Database**: You can run it locally or use a cloud instance

## Environment Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your actual values:

   ```bash
   # OpenAI API Key for embeddings
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here

   # Qdrant Vector Database URL
   QDRANT_URL=http://localhost:6333
   ```

## Running Qdrant Locally

### Option 1: Using Docker (Recommended)

```bash
docker run -p 6333:6333 qdrant/qdrant
```

### Option 2: Using Docker Compose

The project includes a docker-compose.yml file. Run:

```bash
cd docker
docker-compose up -d
```

### Option 3: Install Qdrant directly

Follow the [Qdrant installation guide](https://qdrant.tech/documentation/guides/installation/)

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Troubleshooting

- **"OPENAI_API_KEY is not properly configured"**: Make sure you've set a real OpenAI API key in `.env.local`
- **"PDF file not found"**: The PDF should be in the `lib/book.pdf` location
- **Qdrant connection errors**: Make sure Qdrant is running on the configured URL (default: http://localhost:6333)

## Testing Qdrant Connection

You can test if Qdrant is running by visiting: http://localhost:6333/dashboard
