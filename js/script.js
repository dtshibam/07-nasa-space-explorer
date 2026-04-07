/**
 * NASA Space Explorer - script.js
 * Handles API fetching, gallery rendering, and modal views.
 */

// 1. Initialize Date Inputs (From your provided snippet)
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Ensure the dateRange.js logic is applied to restrict dates (1995-Today)
if (typeof setupDateInputs === 'function') {
    setupDateInputs(startInput, endInput);
}

const gallery = document.getElementById('gallery');
const searchBtn = document.querySelector('button');

// 2. Fetch Data from NASA API
async function fetchNASAData() {
    const apiKey = 'DEMO_KEY'; // Replace with your actual NASA API key if needed
    const start = startInput.value;
    const end = endInput.value;

    if (!start || !end) {
        alert("Please select both a start and end date!");
        return;
    }

    // [Loading Message] - Rubric Requirement
    gallery.innerHTML = `
        <div class="loading-state">
            <p>🔄 Loading space photos...</p>
        </div>
    `;

    try {
        const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${start}&end_date=${end}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        renderGallery(data);
    } catch (error) {
        gallery.innerHTML = `<p class="error">Error: ${error.message || 'Could not fetch data.'}</p>`;
        console.error("API Fetch Error:", error);
    }
}

// 3. Render Gallery Items
function renderGallery(data) {
    gallery.innerHTML = ''; // Clear loader/placeholder

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-item';

        // [LevelUp: Handle Video Entries]
        // If it's a video, we show a placeholder icon; images show the actual NASA photo.
        const mediaElement = item.media_type === 'video' 
            ? `<div class="video-icon">📹 View Space Video</div>`
            : `<img src="${item.url}" alt="${item.title}" loading="lazy">`;

        card.innerHTML = `
            ${mediaElement}
            <div class="item-info">
                <h3>${item.title}</h3>
                <p class="item-date">${item.date}</p>
            </div>
        `;

        // Open modal on click
        card.addEventListener('click', () => openModal(item));
        gallery.appendChild(card);
    });
}

// 4. Modal View Function
function openModal(item) {
    // Create Modal Elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Handle Video vs Image in Modal
    const modalMedia = item.media_type === 'video'
        ? `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`
        : `<img src="${item.hdurl || item.url}" alt="${item.title}">`;

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            ${modalMedia}
            <div class="modal-text">
                <h2>${item.title}</h2>
                <span class="modal-date">${item.date}</span>
                <p class="explanation">${item.explanation}</p>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Close Logic
    const closeBtn = modalOverlay.querySelector('.close-btn');
    closeBtn.onclick = () => modalOverlay.remove();
    
    // Close if clicking outside the content box
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) modalOverlay.remove();
    };
}

// 5. Event Listeners
searchBtn.addEventListener('click', fetchNASAData);

// [LevelUp: Random Space Fact]
window.addEventListener('DOMContentLoaded', () => {
    const facts = [
        "One million Earths could fit inside the Sun.",
        "The footprints on the Moon will be there for 100 million years.",
        "Venus is the hottest planet in our solar system.",
        "Space is completely silent because there is no air to carry sound.",
        "A day on Venus is longer than a year on Earth."
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    const factSection = document.createElement('div');
    factSection.className = 'daily-fact';
    factSection.innerHTML = `<p><strong>Did You Know?</strong> ${randomFact}</p>`;
    
    // Insert after the header
    const container = document.querySelector('.container');
    const header = document.querySelector('.site-header');
    container.insertBefore(factSection, header.nextSibling);
});
