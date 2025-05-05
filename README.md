# multi-ai-search

Simple web app to search multiple (customizable) AI engines simultaneously with one click.

## TODO

- [x] Allow users to customize/save their preferred engine list (using localStorage)
- [x] Add more search engines base on the research of https://github.com/CaraJ7/MMSearch
  - https://mmsearch.github.io

- [ ] format code

- [ ] Add more known AI search engines if URL params allow
  * Claude
  * Grok
  * SourceGraph
  * https://yep.com/chat/?q=%s
  * https://sourcegraph.com/search?q=%s
  * https://duckduckgo.com/?q=%s&assist=true

- [ ] Support Progressive Web App (PWA)
  * creating a web app manifest
  * adding a service worker
  * ensuring your app is served over HTTPS

- [ ] Support choose suitable engines using AI algorithms
- [ ] Improve UI feedback (e.g., "opening tabs..." message)
- [ ] Add dark mode toggle using CSS variables
- [ ] Refactor JS for better modularity (e.g., separate URL generation)
