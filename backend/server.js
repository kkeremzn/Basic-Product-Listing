const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001; 

app.use(cors()); 
app.use(express.json());

async function getGoldPrice() {
    const MOCK_GOLD_PRICE = 75.0; 
    console.log(`[SERVER] Hesaplama için Kullanılan Altın Fiyatı (USD/gram): ${MOCK_GOLD_PRICE}`);
    return MOCK_GOLD_PRICE; 
}

app.get('/', (req, res) => {
    res.send('API çalışıyor!');
});

app.get('/api/products', async (req, res) => {
    try {
        const productsPath = path.join(__dirname, 'products.json');
        const productsData = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(productsData);

        const goldPrice = await getGoldPrice(); 
        
        const productsWithPrice = products.map(product => {
            
            const calculatedPrice = (product.popularityScore + 1) * product.weight * goldPrice;
            const finalPrice = parseFloat(calculatedPrice.toFixed(2)); 

            return {
                ...product, 
                price: finalPrice, 
            };
        });

        res.json(productsWithPrice); 
    } catch (error) {
        console.error('[SERVER] Ürünler okunurken veya fiyat hesaplanırken hata oluştu:', error);
        res.status(500).json({ message: 'Sunucu hatası: Ürünler yüklenemedi.' });
    }
});

app.listen(PORT, () => {
    console.log(`[SERVER] Sunucu ${PORT} portunda çalışıyor.`);
    console.log(`[SERVER] API Ana Sayfası: http://localhost:${PORT}`);
    console.log(`[SERVER] Ürün API Adresi: http://localhost:${PORT}/api/products`);
});