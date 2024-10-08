document.addEventListener("DOMContentLoaded", function () {

    const dropdown = document.querySelector('.category_dropdown');
    const knowledgeCards = document.querySelectorAll('.knowledge-card');


    dropdown.addEventListener('change', function () {
        const selectedCategory = this.value;
        // Clear the knowledge filter input when changing categories
        const filterInput = document.getElementById('knowledge-filter-input');
        if (filterInput) {
            filterInput.value = ''; // Clear the input field
        }
        // Loop through all knowledge cards
        knowledgeCards.forEach(card => {
            const cardCategoryId = card.getAttribute('data-category-id');

            // If "All categories" is selected or the category matches, show the card
            if (selectedCategory === "" || cardCategoryId === selectedCategory) {
                card.style.display = "block"; // Show the card
                card.setAttribute('data-claimed-filter', 'true');
            } else {
                card.style.display = "none"; // Hide the card
                card.setAttribute('data-claimed-filter', 'false');
            }
        });
    })

    document.getElementById('knowledge-filter-input').addEventListener('input', function () {

        let filterValue = this.value.toLowerCase();
        // Get the value of the input field and convert it to lowercase for case-insensitive matching
        const cards = document.querySelectorAll('.knowledge-card');
        cards.forEach(card => {
            if (card.getAttribute('data-claimed-filter') === 'true') {
                const title = card.querySelector('.knowledge-title').textContent.toLowerCase();
                const author = card.querySelector('.knowledge-author').textContent.toLowerCase();
                const description = card.querySelector('.knowledge-description').textContent.toLowerCase();

                if (title.includes(filterValue) || author.includes(filterValue) || description.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';

                }
            }
        });
    });
    document.querySelectorAll('.knowledge-card').forEach(card => {
        card.addEventListener('click', function () {
            // Grab content from the clicked card
            const title = this.querySelector('.knowledge-title').textContent;
            const category = this.querySelector('.knowledge-category').textContent;
            const author = this.querySelector('.knowledge-author').textContent;
            const time = this.querySelector('.knowledge-time').textContent;
            const description = this.querySelector('.knowledge-description').textContent;

            // Populate the lightbox with the card content
            document.getElementById('lightbox-title').textContent = title;
            document.getElementById('lightbox-category').textContent = category;
            document.getElementById('lightbox-author').textContent = author;
            document.getElementById('lightbox-time').textContent = time;
            document.getElementById('lightbox-description').textContent = description;

            // Show the lightbox
            document.getElementById('lightbox').style.display = 'block';
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





document.getElementById("openAddFormButton").addEventListener("click", openAddForm);
function openAddForm() {
    document.getElementById("form").style.display = "block";
}

document.getElementById("closeAddForm").addEventListener("click", closeAddForm);
function closeAddForm() {
    document.getElementById("form").style.display = "none";
}

