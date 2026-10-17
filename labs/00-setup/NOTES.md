# Lab 00 NOTES

トークン、パスワード、リカバリーコードは書かない。

## 00-1 アカウントを観察する

### Account ID

- 文字数と使われている文字の種類: 16 進数
- 見つけ方 1（コピーする）: Dashboard の検索（`Cmd + K`）で `Copy account ID` を選ぶ
- 見つけ方 2（画面に表示されている場所）: ドメイン（`takkyuuplayer.com`）を開いたときの Dashboard の URL `https://dash.cloudflare.com/<Account ID>/<ドメイン名>` で、パスの最初の部分
- 参考: [Find account and zone IDs](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/)

### Zone ID

- 何の ID か: ドメイン（ゾーン）の ID
- Account ID との違い: アカウントの中にゾーンがある。そのため Dashboard の URL も `/<アカウント>/<ゾーン>` の形になっている
- 1 つのアカウントに Zone ID はいくつあり得るか: アカウントに追加したドメインの数だけ

### メンバーとロール

- メンバー: 自分だけ
- 自分のロール: Super Administrator

### 2 要素認証

- 状態: 設定済み（00-1 の途中で設定した）
- 方式: 認証アプリとセキュリティキーの両方
- 未設定のままだと何が危ないか: パスワードが漏れると、なりすましてログインされるかもしれない

### 気づいたこと

- `takkyuuplayer.com` は本番のサイトで使っているゾーン。00-2 で作るトークンの Zone Resources と、Part 2 の進め方に注意する

### 完了条件

- Dashboard を見ずに、Account ID がどこに表示されているかを説明する: 検索の `Copy account ID` と、ドメインを開いたときの URL の最初の部分（セッション中のやり取りで確認済み）

## 00-2 最小権限の API トークンを作る

### wrangler 用トークンに Zone Resources が要らない理由

- `*.workers.dev` のサブドメイン（`<Worker 名>.takkyuuplayer.workers.dev` の `takkyuuplayer`）はアカウントごとに 1 つ付く設定で、ゾーンには属さないため
- 参考: [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/)

### wrangler 用トークン（Account API Token）

- 名前: `cloudflare-exercise-wrangler`
- 種類: Account API Token。作った人がアカウントのメンバーから外れても消えないので、CI に向いている
- Permission policies（範囲: アカウント全体）:
  - Workers Metadata Read-Only
  - Workers Editor
  - Workers Content Read-Only
- Zone Resources: なし（`*.workers.dev` はアカウントの設定で、ゾーンに属さないため）
- Client IP Address Filtering: なし（すべての IP を許可）
- TTL: なし（No expiration）
- 参考: [Workers roles and permissions](https://developers.cloudflare.com/workers/authorization/workers/)

#### 決めたこと

- Metadata Read-Only と Content Read-Only は Editor に含まれるので外す
- Editor は既存の Worker の更新とデプロイだけで、新しい Worker は作れない（作るにはアカウント全体の Admin が必要）。トークンを Admin にはせず、新しい Worker は OAuth で手作業で作る。トークンは Editor のまま、Worker ができたらその Worker だけに範囲を絞る（CI を最小権限にするため）。まだ存在しない Worker は範囲に指定できないので、絞るのは 01 で Worker を作ったあと
- TTL と IP 制限は付けない。どこからでも、いつまでも使えるようにするため。GitHub Actions の実行環境は IP が決まっていないので、IP 制限は CI と相性が悪い。その代わり、漏れたときは Dashboard ですぐに失効させる

### terraform 用トークン（Account API Token）

- 名前: `cloudflare-exercise-terraform`
- 種類: Account API Token（wrangler 用と同じ理由）
- Permission policies（範囲: アカウント全体）:
  - Account Settings Read
- Zone Resources: なし
- Client IP Address Filtering: なし（すべての IP を許可）
- TTL: なし（No expiration）
- 00-4 はアカウント情報を読むだけなので、読み取りの権限だけにした。KV の権限は 02 で付け足す

## 00-3 wrangler でログインする

### OAuth（`wrangler login`）

`npx wrangler whoami` の結果（wrangler 4.149.0、メールアドレスと Account ID は伏せた）:

```
👋 You are logged in with an OAuth Token, associated with the email <email>
🔐 Credentials are stored in: ~/Library/Preferences/.wrangler/config/default.toml
Account Name: takkyuuplayer
🔓 Token Permissions:
- user (read), offline_access, account (read)
- workers (write), workers_kv (write), workers_routes (write), workers_scripts (write), workers_tail (read)
- d1 (write), pages (write), zone (read), ssl_certs (write)
- ai (write), ai-search (write), ai-search (run), websearch.run, agent-memory (write)
- queues (write), pipelines (write), secrets_store (write)
```

- 00-2 で考えた最小権限と比べると: 広い
- 認証情報の保存場所: `~/Library/Preferences/.wrangler/config/default.toml`
- `workers_routes (write)` があると、本番ゾーン（`takkyuuplayer.com/*`）に Route を付けて Worker にリクエストを通せる。リダイレクトで他のサイトにユーザーを誘導したり、レスポンスを書き換えたりできる。scope が `zone (read)` だけでも安全とは言えない

### OAuth と API トークンの使い分け

- OAuth ログイン: 人が手で実行するとき（ローカルでの開発）
- API トークン: CI/CD。最小権限にして使う
- CI で `wrangler login` を使わない理由: ブラウザでの認可が必要で CI では実行できない。また、OAuth の権限は広く、個人のアカウントにひも付いている

### API トークンでの認証（`CLOUDFLARE_API_TOKEN`）

`wrangler whoami` の結果（Account ID は伏せた）:

```
👋 You are logged in with an Account API Token, associated with the account takkyuuplayer.
ℹ️   The API Token is read from the CLOUDFLARE_API_TOKEN environment variable.
🔓 To see token permissions visit https://dash.cloudflare.com/<Account ID>/api-tokens
```

- OAuth との違い: アカウントにひも付く。権限の一覧は `whoami` に出ず、Dashboard で確認する

## 00-4 Terraform から API を呼ぶ

- `terraform plan` / `apply` で `account_name = "takkyuuplayer"` が出た
- 渡し方: API トークンは `CLOUDFLARE_API_TOKEN`、Account ID は `TF_VAR_account_id`（どちらも環境変数で、リポジトリに書かない）
- `version = "~> 5.28"`: 5.28 以上で、6 は許さない。最新のメジャーバージョン（5）に固定している
- `.terraform.lock.hcl` をコミットする理由: provider のバージョンをロックするため。正確なバージョンとチェックサムが書かれているので、誰が `init` しても（CI でも）同じ provider が入る。上げるときは `terraform init -upgrade` で明示的に上げる
- `.terraform/` をコミットしない理由: ダウンロードした provider のキャッシュで、`init` すれば作り直せる
- `apply` すると手元に `terraform.tfstate`（state ファイル）ができる。`.gitignore` で除外している

## チェックポイント

- Global API Key ではなく API トークンを使う理由: 権限を細かく絞れる（fine-grained）から。Global API Key はユーザーのすべての権限を持ち、範囲も期限も絞れない
- トークンが漏れたら: まずトークンを無効化するか、作り直す（Roll）。そのあと、漏れていた間に何をされたかを Audit Logs で確認する
- アカウントとゾーン: アカウントの中にゾーン（ドメイン）がある。1 つのアカウントに複数のゾーンを持てる（00-1）
- `wrangler login` の認証情報の保存場所: `~/Library/Preferences/.wrangler/config/default.toml`。CI ではブラウザでの認可ができず、権限も広く個人にひも付くので使わない（00-3）
