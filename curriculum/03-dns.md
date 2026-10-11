# 03. ゾーンと DNS

- 前提: 00, 02
- 必要なもの: **自分のドメイン**（新規取得 or 既存）、オリジンとなる Web サーバー（後述）
- 成果物の置き場所: `infra/`（ここから Part 2 を通して育てる）

## ゴール

- ドメインを Cloudflare に載せる（フルセットアップ）手順と、ネームサーバー委任の仕組みを説明できる
- プロキシ（オレンジクラウド）と DNS only（グレークラウド）の違いを観察で示せる
- DNS レコードを Terraform で管理できる

## 公式ドキュメント

- [DNS overview](https://developers.cloudflare.com/dns/)
- [Full setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/)
- [Proxy status](https://developers.cloudflare.com/dns/proxy-status/)
- [DNS record types](https://developers.cloudflare.com/dns/manage-dns-records/reference/dns-record-types/)
- [Registrar](https://developers.cloudflare.com/registrar/)（ドメインを取得する場合）

## オリジンの用意

Part 2 の演習には、Cloudflare の背後に置く「オリジン」が必要。次のいずれかを用意する。

- **GitHub Pages**（無料。静的サイトで十分な演習が多い）
- 手持ちの VPS / クラウドの VM
- 後で [15 Cloudflare Tunnel](15-tunnel.md) を学んだら、ローカルマシンをオリジンにすることもできる

レスポンスヘッダー（`Cache-Control` など）を自由に変えられるオリジンだと、[05 キャッシュ](05-cache.md) の演習がやりやすい。

## 演習

### 03-1 `[Dashboard]` ゾーンを追加する

1. Dashboard でドメインを追加し、Free プランを選ぶ。
2. 指定された Cloudflare のネームサーバーに、レジストラ側で変更する（Cloudflare Registrar で取得した場合は不要）。
3. `dig NS <domain>` と `dig NS <domain> @<TLD のネームサーバー>` で委任が切り替わったことを確認する。

**完了条件:** ゾーンのステータスが Active になる。委任が反映されるまでに何が起きていたか説明できる。

### 03-2 `[Dashboard]` プロキシの有無を観察する

同じオリジンを指す 2 つのレコードを作る。

- `proxied.<domain>` — Proxied
- `direct.<domain>` — DNS only

それぞれに `dig` と `curl -I` を実行し、比較表を `infra/NOTES.md` にまとめる（返る IP アドレス、`server` ヘッダー、`cf-ray` ヘッダーの有無など）。

**完了条件:** プロキシを有効にすると「誰の IP が DNS で返り、TLS を誰が終端しているか」を説明できる。

### 03-3 `[IaC]` ゾーンと DNS を Terraform に取り込む

`infra/` に Terraform の構成を作る。

- ゾーンは data source で参照するか、import して resource として管理するかを選ぶ（理由を `infra/NOTES.md` に書く）
- 03-2 のレコードを import する
- 新しいレコード（例: `iac.<domain>` の TXT）を Terraform から追加する

**完了条件:** `terraform plan` が差分なし。Dashboard でレコードの値を変えると plan で検出できる。

### 03-4 `[CLI]` DNS の動作を観察する

- TTL を変えたときに `dig` の結果の TTL がどう減っていくか観察する
- Proxied レコードの TTL が Auto になる理由をドキュメントで確認する

## チェックポイント

- ネームサーバーを変更しても、すぐに全世界で切り替わらないのはなぜか？
- Proxied にできないレコードタイプは何か？ それはなぜか？
- オリジンの IP アドレスを隠したいとき、Proxied にするだけで十分か？
- CNAME flattening とは何か？ ゾーン頂点（apex）で CNAME を使いたいときに何が起きるか？

## 発展課題

- DNSSEC を有効化し、`dig +dnssec` で署名を確認する（Cloudflare Registrar 以外の場合はレジストラ側に DS レコードの登録が必要）。
- 既存の DNS を全部 `cf-terraforming` で生成して `infra/` に取り込む。

## 後片付け

- ゾーンは Part 2 以降も使うので残す。PROGRESS.md の「残しているリソース」に記録する。
