var request = require('request');
var cheerio = require('cheerio');

var codeUrlBase = 'http://finance.naver.com/sise/sise_market_sum.nhn?sosok=0&page=';

var result = [];

for(let page = 1; page < 28; page++){
  var url = codeUrlBase + page;
  request(url, (err, res, body)=>{

    var $ = cheerio.load(body);

    var temp = $('table.type_2 > tbody > tr > td:nth-child(2) > a.tltle');
    console.log('temp', temp[0].children[0].data);
    console.log('temp length', temp.length);
    for(let i = 0; i < temp.length; i++){
      console.log('page', page);
      console.log((page-1)*50 + i);
      result[(page-1)*50 + i] = {name: temp[i].children[0].data, code: temp[i].attribs.href.slice(20)};
    }

  });
}

setTimeout(()=>{
  for(let i = 0; i < result.length; i++){
    console.log(i, result[i]);
  }
},3000);