import { useState } from "react";
import "./App.css";

function App() {
  function generateShortUrl() {
    const value = originalURL.trim();
    if (value === "") {
      setError("Please enter a URL");
      setShortUrl("");
      return;
    }
    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Invalid protocol");
      }
      const hostname = url.hostname;
      if (hostname.startsWith(".") || hostname.endsWith(".")) {
        throw new Error("Invalid hostname");
      }
      if (!hostname.includes(".")) {
        throw new Error("Missing domain extension");
      }
      const parts = hostname.split(".");
      if (parts.some((part) => part.length === 0)) {
        throw new Error("Invalid hostname");
      }
      const tld = parts[parts.length - 1];
      if (!/^[a-zA-Z]{2,}$/.test(tld)) {
        throw new Error("Invalid domain extension");
      }
      setError("");
      const randomCode = Math.random().toString(36).substring(2, 8);
      const generatedUrl = `https://${randomCode}`;
      setShortUrl(generatedUrl);
      setCopied(false);
    } catch (error) {
      console.log("Validation error:", error);
      setError("Please enter a valid URL");
      setShortUrl("");
    }
  }
  const [originalURL, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });
  function changeTheme(newTheme) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }
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
    <main className="app" data-theme={theme}>
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
            className={shortUrl ? "short-url-visible" : ""}
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
            aria-label={copied ? "Copied" : "Copy short URL"}
          >
            {copied ? (
              <svg
                className={shortUrl ? "copy-icon-visible" : ""}
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className={shortUrl ? "copy-icon-visible" : ""}
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 15C4.06812 15 3.60218 15 3.23463 14.8478C2.74458 14.6448 2.35523 14.2554 2.15224 13.7654C2 13.3978 2 12.9319 2 12V5.2C2 4.0799 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2H12C12.9319 2 13.3978 2 13.7654 2.15224C14.2554 2.35523 14.6448 2.74458 14.8478 3.23463C15 3.60218 15 4.06812 15 5M12.2 22H18.8C19.9201 22 20.4802 22 20.908 21.782C21.2843 21.5903 21.5903 21.2843 21.782 20.908C22 20.4802 22 19.9201 22 18.8V12.2C22 11.0799 22 10.5198 21.782 10.092C21.5903 9.71569 21.2843 9.40973 20.908 9.21799C20.4802 9 19.9201 9 18.8 9H12.2C11.0799 9 10.5198 9 10.092 9.21799C9.71569 9.40973 9.40973 9.71569 9.21799 10.092C9 10.5198 9 11.0799 9 12.2V18.8C9 19.9201 9 20.4802 9.21799 20.908C9.40973 21.2843 9.71569 21.5903 10.092 21.782C10.5198 22 11.0799 22 12.2 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
        <button type="button" onClick={generateShortUrl}>
          Generate
        </button>
        <p>No account required to get started</p>
      </div>
      <div className="theme-switcher">
        <button
          className={`theme-option ${theme === "light" ? "active" : ""}`}
          onClick={() => changeTheme("light")}
          aria-label="Light theme"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className={`theme-option ${theme === "dark" ? "active" : ""}`}
          onClick={() => changeTheme("dark")}
          aria-label="Dark theme"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 15.8442C20.6866 16.4382 19.2286 16.7688 17.6935 16.7688C11.9153 16.7688 7.23116 12.0847 7.23116 6.30654C7.23116 4.77135 7.5618 3.3134 8.15577 2C4.52576 3.64163 2 7.2947 2 11.5377C2 17.3159 6.68414 22 12.4623 22C16.7053 22 20.3584 19.4742 22 15.8442Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}

export default App;
