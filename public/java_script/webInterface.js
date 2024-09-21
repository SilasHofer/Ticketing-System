document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".openTicket").forEach(button => {
        button.addEventListener("click", function () {
            // Get the ticket ID from the data attribute
            const ticketID = button.getAttribute("data-ticket-id");
            // Redirect to the ticket URL
            window.location.href = `/ticket?ticketID=${ticketID}`;
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








