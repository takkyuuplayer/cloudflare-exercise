# Cloudflare 実践カリキュラム

公式ドキュメント（[developers.cloudflare.com](https://developers.cloudflare.com/)）を教科書にし、**Dashboard で設定する → コードを書く → IaC に落とす** を繰り返して Cloudflare を体系的に身につけるカリキュラムです。

## 学び方の原則

- **1 演習 = 1 つの観察可能な成果。** 演習の完了条件は「`curl` の結果がこうなる」「`terraform plan` が差分なしになる」のように、目で確かめられる形で書いてある。
- **ClickOps → Code → IaC の 3 段階。** 多くのモジュールは、同じ設定を次の 3 通りで作る構成にしている。
  - `[Dashboard]` ブラウザで設定し、UI から製品の概念をつかむ
  - `[Code]` Workers などのコードを書く / `wrangler` や API を使う
  - `[IaC]` Terraform（cloudflare provider v5）で同じ状態を宣言的に再現する
- **ドキュメントを読むのは課題を解くため。** 各モジュールの「公式ドキュメント」は、演習を始める前に目を通す最小限のページ。全部を読み込んでから始める必要はない。
- **1 モジュール = 1 PR。** 成果物は PR として提出し、コーチが差分にレビューコメントを付ける。マージがモジュールの修了。
- **チェックポイントは口頭試問。** コーチ（AI エージェント）が質問するので、自分の言葉で答える。

## IaC の方針

| 対象 | 管理するツール | 置き場所 |
| --- | --- | --- |
| Worker のコード・バインディング・ルート | `wrangler.jsonc` | `labs/<NN>-*/` |
| ゾーン設定・DNS・Rules・WAF・Zero Trust など | Terraform | `infra/`（モジュールをまたいで育てる） |
| モジュール単体で作って壊すリソース | Terraform | `labs/<NN>-*/terraform/` |

「どこまでを wrangler で、どこからを Terraform で管理するか」はそれ自体が設計判断であり、[02 IaC 入門](02-iac-basics.md) と [19 CI/CD](19-cicd.md) で議論する。

## 前提と費用

- 必要なもの: Cloudflare アカウント（無料）、Node.js（LTS）、Terraform、`curl` / `dig`、GitHub アカウント（Part 5）。
- **Part 2 以降（エッジネットワーク）は自分のドメインが必要。** Cloudflare Registrar などで安価なドメインを 1 つ用意すると学習しやすい（ドメイン代は有料）。持っていない場合は Part 1 → Part 3 → Part 4 の順に進め、Part 2 は後回しにできる。
- 多くの演習は無料プランで完了できる。ただし製品によっては支払い方法の登録や Workers Paid プランが必要なものがある。**使う前に必ず各製品の Pricing / Limits ページを確認する。**

## ロードマップ

### Part 1. 土台を作る（ドメイン不要）

| # | モジュール | 主な成果物 |
| --- | --- | --- |
| 00 | [環境準備とアカウントの基礎](00-setup.md) | 最小権限 API トークン、`wrangler` / `terraform` が動く環境 |
| 01 | [Workers 入門](01-workers-intro.md) | `*.workers.dev` で動く最初の Worker |
| 02 | [IaC 入門: Terraform で Cloudflare を管理する](02-iac-basics.md) | Terraform で作った KV namespace と、ClickOps からの import |

### Part 2. エッジネットワーク（自分のドメインが必要）

| # | モジュール | 主な成果物 |
| --- | --- | --- |
| 03 | [ゾーンと DNS](03-dns.md) | Cloudflare に載ったゾーン、Terraform 管理の DNS レコード |
| 04 | [SSL/TLS](04-ssl-tls.md) | 暗号化モードの理解、HSTS などの設定 |
| 05 | [キャッシュと CDN](05-cache.md) | Cache Rules とキャッシュヒットの観察 |
| 06 | [Rules: リダイレクト・変換・オリジン制御](06-rules.md) | Redirect / Transform Rules の IaC 化 |
| 07 | [セキュリティ: WAF・レート制限・Bot・Turnstile](07-security.md) | WAF カスタムルール、Turnstile 付きフォーム |

### Part 3. Developer Platform

| # | モジュール | 主な成果物 |
| --- | --- | --- |
| 08 | [Workers を深く知る](08-workers-deep-dive.md) | バインディング・シークレット・テスト・独自ドメインでの公開 |
| 09 | [フルスタックアプリと Static Assets](09-static-assets.md) | フロントエンド + API を 1 つの Worker で配信 |
| 10 | [KV と R2](10-kv-r2.md) | 短縮 URL サービス、画像アップローダー |
| 11 | [D1](11-d1.md) | マイグレーション付きの SQL アプリ |
| 12 | [Durable Objects](12-durable-objects.md) | 状態を持つカウンター / チャットルーム |
| 13 | [非同期処理: Cron・Queues・Workflows](13-async.md) | 定期実行、キュー処理、リトライ付きワークフロー |
| 14 | [AI: Workers AI・AI Gateway・Vectorize](14-ai.md) | RAG の最小構成 |

### Part 4. Zero Trust（Cloudflare One）

| # | モジュール | 主な成果物 |
| --- | --- | --- |
| 15 | [Cloudflare Tunnel](15-tunnel.md) | ローカルのアプリをポート開放なしで公開 |
| 16 | [Access](16-access.md) | 認証付きの社内向けアプリ |
| 17 | [Gateway と WARP（任意）](17-gateway.md) | DNS フィルタリングポリシー |

### Part 5. 運用

| # | モジュール | 主な成果物 |
| --- | --- | --- |
| 18 | [Observability](18-observability.md) | ログ・メトリクス・GraphQL Analytics での調査 |
| 19 | [CI/CD と IaC の運用](19-cicd.md) | GitHub Actions による plan / apply / deploy、R2 での remote state |
| 20 | [卒業制作](20-capstone.md) | 全体を IaC で再現できる小さなサービス |

## モジュールの構成

各モジュールは次の節を持つ。

- **ゴール** — 終わったときにできるようになっていること
- **公式ドキュメント** — 最初に目を通すページ
- **演習** — `[Dashboard]` / `[Code]` / `[IaC]` / `[CLI]` のタグ付き。完了条件つき
- **チェックポイント** — コーチが出す口頭試問
- **発展課題** — 余力があれば
- **後片付け** — 課金や放置リソースを防ぐ

## 公式の学習リソース

このカリキュラムと並行して、公式の [Resources](https://developers.cloudflare.com/resources/)（Learning Paths など） や各製品の Tutorials も参照するとよい。
