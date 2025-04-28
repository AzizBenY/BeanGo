// Import Firestore functions from CDN
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
const db = window.db;

// Export the createProductCard function
export function createProductCard(product) {
    const container = document.getElementById("product-card-container");
  
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute('data-product', JSON.stringify(product)); // Store product data in the card
  
    // Log the image URL to check if it's correct
    console.log("Product image URL:", product.image);
  
    // Create the card's inner HTML
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h2 class="product-title">${product.name}</h2>
      <p class="product-description">${product.description}</p>
      <div class="price-compose-container">
        <div class="product-price">${product.prix} dt</div>
        <button class="compose-button">Compose Now</button>
      </div>
    `;
  
    // Add event listeners for interactions if needed
    // (Add your existing logic here)

    container.appendChild(card);
}
  
// Function to change cup icon image
function changeIcon(icon, src) {
  icon.src = src;
}

// Function to handle size selection
function selectSize(button, size) {
  const isSelected = button.classList.contains('selected');

  // Remove 'selected' from all size buttons in the same card
  const card = button.closest('.product-card');
  const buttons = card.querySelectorAll('.size-button');
  buttons.forEach(btn => btn.classList.remove('selected'));

  // Toggle the selected class
  if (!isSelected) {
    button.classList.add('selected');

    // Get product data from the card
    const productData = JSON.parse(card.getAttribute('data-product'));
    const priceElement = card.querySelector('.product-price');

    // Update price
    if (size === "Small") {
      priceElement.innerText = `${productData.price.small} `;
    } else if (size === "Medium") {
      priceElement.innerText = `${productData.price.medium} `;
    } else if (size === "Large") {
      priceElement.innerText = `${productData.price.large} `;
    }

    // Reveal the compose section
    const composeContainer = card.querySelector('.price-compose-container');
    composeContainer.classList.remove('hidden');
  }
}

// Function to fetch coffee data from Firestore
async function fetchCoffee() {
    try {
      const querySnapshot = await getDocs(collection(db, "Coffee"));
      console.log("Fetched documents:", querySnapshot.docs.length);
      querySnapshot.forEach((doc) => {
        const product = {
          id: doc.id,
          image: doc.data().image, // Make sure the image field exists in Firestore
          title: doc.data().Name,
          description: doc.data().Description,
          sizes: ["Small", "Medium", "Large"],
          price: {
            small: doc.data().prixS,
            medium: doc.data().prixM,
            large: doc.data().prixL
          }
        };
        console.log("Product image URL:", product.image);  // Check if the URL is correct
        console.log("Product data:", product);
        createProductCard(product);
      });
    } catch (error) {
      console.error("Error fetching coffee: ", error);
    }
  }
  

// Fetch coffee products when the page loads
fetchCoffee();
// Function to fetch and display the image
async function fetchAndDisplayImage(imageURL) {
    try {
      // Check if the image is accessible by attempting to fetch the image
      const response = await fetch(imageURL);
      
      // If the image is not accessible, throw an error
      if (!response.ok) {
        throw new Error('Image not found or access denied');
      }
  
      // Create an img element and set the source to the image URL
      const imgElement = document.createElement('img');
      imgElement.src = imageURL;
      imgElement.alt = 'Product Image';
      imgElement.classList.add('product-image');  // Optional: Add a class for styling
  
      // Find the container where you want to append the image
      const container = document.getElementById('product-card-container');
      container.appendChild(imgElement);
  
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }
  
  // Example of calling the function with a direct Imgur URL
  fetchAndDisplayImage('https://i.imgur.com/oekhms9.png');
  
// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch product details based on product ID
async function fetchProductDetails() {
    const productId = getQueryParam('productId');
    if (!productId) return;

    try {
        const doc = await db.collection('Coffee').doc(productId).get();
        if (doc.exists) {
            const product = doc.data();
            displayProductDetails(product);
        } else {
            console.error("No such document!");
        }
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Function to display product details
function displayProductDetails(product) {
    const productDetails = document.getElementById('product-details');
    productDetails.innerHTML = `
        <h1>${product.Name}</h1>
        <img src="${product.image}" alt="${product.Name}">
        <p>${product.Description}</p>
        <p>Small: ${product.prixS}</p>
        <p>Medium: ${product.prixM}</p>
        <p>Large: ${product.prixL}</p>
    `;
}

// Initial load
fetchProductDetails();
  
  