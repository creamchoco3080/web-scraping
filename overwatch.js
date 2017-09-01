var request = require('request');
var cheerio = require('cheerio');
var urlBase = 'https://overlog.gg/leaderboards/global/rank/';


for(let i = 1; i < 10; i++){

  var url = urlBase + i;

  request(url, (err, res, body)=>{

    var $ = cheerio.load(body);

    var rank = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-Rank > span');

    console.log(rank);


  });

}