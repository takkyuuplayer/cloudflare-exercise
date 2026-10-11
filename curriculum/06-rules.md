# 06. Rules: リダイレクト・変換・オリジン制御

- 前提: 05
- 必要なもの: 03 のゾーン
- 成果物の置き場所: `infra/`

## ゴール

- Rules 製品群（Redirect / Transform / Origin / Configuration など）の使い分けを説明できる
- Rules の式言語（Wireshark 風のフィルタ式）を書ける
- Workers を使うべき処理と Rules で足りる処理を判断できる

## 公式ドキュメント

- [Rules overview](https://developers.cloudflare.com/rules/)
- [Redirects](https://developers.cloudflare.com/rules/url-forwarding/)
- [Transform Rules](https://developers.cloudflare.com/rules/transform/)
- [Origin Rules](https://developers.cloudflare.com/rules/origin-rules/)
- [Rules language](https://developers.cloudflare.com/ruleset-engine/rules-language/)
- [Ruleset Engine](https://developers.cloudflare.com/ruleset-engine/)

## 演習

### 06-1 `[Dashboard]` リダイレクト

- `www.<domain>` → `<domain>` への 301 リダイレクト（パスとクエリを保持）
- `/old/*` → `/new/*` への動的リダイレクト

**完了条件:** `curl -I` で `location` ヘッダーが期待通りになる。パスとクエリが保持されている。

### 06-2 `[Dashboard]` Transform Rules

- レスポンスにセキュリティヘッダー（`X-Content-Type-Options` など）を追加する
- リクエストにヘッダーを追加し、オリジン側で受け取れることを確認する
- URL Rewrite で `/docs` を内部的に `/documentation` に書き換える（クライアントの URL は変わらない）

**完了条件:** リダイレクトと URL Rewrite の違いを、`curl -v` の結果で示せる。

### 06-3 `[Dashboard]` Origin Rules / Configuration Rules

特定のパスだけ Host ヘッダーやオリジンのポートを変える、または特定パスだけセキュリティレベルを変えるルールを作る。

### 06-4 `[IaC]` すべてを Terraform へ

06-1〜06-3 を `cloudflare_ruleset` で定義する。phase ごとにリソースが分かれることを確認する。

**完了条件:** Dashboard 側に手作業のルールが残っておらず、`terraform plan` が差分なし。

### 06-5 設計 Rules と Workers の境界

次の要件それぞれを Rules と Workers のどちらで実装すべきか、`infra/NOTES.md` に理由とともに書く。

- 国ごとに別の言語ページへリダイレクトする
- 数千件ある旧 URL → 新 URL の対応表でリダイレクトする（Bulk Redirects も調べる）
- レスポンス HTML の一部を書き換える
- A/B テストで 50% のユーザーを別オリジンへ振り分ける

## チェックポイント

- Single Redirects と Bulk Redirects はどう使い分ける？
- 同じリクエストに複数のルールがマッチしたとき、評価順序はどう決まる？
- `http.request.uri.path` と `http.request.uri` の違いは？

## 発展課題

- Snippets（プランによる）や Workers の `HTMLRewriter` で 06-5 の HTML 書き換えを実装して比較する。

## 後片付け

- 学習用のリダイレクトで本来のサイトに影響しているものがないか確認する。
