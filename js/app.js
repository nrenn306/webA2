document.addEventListener('DOMContentLoaded', () => {
    const url = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    /* ---------------- utility functions ---------------- */
    /**
     * Retrieves the product data stored in localStorage
     * 
     * @returns {Array} An array of product objects, or an empty array if no data is stored. 
     */
    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    /**
     * Saves the provided product data into localStorage
     * 
     * @param {Array|Object} data - The product data to store. This will be converted to a JSON string before saving.
     */
    function updateStorage(data) {
        localStorage.setItem('products', JSON.stringify(data));
    }

    /**
     * Fetches product data from the server, saves it to localStorage, 
     * and then initializes the application with the retrieved data.
     */
    function fetchAndStore() {
        fetch(url)
        .then(response => {
            // check if the fetch request was successful
            if (response.ok) {
                return response.json(); // convert the response to JSON
            } else {
                // if response is not ok, throw an error so it jumps to .catch()
                throw new error("fetch failed");
            }
        })
        .then(data => {
            updateStorage(data); // save the data into localStorage
            main(data); // start the main logic of the app using the fresh data
        })
        .catch(error => console.error(error)); // log errors that occur during fetch 
    }


    // initializes the application by checking whether product data already exists in localStorage
    const products = retrieveStorage();
    if (products && products.length > 0) {
        // if data exists, load the app using stored products
        main(products);
    } else {
        // if no data found, fetch from server and store it 
        fetchAndStore();
    }
    
    /**
     * Toggles the direction of the triangle icon (▲/▼) inside the browse filter handling.
     * 
     * @param {string} name - The ID of the filter section whose triangle should toggle.
     */
    function toggleTriagngle(name) {
        const p = document.querySelector("#" + name + " p");
        p.textContent = p.textContent.endsWith('▲')
            ? p.textContent.replace('▲', '▼')
            : p.textContent.replace('▼', '▲');
    }

    /**
     * Populates and displays the category filter list
     * 
     * @param {Array<Object>} data - The full list of product objects. Each object should contain a 'category' property.
     */
    function populateCategoryFilter(data) {
        // get the category filter container and toggle visibility
        const categoryCheckBox = document.querySelector("#categoryCheckBox");
        categoryCheckBox.classList.toggle("hidden");

        categoryCheckBox.innerHTML = ""; // clear previous options
        toggleTriagngle("category"); // toggle arrow next to filter header 

        // collect all unique product categories 
        const categories = [];
        for (let product of data) {
            if (!categories.includes(product.category)) {
                categories.push(product.category);
            }
        }
    
        categories.sort(); // sort categories alphabetically 
        
        // build the checkbox elements for each category
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

    /**
     * Populates and displays the size filter options 
     * 
     * @param {Array<Object>} data - The product list, where each product contains a 'sizes' array of available size options.
     */
    function populateSizeFilter(data) {
        // get the size filter container and toggle visibility
        const sizeCheckBox = document.querySelector("#sizeCheckBox");
        sizeCheckBox.classList.toggle("hidden");

        sizeCheckBox.innerHTML = ""; // clear any previous size options 
        toggleTriagngle("size"); // toggle the arrow icon in the filter header

        // collect all unique sizes from the product list
        const sizes = [];
        for (let product of data) {
            for (let s of product.sizes) {
                if (!sizes.includes(s)) {
                    sizes.push(s)
                }
            }
        }

        // build the checkbox elements for each size
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

    /**
     * Populates and displays the color filter options.
     * 
     * @param {Array<Object>} data - The list of products, each containing a 'color' array where each color has a 'name' and 'hex' value. 
     */
    function populateColorsFilter(data) {
        // get the color filter container and toggle visibility
        const colorsCheckBox = document.querySelector("#colorsCheckBox");
        colorsCheckBox.classList.toggle("hidden");

        colorsCheckBox.innerHTML = ""; // clear any previous color options 
        toggleTriagngle("colors"); // toggle the arrow icon in the filter header

        // collect all unique color obj4ects from the dataset 
        const colors = [];
        for (let product of data) {
            for (let c of product.color) {
                if (colors.findIndex(col => col.name === c.name) === -1) {
                    colors.push(c);
                }
            }

        }

        // sort colors alphabetically by name 
        colors.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        // build the checkbox elements for each color 
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

            // visual color swatch 
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

    /**
     * Determine which filter section to populate or toggle based on
     * the text content of the clicked <p> element. 
     * 
     * @param {Event} e - The click event triggered on the filter container. 
     * @param {Array<Object>} data -The full product dataset used to generate filter options such as categories, sizes, and colors.
     */
    function populateFilter(e, data) {
        // make sure only clicks on <p> elements (filter headersa) are processed
        if (e.target.nodeName == "P") {
            // check which filter header was clicked based on its text 
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

    /**
     * Handles all site-wide navigation interactions based on the user's click.
     * 
     * @param {Event} e - The click event triggered anywhere within the navigation component. 
     * @returns After click has been handled. 
     */
    function navigationHandler(e) {
        const home = document.querySelector("#home");
        const browse = document.querySelector("#browse");
        const about = document.querySelector("#about");
        const shoppingCart = document.querySelector("#shoppingCart");
        
        // always hide thr single product page when navigating 
        document.querySelector("#singleProduct").classList.add("hidden");

        if(e.target.nodeName == "IMG") { // when clicking the site logo, go to home
            showView("home")
            return;
        } else if (e.target.nodeName == "LI") { // when clicking a navigation list item (<li>)
            const navList = document.querySelectorAll("#navigation li");
            const clickedNav = e.target.textContent.trim(); // get the text of the clicked nav item (cleaned)

            if (clickedNav === "Home") {showView("home"); return;}
            if (clickedNav === "Browse") {showView("browse"); return;}
            if (clickedNav === "About") {document.querySelector("#about").showModal(); return;}
        } else if (e.target.nodeName == "H3" || e.target.nodeName == "DIV") { // clicking cart header opens the cart
            showView("shoppingCart");
            updateCart();
        }
    }

    /**
     * Shows the specified main view of the website and hides the others. 
     * 
     * @param {String} viewName - The name of the view to show. "home", "browse",  or "shoppingCart".
     */
    function showView(viewName) {
        // hide all main sections
        home.classList.add("hidden");
        browse.classList.add("hidden");
        shoppingCart.classList.add("hidden");

        // show the requested view based on viewName
        if (viewName === "home") home.classList.remove("hidden");
        if (viewName === "browse") browse.classList.remove("hidden");
        if (viewName === "shoppingCart") shoppingCart.classList.remove("hidden");
    }

    /**
     * Sets up event listeners to handle closing the "about" pop up modal.
     */
    function aboutPageHandler() {
        // close the "about" modal when the "close" button is clicked
        document.querySelector("#close").addEventListener('click', () => {
            document.querySelector("#about").close();
        });
        // close the "about" modal when the "x" button is clicked
        document.querySelector("#x").addEventListener('click', () => {
            document.querySelector("#about").close();
        });
    }

    /**
     * Filters the product data based on which filter checkboxes are checked. 
     * 
     * @param {Array} data - The array of product objects to filter
     * @returns {Array} The filtered array of products based on active filters. 
     */
    function filterHandler(data) {
        // get all checked inputs inside the #filter container 
        const checked = [...document.querySelectorAll('#filter input:checked')];

        // organize the checke filters into categories 
        const filters = {
            gender: checked.filter(p => p.classList.contains("gender")).map(p => p.id),
            category: checked.filter(p => p.classList.contains("category")).map(p => p.id),
            size: checked.filter(p => p.classList.contains("size")).map(p => p.id),
            color: checked.filter(p => p.classList.contains("color")).map(p => p.id)
        };

        // start with the full product list
        let results = data;

        // apply filter based on checkboxes
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

        showSelectedFilters(checked, data); // updxate UI

        return results; // return filtered product list
    
    }

    /**
     * Applies active filters and sorts the product data before displaying it. 
     * 
     * @param {Array} data - Array of all product objects. 
     */
    function applyFiltersAndSort(data) {
        const results = filterHandler(data); // apply filters and get the filtered results 
        const sortType = document.querySelector("#sort").value; // get the selected sorting option from the dropdown

        // perform sort based on selected option 
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

        // update browse page 
        populateBrowsePage(results);
        
    }

    /**
     * Displays the currently selected filters as buttons and allows removing them. 
     * 
     * @param {Array} checked - Array of all currently checked input elements (filters).
     * @param {Array} data - Array of all product objects to reapply filtering. 
     */
    function showSelectedFilters(checked, data) {
        // get the container for displaying selected filters and clear it 
        const div = document.querySelector("#selectedFilters");
        div.innerHTML = "";

        // loop through each checked filter input
        for(let c of checked) {
            const button = document.createElement("button"); // create a button to represent the selected filter 

            // for gender filters, display the label text instead of the id
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

    /**
     * This function populates the browse page with product data
     * @param data The product data
     */
    function populateBrowsePage(data) {
        const template = document.querySelector("#results template");
        const parent = document.querySelector("#browseResults");

        //clear existing products
        parent.innerHTML = "";

        //populate products using template and data
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

            //what to do when add to cart button is clicked
            button.onclick = () => {
                const selectedColor = selected.getColor();
                const selectedSize = selected.getSize();
                addToCart(d, selectedSize, selectedColor);
            };
        }

        parent.addEventListener('click', (e) => showSingleProduct(e, data));
    }

    /**
     * This function clears all selected filters and updates the browse page accordingly
     * @param data The product data
     */
    function clearFilter(data) {
        const checked = [...document.querySelectorAll('#filter input:checked')];

        //uncheck all checked filters and clear the checked array
        for (let c of checked) {
            c.checked = false;
        }
        checked.length = 0;

        showSelectedFilters(checked, data);
        applyFiltersAndSort(data);

    }

    /**
     * This function shows the single product view for a clicked product
     * @param e The event object from clicking on a product
     * @param data The product data
     */
    function showSingleProduct(e, data) {
        //check if clicked element is an image or title
        if (e.target.nodeName == "IMG" || e.target.classList.contains("browseResultProductTitle")) {
            //if so show single product view and hide browse view
            document.querySelector("#browse").classList.add("hidden");
            document.querySelector("#singleProduct").classList.remove("hidden");

            const id = e.target.id;
            
            //find product based on clicked ID
            const found = data.find(p => p.id == id);

            //create breadcrumb navigation
            document.querySelector("#genderBC").textContent = found.gender;
            document.querySelector("#categoryBC").textContent = " > " + found.category;
            document.querySelector("#productName").textContent = " > " + found.name;

            //create single product display
            document.querySelector("#productImage").alt = found.name;
            document.querySelector("#productTitle").textContent = found.name;
            document.querySelector("#productPrice").textContent = "$" + found.price;
            document.querySelector("#productDescriptionText").textContent = found.description;
            document.querySelector("#productMaterial").textContent = found.material;

            //based on found product, display colour and size options
            const selected = displayColorAndSizeSelection(found, document.querySelector("#colorOptions"), document.querySelector("#sizeOptions"));

            //add to cart button functionality for single product
            document.querySelector("#singleAddBtn").onclick = () => {
                const selectedColor = selected.getColor();
                const selectedSize = selected.getSize();
                const selectedQuantity = parseInt(document.querySelector("#qtyInput").value);

                //validate quantity input
                if (selectedQuantity <= 0) {
                    alert("Please enter a valid quantity.");
                    return;
                }

                //add selected quantity of product to cart
                for (let i = 0; i < selectedQuantity; i++) {
                    addToCart(found, selectedSize, selectedColor);
                }
                document.querySelector("#qtyInput").value = "1";
            };

            loadRelatedProducts(found, data);
        }
    }

    /**
     * This function loads related products based on category and gender
     * @param productData The product object for which related products are to be found
     * @param data The product data
     */
    function loadRelatedProducts(productData, data) {
        //show related products based on category
        let related = data.filter(p => p.category === productData.category && p.id !== productData.id);

        //if there are less than 4 related options, show options based on gender
        if (related.length < 4) {
            const sameGender = data.filter(p => p.gender === productData.gender && p.id !== productData.id);
            related.push(...sameGender);
        }

        //limit related products to 4
        related = related.slice(0,4);

        const relatedList = document.querySelector("#relatedList");
        relatedList.innerHTML = "";

        const template = document.querySelector("#relatedProductTemplate");

        //populate related products using template and related array
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
            
            //add button functionality
            button.onclick = () => {
                const selectedColor = selected.getColor();
                const selectedSize = selected.getSize();
                addToCart(product, selectedSize, selectedColor);
            }

            //allows clicking on image, title, or price to show single product
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

  
    /**
     * This functions shows a single product based on its ID
     * @param id The ID of the product to be displayed
     * @param data The product data 
     */
    function showSingleProductById(id, data) {
        // had to look this up on google (it was in the AI overview section so no particular website)
        const fakeEvent = { target: { id: id, nodeName: "IMG" } };
        showSingleProduct(fakeEvent, data);
    }

    /**
     * This function displays colour and size selection options for a given product
     * @param found The product object for which to display colour and size options
     * @param colorContainer The HTML container element for colour options
     * @param sizeContainer The HTML container element for size options
     * @returns The selected colour and size through getter functions
     */
    function displayColorAndSizeSelection(found, colorContainer, sizeContainer) {
        colorContainer.innerHTML = "";
        sizeContainer.innerHTML = "";

        //set default to first colour/size 
        let selectedColor = found.color[0].name;
        let selectedSize = found.sizes[0];

        //populate colour options
        for (let c of found.color) {
            const colorDiv = document.createElement("div"); 

            //outline selected colour
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
                //remove border from all other colours
                colorContainer.querySelectorAll("div").forEach(div => {
                    colorDiv.style.border = "1px solid black";
                });

                colorDiv.style.border = "4px solid black";

                selectedColor = colorDiv.dataset.value;

            });
        }

        //populate size options
        for (let s of found.sizes) {
            const sizeDiv = document.createElement("div");

            //highlight selected size
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

            //add click event to select size
            sizeDiv.addEventListener('click', () => {
                sizeContainer.querySelectorAll("div").forEach(div => {
                    div.style.backgroundColor = "white";
                    div.style.color = "black";
                });

                sizeDiv.style.backgroundColor = "black";
                sizeDiv.style.color = "white";

                selectedSize = sizeDiv.dataset.value;
            });

            //default selected size
            if (sizeDiv.style.backgroundColor == "black") {
                selectedSize = sizeDiv.dataset.value;
            }
        }

        // return selected colour and size
        return {
            getColor: () => selectedColor,
            getSize: () => selectedSize
        };
    }

    // shopping cart array that holds products added to cart
    let cart = [];

    /**
     * This function adds a product to the cart and calls functions to update the cart display and cart count
     * @param product The product object to be added to the cart
     * @param selectedSize The selected size of the product
     * @param selectedColor The selected color of the product
     */
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
        showToast("Item added to cart!");
        
    }

    /**
     * This function updates the cart count displayed in the navigation bar
     * @returns Updated cart count
     */
    function updateCartCount() {
        let total = 0;
        for (let i=0; i < cart.length; i++) {
            total += cart[i].quantity;
        }

        document.querySelector("#cartCount").textContent = total;
    }

    /**
     * This function updates the cart display based on the current contents of the cart
     * @returns Updated cart display
     */
    function updateCart() {
        const cartBody = document.querySelector("#cartBody");
        const cartTemplate = document.querySelector("#cartItemTemplate");

        //Clear existing cart display
        cartBody.innerHTML = "";

        let emptyCartMessage = document.querySelector(".emptyCartMessage");

        //If cart is empty, show empty cart message and hide cart table
        if (cart.length === 0) {
            document.querySelector(".cartTable").classList.add("hidden");

            //Disable shipping options if cart is empty
            document.querySelector("#shippingMethod").disabled = true;
            document.querySelector("#shippingLocation").disabled = true;

            //Show empty cart message if not already present
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

            //Enable shipping options when cart has items
            document.querySelector("#shippingMethod").disabled = false;
            document.querySelector("#shippingLocation").disabled = false;

            //Remove empty cart message if present
            if (emptyCartMessage) {
                emptyCartMessage.remove();
            }

            //Populate cart with current items based on cart array and template
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

    /**
     * This function removes a product from the cart 
     * It ensures that the correct product is removed by matching the product ID, selected size, and selected color
     * @param e Event object from clicking the remove button
     */
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

    /**
     * This function updates the merchandise total in the cart and calls shippingCost to update shipping, tax, and order total
     */
    function updateCartTotal() {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].price * cart[i].quantity;
        }

        document.querySelector("#merchTotal").textContent = "$" + total.toFixed(2);

        shippingCost(total);
    }

    /**
     * This function calculates shipping cost, tax, and order total based on the merchandise total
     * @param total This is the merchandise total before shipping and taxes
     */
    function shippingCost(total) {
        const shippingMethod = document.querySelector("#shippingMethod").value;
        const shippingLocation = document.querySelector("#shippingLocation").value;
        const shippingTotal = document.querySelector("#shippingTotal");
        const taxTotal = document.querySelector("#taxTotal");
        const orderTotal = document.querySelector("#orderTotal");

        let shippingCost = 0;
        let taxCost =  0;
        let orderCost = 0;

        //if order is over $500, free shipping
        if (total > 500) {
            shippingCost = 0
        } else if (total > 0) {
            //determine shipping cost based on method and location
            const rates = {
                standard:  { canada: 10, unitedStates: 15, international: 20 },
                express:   { canada: 25, unitedStates: 25, international: 30 },
                priority:  { canada: 35, unitedStates: 50, international: 50 }
            };

            shippingCost = rates[shippingMethod][shippingLocation];

        }

        //tax for canada only
        if (shippingLocation === "canada") {
            taxCost = total * 0.05;
        }

        orderCost = total + shippingCost + taxCost;

        shippingTotal.textContent = "$" + shippingCost.toFixed(2);
        taxTotal.textContent = "$" + taxCost.toFixed(2);
        orderTotal.textContent = "$" + orderCost.toFixed(2);

    }

    /**
     * This function shows a toast notification based on the passed text
     * @param text Message to be shown in the toast.
     */
    function showToast(text) {
        if (cart.length != 0) {
            const container = document.querySelector(".toastContainer");
            const toast = document.createElement("div");
            toast.classList.add('toast');
            toast.textContent = text;

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
        }
        
    }

    /**
     * This function clears all items from the shopping cart
    */
    function clearCart() {
        cart.length = 0;
        updateCart();
        updateCartCount();
    }

    /**
     * This function initializes the entire website once product data has been loaded
     * It sorts products, sets up event listeners, and prepares the page for iteractions.
     * @param data The product data loaded.
     */
    function main(data) {

        //Sort the product data alphabetically by name when when the page loads
        data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

        //About page popup
        aboutPageHandler();

        //Handle clicking on a filter 
        document.querySelector("#filter").addEventListener('click', (e) => { populateFilter(e, data); });

        //Handle navigation clicks
        document.querySelector("nav").addEventListener('click', (e) => {navigationHandler(e)});

        //Load browse page with products
        populateBrowsePage(data);

        //Handle filtering based on checked filters
        document.querySelector("#filter").addEventListener('change', () => {applyFiltersAndSort(data);});

        //Handle sorting when sort option is changed
        document.querySelector("#sort").addEventListener('change', () => {applyFiltersAndSort(data);});

        //Handle clearing filters when clear button is clicked
        document.querySelector("#clear").addEventListener('click', () => {clearFilter(data);});

        //Handle changes made to shipping method
        document.querySelector("#shippingMethod").addEventListener('change', () => {updateCartTotal();});

        //Handle changes made to shipping location
        document.querySelector("#shippingLocation").addEventListener('change', () => {updateCartTotal();});

        //Handle checkout button click
        document.querySelector("#checkoutButton").addEventListener('click', () => {showToast("Your order has been submitted!");
            clearCart();
        });
    }   


});