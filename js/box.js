import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- Bakeries Section ---
    const bakeryWrapper = document.getElementById('bakery-product-wrapper');
    const bakeryTemplate = document.getElementById('bakery-product-card-template');
    let bakeryProducts = [];
    let bakeryCurrentStart = 0;
    const bakeryCardsToShow = 4;

    async function fetchBakeries() {
        const muffinsCollection = collection(db, "muffins");
        const snapshot = await getDocs(muffinsCollection);
        bakeryProducts = [];
        snapshot.forEach(doc => {
            bakeryProducts.push({ id: doc.id, ...doc.data() });
        });
        bakeryCurrentStart = 0;
        renderBakeryCards();
        attachBakeryArrowEvents();
    }

    function createBakeryCard(product) {
        const card = bakeryTemplate.content.cloneNode(true);
        card.querySelector('.product-image').src = product.image;
        card.querySelector('.product-image').alt = product.name;
        card.querySelector('.product-name').textContent = product.name;
        card.querySelector('.product-description').textContent = product.description;
        card.querySelector('.price').textContent = `${product.prix}dt`;
        return card;
    }

    function renderBakeryCards() {
        bakeryWrapper.innerHTML = '';
        const visible = bakeryProducts.slice(bakeryCurrentStart, bakeryCurrentStart + bakeryCardsToShow);
        visible.forEach(product => {
            const card = createBakeryCard(product);
            bakeryWrapper.appendChild(card);
        });
        updateBakeryArrows();
    }

    function updateBakeryArrows() {
        const left = document.querySelector('.bakeries-arrow-left');
        const right = document.querySelector('.bakeries-arrow-right');
        left.style.opacity = bakeryCurrentStart === 0 ? '0.5' : '1';
        left.style.pointerEvents = bakeryCurrentStart === 0 ? 'none' : 'auto';
        right.style.opacity = (bakeryCurrentStart + bakeryCardsToShow >= bakeryProducts.length) ? '0.5' : '1';
        right.style.pointerEvents = (bakeryCurrentStart + bakeryCardsToShow >= bakeryProducts.length) ? 'none' : 'auto';
    }

    function attachBakeryArrowEvents() {
        document.querySelector('.bakeries-arrow-left').onclick = () => {
            if (bakeryCurrentStart > 0) {
                bakeryCurrentStart--;
                renderBakeryCards();
            }
        };
        document.querySelector('.bakeries-arrow-right').onclick = () => {
            if (bakeryCurrentStart + bakeryCardsToShow < bakeryProducts.length) {
                bakeryCurrentStart++;
                renderBakeryCards();
            }
        };
    }

    // --- Drinks Section ---
    const drinksWrapper = document.getElementById('drinks-product-wrapper');
    const drinksTemplate = document.getElementById('drinks-product-card-template');
    let drinksProducts = [];
    let drinksCurrentStart = 0;
    const drinksCardsToShow = 4;

    async function fetchDrinks() {
        const freshyCollection = collection(db, "freshy");
        const snapshot = await getDocs(freshyCollection);
        drinksProducts = [];
        snapshot.forEach(doc => {
            drinksProducts.push({ id: doc.id, ...doc.data() });
        });
        drinksCurrentStart = 0;
        renderDrinksCards();
        attachDrinksArrowEvents();
    }

    function createDrinksCard(product) {
        const card = drinksTemplate.content.cloneNode(true);
        card.querySelector('.product-image').src = product.image;
        card.querySelector('.product-image').alt = product.name;
        card.querySelector('.drinks-product-name').textContent = product.name;
        card.querySelector('.drinks-product-description').textContent = product.description;
        // Set base price
        const basePrice = parseFloat(product.prix);
        const priceElement = card.querySelector('.price');
        priceElement.textContent = basePrice;
        // Size selector logic
        const sizeCircles = card.querySelectorAll('.size-circle');
        sizeCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                sizeCircles.forEach(c => c.classList.remove('selected'));
                circle.classList.add('selected');
                let updatedPrice = basePrice;
                const size = circle.dataset.size;
                if (size === 'medium') updatedPrice += 1;
                else if (size === 'large') updatedPrice += 2;
                priceElement.textContent = updatedPrice;
            });
        });
        return card;
    }

    function renderDrinksCards() {
        drinksWrapper.innerHTML = '';
        const visible = drinksProducts.slice(drinksCurrentStart, drinksCurrentStart + drinksCardsToShow);
        visible.forEach(product => {
            const card = createDrinksCard(product);
            drinksWrapper.appendChild(card);
        });
        updateDrinksArrows();
    }

    function updateDrinksArrows() {
        const left = document.querySelector('.drinks-arrow-left');
        const right = document.querySelector('.drinks-arrow-right');
        left.style.opacity = drinksCurrentStart === 0 ? '0.5' : '1';
        left.style.pointerEvents = drinksCurrentStart === 0 ? 'none' : 'auto';
        right.style.opacity = (drinksCurrentStart + drinksCardsToShow >= drinksProducts.length) ? '0.5' : '1';
        right.style.pointerEvents = (drinksCurrentStart + drinksCardsToShow >= drinksProducts.length) ? 'none' : 'auto';
    }

    function attachDrinksArrowEvents() {
        document.querySelector('.drinks-arrow-left').onclick = () => {
            if (drinksCurrentStart > 0) {
                drinksCurrentStart--;
                renderDrinksCards();
            }
        };
        document.querySelector('.drinks-arrow-right').onclick = () => {
            if (drinksCurrentStart + drinksCardsToShow < drinksProducts.length) {
                drinksCurrentStart++;
                renderDrinksCards();
            }
        };
    }

    // --- Ice Cream Section ---
    const iceCreamWrapper = document.getElementById('ice-cream-product-wrapper');
    const iceCreamTemplate = document.getElementById('ice-cream-product-card-template');
    let iceCreamProducts = [];
    let iceCreamCurrentStart = 0;
    const iceCreamCardsToShow = 4;

    async function fetchIceCream() {
        const iceCreamCollection = collection(db, "iceCream");
        const snapshot = await getDocs(iceCreamCollection);
        iceCreamProducts = [];
        snapshot.forEach(doc => {
            iceCreamProducts.push({ id: doc.id, ...doc.data() });
        });
        iceCreamCurrentStart = 0;
        renderIceCreamCards();
        attachIceCreamArrowEvents();
    }

    function createIceCreamCard(product) {
        const card = iceCreamTemplate.content.cloneNode(true);
        card.querySelector('.product-image').src = product.image || 'default.jpg';
        card.querySelector('.product-image').alt = product.name;
        card.querySelector('.product-name').textContent = product.name;
        card.querySelector('.product-description').textContent = product.description;
        card.querySelector('.price').textContent = `${product.prix}dt`;
        return card;
    }

    function renderIceCreamCards() {
        iceCreamWrapper.innerHTML = '';
        const visible = iceCreamProducts.slice(iceCreamCurrentStart, iceCreamCurrentStart + iceCreamCardsToShow);
        visible.forEach(product => {
            const card = createIceCreamCard(product);
            iceCreamWrapper.appendChild(card);
        });
        updateIceCreamArrows();
    }

    function updateIceCreamArrows() {
        const left = document.querySelector('.icecream-arrow-left');
        const right = document.querySelector('.icecream-arrow-right');
        left.style.opacity = iceCreamCurrentStart === 0 ? '0.5' : '1';
        left.style.pointerEvents = iceCreamCurrentStart === 0 ? 'none' : 'auto';
        right.style.opacity = (iceCreamCurrentStart + iceCreamCardsToShow >= iceCreamProducts.length) ? '0.5' : '1';
        right.style.pointerEvents = (iceCreamCurrentStart + iceCreamCardsToShow >= iceCreamProducts.length) ? 'none' : 'auto';
    }

    function attachIceCreamArrowEvents() {
        document.querySelector('.icecream-arrow-left').onclick = () => {
            if (iceCreamCurrentStart > 0) {
                iceCreamCurrentStart--;
                renderIceCreamCards();
            }
        };
        document.querySelector('.icecream-arrow-right').onclick = () => {
            if (iceCreamCurrentStart + iceCreamCardsToShow < iceCreamProducts.length) {
                iceCreamCurrentStart++;
                renderIceCreamCards();
            }
        };
    }

    // Fetch all products on page load
    fetchBakeries();
    fetchDrinks();
    fetchIceCream();
}); 