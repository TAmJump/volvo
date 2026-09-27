# TRACE//VEHICLE FULLSTACK v2

## 起動
1. `.env.example` を `.env` にコピー。
2. 正規に発行された PAT/API Key/OAuth credentials を `.env` または本番Secret Managerへ設定。
3. `docker compose up`
4. http://localhost:8080

## PAT
`TELEMATICS_PAT` はサーバーだけが読みます。HTML/JavaScriptへ絶対に埋め込みません。
`src/connectors/patTelematics.js` がBearer PAT型APIの実装例です。実際のメーカー/プロバイダ仕様に合わせてendpoint/response mappingを変更します。

## API Key/OAuth
`.env.example` に設定欄あり。ProviderごとにConnector adapterを追加してください。

## 実位置が出る条件
- Providerとの契約/API利用権限がある
- 対象車両について必要な所有者認証・業務権限等がある
- Providerがlocation endpoint/dataを提供する
- Legal BasisがAPPROVED

上記がない場合、アプリは位置を捏造せず取得不可を返します。
