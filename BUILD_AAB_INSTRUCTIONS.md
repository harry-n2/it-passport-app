# App Bundle (AAB) 生成手順

## 🎯 概要
Google Play ConsoleにアップロードするApp Bundle (AAB) ファイルの生成方法です。

---

## 📋 事前確認

### 1. 署名キーの準備
リリース用の署名キーが必要です。まだ作成していない場合：

```bash
cd "C:\Users\naoya\myproject\demo\android\app"
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias release-key
```

### 2. 署名設定ファイル作成
`C:\Users\naoya\myproject\demo\android\app\release-key.properties`
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD  
keyAlias=release-key
storeFile=release-key.jks
```

---

## 🔨 App Bundle 生成

### Step 1: プロジェクト同期
```bash
cd "C:\Users\naoya\myproject\demo"
npx cap sync android
```

### Step 2: App Bundle ビルド

#### デバッグ版 (テスト用)
```bash
cd "C:\Users\naoya\myproject\demo\android"
./gradlew.bat bundleDebug
```
**生成場所**: `app/build/outputs/bundle/debug/app-debug.aab`

#### リリース版 (本番用)
```bash
cd "C:\Users\naoya\myproject\demo\android"
./gradlew.bat bundleRelease
```  
**生成場所**: `app/build/outputs/bundle/release/app-release.aab`

### Step 3: ファイル確認
```bash
ls -la "app/build/outputs/bundle/release/"
```

---

## 📁 ファイル配置構造

```
C:\Users\naoya\myproject\demo\android\
├── app\
│   ├── build\
│   │   └── outputs\
│   │       └── bundle\
│   │           ├── debug\
│   │           │   └── app-debug.aab        ← デバッグ版
│   │           └── release\
│   │               └── app-release.aab      ← リリース版 ★
│   ├── release-key.jks                      ← 署名キー
│   └── release-key.properties               ← 署名設定
└── ...
```

---

## ⚠️ 注意点

### 署名について
- **デバッグ版**: 自動で開発用署名
- **リリース版**: 手動で本番用署名が必要

### ファイルサイズ
- 通常 10-50MB程度
- 100MBを超える場合は要確認

### バージョン確認
生成されたAABファイルのバージョンを確認：
```bash
aapt2 dump badging app-release.aab | grep version
```

---

## 🚀 Google Play Console アップロード

### 1. Play Console にログイン
```
https://play.google.com/console/
```

### 2. アプリを選択
- [リリース] → [テスト] → [クローズドテスト] → [Alpha]

### 3. 新しいリリースを作成
- [新しいリリースを作成] をクリック

### 4. App Bundle アップロード
- **ファイル**: `app-release.aab` をドラッグ&ドロップ
- **アップロード時間**: 数分〜10分程度

### 5. リリースノート入力
```
Alpha v1.0.0-alpha1

■ 新機能
• ITパスポート過去問500問を収録
• ランダム出題・年度別出題機能  
• 学習進捗管理機能
• AdMob広告表示機能
• プレミアム版課金機能

■ テスト項目
• 基本的な問題出題・回答
• 広告表示タイミング
• 課金フローの確認
• UI/UX使いやすさ
• パフォーマンス・安定性

テスターの皆様、フィードバックをお待ちしております！
```

### 6. リリース実行
- [リリースを確認] → [Alpha にリリース]

---

## 🐛 トラブルシューティング

### ビルドエラー
```
FAILURE: Build failed with an exception.
```
**対処法**:
1. `./gradlew.bat clean` でクリーン
2. Android SDK のバージョン確認
3. Java バージョンの確認

### 署名エラー  
```
Execution failed for task ':app:bundleRelease'
```
**対処法**:
1. 署名ファイルのパス確認
2. パスワードの再確認
3. キーストアファイルの存在確認

### アップロードエラー
```
Upload failed
```
**対処法**:
1. ファイルサイズの確認（100MB以下）
2. 同じversionCodeの重複確認
3. ネットワーク接続の確認

---

## 📊 ファイル情報確認

### AABファイルの詳細確認
```bash
# ファイルサイズ確認
ls -lh app/build/outputs/bundle/release/app-release.aab

# パッケージ情報確認  
aapt2 dump badging app-release.aab

# 署名確認
jarsigner -verify app-release.aab
```

### バージョン情報
- **アプリ名**: ITパスポート過去問アプリ (Alpha)
- **パッケージ名**: com.itpassport.app  
- **バージョン名**: 1.0.0-alpha1
- **バージョンコード**: 2

---

**✅ 上記手順でApp Bundleを生成し、Google Play Consoleにアップロードできます！**