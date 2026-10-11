# 13. 非同期処理: Cron・Queues・Workflows

- 前提: 08（11 の D1 があると題材にしやすい）
- 必要なもの: Queues / Workflows のプラン要件を各 Pricing ページで確認する
- 成果物の置き場所: `labs/13-async/`

## ゴール

- Cron Triggers・Queues・Workflows の使い分けを説明できる
- メッセージの再試行・Dead Letter Queue・冪等性を考慮した処理を書ける
- 複数ステップの長時間処理を Workflows で耐障害的に書ける

## 公式ドキュメント

- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Queues](https://developers.cloudflare.com/queues/)
- [Queues: Batching, retries and delays](https://developers.cloudflare.com/queues/configuration/batching-retries/)
- [Dead Letter Queues](https://developers.cloudflare.com/queues/configuration/dead-letter-queues/)
- [Workflows](https://developers.cloudflare.com/workflows/)
- [Workflows: Rules of Workflows](https://developers.cloudflare.com/workflows/build/rules-of-workflows/)

## 演習

### 13-1 `[Code]` Cron で定期実行

5 分ごとに外部 API（天気、為替など）を取得して KV か D1 に保存する。`scheduled` ハンドラーをローカルでテストする方法も調べる。

**完了条件:** Dashboard で Cron の実行履歴を確認できる。

### 13-2 `[Code]` Queues で処理を非同期化

- Producer: `POST /jobs` で受け付けたら即 202 を返し、キューにメッセージを送る
- Consumer: メッセージを処理する。ランダムに失敗させ、再試行されることを確認する
- 一定回数失敗したら Dead Letter Queue に送る

**完了条件:** 同じメッセージが 2 回処理されても結果が壊れない（冪等）ことを説明できる。

### 13-3 `[Code]` Workflows

「画像を R2 から取得 → 加工（または Workers AI で説明文生成）→ D1 に保存 → 通知」のような複数ステップの処理を Workflow にする。途中のステップをわざと失敗させ、再試行と再開の挙動を観察する。

**完了条件:** `step.do` の外に副作用を書いてはいけない理由を説明できる。

### 13-4 `[IaC]` キューを Terraform で作る

キュー本体を Terraform で作り、Producer / Consumer のバインディングは wrangler で設定する。

## チェックポイント

- 「Cron で 1 分ごとに未処理のレコードを探す」設計と、「Queues に積む」設計の違いは？
- Queues の配信保証は at-least-once か exactly-once か？ それが設計に与える影響は？
- Workflows と Queues はどう使い分ける？

## 発展課題

- R2 のイベント通知を Queues に送り、アップロードをトリガーに処理を走らせる。

## 後片付け

- 不要な Cron Trigger を外す（定期実行は放置するとリクエスト数を消費し続ける）。
