// AdMob広告管理クラス
class AdMobManager {
    constructor() {
        this.initialized = false;
        this.bannerAdId = 'ca-app-pub-3940256099942544/6300978111'; // テスト用バナー
        this.interstitialAdId = 'ca-app-pub-3940256099942544/1033173712'; // テスト用インタースティシャル
        this.rewardedAdId = 'ca-app-pub-3940256099942544/5224354917'; // テスト用リワード
        
        // 本番用IDに変更する際はここを更新
        // this.bannerAdId = 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_BANNER_ID';
        // this.interstitialAdId = 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_INTERSTITIAL_ID';
        // this.rewardedAdId = 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_REWARDED_ID';
    }

    async initialize() {
        try {
            if (!window.AdMob) {
                console.log('AdMob plugin not available');
                return false;
            }

            await AdMob.initialize({
                initializeForTesting: true, // 本番時はfalseに変更
            });

            this.initialized = true;
            console.log('AdMob初期化完了');
            return true;
        } catch (error) {
            console.error('AdMob初期化エラー:', error);
            return false;
        }
    }

    // バナー広告の表示
    async showBannerAd(position = 'BOTTOM_CENTER') {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            await AdMob.showBanner({
                adId: this.bannerAdId,
                adSize: 'BANNER',
                position: position,
                margin: 0,
            });
            console.log('バナー広告表示完了');
        } catch (error) {
            console.error('バナー広告表示エラー:', error);
        }
    }

    // バナー広告の非表示
    async hideBannerAd() {
        try {
            await AdMob.hideBanner();
            console.log('バナー広告非表示完了');
        } catch (error) {
            console.error('バナー広告非表示エラー:', error);
        }
    }

    // インタースティシャル広告の読み込み
    async loadInterstitialAd() {
        try {
            await AdMob.prepareInterstitial({
                adId: this.interstitialAdId,
            });
            console.log('インタースティシャル広告読み込み完了');
            return true;
        } catch (error) {
            console.error('インタースティシャル広告読み込みエラー:', error);
            return false;
        }
    }

    // インタースティシャル広告の表示
    async showInterstitialAd() {
        try {
            await AdMob.showInterstitial();
            console.log('インタースティシャル広告表示完了');
        } catch (error) {
            console.error('インタースティシャル広告表示エラー:', error);
        }
    }

    // リワード広告の読み込み
    async loadRewardedAd() {
        try {
            await AdMob.prepareRewardVideoAd({
                adId: this.rewardedAdId,
            });
            console.log('リワード広告読み込み完了');
            return true;
        } catch (error) {
            console.error('リワード広告読み込みエラー:', error);
            return false;
        }
    }

    // リワード広告の表示
    async showRewardedAd() {
        return new Promise(async (resolve) => {
            try {
                // リワード獲得イベントリスナー
                AdMob.addListener('onRewardedVideoAdReward', (reward) => {
                    console.log('リワード獲得:', reward);
                    resolve({ rewarded: true, reward: reward });
                });

                // 広告終了イベントリスナー
                AdMob.addListener('onRewardedVideoAdClosed', () => {
                    console.log('リワード広告終了');
                    resolve({ rewarded: false });
                });

                await AdMob.showRewardVideoAd();
            } catch (error) {
                console.error('リワード広告表示エラー:', error);
                resolve({ rewarded: false, error: error });
            }
        });
    }

    // 広告ブロック時の代替収益化（プレミアム購入促進）
    showPremiumUpgrade() {
        const modal = document.createElement('div');
        modal.className = 'premium-modal';
        modal.innerHTML = `
            <div class="premium-content">
                <h3>広告なしのプレミアム版</h3>
                <p>・全問題が利用可能</p>
                <p>・広告なしの学習環境</p>
                <p>・オフライン学習機能</p>
                <button onclick="purchaseManager.purchasePremium()" class="premium-btn">
                    プレミアム版を購入 (¥480)
                </button>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">
                    閉じる
                </button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// グローバルインスタンス
const adMobManager = new AdMobManager();

// アプリ起動時の初期化
document.addEventListener('DOMContentLoaded', async () => {
    await adMobManager.initialize();
    
    // 30秒後にバナー広告を表示
    setTimeout(() => {
        adMobManager.showBannerAd();
    }, 30000);
});