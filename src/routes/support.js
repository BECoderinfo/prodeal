const express = require('express');

const { addquotation , getquotations , deletequotation , giveAnswer , getquotationsbyserch  } = require('../controllers/supportController');

const supportRouter = express.Router();

supportRouter.post('/quotation', addquotation);
supportRouter.get('/quotations', getquotations);
supportRouter.post('/answer', giveAnswer);
supportRouter.delete('/quotation/:id', deletequotation);
supportRouter.get('/search/:quotation', getquotationsbyserch);


module.exports = supportRouter;