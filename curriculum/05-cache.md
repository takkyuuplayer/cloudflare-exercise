# 05. キャッシュと CDN

- 前提: 03, 04
- 必要なもの: レスポンスヘッダーを制御できるオリジンが望ましい
- 成果物の置き場所: `infra/`

## ゴール

- Cloudflare のデフォルトのキャッシュ挙動（何がキャッシュされ、何がされないか）を説明できる
- `cf-cache-status` を読んでキャッシュの状態を判断できる
- Cache Rules でキャッシュ挙動を変え、IaC で管理できる

## 公式ドキュメント

- [Cache overview](https://developers.cloudflare.com/cache/)
- [Default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/)
- [Cloudflare cache responses (cf-cache-status)](https://developers.cloudflare.com/cache/concepts/cache-responses/)
- [Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/)
- [Purge cache](https://developers.cloudflare.com/cache/how-to/purge-cache/)
- [Origin Cache Control](https://developers.cloudflare.com/cache/concepts/cache-control/)

## 演習

### 05-1 `[CLI]` デフォルトの挙動を観察する

オリジンの HTML、画像、CSS などに対して `curl -sI` を 2 回ずつ実行し、`cf-cache-status` と `age` を記録する。

**完了条件:** HTML がデフォルトではキャッシュされない理由を、ドキュメントの該当箇所を引いて説明できる。

### 05-2 `[CLI]` オリジンの Cache-Control を変える

オリジンが返す `Cache-Control` を `no-store`、`max-age=60`、`s-maxage=600, max-age=0` などに変え、Cloudflare とブラウザそれぞれのキャッシュ期間がどうなるか観察する。

**完了条件:** `s-maxage` と `max-age` の違い、Browser Cache TTL 設定との関係を説明できる。

### 05-3 `[Dashboard]` Cache Rules を作る

- 特定のパス（例: `/blog/*`）の HTML を Edge TTL 付きでキャッシュするルール
- 特定のクエリ文字列を無視してキャッシュキーを作るルール

**完了条件:** `cf-cache-status: HIT` になることと、キャッシュキーの違いによる HIT / MISS の変化を確認できる。

### 05-4 `[CLI]` パージする

Dashboard と API（`curl` で Purge Cache API）の両方で URL 単位のパージを行い、直後に MISS になることを確認する。

**完了条件:** パージ用 API トークンに必要な権限を説明できる。

### 05-5 `[IaC]` Cache Rules を Terraform 化する

05-3 のルールを `cloudflare_ruleset`（phase: `http_request_cache_settings`）で定義し直し、Dashboard で作ったものは削除する。

**完了条件:** `terraform plan` が差分なしで、05-3 と同じ観察結果になる。

## チェックポイント

- `cf-cache-status` の `DYNAMIC` と `BYPASS` の違いは？
- 「同じ URL なのに HIT したりしなかったりする」とき、何が原因として考えられるか？
- ログインユーザーごとに内容が変わるページを誤ってキャッシュすると何が起きる？ どう防ぐ？
- Ruleset Engine における「phase」とは何か？

## 発展課題

- Tiered Cache の仕組みを読み、有効化前後で `cf-ray` の colo やヒット率に違いが出るか調べる。
- Cache Reserve の料金体系を読み、どんなサイトで効果があるかを考える。

## 後片付け

- 学習用に入れた極端に長い Edge TTL のルールは削除するか、短くする。
