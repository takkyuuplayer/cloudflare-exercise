# 02. IaC 入門: Terraform で Cloudflare を管理する

- 前提: 00, 01
- 必要なもの: 無料プランで可（ドメイン不要）
- 成果物の置き場所: `labs/02-iac-basics/`

## ゴール

- Terraform の state・plan・apply・import のサイクルを Cloudflare で回せる
- Dashboard で手作業した変更（ドリフト）を検出し、IaC に取り込める
- wrangler と Terraform の管理範囲を自分で線引きできる

## 公式ドキュメント

- [Terraform (Cloudflare Docs)](https://developers.cloudflare.com/terraform/)
- [cloudflare provider (Terraform Registry)](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)
- [Import Cloudflare resources](https://developers.cloudflare.com/terraform/advanced-topics/import-cloudflare-resources/)
- [Workers KV](https://developers.cloudflare.com/kv/)
- [Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)

> v4 から v5 でリソース名・属性が大きく変わっている。ブログ記事などを参考にするときは、v5 の Registry ドキュメントと照らし合わせること。

## 演習

### 02-1 `[IaC]` KV namespace を Terraform で作る

`labs/02-iac-basics/terraform/` に Workers KV namespace を 1 つ定義して作る。

- `account_id` は変数にし、値は `*.tfvars`（`.gitignore` 済み）か環境変数 `TF_VAR_account_id` で渡す
- namespace の ID を `output` に出す

**完了条件:** Dashboard で namespace ができていることを確認でき、再度 `terraform plan` すると差分なし（No changes）になる。

### 02-2 `[Code]` Terraform で作った KV を Worker から使う

01 の Worker（またはコピー）に、02-1 の namespace を KV バインディングとして `wrangler.jsonc` に追加する。`GET /kv/:key` と `PUT /kv/:key` を実装する。

**完了条件:** `curl -X PUT` で保存した値を `curl` で取得できる。

### 02-3 `[Dashboard]` → `[IaC]` ドリフトを起こして直す

1. Dashboard で 02-1 の namespace の名前を変更する。
2. `terraform plan` を実行し、どう表示されるか観察する。
3. 「Dashboard の変更を正とする」場合と「コードを正とする」場合、それぞれどうすれば `plan` が差分なしに戻るかを考え、片方を実行する。

**完了条件:** ドリフトの検出から解消までを説明できる。

### 02-4 `[Dashboard]` → `[IaC]` ClickOps で作ったものを import する

1. Dashboard で KV namespace をもう 1 つ手作業で作る。
2. `import` ブロック（または `terraform import`）で Terraform の管理下に入れる。
3. `cf-terraforming` で設定を生成する方法も試し、手書きとの違いを比べる。

**完了条件:** import 後の `terraform plan` が差分なしになる。

### 02-5 設計 管理範囲の線引きを書く

`labs/02-iac-basics/DECISION.md` に、次について自分の方針を書く。コーチとディスカッションする。

- Worker のコードとバインディングは wrangler、それ以外は Terraform、という分け方の利点と欠点
- Terraform で Worker スクリプトまで管理する場合（`cloudflare_workers_script` など）に困ること
- KV namespace の ID を wrangler 側へどう受け渡すか（手でコピー / output を読むスクリプト / その他）

## チェックポイント

- state ファイルには何が入っているか？ なぜコミットしてはいけないのか？
- `terraform plan` で「must be replaced」と出たら何を確認する？
- import は「設定を生成する」操作か、「state に紐づける」操作か？
- ドリフトが起きやすいのはどんな運用のときか？ どう防ぐか？

## 発展課題

- `lifecycle { prevent_destroy = true }` を付けて `terraform destroy` の挙動を確かめる。
- `moved` ブロックでリソースのアドレスを変更する。

## 後片付け

- `terraform destroy` で 02 のリソースを削除する。Worker から KV バインディングを外すのも忘れずに。
