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
    const maxFiles = 3; // Limit to 3 files
    const maxSizeInBytes = 2 * 1024 * 1024;
    const allowedFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const files = fileInput.files;
            let valid = true; // Flag to check if all files are valid
            let fileNames = [];

            if (files.length > maxFiles) {
                alert(`You can only upload a maximum of ${maxFiles} files.`);
                fileInput.value = ""; // Reset the file input
                fileNameSpan.textContent = "No files chosen";
                valid = false;
            } else {
                // Check each file's size
                Array.from(files).forEach(file => {
                    if (file.size > maxSizeInBytes) {
                        alert(`The file "${file.name}" exceeds the 2 MB size limit.`);
                        valid = false;
                    } else if (!allowedFileTypes.includes(file.type)) {
                        alert(`The file "${file.name}" is not an allowed file type. Only JPG, PNG, and PDF files are accepted.`);
                        valid = false;
                    } else {
                        fileNames.push(file.name); // If valid, add to the list of file names
                    }
                });
            }

            // If all files are valid, show the file names
            if (valid && files.length > 0) {
                fileNameSpan.textContent = fileNames.join(', ');
            } else {
                fileInput.value = ""; // Reset the file input if any file is invalid
                fileNameSpan.textContent = "No files chosen";
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











