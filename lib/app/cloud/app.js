const express = require("express");
const router = express.Router();
const mw = require("./middleware");
const config = require("../../config");
const multer = require("multer");
const upload = multer({dest: config.projectDir(config.cloudDir)});

router.get("/*", mw.cloud);
router.post("/*", upload.single("file"), mw.postReqs);
router.use(mw.common);
module.exports = {router};