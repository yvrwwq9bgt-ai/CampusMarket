# CampusMarket

大学生限定で、教科書や学生用品を大学内・大学周辺で売買できるフリマWebアプリのMVPです。React / Vite / TypeScript / Tailwind CSS を使い、現時点ではフロントエンド中心のローカルモックデータで動きます。

## 起動方法

```bash
npm install
npm run dev
```

開発サーバー起動後、表示された `http://localhost:5173` などのURLをブラウザで開いてください。

本番ビルド確認:

```bash
npm run build
```

## 主な機能

- トップページ: 検索、カテゴリ導線、人気商品、出品ボタン、学生限定の説明カード
- About Us: 大きなタイポグラフィと縦に読ませる構成で、CampusMarketの思想・仕組みを紹介
- 商品一覧: 商品カード、検索、カテゴリ絞り込み、大学名絞り込み
- 商品詳細: 画像、価格、説明、出品者、大学名、状態、受け渡し方法、購入希望、メッセージ、出品者向け管理表示
- ショップ開設: ショップ名、紹介文、受け渡し方、カバー画像、ロゴ画像を登録し、ショップ単位で出店
- 出品ページ: ショップ開設後、画像ファイルを最大5枚まで選択してプレビューし、ショップから商品を追加
- モック商品: 初期商品を110件用意し、カテゴリ・大学・ショップごとに探せる量を確保
- ログイン/登録: モック認証。大学メールによる学生確認の説明表示
- マイページ: ユーザー情報、ショップ管理、通知、プロフィール編集、出品商品、出品取り消し、再出品、取り消し済み商品の削除、購入希望商品、メッセージ履歴
- ショップページ: 学生ショップ単位で商品一覧、受け渡し場所、ルールを表示
- ローカル保存: 商品、ショップ、ログインユーザー、購入希望、通知、メッセージを `localStorage` に保存

## ディレクトリ構成

```text
src/
  components/        共通UIコンポーネント
  context/           ローカル状態管理
  data/              カテゴリ、大学、モック商品データ
  pages/             ルーティング単位の画面
  services/          将来APIやSupabase呼び出しへ置き換える境界
  types/             商品・ユーザーなどの型定義
  utils/             表示整形などの小さな関数
```

## Supabase テーブル設計案

### shops

| column | type | note |
| --- | --- | --- |
| id | uuid primary key | ショップID |
| owner_id | uuid references profiles(id) | ショップオーナー |
| name | text | ショップ名 |
| slug | text unique | ショップURL用識別子 |
| tagline | text | ひとこと |
| description | text | ショップ紹介 |
| university_name | text | 主な大学 |
| featured_category | text | メインカテゴリ |
| pickup_area | text | 主な受け渡し場所 |
| shipping_policy | text | 受け渡しルール |
| cover_image_url | text nullable | カバー画像 |
| logo_image_url | text nullable | ロゴ画像 |
| created_at | timestamptz | 作成日時 |
| updated_at | timestamptz | 更新日時 |

### profiles

| column | type | note |
| --- | --- | --- |
| id | uuid primary key | Supabase Auth の user id |
| display_name | text | 表示名 |
| email | text unique | 大学メール |
| university_name | text | 大学名 |
| verified_student | boolean | 学生確認済みか |
| avatar_url | text nullable | プロフィール画像 |
| created_at | timestamptz | 作成日時 |

### products

| column | type | note |
| --- | --- | --- |
| id | uuid primary key | 商品ID |
| seller_id | uuid references profiles(id) | 出品者 |
| title | text | 商品名 |
| price | integer | 価格 |
| category | text | 教科書、参考書など |
| condition | text | 商品状態 |
| university_name | text | 大学名 |
| delivery_method | text | 受け渡し方法 |
| description | text | 説明文 |
| image_url | text | 画像URL。MVPではアップロード画像をData URLとして保持 |
| image_urls | text[] | 複数画像を扱う場合の画像URL配列 |
| shop_id | uuid references shops(id) | 掲載先ショップ |
| status | text | available / reserved / sold / cancelled |
| created_at | timestamptz | 作成日時 |
| updated_at | timestamptz | 更新日時 |

### purchase_interests

| column | type | note |
| --- | --- | --- |
| id | uuid primary key | 購入希望ID |
| product_id | uuid references products(id) | 商品 |
| buyer_id | uuid references profiles(id) | 購入希望者 |
| status | text | interested / canceled / accepted |
| created_at | timestamptz | 作成日時 |

### notifications

| column | type | note |
| --- | --- | --- |
| id | uuid primary key | 通知ID |
| recipient_id | uuid references profiles(id) | 通知を受け取るユーザー |
| product_id | uuid references products(id) | 対象商品 |
| actor_id | uuid references profiles(id) | 通知の発生元ユーザー |
| type | text | purchase_interest など |
| title | text | 通知タイトル |
| body | text | 通知本文 |
| read | boolean | 既読か |
| created_at | timestamptz | 作成日時 |

### conversations

| column | type | note |
| --- | --- | --- |
| id | uuid primary key | 会話ID |
| product_id | uuid references products(id) | 対象商品 |
| buyer_id | uuid references profiles(id) | 購入希望者 |
| seller_id | uuid references profiles(id) | 出品者 |
| created_at | timestamptz | 作成日時 |

### messages

| column | type | note |
| --- | --- | --- |
| id | uuid primary key | メッセージID |
| conversation_id | uuid references conversations(id) | 会話 |
| sender_id | uuid references profiles(id) | 送信者 |
| body | text | 本文 |
| created_at | timestamptz | 送信日時 |

### payments

| column | type | note |
| --- | --- | --- |
| id | uuid primary key | 決済ID |
| product_id | uuid references products(id) | 商品 |
| buyer_id | uuid references profiles(id) | 購入者 |
| seller_id | uuid references profiles(id) | 出品者 |
| amount | integer | 決済金額 |
| provider | text | Stripe など |
| provider_payment_id | text nullable | 外部決済ID |
| status | text | pending / paid / refunded / failed |
| created_at | timestamptz | 作成日時 |

## 今後の拡張方針

- 本人確認: `profiles.verified_student` と大学メールドメイン検証、学生証アップロード審査を追加
- ショップ: `shops` を独立させて、ショップURL、フォロー、ショップ単位の分析を追加
- 決済: `payments` テーブルと決済プロバイダWebhookを追加
- チャット: `conversations` / `messages` を Supabase Realtime に接続
- 画像: 現在はブラウザ内でリサイズしたData URLを保存。Supabase接続時は Supabase Storage にアップロードし、`products.image_url` に公開URLまたはStorage pathを保存
- データアクセス: 現在の `CampusMarketContext` を `services/products.ts` などのAPI層へ差し替え
