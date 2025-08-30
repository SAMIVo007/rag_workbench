"use client";

import { useState } from "react";
import { sendChatMessage } from "@/lib/chatClient";

export default function ChatComponent() {
	const [message, setMessage] = useState("");
	const [chatHistory, setChatHistory] = useState<
		Array<{
			type: "user" | "assistant";
			content: string;
			sources?: any[];
		}>
	>([]);
	const [loading, setLoading] = useState(false);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!message.trim() || loading) return;

		const userMessage = message.trim();
		setMessage("");

		// Add user message to chat
		setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);
		setLoading(true);

		try {
			const response = await sendChatMessage(userMessage);

			// Add assistant response to chat
			setChatHistory((prev) => [
				...prev,
				{
					type: "assistant",
					content: response.message,
					sources: response.sources,
				},
			]);
		} catch (error) {
			setChatHistory((prev) => [
				...prev,
				{
					type: "assistant",
					content: `Error: ${
						error instanceof Error ? error.message : "Unknown error"
					}`,
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-4">Chat with your PDF</h2>

			{/* Chat History */}
			<div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
				{chatHistory.length === 0 ? (
					<p className="text-gray-500 text-center">
						Start a conversation by asking a question about your PDF...
					</p>
				) : (
					chatHistory.map((chat, index) => (
						<div
							key={index}
							className={`mb-4 ${chat.type === "user" ? "text-right" : "text-left"}`}
						>
							<div
								className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
									chat.type === "user" ? "bg-blue-500 text-white" : "bg-white border"
								}`}
							>
								<p className="text-sm">{chat.content}</p>
								{chat.sources && chat.sources.length > 0 && (
									<div className="mt-2 text-xs text-gray-600">
										<p>Sources: {chat.sources.length} document chunks</p>
									</div>
								)}
							</div>
						</div>
					))
				)}

				{loading && (
					<div className="text-left mb-4">
						<div className="inline-block bg-white border px-4 py-2 rounded-lg">
							<p className="text-sm text-gray-500">Thinking...</p>
						</div>
					</div>
				)}
			</div>

			{/* Message Input */}
			<form onSubmit={handleSendMessage} className="flex gap-2">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Ask a question about your PDF..."
					className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={loading}
				/>
				<button
					type="submit"
					disabled={loading || !message.trim()}
					className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Send
				</button>
			</form>
		</div>
	);
}
