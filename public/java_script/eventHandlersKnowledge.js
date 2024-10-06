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
            } else {
                card.style.display = "none"; // Hide the card
            }
        });
    })

    document.getElementById('knowledge-filter-input').addEventListener('input', function () {

        let filterValue = this.value.toLowerCase();
        // Get the value of the input field and convert it to lowercase for case-insensitive matching
        const cards = document.querySelectorAll('.knowledge-card');
        cards.forEach(card => {
            if (card.style.display !== 'none') {
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

});





document.getElementById("openAddFormButton").addEventListener("click", openAddForm);
function openAddForm() {
    document.getElementById("form").style.display = "block";
}

document.getElementById("closeAddForm").addEventListener("click", closeAddForm);
function closeAddForm() {
    document.getElementById("form").style.display = "none";
}

