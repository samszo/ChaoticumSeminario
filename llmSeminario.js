const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chaoticum Seminario</title>
        </head>
        <body>
            <h1>Bienvenue au Chaoticum Seminario</h1>
            <p>Ceci est une page web servie par un serveur Node.js.</p>
        </body>
        </html>
    `);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

import ollama from 'ollama'

const response = await ollama.chat({
  model: 'llama3.1',
  messages: [{ role: 'user', content: 'Why is the sky blue?' }],
})
console.log(response.message.content)