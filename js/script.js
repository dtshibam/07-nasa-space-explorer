/**
 * NASA Space Explorer - script.js
 */

// 1. Initialize Date Inputs & Logic from dateRange.js
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// This uses the setup function provided in your starter files
if (typeof setupDateInputs === 'function') {
    setupDateInputs(startInput, endInput);
}

const gallery = document.getElementById('gallery');
const searchBtn = document.querySelector('button');

// 2. Fetch Data from NASA API
async function fetchNASAData() {
    const apiKey = 'DEMO_KEY'; // Replace with your actual NASA API key if you have one
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
        gallery.innerHTML = `<p class="error" style="color:red; text-align:center;">Error: ${error.message || 'Could not fetch data.'}</p>`;
        console.error("API Fetch Error:", error);
    }
}

// 3. Render Gallery Items
function renderGallery(data) {
    gallery.innerHTML = ''; // Clear loader/placeholder

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-item';

        // Check if it's a video or image for the thumbnail
        let mediaThumbnail = '';
        if (item.media_type === 'video') {
            mediaThumbnail = `<div class="video-icon" style="height:250px; display:flex; align-items:center; justify-content:center; background:#333;">📹 View Space Video</div>`;
        } else {
            mediaThumbnail = `<img src="${item.url}" alt="${item.title}" loading="lazy">`;
        }

        card.innerHTML = `
            ${mediaThumbnail}
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

// 4. Modal View Function (With Video Fix)
function openModal(item) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    let mediaHtml = '';

    if (item.media_type === 'video') {
        // Fix for YouTube URLs to ensure they work in an iframe
        let videoUrl = item.url;
        if (videoUrl.includes('youtube.com/watch?v=')) {
            videoUrl = videoUrl.replace('watch?v=', 'embed/');
        } else if (videoUrl.includes('youtu.be/')) {
            videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
        }
        // Force HTTPS to avoid security blocks
        videoUrl = videoUrl.replace('http://', 'https://');

        mediaHtml = `
            <div class="video-container">
                <iframe 
                    src="${videoUrl}" 
                    frameborder="0" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen>
                </iframe>
            </div>`;
    } else {
        // High-res image logic
        mediaHtml = `<img src="${item.hdurl || item.url}" alt="${item.title}">`;
    }

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            ${mediaHtml}
            <div class="modal-text">
                <h2>${item.title}</h2>
                <span class="modal-date" style="color: #FC3D21; font-weight: bold;">${item.date}</span>
                <p class="explanation" style="margin-top: 15px; line-height: 1.6;">${item.explanation}</p>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Close logic
    modalOverlay.querySelector('.close-btn').onclick = () => modalOverlay.remove();
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
    container.insertBefore(factSection, header.nextSibling);
});
