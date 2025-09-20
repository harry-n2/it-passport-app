# 🔐 署名キー問題の解決方法

## ⚠️ 現在の状況

### Google Play Consoleが要求する署名キー
```
要求されるSHA1: 63:15:73:75:36:71:C7:D7:71:33:50:C0:33:FD:A6:DB:EF:4A:70:84
```

### 現在利用可能な署名キー
```
現在のリリースキー SHA1: EF:ED:37:07:04:17:B1:D1:3E:69:38:C0:72:37:42:A0:56:91:62:8A
新しいアップロードキー SHA1: 33:4B:06:77:4F:29:09:01:04:42:7A:53:81:67:77:14:16:95:8A:04
デバッグキー SHA1: 06:89:2B:9B:34:4F:04:1F:B6:C2:E3:A3:83:6F:80:E6:30:CD:DA:65
```

## 🔧 解決方法

### 方法1: Google Play Consoleでアプリ署名をリセット (推奨)

1. **Google Play Console** にアクセス
2. **リリース** → **設定** → **アプリ署名**
3. **「アプリ署名証明書をリセット」** を選択
4. 新しいアップロードキーで署名したAABファイルをアップロード

### 方法2: 既存のリリースキーを使用

既存の `release-key.jks` を使ってビルドし直します。

```bash
# build.gradleを元のキーに戻す
storeFile=release-key.jks
keyAlias=release-key
```

### 方法3: Google Playサポートに連絡

要求されているSHA1フィンガープリントのキーが見つからない場合、Google Playサポートに連絡して、アプリ署名の状況を確認します。

## ⚡ 即座に試す方法

### Step 1: 元のキーに戻す
```bash
cd C:\Users\naoya\myproject\demo\android\app
# プロパティファイルを元に戻す
cp release-key.properties upload-keystore.properties
```

### Step 2: build.gradle更新
```gradle
def keystorePropertiesFile = rootProject.file("app/release-key.properties")
```

### Step 3: ビルド実行
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

## 🎯 推奨アクション

**最も確実な方法は、Google Play Consoleでアプリ署名をリセットすることです。**

1. Play Console → アプリ設定 → アプリ署名
2. 「Play アプリ署名を使用する」を選択
3. 新しいアップロード証明書として現在のキーを登録
4. 今後は現在のキーでアップロード可能

## 📞 サポート情報

この問題は一般的で、Google Play Consoleのヘルプセンターに詳細な解決方法があります：

- [アプリ署名に関するトラブルシューティング](https://support.google.com/googleplay/android-developer/answer/9842756)
- [署名証明書のリセット](https://support.google.com/googleplay/android-developer/answer/9842756)

---

**次のアクション**: Google Play Consoleでアプリ署名設定を確認し、必要に応じてリセットを実行してください。