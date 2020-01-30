//Install express server
const express = require('express');
const path = require('path');
// const proxy = require('express-http-proxy');

const app = express();

// app.use('/api', proxy('https://graph.squintboard.com/'));

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/output/dist'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/output/dist/index.html'));
});

const PORT = process.env.PORT || 80;

// Start the app by listening on the default Heroku port
app.listen(PORT, err =>
  err
    ? console.log(`Hubo un error al iniciar el servidor!\nError: ${err}`)
    : console.log(`Servidor inicializado en puerto ${PORT} con éxito!`)
);
