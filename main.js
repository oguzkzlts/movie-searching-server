const http = require ("http");

const host = 'localhost';
const port = 8001;

const handler = function (req,res){
    res.writeHead(200);
    res.end("Welcome!");
}

const server = http.createServer(handler);
server.listen(port, host, () => {
    console.log(`server running on port ${port}`)
}
)