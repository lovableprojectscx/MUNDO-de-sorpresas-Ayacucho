const https = require('https');

const links = [
  "https://www.facebook.com/share/r/1ZjPxG3D27/",
  "https://www.facebook.com/share/v/1DWh9ZmP7i/",
  "https://www.facebook.com/share/r/18F6dfMbWN/",
  "https://www.facebook.com/share/v/18CQVYdw52/",
];

async function getRedirectUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location);
      } else {
        // Facebook perhaps sends 200 with meta refresh
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const match = data.match(/URL='([^']+)'/); // meta refresh
          if (match) resolve(match[1]);
          else resolve(url);
        });
      }
    }).on('error', () => resolve(url));
  });
}

(async () => {
  for (const link of links) {
    const finalUrl = await getRedirectUrl(link);
    console.log(`ORIGINAL: ${link} -> FINAL: ${finalUrl}`);
  }
})();
