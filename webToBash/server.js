const path = require("path");
const express = require("express");
const { spawn } = require("child_process");

// GET http://localhost:3000/_all_dbs HTTP/1.1
// https://betterprogramming.pub/the-anatomy-of-an-http-request-728a469ecba9

const gitcouch = spawn("./gitcouch", [], { cwd: path.join(__dirname, "..") });

gitcouch.stdout.on("data", (data) => {
  console.log(`stdout:\n${data}`);
});

gitcouch.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

// gitcouch.stdin.write(
//   `GET /_all_dbs HTTP/1.1
// Host: localhost:3000
// Referer: http://localhost:3000/browse/index.html
// \n`
// );

// =====================

const port = 3000;

const app = express();

app.use(express.static("../web"));

app.get("/*", function (req, res) {
  const gitcouchRequest = `${req.method} ${req.originalUrl} HTTP/1.1
  Host: ${req.hostname}
  Referer: ${req.get("Referer")}
  \n`;
  gitcouch.stdin.write(gitcouchRequest);

  res.status(200).send("TODO");
});

app.use(require("./404"));

app.listen(port, () => {
  console.log("APP STARTED ON PORT", port, `: http://localhost:${port}`);
});

console.log("FIN");
