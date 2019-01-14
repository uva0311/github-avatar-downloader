var request = require('request');
var fs = require('fs');
var token = require('./secrets.js');
var repoOwnerInput = process.argv[2];
var repoNameInput = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if(process.argv.length <= 2){
    return console.log('Please provide repo owner and repo name.');
  } else {
    var options = {
      url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
      headers: {
        'User-Agent': 'request',
        'Authorization': 'token ' + token.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body){
      cb(err, JSON.parse(body));
    });
  }
}

function downloadImageByURL(url, filePath) {
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
  for(var i = 0; i < result.length; i++){
    downloadImageByURL(result[i]['avatar_url'], 'avatars/'+result[i]['login']+'.jpg');
  }
});
