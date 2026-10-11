# 08. Workers を深く知る

- 前提: 01, 02（独自ドメインでの公開は 03 も）
- 必要なもの: 無料プランで可
- 成果物の置き場所: `labs/08-workers-deep-dive/`

## ゴール

- 環境変数・シークレット・バインディングの違いを説明し、使い分けられる
- `vitest` でテストを書ける（Workers ランタイム上で実行）
- 環境（staging / production）を分けてデプロイできる
- Worker を独自ドメイン / ルートで公開できる

## 公式ドキュメント

- [Environment variables](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Environments](https://developers.cloudflare.com/workers/wrangler/environments/)
- [Vitest integration](https://developers.cloudflare.com/workers/testing/vitest-integration/)
- [Routes and domains](https://developers.cloudflare.com/workers/configuration/routing/)
- [Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Gradual deployments](https://developers.cloudflare.com/workers/versions-and-deployments/gradual-deployments/)

## 演習

### 08-1 `[Code]` 設定値とシークレット

- `vars` に公開してよい設定（例: `GREETING`）を置く
- `wrangler secret put` で `API_KEY` を設定し、`Authorization: Bearer` ヘッダーと照合する API を作る
- ローカル開発用の値は `.dev.vars` に置く（コミットしない）
- `npx wrangler types` で `Env` の型を生成する

**完了条件:** 正しいキーで 200、それ以外で 401。シークレットが Dashboard でどう見えるかを確認する。

### 08-2 `[Code]` テストを書く

`@cloudflare/vitest-pool-workers` を導入し、08-1 の API に対する単体テスト・結合テスト（`SELF.fetch` など）を書く。

**完了条件:** `npm test` が通る。テストがどのランタイムで動いているか説明できる。

### 08-3 `[Code]` 環境を分ける

`wrangler.jsonc` に `staging` 環境を追加し、変数とシークレットを環境ごとに分ける。

**完了条件:** `wrangler deploy --env staging` と本番で、別の Worker として動いていることを確認できる。

### 08-4 `[Code]` 独自ドメインで公開する（要: 03）

- Custom Domain で `api.<domain>` に Worker を割り当てる
- Route で `<domain>/worker/*` にも割り当ててみる

**完了条件:** Custom Domain と Route の違い（DNS レコードの扱い、オリジンの有無）を説明できる。

### 08-5 `[Code]` 段階的デプロイ

`wrangler versions upload` と `wrangler versions deploy` を使い、新バージョンに 10% だけトラフィックを流す。

**完了条件:** 何度かリクエストしてバージョンが混ざることを確認し、100% に切り替えるかロールバックする。

### 08-6 `[IaC]` ルーティングと DNS の責任分担

Custom Domain を wrangler で設定した場合と、Terraform（`infra/`）で設定した場合の違いを調べ、どちらで管理するかを決めて `labs/08-workers-deep-dive/DECISION.md` に書く。

## チェックポイント

- `vars` とシークレットの違いは？ どちらも `env` から読めるのに分ける理由は？
- `ctx.waitUntil()` はいつ使う？
- 無料プランの CPU 時間の上限を超えるとどうなる？ 「CPU 時間」と「実時間」の違いは？
- グローバル変数に値を入れておくと、次のリクエストでも残っていることがある。なぜか？ 頼ってよいか？

## 発展課題

- Hono などのフレームワークでルーティングを書き直す。
- Service bindings で Worker から別の Worker を呼ぶ。

## 後片付け

- `staging` 環境の Worker を使わないなら削除する。
