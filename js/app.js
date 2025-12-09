document.addEventListener('DOMContentLoaded', () => {
    const url = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    /* ---------------- utility functions ---------------- */
    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    function updateStorage(data) {
        localStorage.setItem('products', JSON.stringify(data));
    }

    // fetch and save data to local storage and run main()
    function fetchAndStore() {
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new error("fetch failed");
            }
        })
        .then(data => {
            updateStorage(data);
            main(data);
        })
        .catch(error => console.error(error));
    }

    // check if data already exists in local storage or not 
    const products = retrieveStorage();
    if (products && products.length > 0) {
        main(products);
    } else {
        fetchAndStore();
    }
    
    // toggles triangle for browse filter 
    function toggleTriagngle(name) {
        const p = document.querySelector("#" + name + " p");
        p.textContent = p.textContent.endsWith('▲')
            ? p.textContent.replace('▲', '▼')
            : p.textContent.replace('▼', '▲');
    }

    // populates category filter 
    function populateCategoryFilter(data) {
        const categoryCheckBox = document.querySelector("#categoryCheckBox");
        categoryCheckBox.classList.toggle("hidden");

        categoryCheckBox.innerHTML = "";

        toggleTriagngle("category");

        const categories = [];
        for (let product of data) {
            if (!categories.includes(product.category)) {
                categories.push(product.category);
            }
        }
    
        categories.sort();
        
        for (let c of categories) {
            const container = document.createElement("div");
            container.classList.add("filter-item");

            const input = document.createElement("input");
            input.type = "checkbox";
            input.classList.add("category");

            input.setAttribute("id", c);
            input.setAttribute("name", c);
            input.setAttribute("value", c);
            
            const label = document.createElement("label");
            label.textContent = c;
            label.setAttribute("for", c);

            container.appendChild(input);
            container.appendChild(label);
            categoryCheckBox.appendChild(container);
        }
    }

    // populates size filter
    function populateSizeFilter(data) {
        const sizeCheckBox = document.querySelector("#sizeCheckBox");
        sizeCheckBox.classList.toggle("hidden");

        sizeCheckBox.innerHTML = "";

        toggleTriagngle("size");

        const sizes = [];
        for (let product of data) {
            for (let s of product.sizes) {
                if (!sizes.includes(s)) {
                    sizes.push(s)
                }
            }
        }

        for (let s of sizes) {
            const container = document.createElement("div");
            container.classList.add("filter-item");

            const input = document.createElement("input");
            input.type = "checkbox";
            input.classList.add("size");

            input.setAttribute("id", s);
            input.setAttribute("name", s);
            input.setAttribute("value", s);
            
            const label = document.createElement("label");
            label.textContent = s;
            label.setAttribute("for", s);

            container.appendChild(input);
            container.appendChild(label);
            sizeCheckBox.appendChild(container);
        }
    }

    // populates color filter 
    function populateColorsFilter(data) {
        const colorsCheckBox = document.querySelector("#colorsCheckBox");
        colorsCheckBox.classList.toggle("hidden");

        colorsCheckBox.innerHTML = "";

        toggleTriagngle("colors");

        const colors = [];
        for (let product of data) {
            for (let c of product.color) {
                if (colors.findIndex(col => col.name === c.name) === -1) {
                    colors.push(c);
                }
            }

        }

        colors.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        for (let c of colors) {
            const container = document.createElement("div");
            container.classList.add("filter-item");

            const input = document.createElement("input");
            input.type = "checkbox";
            input.classList.add("color");

            input.setAttribute("id", c.name);
            input.setAttribute("name", c.name);
            input.setAttribute("value", c.name);
            
            const label = document.createElement("label");
            label.textContent = c.name;
            label.setAttribute("for", c.name);

            const div = document.createElement("div");
            div.style.backgroundColor = c.hex;
            div.style.height = "20px";
            div.style.width = "20px";
            div.style.border = "1px solid black";
            div.setAttribute("for", c.name);

            container.appendChild(input);
            container.appendChild(label);
            label.appendChild(div);
            colorsCheckBox.appendChild(container);
        }
    }

    // populates all filters according to what was clicked 
    function populateFilter(e, data) {
        if (e.target.nodeName == "P") {
                if (e.target.textContent.includes("Gender")) {
                    document.querySelector("#genderCheckBox").classList.toggle("hidden");
                    toggleTriagngle("gender")
                } else if (e.target.textContent.includes("Category")) {
                    populateCategoryFilter(data);
                } else if (e.target.textContent.includes("Size")) {
                    populateSizeFilter(data);
                } else if (e.target.textContent.includes("Colors")) {
                    populateColorsFilter(data);
                }
            }
    }

    // navigation
    function navigationHandler(e) {
        const home = document.querySelector("#home");
        const browse = document.querySelector("#browse");
        const about = document.querySelector("#about");
        const shoppingCart = document.querySelector("#shoppingCart");
        
        document.querySelector("#singleProduct").classList.add("hidden");

        if(e.target.nodeName == "IMG") {
            showView("home")
            return;
        } else if (e.target.nodeName == "LI") {
            const navList = document.querySelectorAll("#navigation li");
            const clickedNav = e.target.textContent.trim();

            if (clickedNav === "Home") {showView("home"); return;}
            if (clickedNav === "Browse") {showView("browse"); return;}
            if (clickedNav === "About") {document.querySelector("#about").showModal(); return;}
        } else if (e.target.nodeName == "H3" || e.target.nodeName == "DIV") {
            showView("shoppingCart");
            updateCart();
        }
    }

    function showView(viewName) {
        home.classList.add("hidden");
        browse.classList.add("hidden");
        shoppingCart.classList.add("hidden");

        if (viewName === "home") home.classList.remove("hidden");
        if (viewName === "browse") browse.classList.remove("hidden");
        if (viewName === "shoppingCart") shoppingCart.classList.remove("hidden");
    }

    // handling about pop up
    function aboutPageHandler() {
        document.querySelector("#close").addEventListener('click', () => {
            document.querySelector("#about").close();
        });
        document.querySelector("#x").addEventListener('click', () => {
            document.querySelector("#about").close();
        });
    }

    // handle filter depending on what filter is checked 
    function filterHandler(data) {
        const checked = [...document.querySelectorAll('#filter input:checked')];

        const filters = {
            gender: checked.filter(p => p.classList.contains("gender")).map(p => p.id),
            category: checked.filter(p => p.classList.contains("category")).map(p => p.id),
            size: checked.filter(p => p.classList.contains("size")).map(p => p.id),
            color: checked.filter(p => p.classList.contains("color")).map(p => p.id)
        };

        let results = data;

        if (filters.gender.length > 0) {
            results = results.filter(p => filters.gender.includes(p.gender));
        }
        if (filters.category.length > 0) {
            results = results.filter(p => filters.category.includes(p.category));
        }
        if (filters.size.length > 0) {
            results = results.filter(p => p.sizes.some(s => filters.size.includes(s)));
        }
        if (filters.color.length > 0) {
            results = results.filter(p => p.color.some(c => filters.color.includes(c.name)));
        }

        showSelectedFilters(checked, data);

        return results;
    
    }

    function applyFiltersAndSort(data) {
        const results = filterHandler(data);
        const sortType = document.querySelector("#sort").value;

        if (sortType == "nameAZ") {
            results.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        } else if (sortType == "nameZA") {
            results.sort((a, b) => {
                if (a.name > b.name) return -1;
                if (a.name < b.name) return 1;
                return 0;
            });
        } else if (sortType == "priceHL") {
            results.sort((a, b) => b.price - a.price);
        } else if (sortType == "priceLH") {
            results.sort((a, b) => a.price - b.price);
        } else if (sortType == "category") {
            results.sort((a, b) => {
                if (a.category < b.category) return -1;
                if (a.category > b.category) return 1;
                return 0;
            });
        }

        populateBrowsePage(results);
        
    }

    function showSelectedFilters(checked, data) {
        const div = document.querySelector("#selectedFilters");
        div.innerHTML = "";
        for(let c of checked) {
            const button = document.createElement("button");
            if (c.id == "mens" || c.id == "womens") {
                button.textContent = document.querySelector(`label[for="${c.id}"]`).textContent;
            } else {
                button.textContent = c.id;
            }

            div.appendChild(button);

            // deletes filter if button is clicked 
            button.addEventListener('click', (e) => {
                button.remove();
                if (c.id == "mens" || c.id == "womens") {
                    if (button.textContent == document.querySelector(`label[for="${c.id}"]`).textContent) {
                        c.checked = false;
                    }
                } else if (button.textContent == c.id) {
                    c.checked = false;
                }
                applyFiltersAndSort(data);
            });
            
        }
    }

    function populateBrowsePage(data) {
        const template = document.querySelector("#results template");
        const parent = document.querySelector("#browseResults");

        parent.innerHTML = "";

        for (let d of data) {
            const clone = template.content.cloneNode(true);

            const img = clone.querySelector("img");
            img.setAttribute("alt", `${d.name}`);
            img.id = d.id;

            const title = clone.querySelector(".browseResultProductTitle");
            title.textContent = d.name;
            title.id = d.id;

            const price = clone.querySelector(".browseResultProductPrice");
            price.textContent = "$" + d.price;
            price.id = d.id;

            const selected = displayColorAndSizeSelection(d, clone.querySelector(".browseColorOptions"), clone.querySelector(".browseSizeOptions"));

            const button = clone.querySelector(".addBtn");

            parent.appendChild(clone);

            button.onclick = () => {
                const selectedColor = selected.getColor();
                const selectedSize = selected.getSize();
                addToCart(d, selectedSize, selectedColor);
            };
        }

        parent.addEventListener('click', (e) => showSingleProduct(e, data));
    }

    function clearFilter(data) {
        const checked = [...document.querySelectorAll('#filter input:checked')];
        for (let c of checked) {
            c.checked = false;
        }
        checked.length = 0;

        showSelectedFilters(checked, data);
        applyFiltersAndSort(data);

    }

    function showSingleProduct(e, data) {
        if (e.target.nodeName == "IMG" || e.target.classList.contains("browseResultProductTitle")) {
            document.querySelector("#browse").classList.add("hidden");
            document.querySelector("#singleProduct").classList.remove("hidden");

            const id = e.target.id;

            const found = data.find(p => p.id == id);

            document.querySelector("#genderBC").textContent = found.gender;
            document.querySelector("#categoryBC").textContent = " > " + found.category;
            document.querySelector("#productName").textContent = " > " + found.name;

            document.querySelector("#productImage").alt = found.name;

            document.querySelector("#productTitle").textContent = found.name;
            document.querySelector("#productPrice").textContent = "$" + found.price;
            document.querySelector("#productDescriptionText").textContent = found.description;
            document.querySelector("#productMaterial").textContent = found.material;


            const selected = displayColorAndSizeSelection(found, document.querySelector("#colorOptions"), document.querySelector("#sizeOptions"));

            document.querySelector("#singleAddBtn").onclick = () => {
                const selectedColor = selected.getColor();
                const selectedSize = selected.getSize();
                const selectedQuantity = parseInt(document.querySelector("#qtyInput").value);

                if (selectedQuantity <= 0) {
                    alert("Please enter a valid quantity.");
                    return;
                }

                for (let i = 0; i < selectedQuantity; i++) {
                    addToCart(found, selectedSize, selectedColor);
                }
                document.querySelector("#qtyInput").value = "1";
            };

            loadRelatedProducts(found, data);
        }
    }

    function loadRelatedProducts(productData, data) {
        //show related products based on category
        let related = data.filter(p => p.category === productData.category && p.id !== productData.id);

        //if there are less than 4 related options, show options based on gender
        if (related.length < 4) {
            const sameGender = data.filter(p => p.gender === productData.gender && p.id !== productData.id);
            related.push(...sameGender);
        }

        related = related.slice(0,4);

        const relatedList = document.querySelector("#relatedList");
        relatedList.innerHTML = "";

        const template = document.querySelector("#relatedProductTemplate");

        related.forEach(product=> {
            const clone = template.content.cloneNode(true);

            const relatedImage = clone.querySelector(".relatedImage");
            relatedImage.src = "https://placehold.co/150x200";
            relatedImage.dataset.id = product.id;

            const relatedTitle = clone.querySelector(".relatedTitle");
            relatedTitle.textContent = product.name;
            relatedTitle.dataset.id = product.id;

            const relatedPrice = clone.querySelector(".relatedPrice");
            relatedPrice.textContent = "$" + product.price;
            relatedPrice.dataset.id = product.id;

            const relatedCard = clone.querySelector(".relatedCard");
            relatedCard.dataset.id = product.id;

            const selected = displayColorAndSizeSelection(product, clone.querySelector(".relatedColorOptions"), clone.querySelector(".relatedSizeOptions"));

            const button = clone.querySelector(".relatedAddBtn");
            
            // Add button functionality
            button.onclick = () => {
                const selectedColor = selected.getColor();
                const selectedSize = selected.getSize();
                addToCart(product, selectedSize, selectedColor);
            }

            relatedCard.addEventListener('click', (e) => {
                const allowedNodes = ["IMG", "H3", "P"];
                const clickedNode = e.target.nodeName;

                if (!allowedNodes.includes(clickedNode)) return;

                const id = e.target.dataset.id || e.currentTarget.dataset.id;
                if (!id) return;

                showSingleProductById(id, data);
            })
            
            relatedList.appendChild(clone);

        });
    }

    // had to look this up on google 
    function showSingleProductById(id, data) {
        const fakeEvent = { target: { id: id, nodeName: "IMG" } };
        showSingleProduct(fakeEvent, data);
    }

    function displayColorAndSizeSelection(found, colorContainer, sizeContainer) {
        colorContainer.innerHTML = "";
        sizeContainer.innerHTML = "";

        // set default to first color/size 
        let selectedColor = found.color[0].name;
        let selectedSize = found.sizes[0];

        for (let c of found.color) {
            const colorDiv = document.createElement("div"); 

            if (c.name == selectedColor) {
                colorDiv.style.border = "4px solid black";
            } else {
                colorDiv.style.border = "1px solid black";
            }

            colorDiv.dataset.value = c.name;
            colorDiv.style.backgroundColor = c.hex;
            colorDiv.style.height = "20px";
            colorDiv.style.width = "20px";
            colorDiv.style.padding = "5px";
            colorDiv.style.margin = "2px";

            colorContainer.appendChild(colorDiv);

            colorDiv.addEventListener('click', () => {
                colorContainer.querySelectorAll("div").forEach(div => {
                    colorDiv.style.border = "1px solid black";
                });

                colorDiv.style.border = "4px solid black";

                selectedColor = colorDiv.dataset.value;

            });
        }

        for (let s of found.sizes) {
            const sizeDiv = document.createElement("div");

            if (s === selectedSize) {
                sizeDiv.style.backgroundColor = "black";
                sizeDiv.style.color = "white";
            }

            sizeDiv.textContent = s;
            sizeDiv.dataset.value = s;
            sizeDiv.style.padding = "7px 11px";
            sizeDiv.style.textAlign = "center";
            sizeDiv.style.margin = "0";
            sizeDiv.style.border = "2px solid #e0e0e0";
            sizeDiv.style.borderRadius = "5px";

            sizeContainer.appendChild(sizeDiv);

            sizeDiv.addEventListener('click', () => {
                sizeContainer.querySelectorAll("div").forEach(div => {
                    div.style.backgroundColor = "white";
                    div.style.color = "black";
                });

                sizeDiv.style.backgroundColor = "black";
                sizeDiv.style.color = "white";

                selectedSize = sizeDiv.dataset.value;
            });

            if (sizeDiv.style.backgroundColor == "black") {
                selectedSize = sizeDiv.dataset.value;
            }
        }

        return {
            getColor: () => selectedColor,
            getSize: () => selectedSize
        };
    }

    let cart = [];

    function addToCart(product, selectedSize, selectedColor) {
        const existingProduct = cart.find(item =>
            item.id === product.id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
        );

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            const newProduct = {
            ...JSON.parse(JSON.stringify(product)),
            quantity: 1,
            selectedSize,
            selectedColor
        };

        cart.push(newProduct);
        }

        updateCart();
        updateCartCount();
    }


    //updates the number of items in the cart
    function updateCartCount() {
        let total = 0;
        for (let i=0; i < cart.length; i++) {
            total += cart[i].quantity;
        }

        document.querySelector("#cartCount").textContent = total;
    }

    //updates the table for cart items
    function updateCart() {
        const cartBody = document.querySelector("#cartBody");
        const cartTemplate = document.querySelector("#cartItemTemplate");

        cartBody.innerHTML = "";

        let emptyCartMessage = document.querySelector(".emptyCartMessage");

        if (cart.length === 0) {
            document.querySelector(".cartTable").classList.add("hidden");

            document.querySelector("#shippingMethod").disabled = true;
            document.querySelector("#shippingLocation").disabled = true;

            if (!emptyCartMessage) {
                emptyCartMessage = document.createElement("p");
                emptyCartMessage.textContent = "Your cart is empty";
                emptyCartMessage.classList.add("emptyCartMessage");
                document.querySelector(".cartItems").appendChild(emptyCartMessage);
            }
    
            updateCartTotal();
            return;
        } else {
            document.querySelector(".cartTable").classList.remove("hidden");

            document.querySelector("#shippingMethod").disabled = false;
            document.querySelector("#shippingLocation").disabled = false;

            if (emptyCartMessage) {
                emptyCartMessage.remove();
            }

            for (let item of cart) {
                const clone = cartTemplate.content.cloneNode(true);

                clone.querySelector(".cartItemImage").src = "https://placehold.co/150x200";
                clone.querySelector(".cartItemTitle").textContent = item.name;
                clone.querySelector(".cartItemPrice").textContent = "$" + item.price.toFixed(2);

                const colorColumn = clone.querySelector(".cartItemColor");
                colorColumn.textContent = item.selectedColor;

                const sizeColumn = clone.querySelector(".cartItemSize");
                sizeColumn.textContent = item.selectedSize;
            

                const quantityColumn = clone.querySelector(".cartItemQuantity");
                quantityColumn.textContent = item.quantity;

                const subtotal = clone.querySelector(".cartItemSubtotal");
                subtotal.textContent = "$" + (item.price*item.quantity).toFixed(2);

                const removeBtn = clone.querySelector(".removeBtn");
                removeBtn.dataset.id = item.id;
                removeBtn.dataset.size = item.selectedSize;
                removeBtn.dataset.color = item.selectedColor;

                removeBtn.addEventListener("click", (e) => {
                    removeProduct(e);
                });

                cartBody.appendChild(clone);
            }
        }


        updateCartTotal();
    }

    // removes product from cart
    function removeProduct(e) {
        const productId = e.target.dataset.id;
        const productSize = e.target.dataset.size;
        const productColor = e.target.dataset.color;

        const index = cart.findIndex(p => 
            p.id == productId &&
            p.selectedSize == productSize &&
            p.selectedColor == productColor
        );

            if (index !== -1) {
                cart.splice(index, 1);
                updateCart();
                updateCartCount();
                updateCartTotal();
            }
    }

    //calculates the cost for items in the cart
    function updateCartTotal() {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].price * cart[i].quantity;
        }

        document.querySelector("#merchTotal").textContent = "$" + total.toFixed(2);

        shippingCost(total);
    }

    function shippingCost(total) {
        const shippingMethod = document.querySelector("#shippingMethod").value;
        const shippingLocation = document.querySelector("#shippingLocation").value;
        const shippingTotal = document.querySelector("#shippingTotal");
        const taxTotal = document.querySelector("#taxTotal");
        const orderTotal = document.querySelector("#orderTotal");

        let shippingCost = 0;
        let taxCost =  0;
        let orderCost = 0;

        if (total > 500) {
            shippingCost = 0
        } else if (total > 0) {
            const rates = {
                standard:  { canada: 10, unitedStates: 15, international: 20 },
                express:   { canada: 25, unitedStates: 25, international: 30 },
                priority:  { canada: 35, unitedStates: 50, international: 50 }
            };

            shippingCost = rates[shippingMethod][shippingLocation];

        }

        if (shippingLocation === "canada") {
            taxCost = total * 0.05;
        }

        orderCost = total + shippingCost + taxCost;

        shippingTotal.textContent = "$" + shippingCost.toFixed(2);
        taxTotal.textContent = "$" + taxCost.toFixed(2);
        orderTotal.textContent = "$" + orderCost.toFixed(2);

    }

    function showToastAndClear() {
        if (cart.length != 0) {
            const container = document.querySelector(".toastContainer");
            const toast = document.createElement("div");
            toast.classList.add('toast');
            toast.textContent = "Your order has been submitted!";

            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.remove("hidden");
            }, 10);

            setTimeout(() => {
                toast.classList.add("hidden");
                setTimeout(() => {
                    container.removeChild(toast);
                }, 500);
            }, 3000);

            cart.length = 0;
            updateCart();
            updateCartCount();
        }
        
    }

    function main(data) {
        //sort data alphabetically initially
        data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

        aboutPageHandler();
        document.querySelector("#filter").addEventListener('click', (e) => { populateFilter(e, data); });
        document.querySelector("nav").addEventListener('click', (e) => {navigationHandler(e)});
        populateBrowsePage(data);
        document.querySelector("#filter").addEventListener('change', () => {applyFiltersAndSort(data);});
        document.querySelector("#sort").addEventListener('change', () => {applyFiltersAndSort(data);});
        document.querySelector("#clear").addEventListener('click', () => {clearFilter(data);});

        document.querySelector("#shippingMethod").addEventListener('change', () => {updateCartTotal();});
        document.querySelector("#shippingLocation").addEventListener('change', () => {updateCartTotal();});
        document.querySelector("#checkoutButton").addEventListener('click', () => {showToastAndClear()});
    }   


});