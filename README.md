# AWS CLF 試験対策アプリ

AWS認定クラウドプラクティショナー試験対策のためのモバイルアプリケーションです。500問以上の問題を収録し、様々な学習モードで効率的に試験対策ができます。

## 機能

- **一問一答モード**: 10問の問題をランダムに出題し、解答後に解説を表示
- **分野別学習**: AWS CLFの主要分野（クラウドの概念、テクノロジー、セキュリティとコンプライアンス、請求と料金）ごとに問題を解くことができます
- **模擬試験モード**: 本番と同様の形式で65問の問題に挑戦し、合格ラインを確認できます
- **ブックマーク機能**: 重要な問題や復習したい問題をブックマークして後から確認できます
- **間違えた問題の復習**: 誤答した問題だけを集中的に復習できます
- **進捗管理**: 分野別の正答率や学習状況を確認できます
- **オフライン対応**: インターネット接続なしでも学習可能です

## インストール方法

```bash
# リポジトリをクローン
git clone https://github.com/mot1234567/awsClf2.git

# 依存関係をインストール
cd awsClf2
npm install

# アプリを起動
npx expo start
```

## 使用技術

- React Native / Expo
- TypeScript
- AsyncStorage (ローカルデータ保存)
- React Navigation
- Jest (テスト)

## 問題データ形式

問題データは以下のJSONフォーマットで定義されています：

```json
{
  "id": 1,
  "question": "問題文",
  "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "correctAnswer": 0,
  "explanation": "解説文",
  "domain": "Cloud Concepts",
  "difficulty": "easy"
}
```

詳細なフォーマット説明は `src/data/README.md` に記載しています。

## 開発環境のセットアップ

### 前提条件

- Node.js 14.0以上
- npm または yarn
- Expo CLI

### 開発用コマンド

```bash
# 開発サーバーを起動
npx expo start

# iOSシミュレータで実行
npx expo start --ios

# Androidエミュレータで実行
npx expo start --android

# テストを実行
npm test

# TypeScriptの型チェック
npx tsc --noEmit
```

## テスト

Jest と React Native Testing Library を使用して自動テストを実装しています。

```bash
# すべてのテストを実行
npm test

# 特定のテストファイルを実行
npm test -- QuizScreen.test.tsx

# テストカバレッジレポートを生成
npm test -- --coverage
```

## ライセンス

MIT

## 作者

mot1234567
