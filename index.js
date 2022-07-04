import {autoComplete, fetchCompanyDetails,quote, autoUpdate} from './api-calls.js'
import express from 'express';
import http from 'http';
import path from 'path';
import {fileURLToPath} from 'url'
import fs from 'fs';


const __dirname = path.dirname(fileURLToPath(import.meta.url))
console.log(path.join(__dirname,'dist/code'))
// const apiCalls = require('./api-calls.js')
const app = express();
const PORT = process.env.PORT || 8080;



const root = path.join('dist', 'code');



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.use(express.static(path.join(__dirname,'dist/code/')))
app.get('/',(req, res) => res.redirect("/search/home"))
app.get('/search',(req, res) => res.redirect("/search/home"))
app.use('/search/home', express.static(path.join(__dirname,'dist/code/')))
app.use('/search/:ticker', express.static(path.join(__dirname,'dist/code/')))
app.use('/watchlist', express.static(path.join(__dirname,'dist/code/')))
app.use('/portfolio', express.static(path.join(__dirname,'dist/code/')))



app.get('/autocomplete', async (request, response) =>{
    // response.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    let query = request.query.q
    // console.log(query)
    await autoComplete(query)
    .then(data=>{
        // console.log(data)
        response.send(data)
    })
    .catch(error =>{
        response.status(500).send({'name':'Error', 'message':error.message})
    });
    
});
app.get('/company_details', async (request, response) => {
    // response.set('Access-Control-Allow-Origin', 'http://localhost:8080');

    let ticker = request.query.symbol.toUpperCase()
    console.log(ticker)
    let result = fetchCompanyDetails(ticker)        //Result = Promise

    try{
        let res = await result;

        response.send(res)
    }
    catch(e){
        response.status(500).send({'name':'Error', 'message':e.message})
    }
    
 
})

app.get('/stock_quote', async (request, response) => {
    // response.set('Access-Control-Allow-Origin', 'http://localhost:8080');
    let ticker = request.query.symbol.toUpperCase()
    // console.log(query)
    let result = quote(ticker)
    let res = {}
    await Promise.all([result])
    .then(data => {
        res = data
        response.send(res)
    })
    .catch(e => {
        response.status(500).send({'name':'Error', 'message':e.message})
    })
    
})

app.use('/*', express.static(path.join(__dirname,'code/dist/code')))

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
