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
    // YOUR API KEY INTEGRATED BELOW
    const apiKey = 'cKBY6hSNpY3hec0iVWzpdoClgXINNOkb9S9jyYdO'; 
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
        // Thumbnail placeholder for videos, actual image for photos
        const mediaElement = item.media_type === 'video' 
            ? `<div class="video-icon" style="height:220px; display:flex; align-items:center; justify-content:center; background:#2a2a2a; color:white; font-weight:bold;">📹 View Space Video</div>`
            : `<img src="${item.url}" alt="${item.title}" loading="lazy" style="width:100%; height:220px; object-fit:cover;">`;

        card.innerHTML = `
            ${mediaElement}
            <div class="item-info" style="padding:15px;">
                <h3 style="margin:0; font-size:1.1rem;">${item.title}</h3>
                <p class="item-date" style="color: #FC3D21; font-weight:bold; margin-top:5px;">${item.date}</p>
            </div>
        `;

        // Open modal on click
        card.addEventListener('click', () => openModal(item));
        gallery.appendChild(card);
    });
}

// 4. Modal View Function
function openModal(item) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    let modalMedia = '';

    // CRITICAL FIX: Convert YouTube URLs to /embed/ format so they play in iFrames
    if (item.media_type === 'video') {
        let videoUrl = item.url;
        if (videoUrl.includes('youtube.com/watch?v=')) {
            videoUrl = videoUrl.replace('watch?v=', 'embed/');
        } else if (videoUrl.includes('youtu.be/')) {
            videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
        }
        // Force HTTPS
        videoUrl = videoUrl.replace('http://', 'https://');

        modalMedia = `
            <div class="video-container" style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden;">
                <iframe src="${videoUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%;" frameborder="0" allowfullscreen></iframe>
            </div>`;
    } else {
        modalMedia = `<img src="${item.hdurl || item.url}" alt="${item.title}" style="width:100%; display:block;">`;
    }

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            ${modalMedia}
            <div class="modal-text" style="padding:30px; color:white;">
                <h2>${item.title}</h2>
                <span class="modal-date" style="color: #FC3D21; font-weight:bold;">${item.date}</span>
                <p class="explanation" style="margin-top:15px; line-height:1.6;">${item.explanation}</p>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Close Logic
    const closeBtn = modalOverlay.querySelector('.close-btn');
    closeBtn.onclick = () => modalOverlay.remove();
    
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
    
    const container = document.querySelector('.container');
    const header = document.querySelector('.site-header');
    if (container && header) {
        container.insertBefore(factSection, header.nextSibling);
    }
});
