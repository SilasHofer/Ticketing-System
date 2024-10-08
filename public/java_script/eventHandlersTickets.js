document.addEventListener("DOMContentLoaded", function () {
    // Attach event listener to ticket images
    document.querySelectorAll('.ticket-images').forEach(img => {
        img.addEventListener('click', function () {
            const imageSrc = this.getAttribute('data-image'); // Get image source
            showImageLightbox(imageSrc);
        });
    });

    // Attach event listener to knowledge cards
    document.querySelectorAll('.knowledge-card').forEach(card => {
        card.addEventListener('click', function () {
            const title = card.querySelector('.knowledge-title').textContent;
            const author = card.querySelector('.knowledge-author').textContent;
            const time = card.querySelector('.knowledge-time').textContent;
            const description = card.querySelector('.knowledge-description').textContent;

            showKnowledgeLightbox(title, author, time, description);
        });
    });

    // Check if the elements exist before adding the event listeners
    const closeButton = document.getElementById('close');
    const lightbox = document.getElementById('lightbox');

    if (closeButton) {
        closeButton.addEventListener('click', function () {
            lightbox.style.display = 'none'; // Hide lightbox
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', function (event) {
            // Ensure you don't close the lightbox if clicking the image or close button
            if (event.target === lightbox) {
                lightbox.style.display = 'none'; // Hide lightbox
            }
        });
    }


    // Function to show the lightbox with image
    function showImageLightbox(imageSrc) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxContent = document.getElementById('lightbox-content');
        const downloadLink = document.getElementById('lightbox-download');
        const downloadButton = document.getElementById('download-button');

        // Show the image
        lightboxImg.src = imageSrc;
        lightboxImg.style.display = 'block'; // Show image
        lightboxContent.style.display = 'none'; // Hide text content

        // Set up download button
        const fileName = imageSrc.substring(imageSrc.lastIndexOf('/') + 1).replace(/-\d+-\d+(?=\.\w+$)/, '');
        downloadLink.href = imageSrc;
        downloadLink.download = fileName;
        downloadButton.style.display = 'block'; // Show download button

        // Display the lightbox
        document.getElementById('lightbox').style.display = 'flex';
    }

    // Function to show the lightbox with knowledge card
    function showKnowledgeLightbox(title, author, time, description) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxContent = document.getElementById('lightbox-content');
        const downloadButton = document.getElementById('download-button');

        // Hide the image
        lightboxImg.style.display = 'none'; // Hide image
        lightboxContent.style.display = 'block'; // Show text content

        // Fill in knowledge card details
        document.getElementById('lightbox-title').textContent = title;
        document.getElementById('lightbox-author').textContent = author;
        document.getElementById('lightbox-time').textContent = time;
        document.getElementById('lightbox-description').textContent = description;

        // Hide the download button (since it's for images)
        downloadButton.style.display = 'none';

        // Display the lightbox
        document.getElementById('lightbox').style.display = 'flex';
    }
});
