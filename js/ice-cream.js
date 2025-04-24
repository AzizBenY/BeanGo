import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from "../js/firebase-config.js"; // Adjust the path if needed

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const template = document.getElementById('product-card-template');

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
            productContainer.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                productContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching ice cream products:", error);
        }
    }

    async function fetchIcecream() {
        try {
            console.log("Fetching iceCream products...");
            const iceCreamCollection = collection(db, "iceCream");
            const snapshot = await getDocs(iceCreamCollection);

            productContainer.innerHTML = '';

            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                console.log("IceCream product:", product);
                const card = createProductCard(product);
                productContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching iceCream products:", error);
        }
    }

    // Call one of the fetch functions initially
    fetchIcecream(); // or fetchProducts();
});
