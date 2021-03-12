require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const PORT = process.env.PORT;

const app = express();

mongoose.connect('mongodb+srv://semana:semana@cluster0-4mhkj.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});