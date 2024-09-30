
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".openTicket").forEach(button => {
        button.addEventListener("click", function () {
            // Get the ticket ID from the data attribute
            const ticketID = button.getAttribute("data-ticket-id");
            // Redirect to the ticket URL
            window.location.href = `/ticket?ticketID=${ticketID}`;
        });
    });
    document.getElementById('filter-input').addEventListener('input', function () {
        // Get the value of the input field and convert it to lowercase for case-insensitive matching
        let filterValue = this.value.toLowerCase();

        // Get all table rows in the tbody
        let tableRows = document.querySelectorAll('#ticket-table-body tr');

        // Loop through the table rows and hide those that don't match the filter
        tableRows.forEach(function (row) {
            let shouldDisplay = false; // Flag to track if row should be displayed

            // Loop through each cell in the row
            row.querySelectorAll('td.filter').forEach(function (cell) {
                // Get the original text and check if it includes the filter value
                let cellText = cell.textContent.toLowerCase();
                if (cellText.includes(filterValue)) {
                    shouldDisplay = true; // Mark row for display
                    // Highlight matching text
                    const highlightedText = cellText.replace(
                        new RegExp(`(${filterValue})`, 'gi'),
                        '<span class="highlight">$1</span>'
                    );
                    cell.innerHTML = highlightedText; // Update cell HTML with highlighted text
                } else {
                    cell.innerHTML = cell.textContent; // Reset to original text if no match
                }
            });
            row.style.display = shouldDisplay ? '' : 'none';
        });
    });

    // Code for the file input functionality
    const fileInput = document.getElementById('myFile');
    const fileNameSpan = document.getElementById('file-name');
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const files = fileInput.files;
            let fileNames = [];

            // Only show the names of the files selected
            Array.from(files).forEach(file => {
                fileNames.push(file.name);
            });

            // Show the file names or reset if no files
            if (files.length > 0) {
                // Clear previous images
                const imageContainer = document.getElementById('imageContainer'); // Assuming you have a container for images
                imageContainer.innerHTML = ''; // Clear existing images

                // Store filenames for display
                const fileNames = [];

                // Loop through each file
                for (const file of files) {
                    // Check if the file is an image
                    if (file.type.startsWith('image/')) {
                        const img = document.createElement('img'); // Create an img element
                        img.src = URL.createObjectURL(file); // Create a URL for the file
                        img.alt = file.name; // Set alt text
                        img.style.width = '100px'; // Set desired width
                        img.style.height = 'auto'; // Maintain aspect ratio
                        img.style.marginRight = '10px'; // Add some space between images
                        imageContainer.appendChild(img); // Append the img to the container
                    } else {
                        fileNames.push(file.name); // If not an image, just store the filename
                    }
                }

                // Display filenames for non-image files
                const fileNameSpan = document.getElementById('file-name'); // Assuming you have a span for file names
                fileNameSpan.textContent = fileNames.length > 0 ? fileNames.join(', ') : "";
            } else {
                fileNameSpan.textContent = "No files chosen";
            }
        });
    }
});

// Check if there is an 'error' query parameter in the URL
const urlParams = new URLSearchParams(window.location.search);
const errorMessage = urlParams.get('error');

// If an error exists, show an alert with the message
if (errorMessage) {
    alert(decodeURIComponent(errorMessage));
    window.location.href = `/`; // Decode it to handle any special characters
}

document.getElementById("openAddFormButton").addEventListener("click", openAddForm);
function openAddForm() {
    document.getElementById("form").style.display = "block";
}

document.getElementById("closeAddForm").addEventListener("click", closeAddForm);
function closeAddForm() {
    document.getElementById("form").style.display = "none";
}











