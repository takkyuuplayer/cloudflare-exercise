# 15. Cloudflare Tunnel

- 前提: 00（公開ホスト名を使う場合は 03）
- 必要なもの: Zero Trust の組織（無料プランあり。初回に支払い方法の入力を求められる場合がある）、`cloudflared`
- 成果物の置き場所: `labs/15-tunnel/`, `infra/`

## ゴール

- Tunnel が「外向きの接続だけでオリジンを公開する」仕組みであることを説明できる
- ローカルの Web アプリをポート開放なしで独自ドメインに公開できる
- Tunnel を Terraform で管理できる（リモート管理のトンネル）

## 公式ドキュメント

- [Cloudflare One](https://developers.cloudflare.com/cloudflare-one/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)
- [Create a tunnel (dashboard)](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/get-started/create-remote-tunnel/)
- [Quick Tunnels (TryCloudflare)](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)
- [Deploy Tunnels with Terraform](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/deployment-guides/terraform/)

> Cloudflare One のドキュメントは構成変更が多い。リンクが切れていたら Cloudflare One のトップから辿る。

## 演習

### 15-1 `[CLI]` Quick Tunnel

ローカルで適当な Web サーバー（`python3 -m http.server` など）を起動し、`cloudflared tunnel --url` でアカウントなしの一時 URL を発行する。

**完了条件:** スマートフォンのモバイル回線からローカルのサーバーにアクセスできる。

### 15-2 `[Dashboard]` 名前付きトンネル（リモート管理）

Dashboard でトンネルを作り、`app.<domain>` をローカルのサーバーに割り当てる。

**完了条件:** `app.<domain>` でアクセスでき、ルーターやファイアウォールのポートを一切開けていないことを説明できる。DNS にどんなレコードが作られたかを確認する。

### 15-3 `[IaC]` トンネルを Terraform で作る

15-2 と同等のトンネル、トンネル設定（ingress）、DNS レコードを `infra/` の Terraform で作り直す。トンネルのトークンの扱いに注意する。

**完了条件:** `terraform apply` → `cloudflared` を起動 → 公開、までがコードと手順書で再現できる。

## チェックポイント

- Tunnel を使うと、オリジンのファイアウォールでどんな通信を許可すればよい？
- 「ローカル設定ファイルで管理するトンネル」と「リモート管理のトンネル」の違いは？
- 1 つのトンネルで複数のホスト名・サービスを公開するにはどうする？
- Tunnel で公開しただけでは誰でもアクセスできる。どう守る？（→ 16）

## 発展課題

- `cloudflared` を Docker コンテナとして動かし、`docker compose` で Web アプリと一緒に起動する。
- 03〜07 のオリジンを Tunnel 経由に切り替え、オリジンの公開ポートを閉じる。

## 後片付け

- Quick Tunnel は停止する。名前付きトンネルを残す場合は PROGRESS.md に記録する。
