import { useState } from "react";
import "./App.css";

function App() {
  function generateShortUrl() {
    if (originalURL.trim() === "") {
      setError("Please enter a URL");
      return;
    }
    try {
      const url = new URL(originalURL.trim());
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setError("Please enter a valid URL");
      return;
    }
    setError("");
    const randomCode = Math.random().toString(36).substring(2, 8);
    const generatedUrl = `https://${randomCode}`;
    setShortUrl(generatedUrl);
    setCopied(false);
  }
  const [originalURL, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  async function copyShortUrl() {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }
  return (
    <main className="app">
      <div className="shortener">
        <label htmlFor="original-url">Original URL</label>
        <input
          id="original-url"
          className={error ? "input-error" : ""}
          type="url"
          placeholder="Put your link"
          value={originalURL}
          onChange={(event) => {
            setOriginalUrl(event.target.value);
            setError("");
            setShortUrl("");
            setCopied(false);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "url-error" : undefined}
        />
        {error && (
          <span id="url-error" className="error-message" role="alert">
            {error}
          </span>
        )}
        <label htmlFor="short-url">Short URL</label>
        <div className="short-url-container">
          <input
            id="short-url"
            type="text"
            value={shortUrl}
            readOnly
            disabled
          />
          <button
            type="button"
            className="copy-button"
            onClick={copyShortUrl}
            disabled={!shortUrl}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button type="button" onClick={generateShortUrl}>
          Generate
        </button>
        <p>No account required to get started</p>
      </div>
    </main>
  );
}

export default App;
