
document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("sortableTable");
    const headers = table.querySelectorAll("th");
    let direction = 1; // 1 for ascending, -1 for descending
    let lastSortedIndex = -1;


    headers.forEach((header, index) => {
        if (index === headers.length) return;

        header.addEventListener("click", () => {
            // Reset the previous sorted column's indicator
            if (lastSortedIndex !== -1 && lastSortedIndex !== index) {
                headers[lastSortedIndex].querySelector('.sort-indicator').textContent = "";
            }

            sortTableByColumn(table, index, direction);
            // Set the sort indicator on the current column
            const indicator = headers[index].querySelector('.sort-indicator');
            if (direction === 1) {
                indicator.textContent = "▲"; // Ascending triangle
            } else {
                indicator.textContent = "▼"; // Descending triangle
            }
            direction *= -1; // Toggle sorting direction on each click
            lastSortedIndex = index;
        });
    });

    headers[0].click();
    headers[0].click();

    document.querySelectorAll(".openTicket").forEach(button => {
        button.addEventListener("click", function () {
            // Get the ticket ID from the data attribute
            const ticketID = button.getAttribute("data-ticket-id");
            // Redirect to the ticket URL
            window.location.href = `/ticket?ticketID=${ticketID}`;
        });
    });

    const claimedFilterCheckbox = document.getElementById('claimed-filter');
    if (claimedFilterCheckbox) {
        claimedFilterCheckbox.addEventListener('change', function () {
            let tableRows = document.querySelectorAll('#ticket-table-body tr');
            const userName = document.querySelector('input[name="user_name"]').value;
            // Reset the text filter input when claimed filter is checked
            if (claimedFilterCheckbox.checked) {
                tableRows.forEach(function (row) {
                    let agentCell = row.querySelector('.filter-agent');

                    // Show the row if it matches the user's name
                    if (agentCell.textContent.trim() === userName) {
                        row.style.display = "table-row"; // Show the claimed ticket
                        row.setAttribute('data-claimed-filter', 'true');
                    } else {
                        row.style.display = "none"; // Hide rows that don't match
                        row.setAttribute('data-claimed-filter', 'false');
                    }
                });
            } else {
                location.reload();
            }
        });
    }


    document.getElementById('filter-input').addEventListener('input', function () {
        // Get the value of the input field and convert it to lowercase for case-insensitive matching
        let filterValue = this.value.toLowerCase();

        // Get all table rows in the tbody
        let tableRows = document.querySelectorAll('#ticket-table-body tr');

        if (filterValue === '' && !claimedFilterCheckbox.checked) {
            location.reload(); // Reload the page to reset filters
            return; // Stop further execution
        }

        // Loop through the table rows and hide those that don't match the filter
        tableRows.forEach(function (row) {
            let shouldDisplay = false; // Flag to track if row should be displayed

            if (row.getAttribute('data-claimed-filter') === 'true') {
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
            }
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

function parseTimeAgo(timeString) {
    // Split the string into number and unit (e.g., "4 days ago" becomes ["4", "days"])
    const timeParts = timeString.match(/(\d+)\s(\w+)\sago/);

    if (!timeParts) return 0; // In case parsing fails, treat it as 0 time difference

    const value = parseInt(timeParts[1], 10);
    const unit = timeParts[2].toLowerCase();

    // Convert to minutes based on the unit
    switch (unit) {
        case 'seconds':
            return value;
        case 'minutes':
            return value * 60; // convert hours to minutes
        case 'hours':
            return value * 60 * 60; // convert days to minutes
        case 'days':
            return value * 60 * 60 * 24; // convert weeks to minutes
        case 'months':
            return value * 60 * 60 * 24; // rough conversion for months
        case 'years':
            return value * 60 * 60 * 24 * 365; // rough conversion for years
        default:
            return 0; // If an unrecognized unit is found, default to 0
    }
}

function sortTableByColumn(table, columnIndex, direction) {
    const rowsArray = Array.from(table.querySelectorAll("tbody tr"));

    rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].innerText.toLowerCase();
        const cellB = rowB.children[columnIndex].innerText.toLowerCase();


        // Check if cellA or cellB are time-ago strings and convert them
        const timeA = parseTimeAgo(cellA);
        const timeB = parseTimeAgo(cellB);

        // If both are time-ago strings, sort based on that
        if (timeA !== null && timeB !== null) {
            return direction * (timeA - timeB);
        }

        // Check if the column is numeric and sort accordingly
        const aIsNumeric = !isNaN(cellA);
        const bIsNumeric = !isNaN(cellB);

        if (aIsNumeric && bIsNumeric) {
            return direction * (Number(cellA) - Number(cellB));
        } else {
            return direction * cellA.localeCompare(cellB);
        }
    });

    // Append sorted rows back to the table body
    const tbody = table.querySelector("tbody");
    rowsArray.forEach(row => tbody.appendChild(row));
}

// Check if there is an 'error' query parameter in the URL
const urlParams = new URLSearchParams(window.location.search);
const errorMessage = urlParams.get('error');

// If an error exists, show an alert with the message
if (errorMessage) {
    alert(decodeURIComponent(errorMessage));
    window.location.href = `/`; // Decode it to handle any special characters
}

const openAddFormButton = document.getElementById("openAddFormButton")
if (openAddFormButton) {
    openAddFormButton.addEventListener("click", openAddForm);
    function openAddForm() {
        document.getElementById("form").style.display = "block";
    }

}

const closeAddFormButton = document.getElementById("closeAddForm")
if (closeAddFormButton) {
    closeAddFormButton.addEventListener("click", closeAddForm);
    function closeAddForm() {
        document.getElementById("form").style.display = "none";
    }
}












