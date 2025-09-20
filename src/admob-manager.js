import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdOptions, RewardAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

class AdMobManager {
    constructor() {
        this.isInitialized = false;
        this.testMode = true; // 本番では false に変更
        this.adUnitIds = {
            banner: this.testMode ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-YOUR-PUBLISHER-ID/BANNER-AD-UNIT-ID',
            interstitial: this.testMode ? 'ca-app-pub-3940256099942544/1033173712' : 'ca-app-pub-YOUR-PUBLISHER-ID/INTERSTITIAL-AD-UNIT-ID',
            reward: this.testMode ? 'ca-app-pub-3940256099942544/5224354917' : 'ca-app-pub-YOUR-PUBLISHER-ID/REWARD-AD-UNIT-ID'
        };
    }

    async initialize() {
        if (!Capacitor.isNativePlatform()) {
            console.log('AdMob is only available on native platforms');
            return;
        }

        try {
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                testingDevices: this.testMode ? ['YOUR_TEST_DEVICE_ID'] : [],
                initializeForTesting: this.testMode
            });
            
            this.isInitialized = true;
            console.log('AdMob initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AdMob:', error);
        }
    }

    async showBanner() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const options = {
            adId: this.adUnitIds.banner,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: this.testMode
        };

        try {
            await AdMob.showBanner(options);
            console.log('Banner ad shown');
        } catch (error) {
            console.error('Failed to show banner ad:', error);
        }
    }

    async hideBanner() {
        try {
            await AdMob.hideBanner();
            console.log('Banner ad hidden');
        } catch (error) {
            console.error('Failed to hide banner ad:', error);
        }
    }

    async showInterstitial() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const options = {
            adId: this.adUnitIds.interstitial,
            isTesting: this.testMode
        };

        try {
            await AdMob.prepareInterstitial(options);
            await AdMob.showInterstitial();
            console.log('Interstitial ad shown');
        } catch (error) {
            console.error('Failed to show interstitial ad:', error);
        }
    }

    async showRewardAd() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const options = {
            adId: this.adUnitIds.reward,
            isTesting: this.testMode
        };

        try {
            await AdMob.prepareRewardVideoAd(options);
            const result = await AdMob.showRewardVideoAd();
            
            if (result.rewarded) {
                console.log('User earned reward');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to show reward ad:', error);
            return false;
        }
    }

    // 広告なし購入後に呼び出す
    async disableAds() {
        try {
            await this.hideBanner();
            console.log('Ads disabled');
        } catch (error) {
            console.error('Failed to disable ads:', error);
        }
    }
}

export default new AdMobManager();