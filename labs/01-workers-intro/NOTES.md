# 01. Workers 入門 メモ

## 01-1 Dashboard だけで Worker を作る

- Worker 名: `hello-world`
- URL: `https://hello-world.takkyuuplayer.workers.dev`
- 作り方: Workers & Pages から「Hello World」テンプレートで作成し、Edit code のエディタで返す文字列を書き換えて Deploy した

### 動作確認

書き換え前:

```console
$ curl https://hello-world.takkyuuplayer.workers.dev
Hello World!%
```

書き換え後:

```console
$ curl https://hello-world.takkyuuplayer.workers.dev
Hello!%
```

### 気付いたこと

- 末尾の `%` はレスポンスではなく zsh が出している。出力が改行で終わっていないときに表示される（`PROMPT_EOL_MARK`）
- 作成しただけではテンプレートの文字列のまま。エディタで書き換えて Deploy して初めて反映される
- この Worker のコードの正（source of truth）は Cloudflare に保存されている、いまデプロイ中のバージョン。手元のファイルにも Git にもない

## 01-2 C3 でプロジェクトを作る

- `npm create cloudflare@latest`（create-cloudflare 2.73.4）で、Hello World example / Worker only / TypeScript を選んだ。デプロイはしなかった
- 先に `NOTES.md` があるディレクトリでも、C3 は既存のファイルを消さずにプロジェクトを作った

### 動作確認

```console
$ npx wrangler dev
$ curl localhost:8787
Hello World!
```

### ファイルの役割

- `wrangler.jsonc`
  - `name`: Cloudflare 側で Worker を見分ける名前。手元で変えて deploy すると、名前の変更ではなく新しい Worker が作られる。前の Worker は残る
  - `main`: エントリーポイント。TypeScript は Cloudflare 上でそのまま動くのではなく、`wrangler dev` / `wrangler deploy` が esbuild でビルドしてからアップロードする
  - `compatibility_date`: ランタイムの挙動をこの日付の時点に固定する。固定しないと、Cloudflare 側の更新でデプロイ後に急に動かなくなるかもしれない
  - `observability`: Workers Logs にログを記録し、Dashboard で見られるようにする（`wrangler tail` はリアルタイムで流す別の仕組み）
- `src/index.ts`: `fetch(request, env, ctx)` ハンドラー
  - `request`: 受け取った `Request`
  - `env`: `wrangler.jsonc` で定義した binding（vars、secrets、KV など）
  - `ctx`: 実行コンテキスト。`ctx.waitUntil()` でレスポンスを返した後も処理を続けられる
- `package.json` の scripts: `dev` は `wrangler dev`、`deploy` は `wrangler deploy`、`cf-typegen` は `wrangler types`、`test` は `vitest`
- `test/` と `vitest.config.mts`: `@cloudflare/vitest-plugin` を使ったテスト。Node.js ではなく Workers のランタイム（workerd）の中で実行される。`wrangler.jsonc` を読むのは、本番と同じ設定・binding でテストするため
- `worker-configuration.d.ts`: `wrangler types` が `wrangler.jsonc` から生成する型定義（`Env` など）。生成できるがコミットする。`tsconfig.json` が名前で参照しており、ファイルを作り直す script もないので、clone した直後の人や CI でも型チェックが通るようにするため。binding を変えたら `npm run cf-typegen` で作り直してコミットする
- `AGENTS.md`: C3 が追加した AI ツール向けの説明。中身を読んだうえで残した

## 01-3 リクエストを観察する API を作る

### デプロイの認証方針

- 最初の 1 回だけ `wrangler login`（OAuth）で deploy して Worker を作る。終わったらすぐ `wrangler logout` する。2 回目以降は `cloudflare-exercise-wrangler` トークンを使う
- 理由: OAuth には `workers_routes (write)` が含まれる。`wrangler.jsonc` に `takkyuuplayer.com/*` の route を書き間違えて deploy すると、本番サイトへのリクエストがオリジンではなくこの Worker に届き、本番が上書きされうる。トークンには route の権限がないので、同じ間違いをしても権限エラーで止まる

### 動作確認（デプロイ後）

URL: `https://01-workers-intro.takkyuuplayer.workers.dev`（ヘッダーは必要な行だけ抜粋。IP アドレスと市区町村は伏せた）

```console
$ curl -i https://01-workers-intro.takkyuuplayer.workers.dev/
HTTP/2 200
content-type: text/plain;charset=UTF-8
cf-ray: a4c40a1e3b05e364-NRT

Hello from 01-workers-intro

$ curl https://01-workers-intro.takkyuuplayer.workers.dev/whoami
{"cf":{"colo":"NRT","country":"JP","city":"xxx","asn":2516,"asOrganization":"Japan Internet Xing Co., Ltd.","httpProtocol":"HTTP/2","tlsVersion":"TLSv1.3"},"headers":{"user-agent":"curl/8.7.1","accept":"*/*","cf-connecting-ip":"240b:10:xxxx:...","cf-ipcountry":"JP","cf-ray":"a4c40a5fdb8c2934","x-forwarded-proto":"https"}}

$ curl -i -X POST -H 'Content-Type: application/json' -d '{"a":1}' https://01-workers-intro.takkyuuplayer.workers.dev/echo
HTTP/2 200
content-type: application/json

{"a":1}

$ curl -i -X POST -d 'notjson' https://01-workers-intro.takkyuuplayer.workers.dev/echo
HTTP/2 400
content-type: application/json

{"error":"Body must be valid JSON"}

$ curl -i https://01-workers-intro.takkyuuplayer.workers.dev/nope
HTTP/2 404
content-type: application/json

{"error":"Not Found"}
```

### 気付いたこと

- `colo` は `NRT`（成田）。`cf-ray` の末尾も同じ `NRT`
- ローカル（`wrangler dev`）と本番の違い
  - `httpProtocol`: ローカルは `HTTP/1.1`、本番は `HTTP/2`
  - `cf-connecting-ip`: ローカルは `::1`（IPv6 の localhost）。curl がエッジを通らず手元の workerd に直接つながるため。本番はエッジが付けた実際のグローバル IP
  - `cf-ipcountry`、`cf-ray`、`x-forwarded-proto` は本番だけに付く
- 404 ではなく 405 にしたのは、`Allow` ヘッダーで「この path は POST なら使える」と伝えられるから（RFC 9110 §15.5.6）
- `?? null` は、`JSON.stringify` が `undefined` のキーを消すため。テストでは `cf` がなく、最初の版は `{"cf":{}}` になった
- `request.json()` は JSON でないと例外を投げる。`try/catch` がないと 400 ではなくなる（何が返るかは 01-4 で試す）
