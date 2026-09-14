const form = document.querySelector("form");

const pass = document.querySelector("#password");
const confPass = document.querySelector("#confirmPassword");

form.addEventListener("submit", function (event) {

    if (pass.value.length < 8) {
        event.preventDefault();
        alert("Password must be at least 8 characters.");
        return;
    }

    if (pass.value !== confPass.value) {
        event.preventDefault();
        alert("Passwords do not match.");
        return;
    }

});


// Dashboard
 
/* ========================================================= CLOSE MOBILE SIDEBAR AFTER CLICK ========================================================= */
const sidebarLinks = document.querySelectorAll( ".dashboard-sidebar .sidebar-link" ); 
sidebarLinks.forEach(link => { 
    link.addEventListener("click", function () { 
        const sidebar = document.querySelector( ".dashboard-sidebar" );
        if ( window.innerWidth <= 767 && sidebar ) { 
            sidebar.classList.remove("show"); } }); });
/* ========================================================= ACTIVE SIDEBAR ITEM ========================================================= */ 
const currentPath = window.location.pathname; 
sidebarLinks.forEach(link => { const href = link.getAttribute("href"); 
    if (href === currentPath) { 
        sidebarLinks.forEach(item => { 
            item.classList.remove("active"); }); 
            link.classList.add("active"); } });