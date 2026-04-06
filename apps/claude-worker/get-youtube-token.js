const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

const creds = JSON.parse(fs.readFileSync('youtube-credentials.json')).installed;
const oauth2 = new google.auth.OAuth2(creds.client_id, creds.client_secret, 'urn:ietf:wg:oauth:2.0:oob');

const url = oauth2.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/youtube.upload'],
});

console.log('\n이 URL을 브라우저에서 열어주세요:\n');
console.log(url);
console.log('\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('브라우저에서 받은 코드를 여기에 붙여넣으세요: ', async (code) => {
  const { tokens } = await oauth2.getToken(code);
  fs.writeFileSync('youtube-token.json', JSON.stringify(tokens, null, 2));
  console.log('\n✅ 완료! youtube-token.json 저장됨');
  console.log('refresh_token:', tokens.refresh_token);
  rl.close();
});
