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
