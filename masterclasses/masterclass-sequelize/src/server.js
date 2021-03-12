const express = require('express');
const routes = require('./routes');

const PORT = 3333;

require('./database');

const app = express();

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}...`);
});