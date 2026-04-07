function openModal(item) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    let mediaHtml = '';

    if (item.media_type === 'video') {
        // NASA often sends a standard watch link, but iframes need the /embed/ version
        let videoUrl = item.url;
        if (videoUrl.includes('youtube.com/watch?v=')) {
            videoUrl = videoUrl.replace('watch?v=', 'embed/');
        } else if (videoUrl.includes('youtu.be/')) {
            videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
        }

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
        mediaHtml = `<img src="${item.hdurl || item.url}" alt="${item.title}">`;
    }

    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            ${mediaHtml}
            <div class="modal-text">
                <h2>${item.title}</h2>
                <span class="modal-date">${item.date}</span>
                <p class="explanation">${item.explanation}</p>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Close logic
    modalOverlay.querySelector('.close-btn').onclick = () => modalOverlay.remove();
    modalOverlay.onclick = (e) => { if (e.target === modalOverlay) modalOverlay.remove(); };
}
