# 04. SSL/TLS

- 前提: 03
- 必要なもの: 03 のゾーンとオリジン
- 成果物の置き場所: `infra/`

## ゴール

- 「訪問者 ↔ Cloudflare」と「Cloudflare ↔ オリジン」の 2 区間の暗号化を分けて説明できる
- 暗号化モード（Off / Flexible / Full / Full (strict)）の違いを、実際に壊して確かめた経験がある
- エッジ証明書・オリジン証明書・HSTS などを IaC で管理できる

## 公式ドキュメント

- [SSL/TLS overview](https://developers.cloudflare.com/ssl/)
- [Encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [Edge certificates](https://developers.cloudflare.com/ssl/edge-certificates/)
- [Origin CA certificates](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/)
- [HTTP Strict Transport Security (HSTS)](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/)

## 演習

### 04-1 `[Dashboard]` 暗号化モードを切り替えて壊す

オリジンの状態（HTTP のみ / 自己署名証明書 / 正規の証明書）と暗号化モードの組み合わせで、どれが動き、どれがエラー（525, 526 など）になるかを試す。結果を表にして `infra/NOTES.md` に残す。

**完了条件:** Flexible モードが「安全そうに見えて危ない」理由と、リダイレクトループが起きる典型パターンを説明できる。

### 04-2 `[CLI]` 証明書を観察する

`openssl s_client -connect <host>:443 -servername <host>` や `curl -v` で、訪問者が受け取るエッジ証明書の発行者・SAN・有効期限を確認する。DNS only のレコードと比べる。

**完了条件:** Universal SSL の証明書がカバーするホスト名の範囲を説明できる（`a.b.<domain>` のような 2 階層サブドメインはどうなるか）。

### 04-3 `[Dashboard]` 推奨設定を入れる

次を設定し、それぞれの効果を `curl` で確認する。

- Always Use HTTPS
- Minimum TLS Version
- HSTS（最初は短い max-age で。理由を考える）

### 04-4 `[IaC]` TLS 設定をコード化する

04-1〜04-3 で最終的に採用した設定を `infra/` の Terraform に落とす（ゾーン設定をどのリソースで書くかは Registry で確認する）。

**完了条件:** Dashboard で設定を一つ変えると `terraform plan` が検出する。

## チェックポイント

- Full と Full (strict) の違いは？ Full (strict) を使うためにオリジンには何が必要か？
- Origin CA 証明書をブラウザから直接オリジンにアクセスしたときに使うと何が起きるか？
- HSTS の max-age をいきなり長くするのが危険なのはなぜか？
- 526 エラーと 525 エラーはそれぞれどの区間の問題か？

## 発展課題

- Authenticated Origin Pulls（mTLS）を設定し、Cloudflare 以外からのアクセスをオリジンで拒否する。
- Certificate Transparency のログ（crt.sh など）で自分のドメインの証明書発行履歴を見る。

## 後片付け

- HSTS を長い max-age で有効化した場合は、ドメインを手放す予定がないかを確認する。
