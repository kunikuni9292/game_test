# Rolling Ball Game

Going Ballsにインスパイアされた3Dボール転がしゲームです。

## 🎮 ゲームの特徴

- 🎮 3D物理エンジンを使用したリアルなボール転がし
- 🎯 レベルごとに異なるステージと障害物
- 🎨 美しい3Dグラフィックスとライティング
- 📱 マウス、キーボード、タッチ操作に対応
- 🌐 GitHub Pagesでデプロイ可能

## 🛠️ 技術スタック

### 推奨構成：Web技術（HTML5 + Three.js）
Going Ballsのような3Dボール転がしゲームには、**HTML5 + Three.js + Cannon.js**の組み合わせが最適です。

#### フロントエンド
- **HTML5**: セマンティックなマークアップ
- **CSS3**: レスポンシブデザインとアニメーション
- **JavaScript (ES6+)**: モダンなJavaScript機能

#### 3Dグラフィックス
- **Three.js**: 3Dレンダリングとシーン管理
- **WebGL**: ハードウェアアクセラレーション

#### 物理エンジン
- **Cannon.js**: リアルな物理シミュレーション
- **重力、摩擦、衝突検出**: 本格的な物理演算

#### ビルドツール
- **Vite**: 高速開発サーバーとバンドリング
- **ES Modules**: モジュール化されたコード構造

#### パッケージ管理
- **npm**: 依存関係の管理
- **package.json**: プロジェクト設定

#### ホスティング
- **GitHub Pages**: 静的サイトホスティング
- **gh-pages**: 自動デプロイツール

## 操作方法

- **マウス**: ドラッグしてボールを操作
- **キーボード**: WASDキーまたは矢印キーで移動
- **ジャンプ**: スペースキー
- **モバイル**: タッチで操作

## 開発環境のセットアップ

### 必要な環境
- Node.js (v16以上)
- npm または yarn

### インストール
```bash
npm install
```

### 開発サーバーの起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### GitHub Pagesへのデプロイ
```bash
npm run deploy
```

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **3Dグラフィックス**: Three.js
- **物理エンジン**: Cannon.js
- **ビルドツール**: Vite
- **ホスティング**: GitHub Pages

## 📁 プロジェクト構成

```
game_test/
├── index.html              # メインHTMLファイル
├── package.json            # プロジェクト設定と依存関係
├── vite.config.js          # Vite設定（GitHub Pages対応）
├── .gitignore             # Git除外ファイル
├── README.md              # プロジェクト説明書
└── src/
    ├── js/
    │   ├── main.js         # メインゲームループ
    │   ├── ball.js         # ボールクラス（物理・描画）
    │   ├── level.js        # レベル管理（ステージ生成）
    │   ├── physics.js      # 物理エンジン設定
    │   └── controls.js     # 入力制御（キーボード・マウス・タッチ）
    ├── css/
    │   └── style.css       # スタイル（レスポンシブ対応）
    └── assets/             # アセット（将来追加予定）
        ├── models/         # 3Dモデル
        ├── textures/       # テクスチャ
        └── sounds/         # 音声ファイル
```

### ファイル説明
- **main.js**: ゲームのメインループ、シーン管理、カメラ制御
- **ball.js**: ボールの物理特性、描画、アニメーション
- **level.js**: ステージ生成、障害物管理、ゴール判定
- **physics.js**: Cannon.js物理エンジンの設定と管理
- **controls.js**: キーボード、マウス、タッチ入力の処理

## ライセンス

MIT License
