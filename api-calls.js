import axios from 'axios'
import { response } from 'express';
// import { response } from 'express';
const API_KEY = '' ;
const HOST = 'https://finnhub.io/api/v1/'

function dateConverterStandard(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = (a.getMonth() + 1).toString().padStart(2, "0");

    let date   = a.getDate().toString().padStart(2, "0");

    let time = year + '-' + month + '-' + date + ' '+ a.getHours() +':'+ a.getMinutes() +':'+a.getSeconds();

    return time;
  }

function getTodayDate(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}




let makeHttpCall = function(url){
    let res = axios.get(url)
    return res    
}

function convertDateAPI(a){
    let year = a.getFullYear();
    let month = (a.getMonth() + 1).toString().padStart(2, "0");
    
    let date   = a.getDate().toString().padStart(2, "0");   
    let time = year + '-' + month + '-' + date;
    return time;
}

function dateConverterNews(UNIX_timestamp){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
    let year = a.getFullYear();
    
    
    let month = months[a.getMonth()];
    let date   = a.getDate().toString() // .padStart(2, "0");   
    let time = month +' '+ date + ', '+year;
    return time;
  }



  function toTimestamp(date){
      return Math.round(date.getTime()/1000);
  }

function checkCommonStock(stock){
    return stock.type == 'Common Stock'
}
function checkDot(stock){
    return stock.symbol.split('.').length < 2
}
function getMarketStatus(date){
    let todayDate = new Date()
    let quoteDate = new Date(date*1000)
    
    let diff = (todayDate - quoteDate); 
    
    let seconds = Math.floor(diff/1000);
    return seconds
}



let autoComplete = async function(query){
    let autoResults = new Object();
    let url = `${HOST}search?q=${query}&token=${API_KEY}`;
    
    await makeHttpCall(url).then(data => 
    
        autoResults = data.data.result.filter(checkCommonStock))
        
        autoResults = autoResults.filter(checkDot);
        
        autoResults = autoResults.map(item =>{
            let temp = Object.assign({}, item);
            temp.displaySymbol = item.displaySymbol.split('.')[0]
            
            return temp;
        })
        
    

    //filter search results autocomplete
    return autoResults
}
    
   
let fetchCompanyDetails =  function(ticker){
    let companyDetails = new Object()

    return companyProfile(ticker).then(function (profile)  {
        companyDetails.profile = profile;
        let summaryPromise = quote(ticker).then(quote => 
            companyDetails.quote = quote)
            
        let sentimentPromise = companySentiment(ticker).then(insights => {companyDetails.insights = insights
            companyDetails.insights.name = companyDetails.profile.name})

        let chartsPromise = charts(ticker).then(charts => companyDetails.charts = charts)
        let newsPromise = companyNews(ticker).then(news => companyDetails.news = news)
        let peersPromise =  peers(ticker).then(response => companyDetails.peers = response)
        
        return Promise.all([summaryPromise, sentimentPromise, chartsPromise, newsPromise, peersPromise]).then(()=>{
            return companyDetails
        })
        .catch(error => alert(error.message));
    
    })
    
    

}
 async function companyProfile(ticker){
    let profile = {}
    let url = `${HOST}stock/profile2?symbol=${ticker}&token=${API_KEY}`

    // profile2.ticker, profile2.name, profile2.exchange, profile2.ipo, profile2.finnhubIndustry, 
    //profile2.logo, Profile2.weburl

    await makeHttpCall(url).then((response) =>{
        
        profile.ticker = response.data.ticker
        profile.name = response.data.name
        profile.exchange = response.data.exchange
        profile.ipo = response.data.ipo
        profile.finnhubIndustry = response.data.finnhubIndustry
        profile.logo = response.data.logo
        profile.weburl = response.data.weburl
        
    })
    return profile
}

async function autoUpdate(ticker){
    let dynamicDetails = new Object()
    await quote(ticker).then(data => dynamicDetails.quote = data)

    return dynamicDetails

}

async function getSummaryChart(marketOpen, closeTimestamp, ticker){
    let charts = {}
    
    const RES = 5;
    let TO = new Date() ; 
    if(marketOpen === 'closed'){
        TO = new Date(closeTimestamp*1000);
        
    }
    let FROM = new Date(TO)
    
    FROM.setHours(FROM.getHours() - 6);
    

    FROM = toTimestamp(FROM)
    TO = toTimestamp(TO)

    let url = `${HOST}/stock/candle?symbol=${ticker}&token=${API_KEY}&resolution=${RES}&from=${FROM}&to=${TO}`
    
    await makeHttpCall(url).then((response) => {

        charts = {
            
            title: ticker + " Hourly Price Variation",
            data:(response.data.t||[]).map((time,index)=>{
                return [time*1000,response.data.c[index]]
            })
        }
        
})

return charts
}


async function quote(ticker){
    let quote = {}
    
   
   

    let url = `${HOST}quote?symbol=${ticker}&token=${API_KEY}`
    let quotePromise = await makeHttpCall(url).then((response)=>{
        // console.log(response)
        quote = response.data
        // console.log(quote)
        let propertyName = ''
        for(propertyName in quote){
            if(typeof quote[propertyName] === 'number'){
                quote[propertyName] = Math.round(quote[propertyName] * 100) / 100;
            }
        }
        let timestamp = quote.t;
        let difference = getMarketStatus(quote.t)



        quote.marketStatus = difference > 300 ? 'closed':'open'
        
        
        // let todayDate = Math.floor(new Date().getTime() / 1000)

        // quote.timezoneOffset= new Date().getTimezoneOffset()
        // quote.timestamp = difference > 300 ? dateConverterStandard(quote.t) : dateConverterStandard(todayDate)
        quote.timestamp = difference > 300 ? quote.t : ~~(+new Date() / 1000);

        let summaryChartsPromise = getSummaryChart(quote.marketStatus, timestamp, ticker)
        return Promise.all([summaryChartsPromise]).then((data)=>{
           
            quote.charts = data
        })
        

    })

    url = `${HOST}stock/profile2?symbol=${ticker}&token=${API_KEY}`
    let companyPromise = await makeHttpCall(url).then((response) =>{
        quote.name = response.data.name
        console.log('inside namr')
        console.log(quote.name)
    })

    return Promise.all([companyPromise, quotePromise]).then(()=>{
        return quote      
    })

}



async function peers(ticker){
    let peer = {}
    let url = `${HOST}stock/peers?symbol=${ticker}&token=${API_KEY}`
    await makeHttpCall(url).then((response) =>{
        peer = response.data
       
    })
    return peer
}

async function charts(ticker){
    let charts = {};
    const RES = 'D';
    
    let TO = new Date();
    let FROM = new Date(TO);

    FROM.setFullYear(FROM.getFullYear() - 2);
   
    FROM = toTimestamp(FROM)
    TO = toTimestamp(TO)

    // charts.ticker = ticker;

    let url = `${HOST}stock/candle?symbol=${ticker}&token=${API_KEY}&resolution=${RES}&from=${FROM}&to=${TO}`
    
    await makeHttpCall(url).then((response) =>{
       
        charts = {
            title: ticker + " Historical",
            data:{
                olhc:(response.data.t||[]).map((time,index)=>{
                    return [time*1000,response.data.o[index],response.data.h[index],response.data.l[index],response.data.c[index]]
                }),
                volume:(response.data.t||[]).map((time,index)=>{
                    return [time*1000,response.data.v[index]]
                })
            }
        }
    
    })
    return charts
}

async function companyNews(ticker){
    let news = []
    let topSlice = []

    let TO = new Date;
    let FROM = new Date(TO);
    FROM.setMonth(FROM.getMonth() - 1);
    TO = convertDateAPI(TO)
    FROM = convertDateAPI(FROM)

    let url = `${HOST}company-news?symbol=${ticker}&token=${API_KEY}&from=${FROM}&to=${TO}`
    
    
    //Company-news.source, company-news.datetime, company-news.summary, 
    //company-news.headline, company-news.url, company-news.title(same as headline), company-news.image
    await makeHttpCall(url).then((response) =>{
        
        response.data.forEach(newsItem => {
            let item = {}
            if(newsItem.headline && newsItem.image){
                item.headline = newsItem.headline
            
                item.source = newsItem.source
                item.datetime = dateConverterNews(newsItem.datetime)
                item.summary = newsItem.summary
                
                item.url = newsItem.url
                item.image = newsItem.image
                news.push(item)
            }
            
        });
        
        topSlice = news.slice(0,20);
      
        
    })
    return topSlice
}

let companySentiment = async function(ticker){
    let insights = {}

    let FROM = new Date();
    FROM.setMonth(FROM.getMonth() - 1);
    FROM = convertDateAPI(FROM)
    let url = `${HOST}/stock/social-sentiment?symbol=${ticker}&token=${API_KEY}&from=${FROM}`
   
    await makeHttpCall(url).then((response) => {
        insights.reddit = {}
        insights.reddit.mention = 0
        insights.reddit.positiveMention = 0
        insights.reddit.negativeMention = 0

        insights.twitter = {}
        insights.twitter.mention = 0
        insights.twitter.positiveMention = 0
        insights.twitter.negativeMention = 0

        
        response.data.reddit.forEach(sentimentItem => {
            
            insights.reddit.mention += sentimentItem.mention
            insights.reddit.positiveMention += sentimentItem.positiveMention
            insights.reddit.negativeMention += sentimentItem.negativeMention
        })
    
        response.data.twitter.forEach(sentimentItem => {
            insights.twitter.mention += sentimentItem.mention
            insights.twitter.positiveMention += sentimentItem.positiveMention
            insights.twitter.negativeMention += sentimentItem.negativeMention
        })
    })

    url = `${HOST}/stock/recommendation?symbol=${ticker}&token=${API_KEY}`
    await makeHttpCall(url).then((response) => {
        insights.recommendation = {
            categories:response.data.map(data=>data.period),
                series:[{
                    name:"Strong Sell",
                    data:response.data.map(d=>d.strongSell),
                    color:"#803131",
                },{
                    name:"Sell",
                    data:response.data.map(d=>d.sell),
                    color:"#f45b5b",
                },{
                    name:"Hold",
                    data:response.data.map(d=>d.hold),
                    color:"#ab801c",
                },{
                    name:"Buy",
                    data:response.data.map(d=>d.buy),
                    color:"#1cb955",
                },{
                    name:"Strong Buy",
                    data:response.data.map(d=>d.strongBuy),
                    color:"#186f37",
                }].reverse()
            }
        
    })

    url = `${HOST}/stock/earnings?symbol=${ticker}&token=${API_KEY}`
    await makeHttpCall(url).then((response) => {
        insights.earnings = {
            categories:response.data.map(data=>{
                return data.period+"<br>Surprise: "+(data.surprise||0).toFixed(2)
            }),
            actual:response.data.map(data=>{
                return parseFloat((data.actual || 0).toFixed(2))
            }),
            estimate:response.data.map(data=>{
                return parseFloat((data.estimate || 0).toFixed(2))
            }),
        }
        
        
    })


    return insights
    
    
}


export {autoComplete, fetchCompanyDetails, autoUpdate, quote};


