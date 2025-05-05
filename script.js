document.addEventListener("DOMContentLoaded", () => {
  // --- Configuration ---
  const STORAGE_KEY = "multiAiSearchSelectedEngines";

  // Define all available search engines
  // { id: 'unique-id', name: 'Display Name', urlTemplate: 'URL with {query} placeholder' }
  const ALL_ENGINES = [
    // --- AI Focused / Chat ---
    {
      id: "brave",
      name: "Brave Search",
      urlTemplate: "https://search.brave.com/search?q={query}&summary=1",
    },
    {
      id: "perplexity",
      name: "Perplexity",
      urlTemplate: "https://www.perplexity.ai/search?q={query}",
    },
    {
      id: "phind",
      name: "Phind",
      urlTemplate: "https://phind.com/search?q={query}",
    },
    {
      id: "you",
      name: "You.com",
      urlTemplate: "https://you.com/search?q={query}",
    },
    // Note: ChatGPT's official site doesn't support direct URL query parameters
    // This link will likely just open the main ChatGPT interface.
    {
      id: "chatgpt",
      name: "ChatGPT (No Direct Search)",
      urlTemplate: "https://chatgpt.com/",
    },

    // --- General Search Engines ---
    {
      id: "duckduckgo",
      name: "DuckDuckGo",
      urlTemplate: "https://duckduckgo.com/?q={query}&assist=true",
    },
    {
      id: "bing",
      name: "Bing",
      urlTemplate: "https://www.bing.com/search?q={query}",
    },
    {
      id: "google",
      name: "Google",
      urlTemplate: "https://www.google.com/search?q={query}",
    },
    {
      id: "startpage",
      name: "Startpage (Private Google)",
      urlTemplate: "https://www.startpage.com/sp/search?query={query}",
    },
    {
      id: "ecosia",
      name: "Ecosia (Eco-friendly)",
      urlTemplate: "https://www.ecosia.org/search?q={query}",
    },
    {
      id: "qwant",
      name: "Qwant (Privacy)",
      urlTemplate: "https://www.qwant.com/?q={query}",
    }, // European privacy engine

    // --- Specialized / Reference ---
    {
      id: "wikipedia",
      name: "Wikipedia",
      urlTemplate: "https://en.wikipedia.org/w/index.php?search={query}",
    },
    {
      id: "wolframalpha",
      name: "WolframAlpha (Compute)",
      urlTemplate: "https://www.wolframalpha.com/input?i={query}",
    }, // Note 'i' parameter
    {
      id: "github",
      name: "GitHub (Code Repos)",
      urlTemplate: "https://github.com/search?q={query}",
    },
    {
      id: "googlescholar",
      name: "Google Scholar",
      urlTemplate: "https://scholar.google.com/scholar?q={query}",
    },
    {
      id: "semanticscholar",
      name: "Semantic Scholar",
      urlTemplate: "https://www.semanticscholar.org/search?q={query}",
    },

    // Add more engines here if desired, following the format:
    // { id: 'unique-id', name: 'Display Name', urlTemplate: 'https://example.com/search?query={query}' },
  ];

  // Define default selected engines if none are saved
  const DEFAULT_SELECTED_IDS = [
    "brave",
    "google",
    "bing",
    "duckduckgo",
    "wikipedia",
  ];

  // --- DOM Elements ---
  const queryInput = document.getElementById("query");
  const searchButton = document.getElementById("search-button");
  const engineChoicesContainer = document.getElementById("engine-choices");

  // --- Functions ---

  /**
   * Loads selected engine IDs from localStorage.
   * @returns {string[]} Array of selected engine IDs.
   */
  function loadPreferences() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "string")
        ) {
          const validSavedIds = parsed.filter((id) =>
            ALL_ENGINES.some((engine) => engine.id === id),
          );
          if (validSavedIds.length > 0) {
            return validSavedIds;
          } else {
            console.warn(
              "Saved preferences contained only invalid/obsolete engine IDs. Reverting to default.",
            );
          }
        } else {
          console.warn(
            "Invalid data format in localStorage. Reverting to default.",
          );
        }
      } catch (e) {
        console.error("Error parsing saved preferences:", e);
      }
    }
    // Return default if nothing saved, parsing failed, data invalid, or only obsolete IDs saved
    console.log("Using default engine selection.");
    // Make a copy to prevent accidental modification of the original default array
    return [...DEFAULT_SELECTED_IDS]; // Use spread to copy
  }

  /**
   * Saves selected engine IDs to localStorage.
   * @param {string[]} selectedIds Array of selected engine IDs.
   */
  function savePreferences(selectedIds) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    console.log("Preferences saved:", selectedIds);
  }

  /**
   * Renders the checkboxes for engine selection.
   * @param {string[]} selectedIds Array of currently selected engine IDs.
   */
  function renderEngineChoices(selectedIds) {
    engineChoicesContainer.innerHTML = ""; // Clear previous content
    engineChoicesContainer.setAttribute("role", "group");
    engineChoicesContainer.setAttribute(
      "aria-labelledby",
      "customize-engines-heading",
    );

    ALL_ENGINES.forEach((engine) => {
      const isChecked = selectedIds.includes(engine.id);

      const wrapper = document.createElement("div");
      wrapper.className = "engine-choice";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `engine-${engine.id}`;
      checkbox.value = engine.id;
      checkbox.checked = isChecked;

      const label = document.createElement("label");
      label.htmlFor = `engine-${engine.id}`;
      label.textContent = engine.name;

      checkbox.addEventListener("change", handleCheckboxChange);

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      engineChoicesContainer.appendChild(wrapper);
    });

    const heading = document.querySelector("#engine-options-container h2");
    if (heading) heading.id = "customize-engines-heading";
  }

  /**
   * Handles the change event for engine checkboxes.
   */
  function handleCheckboxChange() {
    const selectedCheckboxes = engineChoicesContainer.querySelectorAll(
      'input[type="checkbox"]:checked',
    );
    const currentSelectedIds = Array.from(selectedCheckboxes).map(
      (cb) => cb.value,
    );
    savePreferences(currentSelectedIds);
  }

  /**
   * Generates the list of URLs for the currently selected engines and query.
   * @param {string} query - The user's search query (trimmed).
   * @returns {string[]} Array of URLs to open.
   */
  function getSelectedEngineUrls(query) {
    const encodedQuery = encodeURIComponent(query);
    const selectedIds = loadPreferences(); // Get the latest saved preferences

    if (selectedIds.length === 0) {
      alert(
        'Please select at least one search engine in the "Customize Engines" section.',
      );
      const firstCheckbox = engineChoicesContainer.querySelector(
        'input[type="checkbox"]',
      );
      if (firstCheckbox) firstCheckbox.focus();
      return []; // Return empty array if no engines selected
    }

    const urlsToOpen = ALL_ENGINES.filter((engine) =>
      selectedIds.includes(engine.id),
    ).map((engine) => {
      if (engine.urlTemplate.includes('{query}')) {
         return engine.urlTemplate.replace('{query}', encodedQuery);
      }

      console.warn(`Engine "${engine.name}" (${engine.id}) does not appear to support direct query parameters in its template.`);
      return engine.urlTemplate; // Return template as is
    });

    return urlsToOpen;
  }

  /**
   * Opens search tabs for the selected engines.
   */
  function openSelectedTabs() {
    const query = queryInput.value.trim();
    if (!query) {
      alert("Please enter a search query.");
      queryInput.focus();
      return;
    }

    const urlsToOpen = getSelectedEngineUrls(query);
    if (urlsToOpen.length === 0) {
      console.log("No URLs generated or selected engines found.");
      return;
    }

    console.log(`Attempting to open ${urlsToOpen.length} tabs for query: "${query}"`);

    // IMPORTANT: Browser pop-up blockers will likely interfere with opening multiple tabs simultaneously.
    // The user will need to allow pop-ups for this page.
    // Adding a small, increasing delay *might* slightly improve behavior in some cases, but is not a guarantee.
    urlsToOpen.forEach((url, index) => {
      setTimeout(() => {
        console.log(`Opening tab ${index + 1}/${urlsToOpen.length}: ${url}`);
        const newTab = window.open(url, "_blank");
         if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
            // Browser blocked the pop-up
            console.warn(`Pop-up blocked for URL: ${url}. User needs to allow pop-ups for this site.`);
            // Optionally, alert the user here, but it might get annoying
            // if multiple are blocked:
            // if (index === 0) alert("Please allow pop-ups in your browser to open all tabs.");
         } else {
             // Optional: Try to keep focus on the original window (behavior varies)
             window.focus();
         }
      }, index * 150); // 150ms delay between each tab opening
    });

    // Give focus back to the input after triggering search
    queryInput.focus();
    // Optional: Select text for easy new search
    // queryInput.select();
  }

  // --- Initialization ---
  const initialSelectedIds = loadPreferences();
  renderEngineChoices(initialSelectedIds);

  // --- Event Listeners ---
  searchButton.addEventListener("click", openSelectedTabs);

  queryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent potential form submission if wrapped in a form later
      openSelectedTabs();
    }
  });
}); // End DOMContentLoaded listener
