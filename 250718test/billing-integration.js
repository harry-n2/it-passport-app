// Google Play Billing統合用JavaScript
// HTMLの料金表示部分で使用

class ITPassportBilling {
    constructor() {
        this.isInitialized = false;
        this.products = {};
        this.ownedProducts = [];
    }

    // 初期化
    async initialize() {
        try {
            await GooglePlayBilling.initialize();
            this.isInitialized = true;
            console.log('Billing initialized successfully');
            
            // 購入完了イベントリスナー
            GooglePlayBilling.addListener('purchaseCompleted', (data) => {
                console.log('Purchase completed:', data);
                this.ownedProducts.push(...data.products);
                this.updateUI();
            });
            
            return true;
        } catch (error) {
            console.error('Billing initialization failed:', error);
            return false;
        }
    }

    // 商品情報と価格を取得
    async loadProductDetails() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const result = await GooglePlayBilling.queryProductDetails();
            this.products = result.products;
            
            // UIに価格を動的表示
            this.updatePriceDisplay();
            
            return this.products;
        } catch (error) {
            console.error('Failed to load product details:', error);
            return {};
        }
    }

    // 購入済み商品を確認
    async checkPurchases() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const result = await GooglePlayBilling.queryPurchases();
            this.ownedProducts = result.purchasedProducts;
            this.updateUI();
            return this.ownedProducts;
        } catch (error) {
            console.error('Failed to check purchases:', error);
            return [];
        }
    }

    // 商品購入
    async purchase(productId) {
        if (!this.isInitialized) {
            throw new Error('Billing not initialized');
        }

        try {
            await GooglePlayBilling.purchase({ productId });
            // 購入結果は purchaseCompleted イベントで受信
        } catch (error) {
            console.error('Purchase failed:', error);
            throw error;
        }
    }

    // UI更新：価格表示
    updatePriceDisplay() {
        // 広告オフの価格表示
        const adFreeProduct = this.products['ad_free'];
        if (adFreeProduct) {
            const priceElement = document.getElementById('ad-free-price');
            if (priceElement) {
                priceElement.textContent = adFreeProduct.price;
            }
        }

        // 模擬試験パックの価格表示
        const mockTestProduct = this.products['mock_test'];
        if (mockTestProduct) {
            const priceElement = document.getElementById('mock-test-price');
            if (priceElement) {
                priceElement.textContent = mockTestProduct.price;
            }
        }
    }

    // UI更新：購入状態
    updateUI() {
        // 広告オフ購入済みチェック
        const hasAdFree = this.ownedProducts.includes('ad_free');
        const adFreeBtn = document.getElementById('purchase-ad-free-btn');
        if (adFreeBtn) {
            if (hasAdFree) {
                adFreeBtn.textContent = '購入済み';
                adFreeBtn.disabled = true;
                // 広告を非表示にする処理
                this.hideAds();
            } else {
                adFreeBtn.textContent = `広告オフ ${this.products['ad_free']?.price || ''}`;
                adFreeBtn.disabled = false;
            }
        }

        // 模擬試験パック購入済みチェック
        const hasMockTest = this.ownedProducts.includes('mock_test');
        const mockTestBtn = document.getElementById('purchase-mock-test-btn');
        if (mockTestBtn) {
            if (hasMockTest) {
                mockTestBtn.textContent = '購入済み';
                mockTestBtn.disabled = true;
                // 模擬試験機能を有効化
                this.enableMockTests();
            } else {
                mockTestBtn.textContent = `模擬試験パック ${this.products['mock_test']?.price || ''}`;
                mockTestBtn.disabled = false;
            }
        }
    }

    // 広告非表示処理
    hideAds() {
        const ads = document.querySelectorAll('.advertisement, .ad-banner');
        ads.forEach(ad => ad.style.display = 'none');
        console.log('Ads hidden');
    }

    // 模擬試験機能有効化
    enableMockTests() {
        const mockTestSections = document.querySelectorAll('.mock-test-content');
        mockTestSections.forEach(section => section.style.display = 'block');
        console.log('Mock tests enabled');
    }

    // 商品IDから詳細情報を取得
    getProductInfo(productId) {
        return this.products[productId] || null;
    }

    // 購入済みかチェック
    isPurchased(productId) {
        return this.ownedProducts.includes(productId);
    }
}

// グローバルインスタンス
const itPassportBilling = new ITPassportBilling();

// DOMロード後に初期化
document.addEventListener('DOMContentLoaded', async () => {
    await itPassportBilling.initialize();
    await itPassportBilling.loadProductDetails();
    await itPassportBilling.checkPurchases();
});

// 購入ボタンのイベントハンドラー例
function purchaseAdFree() {
    itPassportBilling.purchase('ad_free').catch(error => {
        alert('購入に失敗しました: ' + error.message);
    });
}

function purchaseMockTest() {
    itPassportBilling.purchase('mock_test').catch(error => {
        alert('購入に失敗しました: ' + error.message);
    });
}