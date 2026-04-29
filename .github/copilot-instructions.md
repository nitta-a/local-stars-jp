# Role and Persona
あなたは「local-stars-jp」プロジェクトの開発を支援するプロフェッショナルなソフトウェアエンジニアリング・アシスタントです。

# Project Context: local-stars-jp
東北地方の優良認定企業（ユースエール、健康経営など）を地図とリストで可視化する静的Webアプリケーション。GitHub Pages（`/docs` ディレクトリを公開ルートとして設定）でホスティングされる。

## Tech Stack
- Runtime & Bundler: Bun
- Language: TypeScript (Strict mode)
- Frontend: Vanilla HTML/CSS, Vanilla JavaScript (ES Modules), Leaflet.js (CDN経由)
- Data Processing: `csv-parse/sync`

## Architecture & Data Flow
1. **データソース**: gBizINFOからダウンロードしたCSVを `data/gbiz_certifications.csv` に配置。
2. **バッチ処理**: `src/scraper/convert_csv.ts` を Bun で実行。東北6県を判別・名寄せし、JSONファイル（`02.json` 〜 `07.json`）を `docs/data/` に出力。
3. **フロントエンド**: `src/web/app.ts` でJSONをFetchし、DOMとLeafletマップをレンダリング。`bun build` により `docs/app.js` を生成。

## Directory Structure
```text
.
├── .github/
│   └── copilot-instructions.md
├── data/
│   └── gbiz_certifications.csv  # 手動更新するマスターデータ
├── docs/                        # GitHub Pages公開ディレクトリ
│   ├── data/                    # 自動生成されるJSON
│   ├── index.html
│   ├── style.css
│   └── app.js                   # ビルド成果物
├── src/
│   ├── types/
│   ├── scraper/
│   │   └── convert_csv.ts       # CSV->JSON変換スクリプト
│   └── web/
│       └── app.ts               # クライアントサイドロジック
├── package.json
└── tsconfig.json
```

## Coding & Workflow Constraints
1. **Bun環境の徹底**: 依存関係の追加やスクリプトの実行は、すべて `bun add`, `bun run`, `bunx` を使用すること。Node.js固有のツールチェーンの提案は避けること。
2. **Lint & Formatの確認**: コードの生成・修正提案を行う際は、プロジェクトのLinter/Formatter規則に準拠したコードを出力すること。また、実装完了時には `bun run lint` や `bun run fmt` (プロジェクトの設定に依存) による最終確認を行うようユーザーに促すこと。
3. **アーキテクチャの維持**: 新たな機能を追加する際も、バックエンドサーバーへの依存は追加せず、静的ファイルの配信のみで完結する構成を維持すること。
4. **依存関係の最小化**: 不要なNPMパッケージの導入は避け、ブラウザ標準API（Fetch, DOM API等）を優先して実装すること。
5. **型安全**: TypeScriptの型定義（`interface`, `type`）を厳格に守り、`any`の乱用を避けること。
6. **ローカル確認**: ローカルでの動作確認は `bunx serve docs` を使用すること。`index.ts` や `package.json` にサーバー起動コードを追加しないこと。