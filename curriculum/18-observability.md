# 18. Observability

- 前提: 08（Part 2 を終えているとゾーンの分析もできる）
- 必要なもの: 無料プランで可（Logpush などはプランによる）
- 成果物の置き場所: `labs/18-observability/`

## ゴール

- Workers のログ・トレース・メトリクスを使って障害を調べられる
- GraphQL Analytics API でトラフィックを集計できる
- ログを外部（R2 など）に送る方法を知っている

## 公式ドキュメント

- [Workers Observability](https://developers.cloudflare.com/workers/observability/)
- [Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/)
- [Tail Workers](https://developers.cloudflare.com/workers/observability/logs/tail-workers/)
- [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/)
- [Logs (Logpush)](https://developers.cloudflare.com/logs/)
- [Workers Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)

## 演習

### 18-1 `[Code]` 構造化ログ

08 の Worker で Workers Logs を有効にし、`console.log` を JSON 形式（リクエスト ID、パス、所要時間など）にする。

**完了条件:** Dashboard の Observability で特定のフィールドを条件にログを検索できる。

### 18-2 障害対応ドリル

コーチにわざとバグ（特定の条件で例外、遅いレスポンスなど）を仕込んでもらい、ログとメトリクスだけで原因を特定する。

**完了条件:** 原因・影響範囲・修正方法を短い報告として `labs/18-observability/INCIDENT.md` に書く。

### 18-3 `[Code]` GraphQL Analytics API

GraphQL Analytics API で、ゾーンの日別リクエスト数・キャッシュヒット率・ステータスコード別件数（またはWorker の呼び出し数とエラー数）を取得するスクリプトを書く。

**完了条件:** Dashboard の数字と一致することを確認する。

### 18-4 `[Code]` 独自メトリクス

Workers Analytics Engine に独自のイベント（例: 短縮 URL のクリック数）を書き込み、SQL API で集計する。

## チェックポイント

- `wrangler tail` と Workers Logs はどう使い分ける？
- サンプリングされたデータを見るときに注意することは？
- 障害発生時に最初に見るべきものは何か？ 自分の Worker でそれはどこにある？

## 発展課題

- Logpush で HTTP リクエストログ（プランによる）や Workers のトレースイベントを R2 に送る。
- OpenTelemetry 形式で外部の監視サービスにエクスポートする。

## 後片付け

- ドリル用に仕込んだバグを取り除く。
