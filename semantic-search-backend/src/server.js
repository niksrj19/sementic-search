import express from "express";
import cors from "cors";
import { products } from "./products.js";
import { indexDocuments, searchDocuments } from "./vector-store.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/search", async (req, res) => {
  try {
    const query = String(req.query.q ?? "").trim();

    if (!query) {
      return res.status(400).json({
        error: "Please provide a search query using ?q=...",
      });
    }

    if (query.length > 500) {
      return res.status(400).json({
        error: "Search query must be 500 characters or fewer.",
      });
    }

    const results = await searchDocuments(query, 5);

    res.json({
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Semantic search failed:", error);

    res.status(500).json({
      error: "Search failed. Please try again.",
    });
  }
});

async function startServer() {
  try {
    console.log("Creating product embeddings...");

    await indexDocuments(products);

    app.listen(PORT, () => {
      console.log(`Semantic search API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize semantic search:", error);
    process.exit(1);
  }
}

startServer();