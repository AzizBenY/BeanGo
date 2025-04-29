import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from '../js/firebase-config.js'; // Adjust the path if necessary

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const drinksProductWrapper = document.getElementById('drinks-product-wrapper');
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

    function createDrinkProductCard(product) {
        const card = template.content.cloneNode(true);
        const image = card.querySelector('.product-image');
        const name = card.querySelector('.drinks-product-name');
        const description = card.querySelector('.drinks-product-description');
        const priceElement = card.querySelector('.price');
        const sizeCircles = card.querySelectorAll('.size-circle');
        const sizeLabels = card.querySelectorAll('.size-label');
    
        const composeButton = card.querySelector('.compose-now');
        const supplementsSection = card.querySelector('.supplements');
        const addToCartButton = supplementsSection.querySelector('.add-to-cart');
        const productCard = card.querySelector('.drinks-product-card');
        const cardContent = card.querySelector('.card-content');
    
        image.src = product.image;
        name.textContent = product.name;
        description.textContent = product.description;
    
        const basePrice = parseFloat(product.prix);
        priceElement.textContent = formatPrice(basePrice) + ' dt'; // ✅ Always add "dt"
    
        // Handle size selection
        sizeCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                if (circle.classList.contains('selected')) {
                    circle.classList.remove('selected');
                    priceElement.textContent = formatPrice(basePrice) + ' dt'; // ✅ Add "dt"
                    return;
                }
                sizeCircles.forEach(c => c.classList.remove('selected'));
                circle.classList.add('selected');
    
                let updatedPrice = parseFloat(basePrice);
                const size = circle.dataset.size;
                if (size === 'medium') updatedPrice += 1;
                else if (size === 'large') updatedPrice += 2;
    
                priceElement.textContent = formatPrice(updatedPrice) + ' dt'; // ✅ Add "dt"
            });
        });
    
        // Default state
        supplementsSection.style.display = 'none';
        addToCartButton.style.display = 'none';
    
        // Click event for Compose Now
        composeButton.addEventListener('click', (event) => {
            event.preventDefault();
        
            if (name) name.style.display = 'none';
            if (description) description.style.display = 'none';
            composeButton.style.display = 'none';
        
            sizeCircles.forEach(circle => circle.style.display = 'none');
            sizeLabels.forEach(label => label.style.display = 'none');
        
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
        
            // HIDE the original price so it doesn't appear twice
            priceElement.style.display = 'none';
        });
    
        productCard.addEventListener('mouseleave', () => {
            // Show the product name and description
            if (name) name.style.display = 'block';
            if (description) description.style.display = 'block';
            composeButton.style.display = 'block';
        
            // Show size circles and labels
            sizeCircles.forEach(circle => {
                circle.style.display = 'flex'; 
                circle.classList.remove('selected'); 
            });
            sizeLabels.forEach(label => {
                label.style.display = 'block'; 
            });
        
            // Hide supplements and add to cart button
            supplementsSection.style.display = 'none';
            addToCartButton.style.display = 'none';
        
            // Remove the cloned price if exists
            const clonedPrice = supplementsSection.querySelector('.cloned-price');
            if (clonedPrice) clonedPrice.remove();
        
            // Ensure the original price is visible and normal
            priceElement.style.display = 'block';
            priceElement.style.marginRight = '0';
            priceElement.style.fontSize = '';
            priceElement.style.color = '';
        });
    
        // Click event for Add to Cart
        addToCartButton.addEventListener('click', () => {
            console.log("Drink Add to Cart clicked");
        });
    
        return card;
    }
    
    
    function formatPrice(price) {
        return Number.isInteger(price) ? price.toString() : price.toFixed(2);
    }
    
    function createProductCard(product) {
    return createDrinkProductCard(product);
}

    
    

    async function fetchProducts(category) {
        try {
            const snapshot = await db.collection('drinks')
                .where('category', '==', category)
                .get();
            drinksProductWrapper.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                drinksProductWrapper.appendChild(card);
            });
            afterCardsLoaded();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    async function fetchCoffee() {
        try {
            const coffeeCollectionRef = collection(db, 'coffee');
            const snapshot = await getDocs(coffeeCollectionRef);
            drinksProductWrapper.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                drinksProductWrapper.appendChild(card);
            });
            afterCardsLoaded();
        } catch (error) {
            console.error("Error fetching coffee products:", error);
        }
    }

    async function fetchFreshy() {
        try {
            const freshyCollection = collection(db, "freshy");
            const snapshot = await getDocs(freshyCollection);
            drinksProductWrapper.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                drinksProductWrapper.appendChild(card);
            });
            afterCardsLoaded();
        } catch (error) {
            console.error("Error fetching freshy products:", error);
        }
    }

    async function fetchSmoothie() {
        try {
            const smoothieCollection = collection(db, "smoothie");
            const snapshot = await getDocs(smoothieCollection);
            drinksProductWrapper.innerHTML = '';
            snapshot.forEach((doc) => {
                const product = { id: doc.id, ...doc.data() };
                const card = createProductCard(product);
                drinksProductWrapper.appendChild(card);
            });
            afterCardsLoaded();
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

    // --- Card Scrolling Logic ---
    let currentStart = 0;
    const cardsToShow = 4;
    function updateVisibleCards() {
        const cards = drinksProductWrapper.querySelectorAll('.drinks-product-card');
        cards.forEach((card, idx) => {
            if (idx >= currentStart && idx < currentStart + cardsToShow) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        const leftArrow = document.querySelector('.nav-arrow.left');
        const rightArrow = document.querySelector('.nav-arrow.right');
        // Always show arrows, but disable if not scrollable
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
            const cards = drinksProductWrapper.querySelectorAll('.drinks-product-card');
            if (currentStart + cardsToShow < cards.length) {
                currentStart++;
                updateVisibleCards();
            }
        });
    }
    // Call after cards are loaded
    function afterCardsLoaded() {
        currentStart = 0;
        updateVisibleCards();
        attachScrollEvents();
    }
    // Function to check if arrows should be visible
    function updateArrowsVisibility() {
        const containerWidth = drinksProductWrapper.clientWidth;
        const wrapperWidth = drinksProductWrapper.scrollWidth;
        const maxScroll = -(wrapperWidth - containerWidth);
        
        // Show/hide left arrow
        leftArrow.style.opacity = currentPosition < 0 ? '1' : '0.5';
        leftArrow.style.pointerEvents = currentPosition < 0 ? 'auto' : 'none';
        
        // Show/hide right arrow
        rightArrow.style.opacity = currentPosition > maxScroll ? '1' : '0.5';
        rightArrow.style.pointerEvents = currentPosition > maxScroll ? 'auto' : 'none';
    }
    // Navigation arrows click handlers
    leftArrow.addEventListener('click', () => {
        updateCardWidth();
        const scrollAmount = cardWidth + gap;
        currentPosition = Math.min(0, currentPosition + scrollAmount);
        updateCardsPosition();
    });

    rightArrow.addEventListener('click', () => {
        updateCardWidth();
        const containerWidth = drinksProductWrapper.clientWidth;
        const wrapperWidth = drinksProductWrapper.scrollWidth;
        const scrollAmount = cardWidth + gap;
        const maxScroll = -(wrapperWidth - containerWidth);
        currentPosition = Math.max(maxScroll, currentPosition - scrollAmount);
        updateCardsPosition();
    });
     // Add resize listener to update card width
     window.addEventListener('resize', () => {
        updateCardWidth();
        // Reset position on resize to prevent layout issues
        currentPosition = 0;
        updateCardsPosition();
    });
});

