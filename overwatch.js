var request = require('request');
var cheerio = require('cheerio');
var urlBase = 'https://overlog.gg/leaderboards/global/rank/';

var result = [];
var startIndex = 1;
var endIndex = 50;

const requestData = (index) => {
  let url = urlBase + index;

  if (index === endIndex) console.log('end');
  else {
    request(url, (err, res, body) => {
      var $ = cheerio.load(body);

      var rank = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-Rank > span');
      var platform = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-Platform > span');
      var player = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-Player > a > em');
      var rating = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-SkillRating');
      var avgFire = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-AvgFire');
      var kd = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-KD > b');
      var winRatio = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-WinRatio > div.WinRatioGraph > div.WinRatio > b');
      var playTime = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-PlayTime');
      var most = $('table.LeaderBoardsTable > tbody > tr > td.ContentCell-MostHeros');

      for (let i = 0; i < rank.length; i++) {
        let trank = rank[i].children[0].data;
        let tplatform = platform[i].children[0].data;
        let tplayer = player[i].children[0].data.slice(4);
        let trating = rating[i].children[2].data.trim();
        let tavgFire = avgFire[i].children[0].data.trim();
        let tkd = kd[i].children[0].data.slice(0, 4);
        let twinRatio = winRatio[i].children[0].data;
        let tplayTime = playTime[i].children[0].data;
        let tmost = [
          most[i].children[1].attribs.alt,
          most[i].children[5]? most[i].children[3].attribs.alt: null,
          most[i].children[5]? most[i].children[5].attribs.alt : null];

        result.push({
          rank: trank,
          platform: tplatform,
          level: tplayer,
          rating: trating,
          avgFire: tavgFire,
          kd: tkd,
          winRatio: twinRatio,
          playTime: tplayTime,
          most: tmost
        });

        console.log(JSON.stringify(result[100*(index-1)+i]));

        if(i === rank.length - 1) requestData(++index);
      }
    });
  }

};

requestData(startIndex);
