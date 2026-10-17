# PROGRESS

## 進捗

状態: `未着手` / `進行中` / `完了` / `スキップ`

| # | モジュール | 状態 | 完了日 | メモ |
| --- | --- | --- | --- | --- |
| 00 | 環境準備とアカウントの基礎 | 完了 | 2026-10-17 | トークンはどちらも Account API Token |
| 01 | Workers 入門 | 未着手 | | |
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
| Account API Token `cloudflare-exercise-terraform`（Account Settings Read、期限なし） | 00 | Dashboard | 02 以降で Terraform から使う。02 で KV の権限を足す |

## 残っている疑問

- `takkyuuplayer.com` は本番のサイトで使っているゾーン。Part 2（03〜07）をどのドメインで進めるか、03 に入る前に決める（練習用のドメインを別に買う / サブドメインだけ使う など）
- wrangler をリポジトリのルートと各 lab のどちらにインストールするか（ルートに未コミットの `package.json` がある）。01 で決める
- トークンを Terraform で管理しようとすると、どんな問題が起きるか（02 で考える）

## 学習ログ

新しいものを上に追記する。

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
