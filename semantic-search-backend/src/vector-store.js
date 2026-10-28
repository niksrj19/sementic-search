import { createEmbedding } from "./embedding.service.js";

const documents = [];

export async function indexDocuments(products) {
  for (const product of products) {
    // Combine meaningful fields into searchable text.
    const text = `${product.name}. ${product.description}. Category: ${product.category}`;

    const embedding = await createEmbedding(text);

    documents.push({
      ...product,
      embedding,
    });
  }

  console.log(`Indexed ${documents.length} documents`);
}

function cosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (
    Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
  );
}

export async function searchDocuments(query, limit = 5) {
  const queryEmbedding = await createEmbedding(query);

  return documents
    .map((document) => ({
      id: document.id,
      name: document.name,
      description: document.description,
      category: document.category,
      score: cosineSimilarity(
        queryEmbedding,
        document.embedding
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}