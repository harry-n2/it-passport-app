import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

class PurchaseManager {
    constructor() {
        this.isInitialized = false;
        this.apiKey = 'YOUR_REVENUECAT_API_KEY'; // RevenueCatダッシュボードから取得
        this.products = {
            'ad_free': 'com.itpassport.app.ad_free', // 広告オフ
            'mock_test': 'com.itpassport.app.mock_test', // 模擬テスト
            'premium': 'com.itpassport.app.premium' // プレミアム
        };
        this.purchaseCallbacks = new Map();
    }

    async initialize() {
        if (!Capacitor.isNativePlatform()) {
            console.log('Purchases is only available on native platforms');
            return;
        }

        try {
            await Purchases.setLogLevel({ level: LOG_LEVEL.INFO });
            await Purchases.configure({ apiKey: this.apiKey });
            
            // ユーザーIDを設定（オプション）
            const userId = this.getUserId();
            if (userId) {
                await Purchases.logIn({ appUserID: userId });
            }
            
            this.isInitialized = true;
            console.log('RevenueCat initialized successfully');
            
            // 購入状態を復元
            await this.restorePurchases();
        } catch (error) {
            console.error('Failed to initialize RevenueCat:', error);
        }
    }

    getUserId() {
        // アプリ独自のユーザーIDがあれば返す
        return localStorage.getItem('userId') || null;
    }

    async getProducts() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const offerings = await Purchases.getOfferings();
            return offerings.current?.availablePackages || [];
        } catch (error) {
            console.error('Failed to get products:', error);
            return [];
        }
    }

    async purchaseProduct(productId) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const offerings = await Purchases.getOfferings();
            const packages = offerings.current?.availablePackages || [];
            const targetPackage = packages.find(pkg => pkg.product.identifier === productId);
            
            if (!targetPackage) {
                throw new Error(`Product ${productId} not found`);
            }

            const purchaserInfo = await Purchases.purchasePackage({ aPackage: targetPackage });
            
            if (purchaserInfo.customerInfo.entitlements.active[productId]) {
                console.log(`Successfully purchased ${productId}`);
                this.handlePurchaseSuccess(productId);
                return true;
            }
            
            return false;
        } catch (error) {
            if (error.code === 'USER_CANCELLED') {
                console.log('Purchase cancelled by user');
            } else {
                console.error('Purchase failed:', error);
            }
            return false;
        }
    }

    async restorePurchases() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const purchaserInfo = await Purchases.restorePurchases();
            const activeEntitlements = purchaserInfo.customerInfo.entitlements.active;
            
            // アクティブな購入を localStorage に保存
            const purchasedFeatures = Object.keys(activeEntitlements);
            localStorage.setItem('purchasedFeatures', JSON.stringify(purchasedFeatures));
            
            console.log('Purchases restored:', purchasedFeatures);
            return purchasedFeatures;
        } catch (error) {
            console.error('Failed to restore purchases:', error);
            return [];
        }
    }

    async checkPurchaseStatus(productId) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const purchaserInfo = await Purchases.getCustomerInfo();
            return purchaserInfo.customerInfo.entitlements.active[productId] != null;
        } catch (error) {
            console.error('Failed to check purchase status:', error);
            // フォールバック: localStorageから確認
            const purchasedFeatures = JSON.parse(localStorage.getItem('purchasedFeatures') || '[]');
            return purchasedFeatures.includes(productId);
        }
    }

    handlePurchaseSuccess(productId) {
        // localStorage を更新
        const purchasedFeatures = JSON.parse(localStorage.getItem('purchasedFeatures') || '[]');
        if (!purchasedFeatures.includes(productId)) {
            purchasedFeatures.push(productId);
            localStorage.setItem('purchasedFeatures', JSON.stringify(purchasedFeatures));
        }

        // コールバックを実行
        const callback = this.purchaseCallbacks.get(productId);
        if (callback) {
            callback();
        }

        // 購入完了イベントを発火
        window.dispatchEvent(new CustomEvent('purchaseComplete', { 
            detail: { productId } 
        }));
    }

    onPurchaseComplete(productId, callback) {
        this.purchaseCallbacks.set(productId, callback);
    }

    // 便利メソッド
    async isAdFreeActive() {
        return await this.checkPurchaseStatus('ad_free');
    }

    async isMockTestActive() {
        return await this.checkPurchaseStatus('mock_test');
    }

    async isPremiumActive() {
        return await this.checkPurchaseStatus('premium');
    }
}

export default new PurchaseManager();