# 📱 ITパスポート過去問アプリ

業界最多500問で確実合格を目指すITパスポート学習アプリ

![ITパスポート](https://img.shields.io/badge/ITパスポート-対策アプリ-blue)
![PWA](https://img.shields.io/badge/PWA-対応-green)
![問題数](https://img.shields.io/badge/問題数-500問-red)

## 🚀 特徴

### 📚 圧倒的なコンテンツ量
- **500問の充実した過去問**（2014年〜2023年）
- **業界最多レベル**の問題数で確実合格をサポート
- **最新技術重点**：生成AI、Web3.0、DX、メタバースなど

### 📱 PWA対応
- **アプリのようにインストール可能**
- **オフライン対応**でいつでも学習
- **iOS・Android両対応**

### 💰 柔軟な料金設定
- **基本機能は無料**
- **広告オフ**: ¥680（買い切り）
- **模擬試験パック**: ¥980

## 🎯 技術仕様

### フロントエンド
- **HTML5/CSS3/JavaScript**（バニラJS）
- **PWA対応**（Service Worker + Manifest）
- **レスポンシブデザイン**

### 決済システム
- **Stripe統合**
- **日本円対応**
- **安全な決済処理**

### SEO最適化
- **構造化データ**
- **OGP対応**
- **モバイルファースト**

## 📊 問題構成

| 年度 | 問題数 | 主要技術分野 |
|------|--------|-------------|
| 2023 | 50問 | 生成AI、Web3.0、NFT、メタバース |
| 2022 | 50問 | テレワーク、DX、ESG |
| 2021 | 50問 | DX基盤、デジタル庁、AI倫理 |
| 2020 | 50問 | 5G、クラウドファースト、IoT |
| 2019 | 50問 | AI基礎、ブロックチェーン |
| 2018 | 50問 | オープンソース、TCO |
| 2017 | 50問 | システム信頼性、SLA |
| 2016 | 50問 | SOA、BPR |
| 2015 | 50問 | ナレッジマネジメント |
| 2014 | 50問 | グリーンIT、システム監査 |

## 🛠 セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/your-username/it-passport-app.git
cd it-passport-app
```

### 2. ローカル環境での実行
```bash
# 簡易サーバーの起動（Python）
python -m http.server 8000

# または Node.js
npx serve .
```

### 3. ブラウザでアクセス
```
http://localhost:8000
```

## 🔧 本番環境デプロイ

### Vercel（推奨）
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### GitHub Pages
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root

## ⚙️ 設定

### Stripe設定
1. [Stripe Dashboard](https://dashboard.stripe.com/)でアカウント作成
2. APIキーを取得
3. `it-passport-simple.html`の`YOUR_PUBLISHABLE_KEY_HERE`を実際のキーに置換

### Google Analytics設定
1. [Google Analytics](https://analytics.google.com/)でプロパティ作成
2. 測定IDを取得
3. `index.html`の`GA_MEASUREMENT_ID`を実際のIDに置換

## 📁 ファイル構成

```
├── index.html              # ランディングページ
├── it-passport-simple.html # メインアプリ
├── manifest.json           # PWA設定
├── service-worker.js       # オフライン対応
├── success.html           # 決済完了ページ
├── privacy.html           # プライバシーポリシー
├── terms.html             # 利用規約
└── README.md              # このファイル
```

## 💡 主な機能

### 学習機能
- ✅ ランダム出題（10問）
- ✅ 年度別出題（2014-2023）
- ✅ 模擬試験（50問・有料）
- ✅ 詳細解説付き

### 進捗管理
- ✅ 正答率の記録
- ✅ 学習時間の計測
- ✅ 連続学習日数
- ✅ 獲得ポイント

### その他
- ✅ SNSシェア機能
- ✅ 今日の1問通知
- ✅ オフライン対応

## 📈 収益モデル

### 無料プラン
- 基本問題200問
- 広告表示あり

### 有料オプション
- **広告オフ**: ¥680
- **模擬試験パック**: ¥980

### 収益予測
| 期間 | 月間訪問者 | 課金率 | 月収 |
|------|------------|--------|------|
| 1ヶ月 | 5,000人 | 2% | 10万円 |
| 3ヶ月 | 20,000人 | 3% | 60万円 |
| 6ヶ月 | 50,000人 | 4% | 200万円 |
| 1年 | 100,000人 | 5% | 500万円 |

## 🎯 マーケティング戦略

### SEO対策
- ITパスポート関連キーワード最適化
- 構造化データによる検索結果強化
- 高品質コンテンツによる自然流入増加

### 広告戦略
- Google広告（検索連動型）
- YouTube広告（IT学習者向け）
- SNS広告（Twitter、Instagram）

## 📝 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照

## 👥 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

- **Email**: support@example.com
- **Issues**: [GitHub Issues](https://github.com/your-username/it-passport-app/issues)

## 🏆 実績

- ✅ **500問の過去問**完全収録
- ✅ **PWA対応**でアプリライクな体験
- ✅ **Stripe決済**統合完了
- ✅ **SEO最適化**済み

---

**🚀 今すぐ始めよう！[デモを見る](https://your-domain.com)**