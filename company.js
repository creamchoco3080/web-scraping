var request = require('request');
var cheerio = require('cheerio');
var textEnc = require('text-encoding');
var Iconv = require('iconv').Iconv;
var iconv = new Iconv('euc-kr', 'utf-8//ignore');

var codeUrlBase = 'http://finance.naver.com/sise/sise_market_sum.nhn?sosok=1&page=';

var result = [];

for(let page = 1; page < 26; page++){
  var url = codeUrlBase + page;
  var option = {
    url: url,
    encoding: null
  };
  request(option, (err, res, body)=>{

    body = iconv.convert(body).toString();
    var $ = cheerio.load(body);

    var temp = $('table.type_2 > tbody > tr > td:nth-child(2) > a.tltle');
    var sum = $('table.type_2 > tbody > tr > td:nth-child(7)');
    for(let i = 0; i < temp.length; i++){
      var name = temp[i].children[0].data;
      var pr = sum[i].children[0].data;
      result[(page-1)*50 + i] = {name: name, code: temp[i].attribs.href.slice(20), price: pr};
    }

  });
}

setTimeout(()=>{
  for(let i = 0; i < result.length; i++){
    console.log(result[i].name + ',' + result[i].price.replace(/,/g, ''));
  }
},3000);