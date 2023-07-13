const { text } = require("express");
const http = require("http");
const fs = require("fs");
const { brotliDecompressSync } = require("zlib");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>my homepage</title></head>");
    res.write(
      '<body><form action ="/message" method="POST"><input type="text" name="message"><button type ="submit">send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    req.on("end", () => {
      const parsdbody = Buffer.concat(body).toString();
      console.log(parsdbody);
      const message = parsdbody.split("=")[0];
      fs.writeFile("message.txt", message, (data, error) => {
        if (data) {
          res.statusCode = 302;
          res.setHeader("location", "/");
          return res.end();
        } else {
          console.log(error);
        }
      });
    });
  }
  res.setHeader("content-type", "text/html");
  res.write("<p> hi all</p>");
  return res.end();
});

server.listen(3000);
