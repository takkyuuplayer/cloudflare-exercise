# 07. セキュリティ: WAF・レート制限・Bot・Turnstile

- 前提: 06
- 必要なもの: 03 のゾーン（プランによって使える機能・ルール数が違う。使う前に確認する）
- 成果物の置き場所: `infra/`, `labs/07-security/`

## ゴール

- WAF のカスタムルール・マネージドルール・レート制限ルールの役割の違いを説明できる
- Security Events から「何が・なぜブロックされたか」を調べられる
- Turnstile をフォームに組み込み、サーバー側で検証できる

## 公式ドキュメント

- [WAF overview](https://developers.cloudflare.com/waf/)
- [Custom rules](https://developers.cloudflare.com/waf/custom-rules/)
- [Rate limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/)
- [Managed rules](https://developers.cloudflare.com/waf/managed-rules/)
- [Security Events](https://developers.cloudflare.com/waf/analytics/security-events/)
- [Bots](https://developers.cloudflare.com/bots/)
- [Turnstile](https://developers.cloudflare.com/turnstile/)
- [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## 演習

### 07-1 `[Dashboard]` WAF カスタムルール

- 特定の国（または自分以外の IP）から `/admin` へのアクセスをブロック
- `User-Agent` が空のリクエストに Managed Challenge

**完了条件:** `curl` でブロックされること（ステータスコードとレスポンス）を確認し、Security Events に該当イベントが出ることを確認する。

### 07-2 `[Dashboard]` レート制限

`/api/*` に短時間で大量にアクセスすると 429 を返すルールを作る。シェルのループで `curl` を連打して発動させる。

**完了条件:** カウントの単位（IP など）と期間、発動後の挙動（ブロック期間）を説明できる。

### 07-3 `[Code]` Turnstile 付きフォーム

`labs/07-security/` に、Turnstile ウィジェット付きのフォームと、トークンを検証する Worker を作る。

- Turnstile のウィジェットは Dashboard（またはこの後 Terraform）で作る
- シークレットキーは `wrangler secret put` で設定する
- 検証に失敗したら 403 を返す

**完了条件:** ブラウザからは送信でき、`curl` でトークンなし・偽トークンで送ると 403 になる。

### 07-4 `[IaC]` セキュリティ設定を Terraform へ

07-1, 07-2 のルールと、07-3 の Turnstile ウィジェットを Terraform で管理する。シークレットキーの扱い（state に入るか？）を確認し、`infra/NOTES.md` に対策を書く。

**完了条件:** `terraform plan` が差分なし。

## チェックポイント

- Block / Managed Challenge / JS Challenge / Log の違いと使い分けは？
- WAF のルールで `ip.src` を使うとき、オリジン側で見えるクライアント IP はどのヘッダーで取得するのか？
- Turnstile のトークンをクライアント側だけで検証すると何がまずい？
- Terraform の state にシークレットが含まれる場合、どんな対策が取れるか？

## 発展課題

- WAF の「Log」アクションで新ルールを先に観察してから Block に切り替える運用を試す。
- Security Analytics でボットスコアの分布を眺め、自分のサイトに来ているトラフィックの性質を調べる。

## 後片付け

- 自分自身をブロックするルールが残っていないか確認する。
