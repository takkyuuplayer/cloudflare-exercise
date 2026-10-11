# 19. CI/CD と IaC の運用

- 前提: 02, 08（`infra/` を育てていればなお良い）
- 必要なもの: GitHub リポジトリ、R2（remote state 用）
- 成果物の置き場所: `.github/workflows/`, `infra/`

## ゴール

- Terraform の state を R2 に置き、複数人・CI から安全に扱える
- Pull Request で `terraform plan` の結果を確認し、マージで `apply` する流れを作れる
- Worker のテストとデプロイを CI で自動化できる

## 公式ドキュメント

- [Remote R2 backend](https://developers.cloudflare.com/terraform/advanced-topics/remote-backend/)
- [CI/CD for Workers](https://developers.cloudflare.com/workers/ci-cd/)
- [GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Terraform best practices (Cloudflare)](https://developers.cloudflare.com/terraform/advanced-topics/best-practices/)

## 演習

### 19-1 `[IaC]` state を R2 に移す

`infra/` の state を R2 バケットの S3 互換 backend に移行する（`terraform init -migrate-state`）。

**完了条件:** ローカルに `terraform.tfstate` がなくなり、`terraform plan` が差分なし。R2 用の認証情報をどう渡しているか説明できる。

### 19-2 `[Code]` Worker の CI

GitHub Actions で次を実行する。

- PR: lint / 型チェック / `vitest`
- main への push: `wrangler deploy`（`cloudflare/wrangler-action` などを使う）

**完了条件:** PR でテストが走り、マージで本番に反映される。API トークンは GitHub の Secrets に置き、00 で作った最小権限のものを使う。

### 19-3 `[IaC]` Terraform の CI

- PR: `terraform fmt -check` / `validate` / `plan`（結果を PR に表示できるとなお良い）
- main への push: `terraform apply`

**完了条件:** Dashboard で手作業の変更をしたら、次の `plan` でドリフトとして検出される流れを確認する。

### 19-4 設計 リリースフローを決める

`labs/19-cicd/DECISION.md` に、次の方針を書く。

- Terraform 用と wrangler 用でトークンを分けるか
- Workers Builds（09-4）と GitHub Actions のどちらでデプロイするか
- `infra/` の変更と Worker の変更が依存するとき（例: 新しい KV namespace を作ってからバインディングを追加）の順序

## チェックポイント

- R2 backend で state のロックはどう扱われるか？ ドキュメントで確認する。
- CI に渡すトークンに必要な最小権限は？
- `apply` の自動化で事故を防ぐために何を入れるべきか？

## 発展課題

- 定期実行のワークフローで `terraform plan -detailed-exitcode` を走らせ、ドリフトを検知したら通知する。
- staging 用の Worker（08-3）を PR ごとのプレビューとしてデプロイする。

## 後片付け

- 不要になった GitHub Secrets やトークンを削除する。
