# TRACE//VEHICLE — XC90

公開URL: https://tamjump.github.io/volvo/

VIN: YV1LFH6M4R1154216

## 構成
| パス | 内容 |
| --- | --- |
| `index.html` | 静的版（GitHub Pages）。案件・法的根拠ゲート・車両・取得経路・地図・タイムライン・証拠（SHA-256）・ハッシュ連鎖の監査ログ・JSON/CSV 出力。本番データとデモデータは保存領域を分離 |
| `worker/` | Volvo API 中継（Cloudflare Worker）。ブラウザからの CORS 遮断を回避。GET のみ・許可パスのみ・許可オリジンのみ。トークンは保存しない |
| `server/` | フルスタック版（Node + PostGIS）。ログイン・権限管理・GPS Webhook 受信・サーバー保存はこちら |

## 位置が表示される条件
- 案件の法的根拠が「承認済み」
- Volvo：車両が所有者の Volvo ID に紐付き、Connected Vehicle / Location API のトークンが有効
- その他：契約GPS・法的照会回答・現場観測のデータを取込

条件を満たさない場合は「取得不可」と表示し、位置を生成しない。VIN・登録番号だけでは取得しない。

## 認証情報
ページに埋め込まない。VCC API KEY とトークンはブラウザのタブ限定領域（sessionStorage）にのみ保持。
