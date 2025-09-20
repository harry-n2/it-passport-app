# 🔐 Google Play Console初回アップロード署名キー作成手順

## 🚨 現在の問題
Google Play Consoleが「アップロードしたすべてのバンドルに署名する必要があります」と表示しているのは、初回アップロード時にアプリ署名の設定が必要だからです。

## 📋 必要な手順

### Step 1: Google Play Consoleでアプリ署名設定確認
1. **Google Play Console** → あなたのアプリ
2. **リリース** → **設定** → **アプリ署名**
3. アプリ署名の状態を確認

### Step 2: アップロード証明書の作成

新しいアップロード証明書を作成して、Google Play Consoleに登録します：

```bash
# 新しいアップロード証明書を作成
cd C:\Users\naoya\myproject\demo\android\app
keytool -genkeypair -alias upload -keyalg RSA -keysize 2048 -validity 9125 \
  -keystore upload-keystore.jks \
  -storepass "YourSecurePassword123" \
  -keypass "YourSecurePassword123" \
  -dname "CN=IT Passport App, OU=Development, O=IT Passport, L=Tokyo, ST=Tokyo, C=JP"
```

### Step 3: アップロード証明書をエクスポート

```bash
keytool -export -rfc -alias upload -keystore upload-keystore.jks \
  -storepass "YourSecurePassword123" -file upload_certificate.pem
```

### Step 4: Google Play Consoleでアプリ署名を設定

1. **アプリ署名** ページで **「Google Play アプリ署名を使用する」** を選択
2. **アップロード証明書をアップロード** で `upload_certificate.pem` をアップロード
3. 設定完了後、署名されたAABファイルをアップロード

## ⚡ 即座に実行する手順

現在のプロジェクトで実行可能な手順：

### 1. 確実な署名キーを作成
### 2. build.gradleで署名を有効化
### 3. 署名されたAABファイルを生成
### 4. Google Play Consoleでアップロード

## 🎯 解決の流れ

1. **署名キー作成** → **AABファイル署名** → **Play Consoleアップロード**
2. 初回のみこの手順が必要
3. 以降は同じ署名キーを使用

---

**重要**: この問題は初回アップロード時の一般的な設定手順です。正しく設定すれば今後は同じエラーは発生しません。