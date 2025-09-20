import AdMobManager from './admob-manager.js';
import PurchaseManager from './purchase-manager.js';

class AppManager {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // AdMobとPurchaseManagerを初期化
            await Promise.all([
                AdMobManager.initialize(),
                PurchaseManager.initialize()
            ]);

            // 購入完了時のイベントリスナー
            this.setupPurchaseListeners();

            // 広告表示の制御
            await this.setupAdDisplay();

            this.initialized = true;
            console.log('App Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize App Manager:', error);
        }
    }

    setupPurchaseListeners() {
        // 広告オフ購入時
        PurchaseManager.onPurchaseComplete('ad_free', async () => {
            await AdMobManager.disableAds();
            this.showPurchaseSuccessMessage('広告が無効になりました！');
        });

        // 模擬テスト購入時
        PurchaseManager.onPurchaseComplete('mock_test', () => {
            this.showPurchaseSuccessMessage('模擬テスト機能が有効になりました！');
            this.enableMockTestFeature();
        });

        // プレミアム購入時
        PurchaseManager.onPurchaseComplete('premium', async () => {
            await AdMobManager.disableAds();
            this.showPurchaseSuccessMessage('プレミアム機能がすべて有効になりました！');
            this.enableAllPremiumFeatures();
        });
    }

    async setupAdDisplay() {
        const isAdFree = await PurchaseManager.isAdFreeActive();
        const isPremium = await PurchaseManager.isPremiumActive();

        if (!isAdFree && !isPremium) {
            // 広告を表示
            await AdMobManager.showBanner();
        }
    }

    // 購入処理
    async handlePurchase(feature) {
        const productMap = {
            'ad-free': 'ad_free',
            'mock-test': 'mock_test',
            'premium': 'premium'
        };

        const productId = productMap[feature];
        if (!productId) {
            console.error('Unknown feature:', feature);
            return false;
        }

        // すでに購入済みかチェック
        const isPurchased = await PurchaseManager.checkPurchaseStatus(productId);
        if (isPurchased) {
            this.showPurchaseSuccessMessage('この機能は既に購入済みです！');
            return true;
        }

        // 購入処理を実行
        this.showLoadingMessage('購入処理中...');
        const success = await PurchaseManager.purchaseProduct(productId);
        
        this.hideLoadingMessage();
        
        if (!success) {
            this.showErrorMessage('購入に失敗しました。しばらくしてからもう一度お試しください。');
        }

        return success;
    }

    // インタースティシャル広告表示（問題間など）
    async showInterstitialAd() {
        const isAdFree = await PurchaseManager.isAdFreeActive();
        const isPremium = await PurchaseManager.isPremiumActive();

        if (!isAdFree && !isPremium) {
            await AdMobManager.showInterstitial();
        }
    }

    // リワード広告表示（ヒント機能など）
    async showRewardAd() {
        return await AdMobManager.showRewardAd();
    }

    // 機能有効化
    enableMockTestFeature() {
        // 模擬テスト機能を有効にする
        const mockTestElements = document.querySelectorAll('.mock-test-feature');
        mockTestElements.forEach(element => {
            element.classList.remove('disabled');
        });
    }

    enableAllPremiumFeatures() {
        // すべてのプレミアム機能を有効にする
        this.enableMockTestFeature();
        
        const premiumElements = document.querySelectorAll('.premium-feature');
        premiumElements.forEach(element => {
            element.classList.remove('disabled');
        });
    }

    // UI関連のヘルパーメソッド
    showPurchaseSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showLoadingMessage(message) {
        // ローディング表示の実装
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-message';
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoadingMessage() {
        const loadingDiv = document.getElementById('loading-message');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    showMessage(message, type = 'info') {
        // トースト通知の実装
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
}

export default new AppManager();