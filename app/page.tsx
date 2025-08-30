"use client";
import { init } from "@/lib/indexing";
import ChatComponent from "@/components/ChatComponent";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
	const [pdfIndexed, setPdfIndexed] = useState(false);
	const [indexingStatus, setIndexingStatus] = useState("idle"); // idle, loading, success, error

	useEffect(() => {
		const indexPDF = async () => {
			setIndexingStatus("loading");
			try {
				await init();
				setIndexingStatus("success");
				setPdfIndexed(true);
			} catch (error) {
				setIndexingStatus("error");
				console.error("Failed to index PDF:", error);
			}
		};

		indexPDF();
	}, []);

	return (
		<div className="min-h-screen p-8">
			<header className="text-center mb-8">
				<Image
					className="dark:invert mx-auto mb-4"
					src="/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
				<h1 className="text-3xl font-bold">RAG Workbench</h1>
				<p className="text-gray-600 mt-2">Chat with your PDF using AI</p>
			</header>

			{/* PDF Indexing Status */}
			<div className="max-w-4xl mx-auto mb-8">
				<div className="bg-white border rounded-lg p-4">
					<h2 className="text-lg font-semibold mb-2">PDF Status</h2>
					{indexingStatus === "loading" && (
						<p className="text-blue-600">
							📄 Indexing PDF... This may take a moment.
						</p>
					)}
					{indexingStatus === "success" && (
						<p className="text-green-600">
							✅ PDF successfully indexed! You can now chat with it.
						</p>
					)}
					{indexingStatus === "error" && (
						<p className="text-red-600">
							❌ Failed to index PDF. Check console for details.
						</p>
					)}
					{indexingStatus === "idle" && (
						<p className="text-gray-600">⏳ Preparing to index PDF...</p>
					)}
				</div>
			</div>

			{/* Chat Interface */}
			{pdfIndexed ? (
				<ChatComponent />
			) : (
				<div className="max-w-4xl mx-auto text-center">
					<p className="text-gray-500">
						Please wait for PDF indexing to complete before chatting...
					</p>
				</div>
			)}
		</div>
	);
}
