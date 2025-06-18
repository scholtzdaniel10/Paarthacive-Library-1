const https = require('https');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const imageCount = 5;

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      // Handle redirect
      if (res.statusCode === 302 && res.headers.location) {
        https.get(res.headers.location, res2 => {
          if (res2.statusCode !== 200) return reject('Failed to get image');
          const fileStream = fs.createWriteStream(dest);
          res2.pipe(fileStream);
          fileStream.on('finish', () => fileStream.close(resolve));
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => fileStream.close(resolve));
      } else {
        reject('Failed to get image');
      }
    }).on('error', reject);
  });
}

(async () => {
  for (let i = 1; i <= imageCount; i++) {
    const url = `https://picsum.photos/400/600?random=${i}`;
    const dest = path.join(uploadDir, `sample${i}.jpg`);
    console.log(`Downloading ${url} -> ${dest}`);
    try {
      await downloadImage(url, dest);
      console.log(`Downloaded sample${i}.jpg`);
    } catch (err) {
      console.error(`Failed to download sample${i}.jpg:`, err);
    }
  }
  console.log('All images downloaded!');
})();