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

    // populate filter
    // category
    const categoryTemplate = document.querySelector("#category template");
    const category = document.querySelector("#category");

    const categories = [];
    for (let product of products) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    }
    categories.sort();
    for (let c of categories) {
        const clone = categoryTemplate.content.cloneNode(true);

        const input = clone.querySelector("input");
        input.setAttribute("id", c);
        input.setAttribute("name", c);
        input.setAttribute("value", c);
        
        const label = clone.querySelector("label");
        label.textContent = c;

        category.appendChild(clone);
    }

    // size **needs to be worked on still so it's in order
    const sizeTemplate = document.querySelector("#size template");
    const size = document.querySelector("#size");

    const sizes = [];
    for (let product of products) {
        for (let s of product.sizes) {
            if (!sizes.includes(s)) {
                sizes.push(s)
            }
        }
    }

    for (let s of sizes) {
        const clone = sizeTemplate.content.cloneNode(true);

        const input = clone.querySelector("input");
        input.setAttribute("id", s);
        input.setAttribute("name", s);
        input.setAttribute("value", s);
        
        const label = clone.querySelector("label");
        label.textContent = s;

        size.appendChild(clone);
    }

    // colors
    const colorsTemplate = document.querySelector("#colors template");
    const colorsDiv = document.querySelector("#colors");

    const colors = [];
    for (let product of products) {
        for (let c of product.color) {
            if (!colors.includes(c.name)) {
            colors.push(c.name);
        }
        }
    
    }
    colors.sort();
    for (let c of colors) {
        const clone = colorsTemplate.content.cloneNode(true);

        const input = clone.querySelector("input");
        input.setAttribute("id", c);
        input.setAttribute("name", c);
        input.setAttribute("value", c);
        
        const label = clone.querySelector("label");
        label.textContent = c;

        colorsDiv.appendChild(clone);
    }

});