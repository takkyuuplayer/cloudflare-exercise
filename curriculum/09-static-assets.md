# 09. フルスタックアプリと Static Assets

- 前提: 08
- 必要なもの: 無料プランで可
- 成果物の置き場所: `labs/09-static-assets/`

## ゴール

- Workers Static Assets で静的ファイルを配信できる
- 静的ファイルと API を 1 つの Worker でまとめて配信し、ルーティングの優先順位を説明できる
- フレームワーク（React / Vue / Astro など）のアプリを Workers にデプロイできる

## 公式ドキュメント

- [Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Static Assets routing](https://developers.cloudflare.com/workers/static-assets/routing/)
- [Framework guides](https://developers.cloudflare.com/workers/framework-guides/)
- [Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

## 演習

### 09-1 `[Code]` 静的サイトだけを配信する

`public/` に HTML / CSS / 画像を置き、`assets` の設定だけで配信する（Worker のコードなし）。

**完了条件:** 存在しないパスで 404 になる。`not_found_handling` を変えると SPA 風の挙動になることを確認する。

### 09-2 `[Code]` API と組み合わせる

フロントエンドから `fetch('/api/...')` で Worker の API を呼ぶ構成にする。

**完了条件:** `/api/*` は Worker のコード、それ以外は静的ファイルが返ることを確認し、どの設定でそう振り分けているか説明できる。

### 09-3 `[Code]` フレームワークで作る

C3 のフレームワークテンプレートで好きなフレームワークのアプリを作り、デプロイする。ビルド成果物がどこに出て、`wrangler.jsonc` からどう参照されているかを追う。

### 09-4 `[Dashboard]` Workers Builds でデプロイ

GitHub リポジトリ（このリポジトリでもよい）を Workers Builds に接続し、push で自動デプロイされるようにする。モノレポ内のディレクトリを指定する方法を調べる。

**完了条件:** `labs/09-static-assets/` への push でビルドが走り、Dashboard でビルドログを確認できる。

## チェックポイント

- Static Assets へのリクエストは Worker の呼び出し回数としてカウントされるか？ ドキュメントで確認する。
- Pages と Workers（Static Assets）はどう使い分ける？ 公式は今どちらを推奨しているか？
- SPA で `/users/123` をリロードしたら 404 になった。何を設定すればよいか？

## 発展課題

- `_headers` ファイルで静的ファイルのキャッシュヘッダーを設定する。
- 09-4 の自動デプロイと、19 で作る GitHub Actions のデプロイの違いを比較する。

## 後片付け

- Workers Builds の接続を残す場合は PROGRESS.md に記録する。
