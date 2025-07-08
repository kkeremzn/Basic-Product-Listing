document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const prevBtn = document.getElementById('prevBtn'); 
    const nextBtn = document.getElementById('nextBtn'); 

    const API_URL = 'https://basic-product-listing.onrender.com/api/products'; 

    async function fetchProducts() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP hata! Durum: ${response.status}`);
            }
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Ürünleri çekerken bir hata oluştu:', error);
            productsContainer.innerHTML = '<p style="text-align:center; color: red; font-weight: bold;">Ürünler yüklenirken bir sorun oluştu. Lütfen API sunucusunun çalıştığından ve doğru portta olduğundan emin olun.</p>';
        }
    }

    function displayProducts(products) {
        productsContainer.innerHTML = ''; 

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const defaultColor = product.images.yellow ? 'yellow' : Object.keys(product.images)[0];
            const defaultImage = product.images[defaultColor];

            const scoreOutOf5 = product.popularityScore * 5; 
            const formattedScore = scoreOutOf5.toFixed(1); 

            productCard.innerHTML = `
                <img src="${defaultImage}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <h3>${product.name}</h3>
                    
                    <p class="price-info">
                        <strong>Fiyat:</strong> <span class="price-value">${product.price.toFixed(2)}</span> USD 
                    </p>

                    <div class="color-options">
                        ${Object.keys(product.images).map(color => `
                            <button 
                                data-color="${color}" 
                                class="${color === defaultColor ? 'active' : ''}"
                                aria-label="${capitalizeFirstLetter(color)} Gold Rengi">
                            </button>
                        `).join('')}
                    </div>
                    
                    <p class="selected-color-name">
                        ${capitalizeFirstLetter(defaultColor)} Gold 
                    </p>

                    <div class="rating-info">
                        <div class="stars-display">
                            ${generateStarRating(product.popularityScore)} 
                        </div>
                        <span class="popularity-score">${formattedScore}/5</span> 
                    </div>
                </div>
            `;

            const colorButtons = productCard.querySelectorAll('.color-options button');
            colorButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    colorButtons.forEach(btn => btn.classList.remove('active'));
                    event.target.classList.add('active');

                    const selectedColor = event.target.dataset.color;
                    const productImage = productCard.querySelector('.product-image');
                    const selectedColorNameElement = productCard.querySelector('.selected-color-name');

                    productImage.src = product.images[selectedColor];
                    selectedColorNameElement.textContent = `${capitalizeFirstLetter(selectedColor)} Gold`;
                });
            });

            productsContainer.appendChild(productCard);
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function generateStarRating(popularityScore) {
        const maxStars = 5; 
        const scoreOutOf5 = popularityScore * maxStars; 
        
        const filledStars = Math.floor(scoreOutOf5); 
        const hasHalfStar = (scoreOutOf5 % 1) >= 0.5;

        let starsHtml = '';
        for (let i = 0; i < filledStars; i++) {
            starsHtml += '<span class="star filled">&#9733;</span>';
        }
        if (hasHalfStar) {
            starsHtml += '<span class="star half">&#9733;</span>';
        }
        for (let i = 0; i < (maxStars - filledStars - (hasHalfStar ? 1 : 0)); i++) {
            starsHtml += '<span class="star empty">&#9734;</span>';
        }
        return starsHtml;
    }

    if (prevBtn && nextBtn) { 
        const scrollAmount = 350; 

        prevBtn.addEventListener('click', () => {
            console.log('Prev butonu tıklandı!'); 
            productsContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            console.log('Next butonu tıklandı!'); 
            productsContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    } else {
        
        console.warn('Carousel butonları (prevBtn veya nextBtn) bulunamadı. HTML IDlerini kontrol edin.');
    }

    fetchProducts();
});