var request = require('request');
var cheerio = require('cheerio');

request
    .get('http://finance.naver.com/item/frgn.nhn?code=005930&page=1')
    .on('response', (res)=>{
      console.log(res);

      var $ = cheerio.load(res);
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
