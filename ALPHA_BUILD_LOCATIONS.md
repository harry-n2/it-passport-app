# Alpha版テスト用ビルドファイル保存場所

## 📁 メインビルドファイル保存場所

### AAB（Android App Bundle）ファイル
```
📍 プライマリ保存場所:
C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\release\app-release.aab

📍 デバッグ版:
C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\debug\app-debug.aab
```

### 署名付きAABファイル（本番用）
```
📍 署名後の保存場所:
C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\release\app-release-signed.aab
（Android Studioで署名後に生成）
```

## 🔨 ビルド手順

### 1. 最新ビルド作成
```bash
# プロジェクトルートから
cd C:\Users\naoya\myproject\demo

# Capacitorビルド
npx cap build android

# Android Studioで開く
npx cap open android
```

### 2. Android Studioでの署名付きAAB作成
1. **Build** → **Generate Signed Bundle / APK**
2. **Android App Bundle** を選択
3. **Next** をクリック
4. Keystoreファイルを選択:
   ```
   Keystore Path: C:\Users\naoya\myproject\demo\android\app\release-key.jks
   Key Alias: release
   ```
5. **Release** ビルドタイプを選択
6. **Finish** をクリック

### 3. 生成されたファイルの場所
```
📁 署名付きAAB:
C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\release\
├── app-release.aab          # 署名付きAAB
├── output-metadata.json     # ビルド情報
└── mapping.txt             # ProGuardマッピング（有効時）
```

## 📤 Google Play Console アップロード手順

### Alpha版（クローズドテスト）アップロード
1. **Google Play Console** にアクセス
2. アプリを選択
3. **リリース** → **テスト** → **クローズドテスト**
4. **Alpha** トラックを選択
5. **新しいリリースを作成**
6. AABファイルをアップロード:
   ```
   ファイル: app-release.aab
   場所: C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\release\
   ```

### ファイルサイズ確認
```bash
# 現在のAABファイルサイズ確認
ls -lh "C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\release\app-release.aab"
```
現在のファイルサイズ: **約8.5MB**

## 📋 アップロード前チェックリスト

### 必須確認項目
- [ ] バージョンコード（versionCode）が前回より大きい
- [ ] バージョン名（versionName）が更新されている
- [ ] 署名が正しく適用されている
- [ ] AdMob App IDが設定されている
- [ ] 必要な権限が追加されている

### 現在の設定値
```
Application ID: com.itpassport.app
Version Code: 10
Version Name: 1.0.0-alpha2
Min SDK: 24
Target SDK: 34
```

## 🔄 継続的なアップデート手順

### 新しいAlpha版リリース時
1. **バージョン更新**:
   ```gradle
   // android/app/build.gradle
   versionCode 11    // 前回より +1
   versionName "1.0.0-alpha3"  // バージョン名更新
   ```

2. **ビルド実行**:
   ```bash
   npx cap build android
   # Android Studioで署名付きAAB作成
   ```

3. **アップロード**:
   - 新しいAABファイルをGoogle Play Consoleにアップロード
   - リリースノートを追加
   - テストユーザーに配信

## 📁 バックアップ推奨

### 重要ファイルのバックアップ
```
📁 署名キー:
C:\Users\naoya\myproject\demo\android\app\release-key.jks
C:\Users\naoya\myproject\demo\android\app\release-key.properties

📁 ビルドファイル:
C:\Users\naoya\myproject\demo\android\app\build\outputs\bundle\release\
```

## 🚨 注意事項

### セキュリティ
- **署名キーファイル**は絶対にGitにコミットしない
- **Keystoreパスワード**を安全に管理
- **本番用API Key**の設定を忘れずに

### Google Play Console
- **内部テスト** → **Alpha** → **Beta** → **本番** の順序でテスト
- テストユーザーのメールアドレスを事前に登録
- 各段階でのフィードバック収集を実施

---

## 🔗 関連ファイル
- `BUILD_AAB_INSTRUCTIONS.md` - 詳細なビルド手順
- `GOOGLE_PLAY_CONSOLE_SETUP.md` - Google Play Console設定
- `MONETIZATION_SETUP_GUIDE.md` - 広告・課金設定