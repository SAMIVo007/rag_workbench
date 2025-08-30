// Chat API client functions

export const sendChatMessage = async (message: string) => {
	try {
		console.log("Sending chat message:", message);

		const response = await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message }),
		});

		const result = await response.json();

		if (result.success) {
			console.log("Chat response received:", result.message);
			console.log("Relevant chunks found:", result.relevantChunks);
			return result;
		} else {
			console.error("Failed to get chat response:", result.error);
			throw new Error(result.error);
		}
	} catch (error) {
		console.error("Error calling chat API:", error);
		throw error;
	}
};

// PDF indexing function (existing)
export const init = async () => {
	try {
		console.log("Starting PDF indexing...");

		const response = await fetch("/api/index", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const result = await response.json();

		if (result.success) {
			console.log("PDF indexed successfully:", result.message);
			console.log("Documents processed:", result.documentCount);
		} else {
			console.error("Failed to index PDF:", result.error);
			alert(`PDF indexing failed: ${result.error}`);
		}
	} catch (error) {
		console.error("Error calling indexing API:", error);
		alert(
			`Network error: ${error instanceof Error ? error.message : "Unknown error"}`
		);
	}
};
