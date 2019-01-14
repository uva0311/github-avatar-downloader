var request = require('request');

function getRepoContributors(repoOwner, repoName, cb) {
  request.get('https://api.github.com/repos/' + repoOwner + '/' + repoName +'/contributors')
         .on('error', function(err){
          throw err;
         });

}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});