# 16. Access

- 前提: 15
- 必要なもの: Zero Trust の組織（無料プランの範囲で可）
- 成果物の置き場所: `infra/`, `labs/16-access/`

## ゴール

- VPN を使わずに、ID ベースでアプリへのアクセスを制御できる
- Access アプリケーション・ポリシー・IdP の関係を説明できる
- Access が付与する JWT をオリジン（Worker）側で検証できる

## 公式ドキュメント

- [Access](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/)
- [Self-hosted applications](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)
- [One-time PIN](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/)
- [Identity providers](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/)
- [Validate JWTs](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
- [Service tokens](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/)

## 演習

### 16-1 `[Dashboard]` アプリを保護する

15 で公開した `app.<domain>` を Access の self-hosted アプリとして登録し、自分のメールアドレスだけ許可するポリシーを作る（One-time PIN でログイン）。

**完了条件:** 別のメールアドレスではアクセスできず、自分のメールではアクセスできる。

### 16-2 `[Dashboard]` IdP を追加する

GitHub か Google を IdP として追加し、「特定の GitHub Organization のメンバーだけ」のようなポリシーを作る。

### 16-3 `[Code]` JWT を検証する

Access で保護した Worker（08 の Custom Domain など）で、`Cf-Access-Jwt-Assertion` ヘッダーの JWT を検証し、ユーザーのメールアドレスを表示する。

**完了条件:** Access を経由しない経路（`*.workers.dev` など）からのリクエストを拒否できる。なぜそれが必要か説明できる。

### 16-4 `[Code]` サービストークン

CI やスクリプトなど人間以外からのアクセス用に Service Token を発行し、`curl` でヘッダーを付けてアクセスする。

### 16-5 `[IaC]` Access を Terraform で管理する

16-1, 16-2, 16-4 のアプリ・ポリシー・IdP・サービストークンを `infra/` の Terraform で管理する。

**完了条件:** `terraform plan` が差分なし。IdP のクライアントシークレットを変数でどう渡したか説明できる。

## チェックポイント

- Access のポリシーの Include / Require / Exclude はどう評価される？
- Access で保護しても、オリジンに直接アクセスできてしまったら意味がない。どう塞ぐ？
- セッションの有効期間はどこで設定する？ 短すぎ / 長すぎるとどうなる？

## 発展課題

- SSH を Access 経由にする（ブラウザレンダリングの SSH や `cloudflared access ssh`）。

## 後片付け

- 学習用に作った IdP 連携やサービストークンで不要なものを削除する。
