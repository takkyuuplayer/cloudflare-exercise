# 02. IaC 入門 メモ

トークン、パスワード、Account ID は書かない。`terraform plan` と `wrangler deploy` の出力には Account ID が出るので、貼るときは伏せる。

## 02-1 KV namespace を Terraform で作る

- 置き場所: `labs/02-iac-basics/terraform/`
- provider: `cloudflare/cloudflare` 5.28.0（2026-10-18 時点の latest）
- リソース: `cloudflare_workers_kv_namespace.lab`（`title = "02-iac-basics"`）。ID は output の `kv_namespace_id`
- 参考: [cloudflare_workers_kv_namespace](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/workers_kv_namespace)

### トークンと変数

- `cloudflare-exercise-terraform` に `Workers KV Storage` の権限を足した
- provider は `CLOUDFLARE_API_TOKEN` ではなく `var.cloudflare_api_token`（`TF_VAR_cloudflare_api_token`）からトークンを読む。wrangler も `CLOUDFLARE_API_TOKEN` を読むので、同じ変数だと wrangler 用と Terraform 用のどちらが入っているかでぶつかるため。ディレクトリごとに `mise.local.toml` を分ける方法もあったが、変数名を分けるほうにした
- `mise.local.toml` はリポジトリの `.gitignore` には足さない（グローバルの gitignore で無視している）
- トークンに TTL は付けない

### 動作確認

```console
$ terraform apply
cloudflare_workers_kv_namespace.lab: Creating...
cloudflare_workers_kv_namespace.lab: Creation complete after 1s [id=3ccf5d6c71a44ac187a66a4c98cfe1d9]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

kv_namespace_id = "3ccf5d6c71a44ac187a66a4c98cfe1d9"

$ terraform apply
cloudflare_workers_kv_namespace.lab: Refreshing state... [id=3ccf5d6c71a44ac187a66a4c98cfe1d9]

No changes. Your infrastructure matches the configuration.
```

Dashboard の Workers KV でも `02-iac-basics` ができていて、ID が output と一致することを確かめた。

## 02-2 Terraform で作った KV を Worker から使う

- 01 の Worker（`01-workers-intro`）を流用した。wrangler 用トークンの対象がこの Worker だけなので、OAuth を使わずに deploy できるため
- `wrangler.jsonc` の `kv_namespaces` にバインディング `KV` を足した。namespace の ID は Terraform の output から手でコピーした（どう受け渡すかは 02-5 で考える）
- `GET /kv/:key` と `PUT /kv/:key` を足した。`PUT` は `workers.dev` で誰でも呼べるが、演習のあいだは公開したままにする。最終的には `workers.dev` を Access で自分だけにしたい（16 で扱う）

### 動作確認

```console
$ curl -i -X PUT https://01-workers-intro.takkyuuplayer.workers.dev/kv/greeting --data 'hello'
HTTP/2 204
cf-ray: a4d06a1a38bc2da1-NRT

$ curl -i https://01-workers-intro.takkyuuplayer.workers.dev/kv/greeting
HTTP/2 200
content-type: text/plain;charset=UTF-8
cf-ray: a4d06a4e9fb8d75c-NRT

hello
```

2 つとも `NRT` で処理されたので、別のロケーションから読んだときの整合性は確かめていない。

## 学んだこと

### Worker を deploy できるトークンは、アカウント内のどの KV にも届きうる

1. KV の権限（`Workers KV Storage`）はアカウント単位でしか付けられない。Workers のように特定の namespace だけに絞れない
2. KV バインディングを付けた Worker の deploy には、KV の権限が要らない。KV の権限を持たない wrangler 用トークンで deploy できた。deploy で送るのは「この ID の namespace を `KV` という名前で結び付ける」という宣言だけで、KV にアクセスするのは実行時の Worker 自身だから
3. そのため、`01-workers-intro` だけに絞ったトークンでも、namespace の ID さえ分かれば、その namespace を Worker にバインドして読み書き・削除できる
4. namespace の ID は識別子でシークレットではない（このリポジトリでも `wrangler.jsonc` に書いて公開している）。ID を知られていないことは守りにならない
5. 確実に守るには、権限の境界であるアカウントを分ける。TTL や IP 制限は、漏れたあとに悪用できる時間と場所を狭める対策で、代わりにはならない

### テストのストレージ

- テストは本物の namespace ではなく、Miniflare がローカルに用意した KV に書き込む
- ストレージはテストごとではなく、テストファイルごとに分かれる。テストごとに分かれるのは以前の `@cloudflare/vitest-pool-workers` の挙動で、古い記事はその前提で書かれている
- 参考: [Isolation and concurrency](https://developers.cloudflare.com/workers/testing/vitest-integration/isolation-and-concurrency/)

### KV の整合性

- KV は結果整合性。`PUT` した直後に別のロケーションから `GET` すると、古い値が返ることがある
- 参考: [How KV works](https://developers.cloudflare.com/kv/concepts/how-kv-works/)

## つまずいたこと

- 最初の `terraform apply` が 401 になった。`CLOUDFLARE_API_TOKEN` に wrangler 用のトークンが入っていたため。その前の `terraform plan` は通っていたが、新しいリソースを作るだけの plan は KV の API を呼ばないので、書き込み権限の証拠にはならない
- `wrangler deploy` が「No access to the specified resource」で失敗した。KV バインディングが原因だと予想したが、KV を足す前のコードでも同じように失敗したので、原因は別だった。トークンの値を取り違えていた
- 切り分けには `tokens/verify` が役に立った。トークンの値を出さずに ID を確かめられるので、どのトークンが入っているかを比べられる
