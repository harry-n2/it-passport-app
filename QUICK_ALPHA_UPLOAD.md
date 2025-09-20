# 🚀 Alpha版クイックアップロードガイド

## 現在の状態
- **Current Version**: 1.0.0-alpha2 (versionCode: 10)
- **AABファイル場所**: `C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\release\app-release.aab`
- **ファイルサイズ**: 約8.5MB
- **新アイコン**: ✅ 適用済み
- **AdMob/RevenueCat**: ✅ 統合済み

## ⚡ 次回Alpha版アップロード（3分手順）

### Step 1: バージョン更新 (30秒)
```bash
# android/app/build.gradle を編集
versionCode 11                    # 10 → 11
versionName "1.0.0-alpha3"       # alpha2 → alpha3
```

### Step 2: ビルド実行 (1分)
```bash
cd C:\Users\naoya\myproject\demo
npx cap build android
npx cap open android
```

### Step 3: 署名付きAAB生成 (1分30秒)
Android Studioで:
1. **Build** → **Generate Signed Bundle / APK**
2. **Android App Bundle** → **Next**
3. Keystore選択 → **Release** → **Finish**

### Step 4: ファイル場所確認
```
📁 新しいAABファイル:
C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\release\app-release.aab
```

## 📤 Google Play Console直行ルート

### Alpha配信URL
```
https://play.google.com/console/developers/[YOUR_DEVELOPER_ID]/app/[YOUR_APP_ID]/tracks/alpha
```

### アップロード手順
1. **新しいリリースを作成**をクリック
2. **app-release.aab**をドラッグ&ドロップ
3. リリースノート記入:
   ```
   Alpha 3 更新内容:
   - 新しいアプリアイコンを適用
   - AdMob広告機能を統合
   - RevenueCat課金システムを統合
   - UIの改善とバグ修正
   ```
4. **リリースを確認** → **ロールアウトを開始**

## 📋 毎回のチェック項目

### ✅ 必須確認
- [ ] versionCodeが前回より大きい
- [ ] 署名が正常に完了している
- [ ] ファイルサイズが妥当（10MB以下推奨）
- [ ] テスト用AdMob IDから本番IDへ変更済み
- [ ] RevenueCat API Keyが本番用

### ⚠️ Alpha版注意事項
- テストユーザー限定配信
- 24時間以内にGoogle Playで配信開始
- クラッシュレポート・ANR監視は必須

## 🔄 次回以降のバージョン番号

| Alpha版 | versionCode | versionName |
|---------|-------------|-------------|
| 現在    | 10          | 1.0.0-alpha2 |
| 次回    | 11          | 1.0.0-alpha3 |
| その次  | 12          | 1.0.0-alpha4 |
| Beta移行| 20          | 1.0.0-beta1  |

## 🚨 緊急時の対応

### ビルドエラー時
```bash
# クリーンビルド
cd android
./gradlew clean
cd ..
npx cap build android
```

### 署名エラー時
```bash
# Keystoreファイル確認
ls -la android/app/release-key.*
```

### アップロードエラー時
- versionCodeの重複確認
- AABファイルサイズ確認（100MB制限）
- 権限・メタデータの競合確認

---

## 📞 サポート情報
- **ビルド関連**: `BUILD_AAB_INSTRUCTIONS.md`
- **Play Console**: `GOOGLE_PLAY_CONSOLE_SETUP.md`
- **収益化**: `MONETIZATION_SETUP_GUIDE.md`
- **全体設定**: `ALPHA_BUILD_LOCATIONS.md`