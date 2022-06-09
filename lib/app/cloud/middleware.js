'use strict';

const fs = require("fs").promises;
const config = require("../../config");
const path = require("path");

async function listDir(dirName, originalURL) {
    //Code provided by Dr. Foust
    let contents = await fs.readdir(dirName);
    let promises = [];
    for (let entry of contents) promises.push(await fs.stat(path.join(dirName, entry)));
    let stats = await Promise.all(promises);
    let dirsArr = [];
    let filesArr = [];
    for (let i = 0; i < contents.length; i++){
        if (stats[i].isDirectory()) {
            dirsArr.push({name: encodeURI(contents[i]), isDirectory: true, path: path.join(originalURL, contents[i], '/')});
        } 
        else {
            filesArr.push({name: encodeURI(contents[i]), isDirectory: false, path: path.join(originalURL, contents[i])});
        }
    }
    //sorting each array alphabetically
    dirsArr.sort((a,b) => a.name.localeCompare(b.name));
    filesArr.sort((a,b) => a.name.localeCompare(b.name));
    //returning both arrays as one object
    return Object.assign({}, [...dirsArr, ...filesArr]);
}

async function cloud(req, res) {
    if (req.originalUrl.match(/\/(\?|$)/)) {
        // requesting a directory (ends with slash)
        try {
            let files = await listDir(config.cloudDir + req.url, req.originalUrl);
            res.status(200);
            res.type("text/html");
            res.render("template/cloud.hbs", {files, currentDirectory: req.originalUrl});
        }
        catch (e) {
            res.status(500);
            res.type("text/html");
            res.send(`
                <html>
                    <body>
                        <h1>Internal server error. Sorry!</h1>
                    </body>
                </html>
            `);
        }
    }
    else {
        const requestedFilePath = (config.cloudDir + req.url.split("?")[0]);
        if (requestedFilePath.includes("..")){
            requestedFilePath.replace("/../", '/');
            res.status(404);
            res.type("text/html");
            res.send(`
            <html>
                <body>
                    <h1>Error: Not found.</hr>
                </body
            </html>
            `);
        } else {
            //Code Hint by Dr. Foust
            let testUrl = req.originalUrl.replace(/(\?|$)/, '/$1');

            let isDir = await (await fs.lstat(requestedFilePath)).isDirectory();
            if (isDir) res.redirect(307, testUrl);
            if ("download" in req.query) res.download(requestedFilePath);
            else res.sendFile(requestedFilePath);
        }
    }
}

async function postReqs (req, res) {
    try {
        switch (req.body.command) {
            case "upload":
                if (req.file.size <= config.maxFileSizeToUpload)
                    await fs.rename(req.file.path, config.cloudDir + req.path + req.file.originalname);
                else {
                    res.status(400);
                    res.type("text/html");
                    res.send(`
                    <html>
                        <body>
                            <h1>
                                Max file size is ${config.maxFileSizeToUpload} byte(s)
                                <br/>
                                Please try again.
                            </h1>
                        </body>
                    </html>
                    `);
                }
                break;
            case "rm":
                await fs.rm(config.cloudDir + req.path + req.body.file);
                break;
            case "mkdir":
                await fs.mkdir(config.cloudDir + req.path + req.body.dir);
                break;
            case "rmdir":
                await fs.rmdir(config.cloudDir + req.path + req.body.dir, {recursive: true});
                break;
            default:
                res.redirect(400, '.');
        }
    }
    catch (e) {
        res.redirect(400, '.');
    }
    res.redirect(303, '.');
}

function common (req, res) {
    res.redirect(400, '.');
}

module.exports = {cloud, postReqs, common};