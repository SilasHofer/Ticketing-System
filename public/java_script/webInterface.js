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

});

document.getElementById("openAddFormButton").addEventListener("click", openAddForm);
function openAddForm() {
    document.getElementById("form").style.display = "block";
}

document.getElementById("closeAddForm").addEventListener("click", closeAddForm);
function closeAddForm() {
    document.getElementById("form").style.display = "none";
}











