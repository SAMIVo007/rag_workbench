import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
	const diagnostics: any = {
		environment: {
			hasOpenAIKey:
				!!process.env.OPENAI_API_KEY &&
				process.env.OPENAI_API_KEY !== "your_openai_api_key_here",
			hasQdrantUrl: !!process.env.QDRANT_URL,
			qdrantUrl: process.env.QDRANT_URL,
			nodeEnv: process.env.NODE_ENV,
		},
		file: {
			pdfPath: path.join(process.cwd(), "lib", "book.pdf"),
			pdfExists: false,
		},
		timestamp: new Date().toISOString(),
	};

	// Check if PDF exists
	try {
		const fs = await import("fs");
		diagnostics.file.pdfExists = fs.existsSync(diagnostics.file.pdfPath);
	} catch (error) {
		// Handle fs import error
	}

	// Test Qdrant connection
	if (process.env.QDRANT_URL) {
		try {
			const response = await fetch(`${process.env.QDRANT_URL}/collections`);
			diagnostics.qdrant = {
				accessible: response.ok,
				status: response.status,
			};
		} catch (error) {
			diagnostics.qdrant = {
				accessible: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	return NextResponse.json(diagnostics);
}
