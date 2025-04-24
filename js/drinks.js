import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from '../js/firebase-config.js'; // Adjust the path if necessary

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const categoryButtons = document.querySelectorAll('.category-button');
    const template = document.getElementById('product-card-template');
    let currentCategory = 'freshy';

    const freshyButton = document.querySelector('.category-button[data-category="freshy"]');
    freshyButton.classList.add('active');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            currentCategory = category;

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (category === 'coffee') {
                fetchCoffee();
            } else if (category === 'freshy') {
                fetchFreshy();
            } else if (category === 'smoothie') {
                fetchSmoothie();
            } else {
                fetchProducts(category);
            }
        });
    });

    function createProductCard(product) {
        const card = template.content.cloneNode(true);
        const image = card.querySelector('.product-image');
        const name = card.querySelector('.drinks-product-name');
        const description = card.querySelector('.drinks-product-description');
        const priceElement = card.querySelector('.price');
        const sizeCircles = card.querySelectorAll('.size-circle');
    
        image.src = product.image;
        name.textContent = product.name;
        description.textContent = product.description;
    
        const basePrice = parseFloat(product.prix);
        priceElement.textContent = formatPrice(basePrice);
 // Start with base price
    
        sizeCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                // If already selected, deselect it and reset price
                if (circle.classList.contains('selected')) {
                    circle.classList.remove('selected');
                    priceElement.textContent = formatPrice(basePrice); // Reset to base price
                    return;
                }
    
                // Remove selected from all circles
                sizeCircles.forEach(c => c.classList.remove('selected'));
    
                // Add selected to clicked one
                circle.classList.add('selected');
    
                // Determine price adjustment
                let updatedPrice = parseFloat(basePrice); // ensure basePrice is a float

                const size = circle.dataset.size;
                if (size === 'medium') {
                    updatedPrice += 1;
                } else if (size === 'large') {
                    updatedPrice += 2;
                }
    
                priceElement.textContent = formatPrice(updatedPrice);

            });
        });
    
        return card;
    }
    function formatPrice(price) {
        return Number.isInteger(price) ? price.toString() : price.toFixed(2);
    }
    
    
    

    async function fetchProducts(category) {
        try {
            const snapshot = await db.collection('drinks')
                .where('category', '==', category)
                .get();
            productContainer.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                productContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    async function fetchCoffee() {
        try {
            const coffeeCollectionRef = collection(db, 'coffee');
            const snapshot = await getDocs(coffeeCollectionRef);
            productContainer.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                productContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching coffee products:", error);
        }
    }

    async function fetchFreshy() {
        try {
            const freshyCollection = collection(db, "freshy");
            const snapshot = await getDocs(freshyCollection);
            productContainer.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                productContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching freshy products:", error);
        }
    }

    async function fetchSmoothie() {
        try {
            const smoothieCollection = collection(db, "smoothie");
            const snapshot = await getDocs(smoothieCollection);
            productContainer.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                productContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching smoothie products:", error);
        }
    }

    fetchFreshy();

    const drinksLink = document.querySelector('.nav-links a[href="drinks.html"]');
    drinksLink.addEventListener('click', (event) => {
        event.preventDefault();
        categoryButtons.forEach(button => button.classList.remove('active'));
        freshyButton.classList.add('active');
        fetchFreshy();
    });
});

