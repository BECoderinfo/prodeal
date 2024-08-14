const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./src/routes'); 
require("./utils/connection")
const app = express();

app.use(bodyParser.json()); 
app.use(cors()); 
app.use(indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
