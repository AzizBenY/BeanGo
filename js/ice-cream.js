import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from "../js/firebase-config.js"; // Adjust the path if needed

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const iceCreamProductWrapper = document.getElementById('ice-cream-product-wrapper');
    const template = document.getElementById('product-card-template');

    let currentStart = 0;
    const cardsToShow = 4;
    function updateVisibleCards() {
        const cards = iceCreamProductWrapper.querySelectorAll('.product-card');
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
            const cards = iceCreamProductWrapper.querySelectorAll('.product-card');
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

    function createProductCard(product) {
        const card = template.content.cloneNode(true);
    
        // Set product details
        card.querySelector('.product-image').src = product.image;
        card.querySelector('.product-image').alt = product.name;
        card.querySelector('.product-name').textContent = product.name;
        card.querySelector('.product-description').textContent = product.description;
        const priceElement = card.querySelector('.price');
        priceElement.textContent = `${product.prix} dt`; // Ensure price is displayed
    
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
    
        // Mouse leave to reset the card
        productCard.addEventListener('mouseleave', () => {
            if (productName) productName.style.display = '';
            if (productDescription) productDescription.style.display = '';
            composeButton.style.display = 'block';
    
            // Hide supplements and add to cart button
            supplementsSection.style.display = 'none';
            addToCartButton.style.display = 'none';
    
            // Remove the cloned price if exists
            const clonedPrice = supplementsSection.querySelector('.cloned-price');
            if (clonedPrice) clonedPrice.remove();
    
            // Ensure the original price is visible and normal
            priceElement.style.display = 'block';
            priceElement.style.marginRight = '0';
            priceElement.style.fontSize = ''; // Reset font size
            priceElement.style.color = ''; // Reset color
        });
    
        // Click event for "Add to Cart"
        addToCartButton.addEventListener('click', () => {
            console.log("Add to Cart clicked");
        });
    
        return card;
    }   

    async function fetchProducts() {
        try {
            const iceCreamsCollection = collection(db, 'ice-creams');
            const snapshot = await getDocs(iceCreamsCollection);
            iceCreamProductWrapper.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                iceCreamProductWrapper.appendChild(card);
            });
            afterCardsLoaded();
        } catch (error) {
            console.error("Error fetching ice cream products:", error);
        }
    }

    async function fetchIcecream() {
        try {
            console.log("Fetching iceCream products...");
            const iceCreamCollection = collection(db, "iceCream");
            const snapshot = await getDocs(iceCreamCollection);

            iceCreamProductWrapper.innerHTML = '';

            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                console.log("IceCream product:", product);
                const card = createProductCard(product);
                iceCreamProductWrapper.appendChild(card);
            });
            afterCardsLoaded();
        } catch (error) {
            console.error("Error fetching iceCream products:", error);
        }
    }

    // Call one of the fetch functions initially
    fetchIcecream(); // or fetchProducts();
});
