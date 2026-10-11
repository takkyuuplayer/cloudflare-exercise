# 12. Durable Objects

- 前提: 08
- 必要なもの: プランの要件を [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/) で確認する
- 成果物の置き場所: `labs/12-durable-objects/`

## ゴール

- Durable Object が「グローバルに一意で、単一スレッドで動く、ストレージ付きのオブジェクト」であることを説明できる
- 強い一貫性が必要な処理（カウンター、ロック、ルーム）を実装できる
- WebSocket を使ったリアルタイム通信を実装できる

## 公式ドキュメント

- [Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [What are Durable Objects?](https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/)
- [SQLite storage API](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)
- [Use WebSockets](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
- [Alarms](https://developers.cloudflare.com/durable-objects/api/alarms/)

## 演習

### 12-1 `[Code]` 正確なカウンター

名前ごとに独立したカウンターを Durable Object で作る（`GET /counter/:name`、`POST /counter/:name/increment`）。

**完了条件:** 並列に 100 回 increment しても正確に 100 増える（10-2 の KV 版と比較する）。

### 12-2 `[Code]` SQLite ストレージ

Durable Object 内の SQLite にデータを保存し、オブジェクトが再起動しても残ることを確認する。

### 12-3 `[Code]` チャットルーム

- ルーム名ごとに 1 つの Durable Object
- WebSocket で接続し、送ったメッセージを同じルームの全員に配信
- WebSocket Hibernation API を使う

**完了条件:** ブラウザのタブを 2 つ開いて会話できる。Hibernation を使う理由を説明できる。

### 12-4 `[Code]` Alarms

ルームに一定時間誰も発言しなければ履歴を消す処理を Alarm で実装する。

### 12-5 `[IaC]` マイグレーション

Durable Object のクラス名を変更する、またはクラスを削除する際の `migrations` 設定を `wrangler.jsonc` に書いて試す。

**完了条件:** migrations の記述を誤るとどうなるか、データはどうなるかを説明できる。

## チェックポイント

- Durable Object はどの地域に作られる？ 作成場所を制御する方法はあるか？
- 1 つの Durable Object に全ユーザーのリクエストを集めると何が起きる？ どう分割する？
- `idFromName` と `newUniqueId` の違いは？
- KV / D1 ではなく Durable Objects を選ぶべきなのはどんなとき？

## 発展課題

- [Agents SDK](https://developers.cloudflare.com/agents/) が Durable Objects の上にどう作られているかを調べる。
- レート制限を Durable Object で実装し、07 の WAF のレート制限と比較する。

## 後片付け

- 使わない Durable Object クラスは `deleted_classes` マイグレーションで削除する。
