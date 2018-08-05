// Include the server in your file
const server = require('server');

const app = require(express);
const { get, post } = server.router;

// Handle requests to the url "/" ( http://localhost:3000/ )
// server([
//   get('/', ctx => 'Hello world!')
// ]);

app.get('/', function(req,res) {
    res.sendfile('./index.html');
   });