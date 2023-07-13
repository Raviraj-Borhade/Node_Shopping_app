const fs = require("fs");

const deletefile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.deletefile = deletefile;
