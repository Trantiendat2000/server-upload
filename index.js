var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
var app = express();
var path = require("path");
var cosr = require("cors");

var host = "localhost";
var port = 8080;

app.use(cosr());

// Create express app
app.use(bodyParser.urlencoded({ extended: true }));

// Create storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

// Routes will go here

/**
 * Uploading multiple files with field 'file'
 * @api /upload/media
 * @method POST
 *
 */
app.get("/upload", (req, res, next) => {
  console.log("run");

  res.status(200).send({
    message: "Success",
  });
});

app.post("/upload/media", upload.array("file"), (req, res, next) => {
  console.log("run post");

  const files = req.files;
  console.log(files);

  res.status(200).send({
    data: {
      urls: files.map(
        (item) => `http://${host}:${port}/files/${item.filename}`
      ),
    },
    error: 0,
    message: "Success",
  });
});

/**
 * Getting file with name
 * @api /files/:name
 * @method GET
 *
 */
app.get("/files/:name", (req, res) => {
  const fileName = req.params.name;
  const directoryPath = path.join(__dirname, "uploads/");

  res.sendFile(`${directoryPath}${fileName}`, fileName, (err) => {
    if (err) {
      try {
        res.status(500).send({
          message: "Could not get the file. " + err,
        });
      } catch (e) {}
    }
  });
});

// Server started on port 8080
app.listen(port, () => console.log(`Server started on port ${port}`));
