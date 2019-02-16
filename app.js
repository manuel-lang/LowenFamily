const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const https = require('https');

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'pug');

var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "./Images");
  },
  filename: function(req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({
  storage: Storage
}).array("imgUploader", 1); //Field name and max count

app.get('/', function (req, res) {
  get_images('lowenfamily').then(images => res.render('index', { instagram: images }));
});

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

function get_images(tag) {
  return new Promise((resolve, reject) => {
    getContent(`https://www.instagram.com/explore/tags/${tag}/`)
      .then(insta_source => {
        let shards = insta_source.split('window._sharedData = ');
        let insta_json = shards[1].split(';</script>');
        let insta_array = JSON.parse(insta_json[0]);
        let images = insta_array['entry_data']['TagPage'][0]['graphql']['hashtag']['edge_hashtag_to_media']['edges'].map(x => x['node']['display_url']);
        fs.readdir('public/images/uploads', (err, files) => {
          files.forEach(function(element) {
            images.unshift("images/uploads/" + element);
          });
          resolve(images);
        }); 
      })
      .catch(err => reject(err));
  })
}

app.post('/upload', function(req, res) {
  upload(req, res, function(err) {
      if (err) {
          return res.end("Something went wrong!");
      }
      return res.end("File uploaded sucessfully!.");
  });
});

app.listen(process.env.PORT || 5000, function () {
  console.log(`Example app listening on port ${process.env.PORT || 5000}!`);
});