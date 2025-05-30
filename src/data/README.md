# AWS CLF 試験問題 JSON フォーマット

このドキュメントでは、AWS CLF 試験対策アプリで使用する問題のJSONフォーマットについて説明します。

## 基本構造

問題は以下のJSONフォーマットで定義されます：

```json
{
  "id": 1,
  "question": "問題文をここに記述します",
  "options": [
    "選択肢1",
    "選択肢2",
    "選択肢3",
    "選択肢4"
  ],
  "correctAnswer": 0,
  "explanation": "解説文をここに記述します",
  "domain": "Cloud Concepts",
  "difficulty": "easy"
}
```

## フィールドの説明

| フィールド | 型 | 説明 |
|------------|------|-------------|
| id | 数値 | 問題の一意の識別子 |
| question | 文字列 | 問題文 |
| options | 文字列の配列 | 選択肢（通常4つ） |
| correctAnswer | 数値 | 正解の選択肢のインデックス（0から始まる） |
| explanation | 文字列 | 解答の解説 |
| domain | 文字列 | 問題のドメイン/カテゴリ |
| difficulty | 文字列 | 問題の難易度（"easy", "medium", "hard"） |

## ドメイン

問題は以下のドメインに分類されます：

- "Cloud Concepts" (クラウドの概念)
- "Technology" (テクノロジー)
- "Security and Compliance" (セキュリティとコンプライアンス)
- "Billing and Pricing" (請求と料金)

これらのドメインはAWS認定クラウドプラクティショナー試験の主要な分野に対応しています。

## 使用例

問題データは `src/data/questions.json` ファイルに配列として保存されます。サンプル問題は `src/data/sampleQuestions.json` にあります。

## 注意事項

- 全ての問題には一意のIDを割り当ててください
- 選択肢は通常4つ用意してください
- 正解の選択肢のインデックスは0から始まることに注意してください（最初の選択肢が正解の場合は0）
