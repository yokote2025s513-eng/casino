# 🎰 Casino Night — 文化祭サイト セットアップガイド

## ファイル構成

```
casino-fes/
├── index.html          ← TOPページ（待ち時間・ランキングTop5）
├── ranking.html        ← 全ゲームランキング（公開向け）
├── style.css           ← 共通スタイル
├── firebase-config.js  ← Firebase設定（要書き換え）
├── common.js           ← 共通ユーティリティ
├── firestore.rules     ← Firestoreセキュリティルール
└── admin/
    ├── ranking.html    ← ランキング登録・編集・削除
    └── reserve.html    ← 整理番号発行・来場者数・待ち時間管理
```

---

## 🔥 Firebaseセットアップ手順

### 1. Firebaseプロジェクト作成
1. https://console.firebase.google.com にアクセス
2. 「プロジェクトを追加」→ プロジェクト名を入力（例: casino-fes-2025）
3. Google アナリティクスはOFF（不要）でOK

### 2. Firestoreを有効化
1. 左メニュー「Firestore Database」→「データベースを作成」
2. 本番環境モードで作成
3. リージョン: `asia-northeast1`（東京）を選択

### 3. Webアプリを登録
1. プロジェクトの歯車 → 「プロジェクトの設定」
2. 「アプリを追加」→ Webアイコン `</>`
3. アプリ名を入力（例: casino-fes-web）
4. 表示される `firebaseConfig` をコピー

### 4. firebase-config.js を書き換え
```javascript
const firebaseConfig = {
  apiKey: "実際の値に置き換え",
  authDomain: "実際の値に置き換え",
  projectId: "実際の値に置き換え",
  storageBucket: "実際の値に置き換え",
  messagingSenderId: "実際の値に置き換え",
  appId: "実際の値に置き換え"
};
```

### 5. Firestoreルールを設定
1. Firestore → 「ルール」タブ
2. `firestore.rules` の内容を貼り付けて「公開」

---

## 🌐 GitHub Pages公開手順

### 1. GitHubリポジトリ作成
```bash
git init
git add .
git commit -m "初回コミット: Casino Night 文化祭サイト"
```

### 2. GitHubにプッシュ
1. GitHub.com で新しいリポジトリを作成（例: `casino-fes`）
2. プッシュ:
```bash
git remote add origin https://github.com/あなたのID/casino-fes.git
git branch -M main
git push -u origin main
```

### 3. GitHub Pages設定
1. リポジトリ → Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)` → Save
4. 数分後に `https://あなたのID.github.io/casino-fes/` で公開

---

## 📱 ページ一覧とURL

| ページ | URL | 用途 |
|--------|-----|------|
| TOP | `/index.html` | 来場者向けトップ |
| ランキング | `/ranking.html` | 来場者向けランキング表示 |
| Admin:Ranking | `/admin/ranking.html` | スタッフ：スコア登録・編集・削除 |
| Admin:Reserve | `/admin/reserve.html` | スタッフ：整理番号・来場者数・待ち時間 |

---

## 🗃 Firestoreコレクション構造

### rankings
```
{
  gameId: "poker" | "blackjack" | "chinchiro" | "keiba",
  name: "参加者名",
  score: 1500,
  note: "メモ（任意）",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### waitTimes / {gameId}
```
{
  minutes: 10,
  status: "open" | "busy" | "full",
  updatedAt: Timestamp
}
```

### visitors / total
```
{
  count: 42,
  updatedAt: Timestamp
}
```

### reserves / {gameId}
```
{ next: 5 }  ← 次に発行する番号
```

### reserveHistory
```
{
  gameId: "poker",
  ticketId: "P-001",
  issuedAt: Timestamp
}
```

---

## 💡 当日の使い方

1. **スタッフ全員に `admin/reserve.html` のURLを共有**
2. 来場者が来たら「来場者数」をカウントアップ
3. ゲームごとに整理番号を発行（画面に大きく表示される）
4. 待ち時間が変わったら都度更新
5. ゲーム終了後は `admin/ranking.html` でスコアを登録
6. `ranking.html` と `index.html` のランキングにリアルタイムで反映される

---

## ⚠️ 注意事項

- Adminページはパスワード保護なし。URLは関係者のみ共有すること
- 文化祭終了後はFirestoreのデータをバックアップ（エクスポート）してから削除推奨
- Firebaseの無料枠（Spark プラン）で十分動作します

---

## 🔄 v2: 1人複数ゲーム対応（変更点）

### 仕様変更
- **以前**: ニックネームはサイト全体でユニーク → 1人1ゲームのみ
- **現在**: ニックネームは**同一ゲーム内**でユニーク → 1人が複数ゲームに参加可能

### 変更ファイル

| ファイル | 変更内容 |
|----------|---------|
| `self-reserve.html` | ・ニックネームをセッションに記憶（2ゲーム目から自動入力）<br>・予約済みゲームに「予約済」バッジを表示<br>・来場者カウントは初回予約時のみ加算<br>・「別のゲームも予約する」ボタンを追加 |
| `admin-reserve.html` | ・重複チェックを「同一ゲーム内」に変更<br>・サジェストで他ゲーム予約済の名前も再入力可能に |
| `admin-ranking.html` | ・整理番号検索を複数ゲーム対応（現タブのゲームを優先マッチ）<br>・重複変数宣言のバグを修正 |
| `ranking.html` | ・名前検索で複数ゲームに登場する選手を1カードにまとめて表示 |

### Firestoreデータ構造（変更なし）
既存の `reserveHistory` コレクション構造はそのまま利用します。
同一ニックネーム × 異なる gameId のドキュメントが複数存在することが想定されます。
