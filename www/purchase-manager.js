// 課金管理クラス
class PurchaseManager {
    constructor() {
        this.initialized = false;
        this.premiumProductId = 'premium_version'; // 商品ID
        this.isDebugMode = true; // 本番時はfalseに変更
        this.isPremiumUser = false;
    }

    async initialize() {
        try {
            if (!window.Purchases) {
                console.log('RevenueCat plugin not available');
                return false;
            }

            // RevenueCat初期化
            await Purchases.setLogLevel({ level: 'DEBUG' }); // 本番時は'ERROR'に変更
            await Purchases.configure({
                apiKey: 'YOUR_REVENUECAT_API_KEY', // RevenueCatのAPIキーを設定
            });

            // ユーザー識別子の設定（オプション）
            const userId = this.generateUserId();
            await Purchases.identify({ appUserID: userId });

            // プレミアム状態の確認
            await this.checkPremiumStatus();

            this.initialized = true;
            console.log('RevenueCat初期化完了');
            return true;
        } catch (error) {
            console.error('RevenueCat初期化エラー:', error);
            // フォールバック：ローカルストレージでの管理
            this.initializeLocalPurchases();
            return false;
        }
    }

    // ローカルストレージでの課金状態管理（フォールバック）
    initializeLocalPurchases() {
        this.isPremiumUser = localStorage.getItem('isPremium') === 'true';
        console.log('ローカル課金管理モード');
    }

    // ユーザーID生成
    generateUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    // プレミアム状態の確認
    async checkPremiumStatus() {
        try {
            const purchaserInfo = await Purchases.getCustomerInfo();
            this.isPremiumUser = Object.keys(purchaserInfo.entitlements.active).length > 0;
            console.log('プレミアム状態:', this.isPremiumUser);
        } catch (error) {
            console.error('プレミアム状態確認エラー:', error);
            this.isPremiumUser = localStorage.getItem('isPremium') === 'true';
        }
    }

    // 商品情報の取得
    async getProducts() {
        try {
            const offerings = await Purchases.getOfferings();
            return offerings.current?.availablePackages || [];
        } catch (error) {
            console.error('商品情報取得エラー:', error);
            // フォールバック商品情報
            return [{
                identifier: 'premium_version',
                packageType: 'LIFETIME',
                product: {
                    identifier: 'premium_version',
                    description: 'ITパスポート過去問アプリ プレミアム版',
                    title: 'プレミアム版',
                    price: '¥480',
                    priceString: '¥480'
                }
            }];
        }
    }

    // プレミアム版の購入
    async purchasePremium() {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            // 購入確認ダイアログ
            if (!this.showPurchaseConfirmation()) {
                return { success: false, cancelled: true };
            }

            this.showLoadingDialog();

            const offerings = await Purchases.getOfferings();
            const premiumPackage = offerings.current?.lifetime;

            if (!premiumPackage) {
                throw new Error('プレミアム商品が見つかりません');
            }

            const purchaseResult = await Purchases.purchasePackage({ 
                aPackage: premiumPackage 
            });

            if (purchaseResult.customerInfo.entitlements.active.premium) {
                this.isPremiumUser = true;
                localStorage.setItem('isPremium', 'true');
                this.hideLoadingDialog();
                this.showSuccessMessage();
                
                // 広告を非表示にする
                if (window.adMobManager) {
                    await adMobManager.hideBannerAd();
                }
                
                return { success: true };
            }
        } catch (error) {
            this.hideLoadingDialog();
            
            if (error.userCancelled) {
                console.log('購入がキャンセルされました');
                return { success: false, cancelled: true };
            }
            
            console.error('購入エラー:', error);
            this.showErrorMessage(error.message);
            
            // フォールバック：デバッグモード時は購入成功として扱う
            if (this.isDebugMode) {
                this.isPremiumUser = true;
                localStorage.setItem('isPremium', 'true');
                this.showSuccessMessage();
                return { success: true };
            }
            
            return { success: false, error: error };
        }
    }

    // 購入の復元
    async restorePurchases() {
        try {
            this.showLoadingDialog();
            
            const purchaserInfo = await Purchases.restorePurchases();
            
            if (Object.keys(purchaserInfo.entitlements.active).length > 0) {
                this.isPremiumUser = true;
                localStorage.setItem('isPremium', 'true');
                this.hideLoadingDialog();
                this.showRestoreSuccessMessage();
                return { success: true };
            } else {
                this.hideLoadingDialog();
                this.showRestoreFailMessage();
                return { success: false, message: '復元可能な購入が見つかりませんでした' };
            }
        } catch (error) {
            this.hideLoadingDialog();
            console.error('購入復元エラー:', error);
            this.showErrorMessage(error.message);
            return { success: false, error: error };
        }
    }

    // プレミアム機能の確認
    isPremium() {
        return this.isPremiumUser;
    }

    // UI関連のヘルパーメソッド
    showPurchaseConfirmation() {
        return confirm('プレミアム版（¥480）を購入しますか？\n\n・全問題利用可能\n・広告なし\n・オフライン学習機能');
    }

    showLoadingDialog() {
        const loading = document.createElement('div');
        loading.id = 'purchase-loading';
        loading.className = 'purchase-loading';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>処理中...</p>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoadingDialog() {
        const loading = document.getElementById('purchase-loading');
        if (loading) {
            loading.remove();
        }
    }

    showSuccessMessage() {
        alert('プレミアム版の購入が完了しました！\n広告なしでお楽しみください。');
        this.updateUIForPremium();
    }

    showRestoreSuccessMessage() {
        alert('購入の復元が完了しました！');
        this.updateUIForPremium();
    }

    showRestoreFailMessage() {
        alert('復元可能な購入が見つかりませんでした。');
    }

    showErrorMessage(message) {
        alert('購入処理でエラーが発生しました:\n' + message);
    }

    // プレミアムユーザー向けのUI更新
    updateUIForPremium() {
        // プレミアムバッジの表示
        const premiumBadge = document.querySelector('.premium-badge');
        if (premiumBadge) {
            premiumBadge.style.display = 'block';
        }

        // 広告エリアの非表示
        const adElements = document.querySelectorAll('.ad-container, .ad-banner');
        adElements.forEach(el => el.style.display = 'none');

        // プレミアム機能の有効化
        const premiumFeatures = document.querySelectorAll('.premium-feature');
        premiumFeatures.forEach(el => el.classList.remove('disabled'));
    }
}

// グローバルインスタンス
const purchaseManager = new PurchaseManager();

// アプリ起動時の初期化
document.addEventListener('DOMContentLoaded', async () => {
    await purchaseManager.initialize();
    
    if (purchaseManager.isPremium()) {
        purchaseManager.updateUIForPremium();
    }
});

// プレミアム購入ボタンのイベント設定
function setupPremiumButtons() {
    const purchaseBtn = document.getElementById('purchase-premium-btn');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', () => {
            purchaseManager.purchasePremium();
        });
    }

    const restoreBtn = document.getElementById('restore-purchase-btn');
    if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
            purchaseManager.restorePurchases();
        });
    }
}