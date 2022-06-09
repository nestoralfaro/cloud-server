const http = require("http");
const app = require("./app");
const config = require("./config");

const server = http.createServer(app);

server.listen(config.hostPort, () => {
    console.log(`Listening on port ${config.hostPort}`);
});