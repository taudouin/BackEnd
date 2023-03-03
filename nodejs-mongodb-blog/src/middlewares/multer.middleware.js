const multer = require("multer");
const path = require("path");
const maxSize = 5 * 1024 * 1024;

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: "src/public/img/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${(file.originalname.split(' ')).join('_')}`);
  },
});

//initializing multer
const upload = multer({
  storage: storageEngine,
  limits: {
    fileSize: maxSize
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = function async(file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|webp/;
  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Format de fichier non supporté !");
  }
};

module.exports = upload;