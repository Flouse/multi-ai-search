# multi-ai-search

Simple web app to search multiple (customizable) AI engines simultaneously with one click.

## Features
- Support multiple AI search engines and General Search Engines (TODO: add a screenshot)
  - Brave Search
  - Perplexity
  - Phind
  - You.com
  - ChatGPT (No Direct Search)
  - Grok
  - DuckDuckGo
  - Bing
  - Google
  - Startpage (Private Google)
  - Ecosia (Eco-friendly)
  - Qwant (Privacy)
  - Wikipedia
  - WolframAlpha (Compute)
  - Google Scholar
  - Semantic Scholar
  - Yep Chat
  - Code Search
    - GitHub (Code Repos)
    - SourceGraph

- Allow users to customize/save their preferred engine list (using localStorage)

## TODO

- [ ] Support choose suitable engines using AI algorithms
  - Given search string or question, suggest which engines should be used (Opt-in Feature)

    Let user type in what the user is looking for.
    The AI could analyze the query and generate a good prompt, and then select the most appropriate search engines from the available list.
    This would go beyond simple keyword matching and attempt to understand the intent behind the query. It doesn't just match keywords but understands the context.

    E.g.
    a. query a word -> wiki, translator
    b. input is a question -> AI search
    c. understand the question using Gemini flash 2.5 and refactor the question and add context

- [ ] Support Progressive Web App (PWA)
  * creating a web app manifest
  * adding a service worker
  * ensuring your app is served over HTTPS

- [ ] Add dark mode toggle using CSS variables
- [ ] Improve UI feedback (e.g., "opening tabs..." message)

- [ ] Add more known AI search engines if URL params allow
  * Claude
