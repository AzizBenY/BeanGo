import { db } from './firebase-config.js'; // Import Firestore instance
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const bakeryProductWrapper = document.getElementById('bakery-product-wrapper');
    const categoryButtons = document.querySelectorAll('.category-button');
    const template = document.getElementById('product-card-template');
    const muffinsButton = document.querySelector('.category-button[data-category="muffins"]');

    // Set the Muffins button as active on initial load
    muffinsButton.classList.add('active');

    // Add click event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            // Update active state of buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Fetch and display products for the selected category
            if (category === 'muffins') {
                fetchMuffins();
            } else if (category === 'sheesecake') {
                fetchCheesecake();
            } else if (category === 'donuts') {
                fetchDonuts();
            }
        });
    });

    // Function to create a product card
    function createProductCard(product) {
        const card = template.content.cloneNode(true);
    
        // Set product details
        card.querySelector('.product-image').src = product.image;
        card.querySelector('.product-image').alt = product.name;
        card.querySelector('.product-name').textContent = product.name;
        card.querySelector('.product-description').textContent = product.description;
        const priceElement = card.querySelector('.price');
        let originalPrice = parseFloat(product.prix); // Get the original price
        priceElement.textContent = `${originalPrice} dt`; // Set the original price
    
        const sizeSelector = card.querySelector('.size-selector');
        if (sizeSelector) {
            sizeSelector.style.display = 'none';
        }
    
        const productCard = card.querySelector('.product-card');
        const composeButton = card.querySelector('.compose-now');
        const supplementsSection = card.querySelector('.supplements');
        const addToCartButton = supplementsSection.querySelector('.add-to-cart');
        const productName = card.querySelector('.product-name');
        const productDescription = card.querySelector('.product-description');
    
        // Set default state
        supplementsSection.style.display = 'none';
        addToCartButton.style.display = 'none';
    
        // Click event for selecting card
        productCard.addEventListener('click', () => {
            document.querySelectorAll('.product-card').forEach(card =>
                card.classList.remove('active'));
            productCard.classList.add('active');
        });
    
        // Click event for "Compose Now"
        composeButton.addEventListener('click', (event) => {
            event.preventDefault();
    
            if (productName) productName.style.display = 'none';
            if (productDescription) productDescription.style.display = 'none';
            composeButton.style.display = 'none';
    
            supplementsSection.style.display = 'block';
            addToCartButton.style.display = 'inline-block';
    
            // Clone the price and insert into supplements
            if (priceElement && !supplementsSection.querySelector('.cloned-price')) {
                const clonedPrice = priceElement.cloneNode(true); 
                clonedPrice.classList.add('cloned-price'); 
                clonedPrice.style.display = 'inline-block';
                clonedPrice.style.marginRight = '-15px';
                clonedPrice.style.marginTop = '30px';
                clonedPrice.style.fontSize = '1.5rem';
                clonedPrice.style.color = '#B83556';
                supplementsSection.insertBefore(clonedPrice, addToCartButton);
            }
    
            // Hide the original price so it doesn't appear twice
            priceElement.style.display = 'none';
        });
    
        let totalPrice = originalPrice; // Initialize a separate variable for the total price
    
        // Function to update total price
        const updateTotalPrice = () => {
            const checkboxes = supplementsSection.querySelectorAll('.checkbox-position');
            let totalSupplementPrice = 0;
    
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const supplementPrice = parseFloat(checkbox.dataset.price);
                    if (!isNaN(supplementPrice)) {
                        totalSupplementPrice += supplementPrice;
                    }
                }
            });
    
            totalPrice = originalPrice + totalSupplementPrice; // Calculate new total price
            priceElement.textContent = `${totalPrice} dt`; // Update main product price
    
            // Update cloned price if it exists
            const clonedPrice = supplementsSection.querySelector('.cloned-price');
            if (clonedPrice) {
                clonedPrice.textContent = `${totalPrice} dt`; // Update cloned price
            }
        };
    
        // Mouse leave to reset the card
        productCard.addEventListener('mouseleave', () => {
            console.log("Mouse left the product card."); // Debug log
            console.log("Original Price:", originalPrice); // Debug log
            console.log("Total Price before reset:", totalPrice); // Debug log
    
            if (productName) productName.style.display = '';
            if (productDescription) productDescription.style.display = '';
            composeButton.style.display = 'block';
    
            // Hide supplements and add to cart button
            supplementsSection.style.display = 'none';
            addToCartButton.style.display = 'none';
    
            // Remove the cloned price if exists
            const clonedPrice = supplementsSection.querySelector('.cloned-price');
            if (clonedPrice) clonedPrice.remove();
    
            // Reset the original price
            priceElement.style.display = 'block';
            totalPrice = originalPrice; // Reset total price to original
            priceElement.textContent = `${totalPrice} dt`; // Reset to original price
            priceElement.style.marginRight = '0';
            priceElement.style.fontSize = ''; // Reset font size
            priceElement.style.color = ''; // Reset color
    
            // Uncheck all checkboxes
            const checkboxes = supplementsSection.querySelectorAll('.checkbox-position');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false; // Uncheck the checkbox
            });
    
            // Update total price to reflect unchecked boxes
            updateTotalPrice(); // Call the function to update the price
    
            console.log("Total Price after reset:", totalPrice); // Debug log
        });
    
        // Click event for "Add to Cart"
        addToCartButton.addEventListener('click', () => {
            console.log("Add to Cart clicked");
        });
    
        // Add event listeners to checkboxes
        const checkboxes = supplementsSection.querySelectorAll('.checkbox-position');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateTotalPrice);
        });
    
        // Add click event listeners to whipped cream items
        const whippedCreamItems = supplementsSection.querySelectorAll('.whipped-cream-item');
        whippedCreamItems.forEach(item => {
            item.addEventListener('click', () => {
                const price = parseFloat(item.dataset.price);
                const isSelected = item.classList.toggle('selected'); // Toggle selected class
    
                // Update total price based on selection
                if (isSelected) {
                    originalPrice += price; // Add price
                } else {
                    originalPrice -= price; // Subtract price
                }
                priceElement.textContent = `${originalPrice} dt`; // Update main product price
                updateTotalPrice(); // Call to update total price
            });
        });
    
        // Add click event listeners to syrup items
        const syrupItems = supplementsSection.querySelectorAll('.syrup-item');
        syrupItems.forEach(item => {
            item.addEventListener('click', () => {
                const price = parseFloat(item.dataset.price);
                const isSelected = item.classList.toggle('selected'); // Toggle selected class
    
                // Update total price based on selection
                if (isSelected) {
                    originalPrice += price; // Add price
                } else {
                    originalPrice -= price; // Subtract price
                }
                priceElement.textContent = `${originalPrice} dt`; // Update main product price
                updateTotalPrice(); // Call to update total price
            });
        });
    
        return card;
    }   

    // Function to fetch muffins data from Firestore
    async function fetchMuffins() {
        try {
            console.log("Fetching muffin products..."); // Debug log
            
            const muffinsCollection = collection(db, "muffins");
            const snapshot = await getDocs(muffinsCollection);
            console.log(`Documents found: ${snapshot.size}`);

            bakeryProductWrapper.innerHTML = ''; // Clear existing products

            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                bakeryProductWrapper.appendChild(card);
            });

            // Update productCards after new cards are added
            productCards = bakeryProductWrapper.querySelectorAll('.product-card'); // Update the product cards
            console.log(`Total product cards: ${productCards.length}`); // Debug log

            afterCardsLoaded();
        } catch (error) {
            console.error("Error fetching muffin products:", error);
        }
    }

    // Add click event listeners for navigation arrows
    // const leftArrow = document.querySelector('.nav-arrow.left');
    // const rightArrow = document.querySelector('.nav-arrow.right');
    const cardsWrapper = document.querySelector('.cards-wrapper');
    let productCards = document.querySelectorAll('.product-card'); // Get product cards
    let currentStart = 0;
    const cardsToShow = 4;
    function updateVisibleCards() {
        const cards = bakeryProductWrapper.querySelectorAll('.product-card');
        cards.forEach((card, idx) => {
            if (idx >= currentStart && idx < currentStart + cardsToShow) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        const leftArrow = document.querySelector('.nav-arrow.left');
        const rightArrow = document.querySelector('.nav-arrow.right');
        leftArrow.style.opacity = currentStart === 0 ? '0.5' : '1';
        leftArrow.style.pointerEvents = currentStart === 0 ? 'none' : 'auto';
        rightArrow.style.opacity = (currentStart + cardsToShow >= cards.length) ? '0.5' : '1';
        rightArrow.style.pointerEvents = (currentStart + cardsToShow >= cards.length) ? 'none' : 'auto';
    }
    function attachScrollEvents() {
        const leftArrow = document.querySelector('.nav-arrow.left');
        const rightArrow = document.querySelector('.nav-arrow.right');
        if (leftArrow) leftArrow.addEventListener('click', () => {
            if (currentStart > 0) {
                currentStart--;
                updateVisibleCards();
            }
        });
        if (rightArrow) rightArrow.addEventListener('click', () => {
            const cards = bakeryProductWrapper.querySelectorAll('.product-card');
            if (currentStart + cardsToShow < cards.length) {
                currentStart++;
                updateVisibleCards();
            }
        });
    }
    function afterCardsLoaded() {
        currentStart = 0;
        updateVisibleCards();
        attachScrollEvents();
    }

    async function fetchCheesecake() {
        try {
            console.log("Fetching cheesecake products..."); // Debug log

            // Access the 'cheesecake' collection
            const cheesecakeCollection = collection(db, "sheesecake");
            const snapshot = await getDocs(cheesecakeCollection); // Fetch all documents
            console.log(`Documents found: ${snapshot.size}`); // Log number of documents found

            // Clear existing products
            bakeryProductWrapper.innerHTML = '';

            // Add new products
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() }; // Get product data
                console.log("Product data:", product); // Log each product
                const card = createProductCard(product); // Create a card
                bakeryProductWrapper.appendChild(card); // Add it to the container
            });

            afterCardsLoaded();
        } catch (error) {
            console.error("Error fetching cheesecake products:", error);
        }
    }

    async function fetchDonuts() {
        try {
            console.log("Fetching donuts products..."); // Debug log

            // Access the 'donuts' collection
            const donutsCollection = collection(db, "donuts");
            const snapshot = await getDocs(donutsCollection); // Fetch all documents
            console.log(`Documents found: ${snapshot.size}`); // Log number of documents

            // Clear existing products
            bakeryProductWrapper.innerHTML = '';

            // Add new products
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() }; // Get product data
                console.log("Product data:", product); // Log each product
                const card = createProductCard(product); // Create a card
                bakeryProductWrapper.appendChild(card); // Add to container
            });

            afterCardsLoaded();
        } catch (error) {
            console.error("Error fetching donuts products:", error);
        }
    }

    // Initial load for muffins
    fetchMuffins();

    // Add click event listener to the Bakeries link
    const bakeriesLink = document.querySelector('.nav-links a[href="bakeries.html"]');
    bakeriesLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior if needed
        console.log("Bakeries link clicked"); // Debug log

        // Remove active class from all category buttons
        categoryButtons.forEach(button => button.classList.remove('active'));
        
        // Add active class to the Muffins button
        muffinsButton.classList.add('active');

        // Fetch muffins
        fetchMuffins(); // Call the function to fetch data for Muffins
    });

    // Add click event listener to the Box link
    const boxLink = document.querySelector('.nav-links a[href="box.html"]');
    boxLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior if needed
        console.log("Box link clicked"); // Debug log

        // Remove active class from all category buttons
        categoryButtons.forEach(button => button.classList.remove('active'));

        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to the Box link
        boxLink.classList.add('active');

        // Navigate to box.html
        window.location.href = 'pages/box.html'; // Use relative path to navigate to box.html
    });

    // Open the cart popup when cart icon is clicked
    document.getElementById('openCart').addEventListener('click', () => {
        document.getElementById('cartPopup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    });

    // Close the cart popup when the close button is clicked
    document.getElementById('closeCart').addEventListener('click', () => {
        document.getElementById('cartPopup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    });

    // Close the cart popup if the overlay is clicked
    document.getElementById('overlay').addEventListener('click', () => {
        document.getElementById('cartPopup').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    });
});
