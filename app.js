require('dotenv').load();
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const https = require('https');

app.use(fileUpload());
app.use(express.static('public'));

const getContent = function (url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

function scrape_insta_hash(tag) {
  return new Promise((resolve, reject) => {
    getContent(`https://www.instagram.com/explore/tags/${tag}/`)
      .then(insta_source => {
        let shards = insta_source.split('window._sharedData = ');
        let insta_json = shards[1].split(';</script>');
        let insta_array = JSON.parse(insta_json[0]);
        let images = insta_array['entry_data']['TagPage'][0]['graphql']['hashtag']['edge_hashtag_to_media']['edges'].map(x => x['node']['display_url']);
        resolve(images);
      })
      .catch(err => reject(err));
  })
}

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/instagram/:hashtag', function (req, res) {
    scrape_insta_hash(req.params.hashtag).then(images => res.send(images));
});

app.get('/images/:folder', function (req, res) {
    fs.readdir(req.params.folder, (err, files) => {
        res.send(files);
    });
});

app.post('/upload', function(req, res) {
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./filename.jpg', function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.send('File uploaded!');
    });
  });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});