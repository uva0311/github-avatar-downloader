require('dotenv').config();

var request = require('request');
var fs = require('fs');
var repoOwnerInput = process.argv[2];
var repoNameInput = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if(process.argv.length <= 3){
    return console.log('Please provide repo owner and repo name.');
  } else if (process.argv.length > 4){
    return console.log('Please only provide two input: repo owner, repo name.');
  } else if(process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.length == 40){

    var options = {
      url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
      headers: {
        'User-Agent': 'request',
        'Authorization': 'token ' + process.env.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body){
      cb(err, JSON.parse(body));
    });
  } else {
    if(process.env.GITHUB_TOKEN.length < 40 || process.env.GITHUB_TOKEN.length > 40){
      return console.log('Invalid token.');
    } else {
      return console.log('GitHub token is missing.');
    }
  }
}

function downloadImageByURL(url, filePath) {
  if(!fs.existsSync('avatars/')) {
    fs.mkdirSync('avatars/');
    console.log('file directory avatars/ is created.');
  }
  request.get(url)
         .on('error', function(err){
            throw err;
         })
         .on('response', function(response){
         })
         .pipe(fs.createWriteStream(filePath))
         .on('finish', function(finish){
            console.log('Download complete.');
         });
}

getRepoContributors(repoOwnerInput, repoNameInput, function(err, result) {
  if(!result.length){
    return console.log('Target repo owner or the repo does not exist.');
  } else {
    for(var i = 0; i < result.length; i++){
      downloadImageByURL(result[i]['avatar_url'], 'avatars/'+result[i]['login']+'.jpg');
    }
  }
});
