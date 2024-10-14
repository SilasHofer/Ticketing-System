document.addEventListener("DOMContentLoaded", function () {
    // Get all the navbar links and admin cards
    const navbarLinks = document.querySelectorAll('.vertical-navbar a');
    const adminCards = document.querySelectorAll('.admin-card');

    // Hide all admin cards except the first one by default
    adminCards.forEach((card, index) => {
        if (index !== 0) card.style.display = 'none';
    });

    // Add click event listeners to each link
    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default anchor behavior (scrolling)

            // Get the target section from the link's href attribute
            const targetSection = document.querySelector(this.getAttribute('href'));

            // Hide all admin cards
            adminCards.forEach(card => {
                card.style.display = 'none';
            });

            // Show the target admin card
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            // Remove active class from all links
            navbarLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            // Add active class to the clicked link
            this.classList.add('active');
        });
    });
    document.querySelectorAll(".openTicket").forEach(button => {
        button.addEventListener("click", function () {
            // Get the ticket ID from the data attribute
            const ticketID = button.getAttribute("data-ticket-id");
            // Redirect to the ticket URL
            window.location.href = `/ticket?ticketID=${ticketID}`;
        });
    });
});
