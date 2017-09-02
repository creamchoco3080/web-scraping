var request = require('request');
var cheerio = require('cheerio');
const readline = require('readline');
const fs = require('fs');

var startNum = 0;
var maxNaverIndex = 13;
var maxGoogleIndex = 9;

const requestNaverData = (company, index, arr, googleArr) => {

  var compCode = company.code;
  var url = 'http://finance.naver.com/item/frgn.nhn?code=' + compCode + '&page=' + index;

  if (index === maxNaverIndex) {
    // console.log('naver end');
    // for(let i = 0; i < arr.length; i++){
    //   console.log(arr[i]);
    // }
    requestGoogleData(company, 1, arr, googleArr);
  }
  else {
    // console.log('index', index);
    request(url, (err, res, body) => {
      // console.log('url', url);
      if (err) console.log(err);
      var $ = cheerio.load(body);
      var ratio = $('table.type2 > tbody > tr > td:nth-child(9) > span.tah.p11');
      var date = $('table.type2 > tbody > tr > td:nth-child(1) > span.tah');
      var price = $('table.type2 > tbody > tr > td:nth-child(2) > span.tah.p11');

      price.splice(0, 6);

      // console.log('ratio length:', ratio.length);
      // console.log('date length:', date.length);
      // console.log('price length:', price.length);
      for (let j = 0; j < ratio.length; j++) {
        arr[(index - 1) * 20 + j] = {
          date: date[j].children[0].data, price: price[j].children[0].data,
          ratio: ratio[j].children[0].data
        };
        // console.log('arr index', (index - 1) * 20 + j);
        if (j === ratio.length - 1) requestNaverData(company,++index, arr, googleArr);
      }
    });
  }

};

const requestGoogleData = (company, index, arr, googleArr) => {
  var compCode = company.code;
  startNum = 30 * (index - 1);
  // console.log('google index:', index);
  if(index === maxGoogleIndex){
    // console.log('google end');
    let res = '';
    for (let j = 0; j < Math.min(arr.length, googleArr.length); j++) {
      res += arr[j].date + ',' + googleArr[j].open.replace(/\n|,/g, '')
        + ',' + arr[j].price.replace(/,/g, '') + ','
        + arr[j].ratio + '\n';
    }
    fs.writeFileSync('./dataTemp/' + company.name + '.csv', res);
  }
  else{
    var url = 'https://www.google.com/finance/historical?q=KRX%3A' + compCode + '&ei=HPCjWfjmJI300wSAgp2oAw&start=' + startNum + '&num=30';
    request(url, (err, res, body) => {

      var $ = cheerio.load(body);
      var date = $('table.gf-table.historical_price > tbody > tr > td.lm');
      var open = $('table.gf-table.historical_price > tbody > tr > td:nth-child(2)');

      // console.log('date, open length', date.length, open.length);
      for (let j = 0; j < date.length; j++) {
        // console.log('google array index', 30*(index-1) + j);
        googleArr[30 * (index-1) + j] = {date: date[j].children[0].data, open: open[j].children[0].data};
        if(j === date.length - 1){
          requestGoogleData(company, ++index, arr, googleArr);
        }
      }
    });
  }
};

const rl = readline.createInterface({
  input: fs.createReadStream('testList.txt')
});

rl.on('line', (line) => {

  console.log('readline', line);
  var company = JSON.parse(line);

  // for (let i = 1; i < 13; i++) {
  requestNaverData(company, 1, [], []);

  // request(url, (err, res, body) => {
  //   if (err) console.log(err);
  //   var $ = cheerio.load(body);
  //   var ratio = $('table.type2 > tbody > tr > td:nth-child(9) > span.tah');
  //   var date = $('table.type2 > tbody > tr > td:nth-child(1) > span.tah');
  //   var price = $('table.type2 > tbody > tr > td:nth-child(2) > span.tah.p11');
  //
  //   price.splice(0, 6);
  //
  //   for (let j = 0; j < ratio.length; j++) {
  //     arr[(i - 1) * ratio.length + j] = {
  //       date: date[j].children[0].data, price: price[j].children[0].data,
  //       ratio: ratio[j].children[0].data
  //     };
  //   }
  //
  // });
  // }

  // for (let i = 0; i < 8; i++) {
  //
  //   startNum = 30 * i;
  //   var url = 'https://www.google.com/finance/historical?q=KRX%3A' + compCode + '&ei=HPCjWfjmJI300wSAgp2oAw&start=' + startNum + '&num=30';
  //   request(url, (err, res, body) => {
  //
  //     var $ = cheerio.load(body);
  //     var date = $('table.gf-table.historical_price > tbody > tr > td.lm');
  //     var open = $('table.gf-table.historical_price > tbody > tr > td:nth-child(2)');
  //
  //     for (let j = 0; j < date.length; j++) {
  //       googleArr[30 * i + j] = {date: date[j].children[0].data, open: open[j].children[0].data};
  //     }
  //   });
  // }

  // setTimeout(() => {
  //   let res = '';
  //   for (let j = 0; j < arr.length; j++) {
  //     // res += JSON.stringify(arr[j])+'\n';
  //     res += arr[j].date + ',' // + googleArr[j].open.replace(/\n|,/g, '')
  //       + ',' + arr[j].price.replace(/,/g, '') + ','
  //       + arr[j].ratio + '\n';
  //   }
  //   fs.writeFileSync('./dataTemp/' + company.name + '.csv', res);
  //
  //   rl.resume();
  // }, 5000);

});

// rl.question('enter company code: ', (compCode) => {
//   for (let i = 1; i < 13; i++) {
//     var url = 'http://finance.naver.com/item/frgn.nhn?code=' + compCode + '&page=' + i;
//
//     request(url, (err, res, body) => {
//       if (err) console.log(err);
//
//       var $ = cheerio.load(body);
//       var ratio = $('table.type2 > tbody > tr > td:nth-child(9) > span.tah');
//       var date = $('table.type2 > tbody > tr > td:nth-child(1) > span.tah');
//       var price = $('table.type2 > tbody > tr > td:nth-child(2) > span.tah.p11');
//
//       price.splice(0, 6);
//
//       for (let j = 0; j < ratio.length; j++) {
//         arr[(i - 1) * ratio.length + j] = {
//           date: date[j].children[0].data, price: price[j].children[0].data,
//           ratio: ratio[j].children[0].data
//         };
//       }
//
//     });
//   }
//
// // google part for open price
//
//   for (let i = 0; i < 8; i++) {
//
//     startNum = 30 * i;
//     var url = 'https://www.google.com/finance/historical?q=KRX%3A' + compCode + '&ei=HPCjWfjmJI300wSAgp2oAw&start=' + startNum + '&num=30';
//     request(url, (err, res, body) => {
//
//       var $ = cheerio.load(body);
//       var date = $('table.gf-table.historical_price > tbody > tr > td.lm');
//       var open = $('table.gf-table.historical_price > tbody > tr > td:nth-child(2)');
//
//       for (let j = 0; j < date.length; j++) {
//         googleArr[30 * i + j + 1] = {date: date[j].children[0].data, open: open[j].children[0].data};
//       }
//     });
//   }
//
//
//   setTimeout(() => {
//     for (let j = 1; j < arr.length; j++) {
//       console.log(arr[j].date + ',' + googleArr[j].open.replace(/\n|,/g, '')
//         + ',' + arr[j].price.replace(/,/g, '') + ','
//         + arr[j].ratio);
//     }
//   }, 3000);
//
//   rl.close();
// });
