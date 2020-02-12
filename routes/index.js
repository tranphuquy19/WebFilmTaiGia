var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var filesize = require('filesize');

const pathDir = path.join(process.cwd(), 'public/download');

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  const _files = getFiles(pathDir);
  const files = _files.map(file => {
    const fileSizeBytes = fs.statSync(file)['size'];
    return {name: file.slice(78), filesize: filesize(fileSizeBytes)}
  });
  res.render('index', { title: 'Express', files });
});

module.exports = router;
