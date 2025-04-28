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
        card.querySelector('.product-image').src = product.image || 'default.jpg';
        card.querySelector('.product-image').alt = product.name;
        card.querySelector('.product-name').textContent = product.name;
        card.querySelector('.product-description').textContent = product.description;
    
        // Display single price (since there's no size-based pricing)
        card.querySelector('.price').textContent = `${product.prix}dt`;
    
        // Hide size selector if not needed
        const sizeSelector = card.querySelector('.size-selector');
        sizeSelector.style.display = 'none';
    
        // Optional: card click event
        const productCard = card.querySelector('.product-card');
        productCard.addEventListener('click', () => {
            document.querySelectorAll('.product-card').forEach(card => card.classList.remove('active'));
            productCard.classList.add('active');
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
