# ITパスポートアプリ - 広告・課金設定ガイド

## 概要
このガイドでは、ITパスポートアプリにGoogle AdMob広告とIn App Purchase（課金システム）を設定する手順を説明します。

## 技術構成
- **フレームワーク**: Capacitor
- **広告**: Google AdMob (@capacitor-community/admob)
- **課金**: RevenueCat (@revenuecat/purchases-capacitor)
- **プラットフォーム**: Android (iOS対応可能)

## 1. Google AdMob設定

### 1.1 AdMob管理画面での設定
1. [Google AdMob](https://admob.google.com/)にアクセス
2. 「アプリを追加」で新しいアプリを登録
3. 以下の広告ユニットを作成：
   - バナー広告
   - インタースティシャル広告
   - リワード広告

### 1.2 アプリIDと広告ユニットIDの取得
```
App ID: ca-app-pub-[YOUR-PUBLISHER-ID]~[YOUR-APP-ID]
Banner ID: ca-app-pub-[YOUR-PUBLISHER-ID]/[BANNER-AD-UNIT-ID]
Interstitial ID: ca-app-pub-[YOUR-PUBLISHER-ID]/[INTERSTITIAL-AD-UNIT-ID]
Reward ID: ca-app-pub-[YOUR-PUBLISHER-ID]/[REWARD-AD-UNIT-ID]
```

### 1.3 コード内のID更新
`src/admob-manager.js`のテスト用IDを本番用IDに変更：
```javascript
this.testMode = false; // 本番時はfalseに変更
this.adUnitIds = {
    banner: 'ca-app-pub-YOUR-PUBLISHER-ID/BANNER-AD-UNIT-ID',
    interstitial: 'ca-app-pub-YOUR-PUBLISHER-ID/INTERSTITIAL-AD-UNIT-ID',
    reward: 'ca-app-pub-YOUR-PUBLISHER-ID/REWARD-AD-UNIT-ID'
};
```

## 2. RevenueCat設定

### 2.1 RevenueCat管理画面での設定
1. [RevenueCat](https://www.revenuecat.com/)でアカウント作成
2. 新しいアプリを追加
3. Google Play Consoleと連携設定

### 2.2 商品設定
Google Play Consoleで以下の商品を作成：
- `com.itpassport.app.ad_free` - 広告オフ (¥680)
- `com.itpassport.app.mock_test` - 模擬テスト (¥980)
- `com.itpassport.app.premium` - プレミアム (¥1,480)

### 2.3 API Key設定
`src/purchase-manager.js`のAPI Keyを更新：
```javascript
this.apiKey = 'YOUR_REVENUECAT_API_KEY';
```

## 3. Google Play Console設定

### 3.1 アプリ署名
1. Google Play Consoleでアプリを作成
2. アプリ署名を有効化
3. 署名済みAPKをアップロード

### 3.2 課金商品設定
「収益化 > アプリ内商品」で商品を作成：
- 商品ID、価格、説明を設定
- テスト用アカウントを追加

## 4. ビルド・デプロイ手順

### 4.1 依存関係の確認
```bash
npm install
```

### 4.2 Androidビルド
```bash
npx cap build android
npx cap open android
```

### 4.3 署名付きAAB作成
Android Studioで：
1. Build > Generate Signed Bundle / APK
2. Android App Bundle選択
3. Keystoreファイルを選択
4. Release版でビルド

## 5. テスト手順

### 5.1 AdMobテスト
- テストデバイスIDを設定
- テスト広告が表示されることを確認
- 広告クリックが正常に動作することを確認

### 5.2 課金テスト
- Google Play Consoleでテスト用アカウントを設定
- 内部テスト版をアップロード
- テスト購入が正常に完了することを確認

## 6. 本番リリース準備

### 6.1 設定値の変更
- AdMobのtestModeをfalseに変更
- 本番用の広告ユニットIDに変更
- RevenueCatのAPI Keyを本番用に変更

### 6.2 プライバシーポリシー
- AdMobとRevenueCatのデータ収集に関する記載を追加
- Google Play Consoleでプライバシーポリシーを設定

## 7. ファイル構成

```
src/
├── admob-manager.js         # AdMob広告管理
├── purchase-manager.js      # RevenueCat課金管理
├── app-manager.js          # 統合管理
└── styles/
    └── purchase-ui.css     # UI関連スタイル

android/
└── app/
    ├── build.gradle        # 依存関係設定
    └── src/main/
        └── AndroidManifest.xml  # 権限・AdMob設定
```

## 8. 重要な注意事項

### 8.1 セキュリティ
- API KeyやシークレットをGitにコミットしない
- 本番環境では必ず本番用の認証情報を使用

### 8.2 法的要件
- プライバシーポリシーの更新必須
- 特定商取引法に基づく表記が必要
- 消費者保護法への準拠

### 8.3 ストア審査
- Google Play Consoleの広告・課金ポリシーを確認
- 年齢制限や対象地域の設定
- アプリの説明文で課金要素について明記

## 9. サポート・トラブルシューティング

### 9.1 よくある問題
- 広告が表示されない → App IDと広告ユニットIDを確認
- 課金が失敗する → Google Play Consoleの商品設定を確認
- ビルドエラー → 依存関係のバージョンを確認

### 9.2 ログ確認
```javascript
// デバッグモードでログを確認
console.log('AdMob initialized:', AdMobManager.isInitialized);
console.log('Purchase status:', PurchaseManager.checkPurchaseStatus('ad_free'));
```

### 9.3 参考リンク
- [AdMob公式ドキュメント](https://developers.google.com/admob)
- [RevenueCat公式ドキュメント](https://docs.revenuecat.com/)
- [Google Play Console ヘルプ](https://support.google.com/googleplay/android-developer/)

---

## 更新履歴
- 2025-09-03: 初版作成
- Google AdMob設定完了
- RevenueCat統合完了
- Android設定完了