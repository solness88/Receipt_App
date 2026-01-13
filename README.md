# 領収書作成アプリ

TypeScript + Reactで作成した領収書作成・PDF生成アプリケーション

## 機能

- 領収書情報の入力フォーム
- リアルタイムプレビュー表示
- PDF自動生成・ダウンロード
- 日本語完全対応
- 会社ロゴ・印鑑の表示
- ローカル完結（サーバー不要）

## 技術スタック

- **React 19** - UIフレームワーク
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **jsPDF** - PDF生成
- **html2canvas** - HTML→画像変換（日本語対応）

## セットアップ

### 1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/receipt-app.git
cd receipt-app
```

### 2. 依存関係をインストール
```bash
npm install
```

### 3. 会社情報の設定
```bash
cp src/companyConfig.sample.ts src/companyConfig.ts
```

`src/companyConfig.ts`を開いて、自分の会社情報に書き換えてください：
```typescript
export const COMPANY_INFO = {
  name: "あなたの会社名",
  postal: "000-0000",
  address: "東京都XX区XX1-1-1",
  building: "XXビル000号室",
  tel: "00-0000-0000"
};
```

### 4. 会社ロゴと印鑑の配置（任意）

以下の画像を配置してください：

- `public/logo.jpg` - 会社ロゴ（右上に表示）
- `public/stamp.jpg` - 会社印鑑（右下に表示）

**注意:** これらの画像はgitignoreされているため、各自で用意する必要があります。

### 5. 開発サーバー起動
```bash
npm run dev
```

ブラウザで `http://localhost:5173/` を開いてください。


**注意:** ポート5173が既に使用中の場合、別のポート番号（5174など）になります。
ターミナルに表示されるURLを確認してください。

## 使い方

1. **入力フォームに記入**
   - 宛名（必須）
   - 発行日（必須）
   - 通し番号（1-10から選択）
   - 金額（必須）
   - 但し書き（必須）
   - 備考（任意）

2. **プレビュー確認**
   - 右側に領収書がリアルタイム表示されます

3. **PDF生成**
   - 「PDFをダウンロード」ボタンをクリック
   - ファイル名: `2026Jan11_15000_株式会社ABC様_発行領収書.pdf`

## プロジェクト構造
```
receipt-app/
├── public/
│   ├── logo.jpg          # 会社ロゴ（gitignore）
│   └── stamp.jpg         # 会社印鑑（gitignore）
├── src/
│   ├── App.tsx           # メインコンポーネント
│   ├── App.css           # スタイル
│   ├── types.ts          # 型定義
│   ├── utils.ts          # ユーティリティ関数
│   ├── pdfGenerator.ts   # PDF生成ロジック
│   ├── companyConfig.ts  # 会社情報（gitignore）
│   └── companyConfig.sample.ts  # 会社情報テンプレート
├── .gitignore
├── package.json
└── README.md
```

## 開発コマンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルド結果のプレビュー
```

## 機密情報の管理

以下のファイルは`.gitignore`で除外されています：

- `src/companyConfig.ts` - 実際の会社情報
- `public/logo.jpg` - 会社ロゴ
- `public/stamp.jpg` - 会社印鑑

これらはローカルにのみ存在し、GitHubには公開されません。

## 今後の予定

- [ ] 設定画面の追加（会社情報をUIで設定可能に）
- [ ] 宛名の登録・管理機能
- [ ] Electronデスクトップアプリ化
- [ ] 印刷機能
