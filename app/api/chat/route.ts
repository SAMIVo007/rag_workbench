import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		// Check environment variables
		if (!process.env.OPENAI_API_KEY) {
			throw new Error("OPENAI_API_KEY is not properly configured");
		}

		if (!process.env.QDRANT_URL) {
			throw new Error("QDRANT_URL is not configured");
		}

		// Parse the request body
		const body = await request.json();
		const { message } = body;

		if (!message || typeof message !== "string") {
			return NextResponse.json(
				{ success: false, error: "Message is required and must be a string" },
				{ status: 400 }
			);
		}

		console.log("Received chat message:", message);

		// Initialize embeddings model (same as indexing)
		const embeddings = new OpenAIEmbeddings({
			model: "text-embedding-3-large",
			apiKey: process.env.OPENAI_API_KEY,
		});

		// Connect to existing vector store
		const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
			url: process.env.QDRANT_URL,
			collectionName: "langchainjs-testing",
		});

		console.log("Searching for relevant documents...");

		const retriever = await vectorStore.asRetriever({
			k: 3, // Number of documents to retrieve
		})

		// Search for relevant documents (similarity search)
		const relevantDocs = await vectorStore.similaritySearch(message, 4); // Get top 4 most relevant chunks

		console.log(`Found ${relevantDocs.length} relevant documents`);

		// Prepare context from relevant documents
		const context = relevantDocs
			.map((doc, index) => `[Document ${index + 1}]\n${doc.pageContent}`)
			.join("\n\n");

		// Initialize OpenAI for chat completion
		const llm = new ChatOpenAI({
			model: "gpt-3.5-turbo",
			apiKey: process.env.OPENAI_API_KEY,
			temperature: 0.7,
		});

		// Create the prompt with context
		const prompt = `You are a helpful assistant that answers questions based on the provided context from a PDF document.

Context from the document:
${context}

Human Question: ${message}

Please answer the question based on the context provided. If the answer cannot be found in the context, please say so clearly.

Answer:`;

		console.log("Generating response with OpenAI...");

		// Generate response
		const response = await llm.invoke(prompt);

		return NextResponse.json({
			success: true,
			message: response,
			relevantChunks: relevantDocs.length,
			sources: relevantDocs.map((doc, index) => ({
				chunk: index + 1,
				content: doc.pageContent.substring(0, 150) + "...", // Preview of source
				metadata: doc.metadata,
			})),
		});
	} catch (error) {
		console.error("Error in chat API:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return NextResponse.json(
			{ success: false, error: errorMessage },
			{ status: 500 }
		);
	}
}
