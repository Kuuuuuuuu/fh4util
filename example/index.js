const Server = require("..");

const server = new Server();

setInterval(() => {
  console.log(server.getData());
}, 1000);
