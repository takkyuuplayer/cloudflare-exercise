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

### 状態

- スキップ: トークンはまだ作っていない。トークンが必要になる演習（00-3 の API トークンでの認証、00-4）に入るときに作る

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
