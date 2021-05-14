const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Create a User</title></head>');
    res.write(
      '<body><h1>Create New User</h1><form action="/create-user" method="POST"><input type="text" name="username"/><button type="submit">Send</button></form></body>'
    );
    res.write('</html>');
    return res.end();
  }

  if (url === '/users') {
    res.write('<html>');
    res.write('<head><title>Users</title></head>');
    res.write('<body><ul><li>User 1</li></ul></body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];

    req.on('data', chunk => {
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const userName = parsedBody.split('=')[1];
      console.log(userName);
      res.status = 302;
      res.setHeader('Location', '/');
      return res.end();
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body>Hello from my node.js server!</body>');
  res.write('</html>');
  res.end();
};

module.exports = requestHandler;
