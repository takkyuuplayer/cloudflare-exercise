# PROGRESS

## 進捗

状態: `未着手` / `進行中` / `完了` / `スキップ`

| # | モジュール | 状態 | 完了日 | メモ |
| --- | --- | --- | --- | --- |
| 00 | 環境準備とアカウントの基礎 | 完了 | 2026-10-17 | トークンはどちらも Account API Token |
| 01 | Workers 入門 | 進行中 | | 01-1〜01-3 完了。次は 01-4・01-5 |
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
| Account API Token `cloudflare-exercise-wrangler`（Workers Editor、期限なし） | 00 | Dashboard | 01 以降で wrangler から使う。01 で Worker を作ったら、その Worker だけに範囲を絞る |
| Worker `hello-world`（`hello-world.takkyuuplayer.workers.dev`） | 01 | Dashboard | 01-1 で作成。01 の後片付けで削除する |
| Worker `01-workers-intro`（`01-workers-intro.takkyuuplayer.workers.dev`） | 01 | `labs/01-workers-intro/`（wrangler） | 01-4・01-5 で使い続ける |
| Account API Token `cloudflare-exercise-terraform`（Account Settings Read、期限なし） | 00 | Dashboard | 02 以降で Terraform から使う。02 で KV の権限を足す |

## 残っている疑問

- `takkyuuplayer.com` は本番のサイトで使っているゾーン。Part 2（03〜07）をどのドメインで進めるか、03 に入る前に決める（練習用のドメインを別に買う / サブドメインだけ使う など）
- Account API Token で、特定の Worker だけに権限を絞れるか（01-4 の前に確かめる）
- トークンを Terraform で管理しようとすると、どんな問題が起きるか（02 で考える）

## 学習ログ

新しいものを上に追記する。

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
