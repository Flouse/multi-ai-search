function openAll() {
  const queryInput = document.getElementById("query");
  const query = encodeURIComponent(queryInput.value.trim());

  if (!query) {
    alert("Please enter a search query.");
    queryInput.focus(); // Optional: put focus back on the input
    return;
  }

  // URLs for AI-powered search engines with query parameter
  const urls = [
    // Note: Official ChatGPT site doesn't support URL query params like this.
    // TODO: This URL might just open the site, not perform a search.
    // `https://chat.openai.com/?q=${query}`, // check Illustrative
    `https://chatgpt.com/?q=${query}`,
    `https://search.brave.com/search?q=${query}`, // Brave Search
    `https://www.perplexity.ai/search?q=${query}`, // Perplexity AI
    `https://you.com/search?q=${query}`, // You.com AI search
    `https://phind.com/search?q=${query}`, // Phind AI search

    // Add more URLs here if needed
    `https://www.bing.com/search?q=${query}`, // Bing Search (often includes AI features)
    `https://www.google.com/search?q=${query}`, // Google Search
  ];

  console.log(
    `Opening ${urls.length} tabs for query: "${decodeURIComponent(query)}"`,
  );

  urls.forEach((url) => {
    window.open(url, "_blank");
    // Adding a small delay *might* sometimes help with pop-up blockers,
    // but it's unreliable and generally not recommended.
    // setTimeout(() => window.open(url, '_blank'), 100);
  });
}

// Allow pressing Enter in the input field to trigger the search
document.getElementById("query").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    openAll();
  }
});
