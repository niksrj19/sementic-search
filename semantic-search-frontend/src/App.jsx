
import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api/search";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(data.results);
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "I need something to monitor my fitness",
    "How can I measure my pulse at home?",
    "Equipment for stretching and meditation",
    "Something for listening to music wirelessly",
  ];

  return (
    <main className="container">
      <header className="hero">
        <span className="eyebrow">AI ENGINEERING · MINI PROJECT</span>
        <h1>Search by meaning.</h1>
        <p>
          Describe what you need in your own words.
          Find products without remembering their exact names.
        </p>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <span className="search-icon">⌕</span>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Something to track my heart rate"
          aria-label="Search products by meaning"
        />

        <button disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <section className="suggestions">
        <p>Try these searches</p>

        <div className="chips">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              className="chip"
              onClick={() => setQuery(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      {searched && !loading && !error && (
        <section className="results">
          <div className="results-heading">
            <h2>Matching products</h2>
            <span>{results.length} results</span>
          </div>

          {results.length === 0 ? (
            <p>No products found.</p>
          ) : (
            results.map((product, index) => (
              <article className="product-card" key={product.id}>
                <div className="rank">{index + 1}</div>

                <div className="product-info">
                  <span className="category">
                    {product.category}
                  </span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>

                <div className="score">
                  <strong>
                    {(product.score * 100).toFixed(1)}%
                  </strong>
                  <span>Similarity</span>
                  <div className="score-track">
                    <div
                      className="score-fill"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(100, product.score * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {!searched && (
        <section className="empty-state">
          <div className="empty-icon">✳</div>
          <h2>Your intent, understood.</h2>
          <p>
            Search for a need, a feature, or a problem.
            The best matching products appear first.
          </p>
        </section>
      )}

      <footer>
        React + Node.js + Transformers.js
      </footer>
    </main>
  );
}
