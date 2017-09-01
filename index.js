var request = require('request');
var cheerio = require('cheerio');
const readline = require('readline');

var compCode = '005930';
var urlBase = 'http://finance.naver.com/item/frgn.nhn?code=' + compCode + '&page=';

var startNum = 0;
var googleUrlBase = 'https://www.google.com/finance/historical?q=KRX%3A' + compCode + '&ei=HPCjWfjmJI300wSAgp2oAw&start=' + startNum + '&num=30';

// naver part for ratio and end price

var arr = [];
var googleArr = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('enter company code: ', (compCode) => {
  for (let i = 1; i < 13; i++) {
    var url = 'http://finance.naver.com/item/frgn.nhn?code=' + compCode + '&page=' + i;

    request(url, (err, res, body) => {
      if (err) console.log(err);

      var $ = cheerio.load(body);
      var ratio = $('table.type2 > tbody > tr > td:nth-child(9) > span.tah');
      var date = $('table.type2 > tbody > tr > td:nth-child(1) > span.tah');
      var price = $('table.type2 > tbody > tr > td:nth-child(2) > span.tah.p11');

      price.splice(0, 6);

      for (let j = 0; j < ratio.length; j++) {
        arr[(i - 1) * ratio.length + j] = {
          date: date[j].children[0].data, price: price[j].children[0].data,
          ratio: ratio[j].children[0].data
        };
      }

    });
  }

// google part for open price

  for (let i = 0; i < 8; i++) {

    startNum = 30 * i;
    var url = 'https://www.google.com/finance/historical?q=KRX%3A' + compCode + '&ei=HPCjWfjmJI300wSAgp2oAw&start=' + startNum + '&num=30';
    request(url, (err, res, body) => {

      var $ = cheerio.load(body);
      var date = $('table.gf-table.historical_price > tbody > tr > td.lm');
      var open = $('table.gf-table.historical_price > tbody > tr > td:nth-child(2)');

      for (let j = 0; j < date.length; j++) {
        googleArr[30 * i + j + 1] = {date: date[j].children[0].data, open: open[j].children[0].data};
      }
    });
  }


  setTimeout(() => {
    for (let j = 1; j < arr.length; j++) {
      console.log(arr[j].date + ',' + googleArr[j].open.replace(/\n|,/g, '')
        + ',' + arr[j].price.replace(/,/g, '') + ','
        + arr[j].ratio);
    }
  }, 3000);

  rl.close();
});
