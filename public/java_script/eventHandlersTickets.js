document.addEventListener("DOMContentLoaded", function () {
    // Attach event listener to each image
    document.querySelectorAll('.ticket-images').forEach(img => {
        img.addEventListener('click', function () {
            const imageSrc = this.getAttribute('data-image'); // Get image source
            document.getElementById('lightbox-img').src = imageSrc; // Set image src for lightbox
            // Set the href of the download link to the image src
            // Extract the filename from the imageSrc (after the last "/")
            const fileName = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);
            const downloadLink = document.getElementById('lightbox-download');
            downloadLink.href = imageSrc;  // Set the href to the image URL
            downloadLink.download = fileName.replace(/-\d+-\d+(?=\.\w+$)/, '');
            document.getElementById('lightbox').style.display = 'flex'; // Show lightbox
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
});
