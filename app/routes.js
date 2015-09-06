var github = require('octonode'); /** requiring the git api being used*/
var client = github.client(); /** defining the client for fetching any public repository details*/

function getIssues(res, repoArray) { /** function deifintion for fetching issue statistics*/
    var response = {};
    var totalOpenCount = 0;
    var totalIssues = [];
    var dayCount = 0;
    var weekCount = 0;
    var withinWeekNotInDayCount = 0;
    var ghrepo = client.repo(repoArray[3] + '/' + repoArray[4]);
    getIssuesinIteration(1);

    function getIssuesinIteration(pages) { /** getting open issue statistics in an iteration of 100 each as the api being used can only fetch 100 issues at a time */
        ghrepo.issues({ /** fetching 100 issues per iteration using github api */
            page: pages,
            per_page: 100,
            state: 'open'
        }, function (err, issue) {
            if(issue){
            console.log(issue.length);
            for (var i = 0; i < issue.length; i++) {
                totalIssues.push(issue[i]);
            }
            totalOpenCount = totalOpenCount + issue.length;
            if (issue.length > 0) {
                pages = pages + 1;
                getIssuesinIteration(pages);
            } else {
                var today = new Date();
                for (var i = 0; i < totalIssues.length; i++) {
                    var dateOpened = new Date(totalIssues[i].created_at);
                    if ((today.getTime() - dateOpened.getTime()) < 1000 * 60 * 60 * 24) { /** get Issues opened in last 24 hours */
                        dayCount = dayCount + 1;
						response.day = dayCount;
                    }
                    if ((today.getTime() - dateOpened.getTime()) < 1000 * 60 * 60 * 24 * 7) { /** get Issues opened in last 7 days*/
                        weekCount = weekCount + 1;
						response.week = weekCount;
                    }
                    if ((today.getTime() - dateOpened.getTime()) < 1000 * 60 * 60 * 24 * 7 && today.getTime() - dateOpened.getTime() > 1000 * 60 * 60 * 24) { /** get Issues opened in last 7 days and not within last 24 hours*/
                       withinWeekNotInDayCount = withinWeekNotInDayCount +1
					   response.weekdate = withinWeekNotInDayCount;
                    }
                }
                if (i >= totalIssues.length) {
                    res.jsonp(response); /** sending issues statistics to client*/
                }
            }
        }
            if(err){
                response.error = 'error fetching statistics';
                res.jsonp(response);
            }
        });
    }
};

module.exports = function (app) {

    /** get all Issues */
    app.get('/api/Issues', function (req, res) {
        var repoArray = [];
        repoArray = req.query.id.split('/'); /** splitting the url entered by user for getting the username and repository name from it*/
        getIssues(res, repoArray); /** get required open issues statistics*/
    });
};