const fs = require("fs");

const pathDir = "/media/pi/65bed2da-7f3e-4e59-b2e6-53d6f7eba018/download/";

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  console.log(files_);
  return files_;
}

function rename(files) {
  files.map(file => {
    const charsRemove = [
      "[",
      "]",
      ".1080p",
      ".BluRay",
      ".x264",
      "-YIFY",
      ".LT",
      ".AG",
      ".AM",
      "YTS",
      ".BrRip",
      ".IMAX",
      "+HI",
      ".Deceit",
      "HDRip",
      "AAC2.0"
    ];
    let newName = "";
    charsRemove.forEach(element => {
      newName.replace(element, "");
    });
    fs.rename(file, newName, err => {});
  });
}

rename(getFiles(pathDir));
