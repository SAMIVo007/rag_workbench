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
			if (result.alreadyIndexed) {
				console.log("PDF was already indexed:", result.message);
			} else {
				console.log("PDF indexed successfully:", result.message);
				console.log("Documents processed:", result.documentCount);
			}
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
