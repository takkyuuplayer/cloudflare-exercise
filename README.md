# cloudflare-exercise

Cloudflare を、公式ドキュメントを教科書に **手を動かして** 体系的に学ぶためのリポジトリ。

- Dashboard で設定する → コードを書く → Terraform（IaC）で再現する、を繰り返す
- AI エージェント（Claude Code / Codex など）は [AGENTS.md](AGENTS.md) に従って先生・コーチ役を務める

## 始め方

1. [curriculum/README.md](curriculum/README.md) でロードマップと前提（費用・ドメイン）を確認する
2. `origin/main` から `learn/<NN>-<topic>` ブランチを切り、AI エージェントに「00 から始めたい」のように伝える
3. 演習ごとにコミットし、Draft PR を出して進める。PR がレビューの場になり、マージがモジュールの修了になる（詳しくは [AGENTS.md](AGENTS.md) の「PR で進める」）
4. セッションの終わりに [PROGRESS.md](PROGRESS.md) を更新し、PR にコミットする

## 構成

| パス | 内容 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | コーチ役エージェントの行動指針（`CLAUDE.md` から読み込む） |
| [PROGRESS.md](PROGRESS.md) | 進捗と学習ログ |
| [curriculum/](curriculum/README.md) | モジュールごとの演習・チェックポイント |
| `labs/<NN>-<topic>/` | 各モジュールで作る成果物 |
| `infra/` | モジュールをまたいで育てる Terraform |
