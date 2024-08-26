import multer from "multer";
import path from "path";
// setup multer storage for storing the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "..", "public", "images"));
  },

  // store the files in in it's actual format rather than binary

  filename: function (req, file, cb) {
    let fileExtension = "";
    if (file.originalname.split(".").length > 1) {
      fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf(".")
      );
    }

    console.log(file);

    // filename without extension
    const filenameWithoutExtension = file.originalname
      .split(" ")
      .join("-")
      .split(".")
      .slice(0, -1)
      .join(".");

    cb(
      null,
      filenameWithoutExtension +
        Date.now() +
        Math.ceil(Math.random() * 1e3) +
        fileExtension
    );
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
