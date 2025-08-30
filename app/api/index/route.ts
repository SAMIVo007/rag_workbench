import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { NextResponse } from "next/server";
import path from "path";

export async function POST() {
  try {
    // Check environment variables
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not properly configured");
    }

    if (!process.env.QDRANT_URL) {
      throw new Error("QDRANT_URL is not configured");
    }

    // Initialize embeddings to check existing data
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-large",
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Check if collection already exists and has data
    try {
      const existingVectorStore = new QdrantVectorStore(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
      });

      // Try to search for any document to check if collection has data
      const testSearch = await existingVectorStore.similaritySearch("test", 1);
      
      if (testSearch.length > 0) {
        console.log("PDF already indexed, skipping...");
        return NextResponse.json({ 
          success: true, 
          message: "PDF already indexed",
          documentCount: testSearch.length,
          alreadyIndexed: true 
        });
      }
    } catch (collectionError) {
      console.log("Collection doesn't exist yet, proceeding with indexing...");
    }

    // Use absolute path to the PDF file in the lib directory
    const filePath = path.join(process.cwd(), "lib", "book.pdf");
    const loader = new PDFLoader(filePath);

    // Load the PDF file page by page
    console.log("Loading PDF...");
    const docs = await loader.load();
    console.log("PDF loaded, document count:", docs.length);

    if (docs.length === 0) {
      throw new Error("No documents found in PDF");
    }

    console.log("Creating vector store...");
    const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: "langchainjs-testing",
    });

    console.log("Indexing done in Vector Store...");

    return NextResponse.json({ 
      success: true, 
      message: "PDF indexed successfully",
      documentCount: docs.length,
      alreadyIndexed: false 
    });
  } catch (error) {
    console.error("Error indexing PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
