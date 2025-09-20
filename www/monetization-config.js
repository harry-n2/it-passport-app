// 収益化設定ファイル
const MONETIZATION_CONFIG = {
    // AdMob設定
    admob: {
        // テスト用ID (本番時は変更必須)
        appId: 'ca-app-pub-3940256099942544~3347511713',
        bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
        interstitialAdId: 'ca-app-pub-3940256099942544/1033173712',
        rewardedAdId: 'ca-app-pub-3940256099942544/5224354917',
        
        // 本番用ID (設定時にコメントアウトを解除)
        // appId: 'ca-app-pub-YOUR_PUBLISHER_ID~YOUR_APP_ID',
        // bannerAdId: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_BANNER_ID',
        // interstitialAdId: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_INTERSTITIAL_ID',
        // rewardedAdId: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_REWARDED_ID',
        
        testMode: true, // 本番時はfalseに変更
        showBannerDelay: 30000, // バナー表示までの遅延（ミリ秒）
        interstitialFrequency: 5, // インタースティシャル広告の表示頻度（問題数）
    },

    // RevenueCat設定
    revenueCat: {
        apiKey: 'YOUR_REVENUECAT_API_KEY', // RevenueCatダッシュボードから取得
        // 本番時は実際のAPIキーに変更
        
        products: {
            premiumVersion: 'premium_version', // 商品ID
            // Google Play Consoleで設定する商品ID
        },
        
        testMode: true, // 本番時はfalseに変更
    },

    // プレミアム機能の価格
    pricing: {
        premiumVersion: {
            price: 480,
            currency: 'JPY',
            displayPrice: '¥480'
        }
    },

    // 広告表示の条件
    adDisplayRules: {
        minQuestionsBeforeAd: 3, // 広告表示前の最小問題数
        maxAdsPerSession: 3, // セッションあたりの最大広告数
        adFrequency: 5, // 何問ごとに広告を表示するか
    }
};

// 本番/開発環境の自動判定
const isProduction = location.hostname !== 'localhost' && 
                    location.protocol === 'https:' &&
                    !location.hostname.includes('192.168');

if (isProduction) {
    MONETIZATION_CONFIG.admob.testMode = false;
    MONETIZATION_CONFIG.revenueCat.testMode = false;
}

// グローバルに設定を公開
window.MONETIZATION_CONFIG = MONETIZATION_CONFIG;