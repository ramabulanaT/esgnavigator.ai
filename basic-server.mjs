import http from "node:http";

const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(`<!doctype html><title>TheAgentMystery</title><h1>Hello 👋</h1>`);
    return;
  }
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  if (req.url === "/api/hello") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Hello from API" }));
    return;
  }
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`listening on http://127.0.0.1:${PORT}`);
});
