# 00. 環境準備とアカウントの基礎

- 前提: なし
- 必要なもの: Cloudflare アカウント、Node.js（LTS）、Terraform
- 成果物の置き場所: `labs/00-setup/`

## ゴール

- Cloudflare の「アカウント」「ゾーン」「ユーザー」「API トークン」の関係を説明できる
- 用途ごとに最小権限の API トークンを作れる
- `wrangler` と `terraform` から自分のアカウントを操作できる

## 公式ドキュメント

- [Fundamentals](https://developers.cloudflare.com/fundamentals/) — アカウントとゾーンの概念
- [Create API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [API token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/)
- [Install/Update Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- [Terraform](https://developers.cloudflare.com/terraform/)

## 演習

### 00-1 `[Dashboard]` アカウントを観察する

Dashboard にログインし、次の値を見つけて `labs/00-setup/NOTES.md` にメモする（ID は秘密情報ではないが、トークンは書かない）。

- Account ID
- アカウントのメンバーと自分のロール
- 2 要素認証の状態（未設定なら設定する）

**完了条件:** Account ID がどこに表示されているかを、Dashboard を見ずに説明できる。

### 00-2 `[Dashboard]` 最小権限の API トークンを 2 つ作る

テンプレートを使わずに **Custom token** で次の 2 つを作る。

1. `wrangler` 用: Workers のデプロイに必要な権限だけ
2. `terraform` 用: このカリキュラム前半で使うリソース（Workers KV など）を編集できる権限だけ

トークンはパスワードマネージャーなどに保管し、リポジトリには置かない。

**完了条件:** 2 つのトークンの権限の違いを説明できる。トークンの「Account Resources」「Zone Resources」「Client IP Address Filtering」「TTL」が何を制限するか説明できる。

### 00-3 `[CLI]` wrangler でログインする

- `npx wrangler login`（OAuth）と、環境変数 `CLOUDFLARE_API_TOKEN` を使う方法の両方を試す。
- `npx wrangler whoami` で、それぞれどの権限で認証されているかを確認する。

**完了条件:** OAuth ログインと API トークンの使い分け（ローカル開発 / CI）を説明できる。

### 00-4 `[IaC]` Terraform から API を叩く

`labs/00-setup/terraform/` に最小の構成を作る。

- `required_providers` で `cloudflare/cloudflare` の v5 系を固定する
- 認証情報はファイルに書かず、環境変数 `CLOUDFLARE_API_TOKEN` で渡す
- data source でアカウント情報を読み、`output` で表示する（リソースはまだ作らない）

**完了条件:** `terraform init` → `terraform plan` → `terraform apply` が通り、output に自分のアカウント名が出る。`.terraform.lock.hcl` をコミットすべき理由を説明できる。

## チェックポイント

- Global API Key ではなく API トークンを使うべき理由は？
- 「アカウント」と「ゾーン」はそれぞれ何の単位か？ 1 つのアカウントに複数のゾーンを持てるか？
- トークンが漏えいしたら、まず何をする？
- `wrangler login` の認証情報はどこに保存されるか？ CI でそれを使わないのはなぜか？

## 発展課題

- Cloudflare API を `curl` で直接叩き、トークンの検証エンドポイント（Verify token）を呼んでみる。
- [cf-terraforming](https://github.com/cloudflare/cf-terraforming) をインストールしておく（02 で使う）。

## 後片付け

- 試しに作って使わなくなったトークンは削除する。
