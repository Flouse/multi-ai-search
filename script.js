document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const STORAGE_KEY = 'multiAiSearchSelectedEngines';

    // Define all available search engines
    const ALL_ENGINES = [
        { id: 'brave', name: 'Brave Search', urlTemplate: 'https://search.brave.com/search?q={query}&summary=1' },
        { id: 'perplexity', name: 'Perplexity', urlTemplate: 'https://www.perplexity.ai/search?q={query}' },
        { id: 'you', name: 'You.com', urlTemplate: 'https://you.com/search?q={query}' },
        { id: 'phind', name: 'Phind', urlTemplate: 'https://phind.com/search?q={query}' },

        // Traditional search engines
        { id: 'duckduckgo', name: 'DuckDuckGo', urlTemplate: 'https://duckduckgo.com/?q={query}&assist=true' },
        { id: 'bing', name: 'Bing', urlTemplate: 'https://www.bing.com/search?q={query}' },
        { id: 'google', name: 'Google', urlTemplate: 'https://www.google.com/search?q={query}' },

        // TODO: Still likely won't auto-search
        { id: 'chatgpt', name: 'ChatGPT', urlTemplate: 'https://chatgpt.com/?q={query}' },

        // Add more engines here if desired
        // { id: 'duckduckgo', name: 'DuckDuckGo', urlTemplate: 'https://duckduckgo.com/?q={query}' },
    ];

    // Define default selected engines if none are saved
    const DEFAULT_SELECTED_IDS = ['brave', 'google', 'bing'];

    // --- DOM Elements ---
    const queryInput = document.getElementById('query');
    const searchButton = document.getElementById('search-button');
    const engineChoicesContainer = document.getElementById('engine-choices');

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
                // Basic validation: ensure it's an array of strings
                if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                     // Further validation: Ensure saved IDs still exist in ALL_ENGINES
                     const validSavedIds = parsed.filter(id => ALL_ENGINES.some(engine => engine.id === id));
                     if (validSavedIds.length > 0) {
                        return validSavedIds;
                     }
                }
            } catch (e) {
                console.error("Error parsing saved preferences:", e);
            }
        }
        return DEFAULT_SELECTED_IDS;
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
        engineChoicesContainer.innerHTML = ''; // Clear previous content

        ALL_ENGINES.forEach(engine => {
            const isChecked = selectedIds.includes(engine.id);

            const wrapper = document.createElement('div');
            wrapper.className = 'engine-choice'; // For styling

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `engine-${engine.id}`;
            checkbox.value = engine.id;
            checkbox.checked = isChecked;
            checkbox.setAttribute('aria-label', engine.name); // Accessibility

            const label = document.createElement('label');
            label.htmlFor = `engine-${engine.id}`;
            label.textContent = engine.name;

            // Add event listener to save preferences when a box is checked/unchecked
            checkbox.addEventListener('change', handleCheckboxChange);

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);
            engineChoicesContainer.appendChild(wrapper);
        });
    }

    /**
     * Handles the change event for engine checkboxes.
     */
    function handleCheckboxChange() {
        const selectedCheckboxes = engineChoicesContainer.querySelectorAll('input[type="checkbox"]:checked');
        const currentSelectedIds = Array.from(selectedCheckboxes).map(cb => cb.value);
        savePreferences(currentSelectedIds);
    }

    /**
     * Opens search tabs for the selected engines.
     */
    function openSelectedTabs() {
        const query = queryInput.value.trim();
        if (!query) {
            alert('Please enter a search query.');
            queryInput.focus();
            return;
        }

        const encodedQuery = encodeURIComponent(query);
        const selectedIds = loadPreferences(); // Get the latest saved preferences

        if (selectedIds.length === 0) {
             alert('Please select at least one search engine in the "Customize Engines" section.');
             return;
        }

        const urlsToOpen = ALL_ENGINES
            .filter(engine => selectedIds.includes(engine.id))
            .map(engine => engine.urlTemplate.replace('{query}', encodedQuery)); // Build URLs

        console.log(`Opening ${urlsToOpen.length} tabs for query: "${query}"`);
        console.log("Selected engines:", selectedIds);

        urlsToOpen.forEach((url, index) => {
             // Using a small, increasing delay *might* slightly improve behavior
             // with pop-up blockers in some cases, but isn't a guarantee.
             // Random delay was less predictable. Let's try incremental.
            setTimeout(() => {
                console.log(`Opening tab ${index + 1}/${urlsToOpen.length}: ${url}`);
                window.open(url, '_blank');
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
    searchButton.addEventListener('click', openSelectedTabs);

    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            openSelectedTabs();
        }
    });

}); // End DOMContentLoaded listener
