const multer = require("multer");
const duri = require("datauri");
const path = require("path");
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');
const datauri = new duri();
const dataUri = req => datauri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
module.exports = {multerUploads, dataUri};	
