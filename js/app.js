document.addEventListener('DOMContentLoaded', () => {
    const products = JSON.parse(content);
    
    // navigation
    const home = document.querySelector("#home");
    const browse = document.querySelector("#browse");
    const about = document.querySelector("#about");
    const shoppingCart = document.querySelector("#shoppingCart");

    document.querySelector("nav").addEventListener('click', (e) => {
        if(e.target.nodeName == "IMG") {
            showView("home")
            return;
        } else if (e.target.nodeName == "LI") {
            const navList = document.querySelectorAll("#navigation li");
            const clickedNav = e.target.textContent.trim();

            if (clickedNav === "Home") {showView("home"); return;}
            if (clickedNav === "Browse") {showView("browse"); return;}
            if (clickedNav === "About") {document.querySelector("#about").showModal(); return;}
        } else if (e.target.nodeName == "H3") {
            showView("shoppingCart");
        }
    });

    function showView(viewName) {
        home.classList.add("hidden");
        browse.classList.add("hidden");
        shoppingCart.classList.add("hidden");

        if (viewName === "home") home.classList.remove("hidden");
        if (viewName === "browse") browse.classList.remove("hidden");
        if (viewName === "shoppingCart") shoppingCart.classList.remove("hidden");
    }

    // handling about pop up
    document.querySelector("#close").addEventListener('click', () => {
        document.querySelector("#about").close();
    });
    document.querySelector("#x").addEventListener('click', () => {
        document.querySelector("#about").close();
    });
});