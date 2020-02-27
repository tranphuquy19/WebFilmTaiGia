var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
var filesize = require("filesize");
var imdb = require("imdb-node-api");

const pathDir = "/media/pi/65bed2da-7f3e-4e59-b2e6-53d6f7eba018/download/";

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
/* GET home page. */
router.get("/", function(req, res, next) {
  const _files = getFiles(pathDir);
  const files = _files.map(file => {
    const fileSizeBytes = fs.statSync(file)["size"];
    return {
      filename: path.basename(file),
      name: path.basename(file, path.extname(file)),
      nameURI: String(path.basename(file, path.extname(file))).hashCode(),
      filesize: filesize(fileSizeBytes)
    };
  });
  res.render("index", { title: "Express", files, total: files.length });
});

router.get("/download", (req, res, next) => {
  const { name } = req.query;
  res.sendFile(path.join(pathDir, name));
});

router.get("/getdata", (req, res, next) => {
  const { name } = req.query;
  imdb.search({ searchKey: name, maxResult: 1 }, (e, d) => {
    if (d) {
      let { result } = JSON.parse(d);
      let film_ = result[0];
      if (film_) {
        imdb.getByImdbId(film_.imdbId, function(err, data) {
          let film = JSON.parse(data).result;
          film.title = film_.name;
          res.json({ mess: 200, film, name });
        });
      } else {
        res.json({ mess: 404, name });
      }
    } else {
      res.json({ mess: 404, name });
    }
  });
});

module.exports = router;
