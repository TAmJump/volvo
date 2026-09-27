# PAT / API Key / OAuth 設定
- PAT: TELEMATICS_PAT。Bearer PAT型provider adapterで使用。
- API Key: TELEMATICS_API_KEY。provider仕様に応じheader/queryへサーバー側から設定。
- OAuth: OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET / OAUTH_TOKEN_URL。Authorization Code + PKCE等、provider指定方式に実装。
- GPS webhook: GPS_WEBHOOK_SECRETで署名/secret検証。
- 本番は.envではなくAWS Secrets Manager / GCP Secret Manager / Azure Key Vault等を推奨。
- SecretをHTML、localStorage、Git、ログ、エクスポートへ出さない。
