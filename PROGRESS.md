# PROGRESS

## 進捗

状態: `未着手` / `進行中` / `完了` / `スキップ`

| # | モジュール | 状態 | 完了日 | メモ |
| --- | --- | --- | --- | --- |
| 00 | 環境準備とアカウントの基礎 | 完了 | 2026-10-17 | トークンはどちらも Account API Token |
| 01 | Workers 入門 | 完了 | 2026-10-18 | 01-5 はドキュメントを読んで説明した |
| 02 | IaC 入門 | 未着手 | | |
| 03 | ゾーンと DNS | 未着手 | | |
| 04 | SSL/TLS | 未着手 | | |
| 05 | キャッシュと CDN | 未着手 | | |
| 06 | Rules | 未着手 | | |
| 07 | セキュリティ | 未着手 | | |
| 08 | Workers を深く知る | 未着手 | | |
| 09 | フルスタックアプリと Static Assets | 未着手 | | |
| 10 | KV と R2 | 未着手 | | |
| 11 | D1 | 未着手 | | |
| 12 | Durable Objects | 未着手 | | |
| 13 | 非同期処理 | 未着手 | | |
| 14 | AI | 未着手 | | |
| 15 | Cloudflare Tunnel | 未着手 | | |
| 16 | Access | 未着手 | | |
| 17 | Gateway と WARP | 未着手 | | |
| 18 | Observability | 未着手 | | |
| 19 | CI/CD と IaC の運用 | 未着手 | | |
| 20 | 卒業制作 | 未着手 | | |

## 残しているリソース

後片付けで消さずに残しているもの（課金や放置の確認用）。

| リソース | 作ったモジュール | 管理方法 | 残す理由 |
| --- | --- | --- | --- |
| Account API Token `cloudflare-exercise-wrangler`（Workers Editor ＋ Workers Tail Read、対象は Worker `01-workers-intro` だけ、期限なし） | 00 | Dashboard。値は `mise.local.toml` | wrangler から deploy・tail する。新しい Worker は作れないので、作るときは OAuth で 1 回だけ deploy して logout する |
| Worker `01-workers-intro`（`01-workers-intro.takkyuuplayer.workers.dev`） | 01 | `labs/01-workers-intro/`（wrangler） | 練習用。わざと例外を投げる `/boom` も残している |
| Account API Token `cloudflare-exercise-terraform`（Account Settings Read、期限なし） | 00 | Dashboard | 02 以降で Terraform から使う。02 で KV の権限を足す |

## 残っている疑問

- `takkyuuplayer.com` は本番のサイトで使っているゾーン。Part 2（03〜07）をどのドメインで進めるか、03 に入る前に決める（練習用のドメインを別に買う / サブドメインだけ使う など）
- Dashboard で `Workers Tail Read` が legacy と表示された。代わりに何を使うべきか（公式の権限一覧には legacy の記述がない）
- `mise.local.toml` はグローバルの gitignore でしか無視されていない。リポジトリの `.gitignore` に足すか
- トークンを Terraform で管理しようとすると、どんな問題が起きるか（02 で考える）

## 学習ログ

新しいものを上に追記する。

### 2026-10-18 モジュール 01（01-4・01-5、口頭試問）
- やったこと: トークンを `01-workers-intro` だけに絞り、`Workers Tail Read` を足した。`wrangler tail` で `console.log` と例外を観察した。`typecheck` script を足した。01-5 はドキュメントで確認した。口頭試問をした。`hello-world` を削除した
- 学んだこと: tail の `Ok` は HTTP ステータスではなく outcome。例外ではクライアントに 500 と `error code: 1101` だけが返り、ログにはソースマップで `src/index.ts` の行番号つきのスタックトレースが出る。deploy もテストも esbuild で型を取り除くだけなので、型の誤りは `tsc` でしか気付けない。コミットした型定義が古いかは `wrangler types --check` で分かる。rollback は古い version を指す新しい deployment を作る
- 口頭試問:
  - isolate の利点と制約: 起動が速くコールドスタートがほぼない。evict されうるので、グローバル変数の state は消えるかもしれない
  - `wrangler dev`: 手元で本番と同じ workerd を動かす。`request.cf` はローカルのキャッシュファイルの値で、HTTP は 1.1（本番は 2）
  - source of truth: `hello-world` は Cloudflare、`01-workers-intro` は Git。Dashboard で編集しても、次の `wrangler deploy` で上書きされる
- つまずいたこと: `compatibility_date` が効くのはデプロイ済みの Worker ではなく次の deploy。Dashboard の `Workers Tail Read` の legacy 表示
- 次回: PR #4 をマージする。02 IaC 入門

### 2026-10-18 モジュール 01（01-1〜01-3）
- やったこと: Dashboard で `hello-world` を作って書き換えた。C3 で `labs/01-workers-intro/` を作った。`/`・`/whoami`・`/echo`・404 を実装し、OAuth で 1 回だけ deploy して logout した
- 学んだこと: Dashboard で作った Worker の正は Cloudflare にあり、Git にはない。`wrangler.jsonc` の `name` を変えると新しい Worker ができる。OAuth は route を書き込めるので、書き間違えると本番のゾーンへのリクエストがこの Worker に届きうる。ローカルの `cf` は、過去に一度取ってきた値のキャッシュ（30 日）で、そのリクエストのものではない
- つまずいたこと: Dashboard のエディタの場所。`worker-configuration.d.ts` をコミットするかどうか（`tsconfig.json` が参照しているのでコミットした）。テストが Node.js ではなく workerd で動くこと
- 次回: Draft PR を出す。トークンを特定の Worker だけに絞れるか確かめる。01-4（ログ）・01-5（ロールバック）

### 2026-10-17 モジュール 00
- やったこと: Account ID とゾーンの関係を確認し、2 要素認証を設定した。wrangler 用と terraform 用の Account API Token を作った。wrangler に OAuth とトークンの両方でログインした。Terraform の data source でアカウント名を読んだ
- 学んだこと: アカウントの中にゾーンがある。`workers.dev` のサブドメインはアカウントの設定でゾーンには属さない。Workers の Editor では新しい Worker を作れない。OAuth の scope は広く、`workers_routes (write)` だけでも本番のゾーンに影響しうる。lock file は provider のバージョンを固定するためにコミットする
- つまずいたこと: Account ID の場所（左上の表示はアカウント名だった）。Account ID を公開リポジトリに書くかどうか（書かないことにした）
- 次回: PR を出してマージする。01 Workers 入門

<!--
### YYYY-MM-DD モジュール NN
- やったこと:
- 学んだこと:
- つまずいたこと:
- 次回:
-->
