# 17. Gateway と WARP（任意）

- 前提: 16
- 必要なもの: Zero Trust の組織、WARP クライアントを入れてよい端末
- 成果物の置き場所: `infra/`

> このモジュールは「社内ネットワークを守る」側の機能で、Web サービス開発者には必須ではない。会社の端末に入れる場合は、社内の IT 管理者のルールに従うこと。

## ゴール

- Secure Web Gateway（SWG）の DNS / HTTP / Network ポリシーの違いを説明できる
- WARP クライアントを Zero Trust 組織に登録し、ポリシーを適用できる

## 公式ドキュメント

- [Gateway](https://developers.cloudflare.com/cloudflare-one/traffic-policies/)
- [DNS policies](https://developers.cloudflare.com/cloudflare-one/traffic-policies/dns-policies/)
- [Cloudflare One Client（旧 WARP client）](https://developers.cloudflare.com/cloudflare-one/team-and-resources/devices/cloudflare-one-client/)

## 演習

### 17-1 `[Dashboard]` DNS フィルタリング

WARP を使わずに、Gateway の DNS ロケーション（DoH エンドポイントなど）をブラウザか OS に設定し、特定カテゴリや特定ドメインをブロックするポリシーを作る。

**完了条件:** ブロック対象のドメインが解決されず、Gateway のログに記録される。

### 17-2 `[Dashboard]` WARP で端末を登録する

WARP クライアントを Zero Trust 組織に登録し、HTTP ポリシー（TLS 検査は任意）を試す。

**完了条件:** 端末からの通信が Gateway のログに出る。

### 17-3 `[IaC]` ポリシーをコード化

17-1 のポリシーを Terraform で管理する。

## チェックポイント

- DNS ポリシーだけでは防げないものは何か？
- TLS 検査を有効にするには端末側に何が必要で、どんなリスクがあるか？

## 後片付け

- WARP クライアントを組織から外す / アンインストールする。DNS 設定を元に戻す。
