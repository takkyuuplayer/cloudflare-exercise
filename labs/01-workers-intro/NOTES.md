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
