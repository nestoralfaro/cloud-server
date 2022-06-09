const path = require("path");

module.exports = {
    projectDir(...rel) {return path.join(__dirname, "..", ...rel)},
    hostPort: 8000,
    logLevel: "dev",
    cloudDir: path.join(__dirname, "..", "/files"),
    maxFileSizeToUpload: 2e+9, //[2GB] in bytes
    sessionOptions: {
        secret: "cloudsecret",
        saveUninitialized: true,
        resave: false
    },
}