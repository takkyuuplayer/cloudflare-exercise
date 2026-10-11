# 01. Workers 入門

- 前提: 00
- 必要なもの: 無料プランで可（ドメイン不要）
- 成果物の置き場所: `labs/01-workers-intro/`

## ゴール

- Workers がどこで・いつ実行されるかを説明できる
- `wrangler` でプロジェクトを作り、ローカル実行・デプロイ・ログ確認ができる
- `fetch` ハンドラーで `Request` を受け取り `Response` を返すコードが書ける

## 公式ドキュメント

- [Workers overview](https://developers.cloudflare.com/workers/)
- [Get started guide (CLI)](https://developers.cloudflare.com/workers/get-started/guide/)
- [How Workers works](https://developers.cloudflare.com/workers/reference/how-workers-works/)
- [Fetch handler](https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)

## 演習

### 01-1 `[Dashboard]` Dashboard だけで Worker を作る

Dashboard の Workers & Pages から「Hello World」テンプレートで Worker を作成し、ブラウザ上のエディタで返す文字列を書き換えてデプロイする。

**完了条件:** `curl https://<name>.<subdomain>.workers.dev` で書き換えた文字列が返る。

### 01-2 `[Code]` C3 でプロジェクトを作る

`npm create cloudflare@latest` で TypeScript の Worker プロジェクトを `labs/01-workers-intro/` に作る。生成されたファイルそれぞれの役割（特に `wrangler.jsonc`）を説明できるようにする。

**完了条件:** `npx wrangler dev` でローカル起動し、`curl localhost:8787` が応答する。

### 01-3 `[Code]` リクエストを観察する API を作る

次のエンドポイントを持つ Worker を実装する。

- `GET /` — テキストを返す
- `GET /whoami` — リクエストの `cf` オブジェクト（国、データセンター（colo）、ASN など）と主要ヘッダーを JSON で返す
- `POST /echo` — JSON ボディをそのまま返す。JSON でなければ 400
- それ以外 — 404

**完了条件:** デプロイ後、`curl` で 4 パターンすべての挙動を確認できる。`/whoami` の `colo` が自分の近くのデータセンターになっている。

### 01-4 `[CLI]` ログを追う

- `npx wrangler tail` を起動した状態でリクエストを送り、`console.log` が届くことを確認する。
- わざと例外を投げるエンドポイントを追加し、ログと HTTP レスポンスがどうなるか観察する。

**完了条件:** 例外発生時にクライアントに何が返り、ログに何が出るかを説明できる。

### 01-5 `[CLI]` バージョンとロールバック

コードを 2 回変更してデプロイし、`npx wrangler deployments list` と `npx wrangler rollback` で 1 つ前に戻す。

**完了条件:** 「version」と「deployment」の違いを説明できる。

## チェックポイント

- Workers は V8 isolate で動く。コンテナや VM と比べた利点と制約は？
- `wrangler dev` はどこでコードを実行しているか？ 本番との差が出うるのはどんなところか？
- `wrangler.jsonc` の `compatibility_date` は何のためにある？
- 01-1 で Dashboard から作った Worker と、01-2 で作った Worker の「正（source of truth）」はそれぞれどこにある？ 両方から編集すると何が起きる？

## 発展課題

- [Workers Playground](https://workers.cloudflare.com/playground) で同じコードを動かしてみる。
- `fetch()` で外部 API を呼び、その結果を加工して返すプロキシを書く。

## 後片付け

- 01-1 で作った Worker は削除してよい（01-2 以降のものはこのモジュール内で使い続けてよい）。
