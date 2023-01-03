# Corporate Site

<br>

## 概要
- 企業向けのWebサイト(コーポレートサイト)を制作する
- Bootstrap を使った、モダンなデザインのWebサイトの作り方を学ぶ
- Javascript のライブラリを使用した、動的で多機能なWebサイトの作り方を学ぶ

<br>

## 使用技術
- HTML
- CSS
- JavaScript(ライブラリ多数)
- Firebase(ホスティング)
- GAS(バックエンド)

<br>

## フォームの実装方法

本コーポレートサイトには、２種類のフォームが実装されています。１つ目のフォームは企業に対する問い合わせを受け付けることができ、２つ目のフォームはメールマガジンの購読登録用のメールアドレスを受け付けます。サイトから送信されるデータは GAS(Google Apps Script) で受け取り、Google Spreadsheet に保存されます。

<br>

### フォームの実装手順
1. Spreadsheet を作成する
2. GAS を作成する( 上部メニューバー > 拡張機能 > Apps Script )
3. GASのソースコードを記述する
4. GAS のアクセス権限を付与する (Spreadsheet と Gmail へのアクセス権限)
5. デプロイする (アクセス権限は「全員」とすること)
6. ウェブアプリのURLを form タグの action 属性に転記する

<br>

### GAS側のソースコード① - 問い合わせフォーム用
```gas

/** スプレッドシートのファイルを取得 */
const sheets = SpreadsheetApp.openById("スプレッドシートID");
/** 情報を追記する対象シートを取得 */
const sheet = sheets.getSheetByName("formData");


/** Corporate 側のフォームが送信されたときに実行される処理 */
function doPost(e) {
  /** クライアント側から取得したデータを定数に保存する */
  const name = e.parameter.name;
  const email = e.parameter.email;
  const subject = e.parameter.subject;
  const message = e.parameter.message;
  

  /** 取得した情報をスプレッドシートに追記する */
  sheet.appendRow( [name, email, subject, message,] );
  
  

  /** Gmailで情報をスプレッドシートに登録したことを管理者に通知する */
  // 通知メールの宛先
  const adminMailAddress = "管理者のメールアドレス";
  // 件名を設定
  const mailSubject = "[Corporate Site] フォームが入力されました。";

  // メールの本文を設定
  const mailBody = `
${name} 様がフォームを送信しました。


【お問い合わせ本文】
${subject}

${message}



( ${name} 様のemail: ${email} )



※スプレッドシートでお問い合わせ内容を確認する場合は、以下のリンクをクリックしてください。
https://docs.google.com/spreadsheets/d/スプレッドシートID
`;

  // Gmail を送信
  GmailApp.sendEmail(adminMailAddress, mailSubject, mailBody);


  // 以下のようにreturnをただのテキストとすることでCORSエラーが予防できる
  return ContentService.createTextOutput("Success!");


  /** クライアント側にJSON形式で結果を返したい場合は以下のように記述する */
  // const response = {
  //   "name": "Test Sara",
  //   "email": "test@gmail.com",
  // };

  // 
  // return ContentService.createTextOutput( JSON.stringify(response) )
  //         .setMimeType(ContentService.MimeType.JSON);


}

```

<br>

### GAS側のソースコード② - フッターのメールマガジン用
```GAS
/** スプレッドシートのファイルを取得 */
const sheets = SpreadsheetApp.openById("先程作成したスプレッドシートID");
/** 情報を追記する対象シートを取得 */
const sheet = sheets.getSheetByName("mailAddress");


/** ニュースレター登録用の情報が送信されてきたときの処理 */
function doPost(e) {
  /** クライアント側から取得したデータを定数に保存する */
  const email = e.parameter.email;
  
  /** 取得した情報をスプレッドシートに追記する(1列目には番号を入れるため、空白にしておく) */
  sheet.appendRow( ['', email] );
  
  

  /** ------------- Gmailで情報をスプレッドシートに登録したことを管理者に通知する ------------*/
  // 通知メールの宛先
  const adminMailAddress = "管理者のメールアドレス";
  // 件名を設定
  const mailSubject = "[Corporate Site] ニュースレター購読依頼が届きました";

  // メールの本文を設定
  const mailBody = `
ニュースレター購読依頼を受け付けました。

ニュースレター購読希望者のメールアドレス：
${email}


※スプレッドシートで購読希望者を確認する場合は、以下のリンクをクリックしてください。
<< 先程作成したメールマガジン購読者のメールアドレスを保存しているスプレッドシートのURL >>
`;

  // Gmail を送信
  GmailApp.sendEmail(adminMailAddress, mailSubject, mailBody);

  /** ---------------------------- Gmail通知処理 ここまで ---------------------------------- */


  return ContentService.createTextOutput("Success.");
}

```

<br>

### ウェブアプリのURLを記載する方法 (index.html)
GASの記述が完了し、ウェブアプリのデプロイが完了すると、ウェブアプリのURLを入手することができます。このURLを form タグの action 属性に貼り付けることで、フォームから送信されるデータをGASで受け取ることが可能です。HTML 上でウェブアプリのURLを記載する箇所は以下を参考にすると分かりやすいでしょう。

```html
<form method="post" action="https://script.google.com/macros/s/GAS ScriptのデプロイID/exec">
  <!-- inputタグなど -->
</form>
```