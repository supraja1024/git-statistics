var github = require('octonode'); /** requiring the git api being used */
var client = github.client({
    username: 'supraja1024',
    password: 'supraja1'
}); /** defining the client for fetching any public repository details*/
var ghrepo;
var response = {};
var totalPR, totalPRCount;
var totalIssues = [];

function getIssues(res) { /** function defintion for fetching issue statistics*/
    var totalOpenCount = 0;
    totalPR = [];
    totalPRCount = 0;
    getIssuesinIteration(1, getPRinIteration, sendResponse);

    function getIssuesinIteration(pages, callback, callback1) { /** getting open issue statistics in an iteration of 100 each as the api being used can only fetch 100 issues at a time */
        ghrepo.issues({ /** fetching 100 issues per iteration using github api */
            page: pages,
            per_page: 100,
            state: 'open'
        }, function (err, issue) {
            if (issue.length > 0) {
                console.log('first: ' + issue.length);
                for (var i = 0; i < issue.length; i++) {
                    totalIssues.push(issue[i]);
                }
                totalOpenCount = totalOpenCount + issue.length;
                pages = pages + 1;
                if (i >= issue.length) {
                    getIssuesinIteration(pages, callback, callback1);
                }
            } else if (issue.length === 0) {
                console.log('second: ' + totalIssues.length);
                response.totalIssues = totalIssues.length;
                if (response.totalIssues) {
                    console.log('calling PR function' + totalIssues.length);
                    callback(1, res, callback1);
                }

            }
            if (err) {
                console.log('first error' + err);
                response.error = 'error fetching statistics';
                res.jsonp(response);
            }
        });
    }
};


function getPRinIteration(pages, res, callback) {
    ghrepo.prs({ /** fetching 100 issues per iteration using github api */
        page: pages,
        per_page: 100,
        state: 'open'
    }, function (err, PR) {
        console.log('third: ' + PR.length);
        if (PR.length > 0) {
            console.log('fourth: ' + PR.length);
            console.log('totalPRCount' + totalPRCount);
            totalPRCount = totalPRCount + PR.length;
            console.log('totalPRCount after increment: '+ totalPRCount);
            pages = pages + 1;
            for (var k = 0; k < PR.length; k++) {
//                console.log(PR[k]);
                totalPR.push(PR[k]);
                console.log(totalPR.length);
//                console.log(totalPR);
            }
            if (k >= PR.length) {
                console.log('calling second iteration of PR ' + totalPR.length);
                getPRinIteration(pages, res, callback);
            }
        } else if (PR.length == 0) {
            console.log('fetched all the PR' + totalPRCount);
            var dayCount = 0;
            var weekCount = 0;
            var withinWeekNotInDayCount = 0;
            var today = new Date();
            //                for (var j = 0; j < totalIssues.length; j++) {
            //                    for (var k = 0; k < totalPR.length; k++) {
            for (var j = 0; j < totalIssues.length; j++) {
                for (var k = 0; k < totalPR.length; k++) {
                    if (totalIssues[j].url === totalPR[k].issue_url) {
                        totalIssues.splice(j, 1);
                        //                            var temp = true;
                        console.log('total issues length ' + totalIssues.length);
                    }
                }
            }
            if (j >= totalIssues.length && k >= totalPR.length) {
                console.log('finsdhed splicing PR from issues array: ' + totalIssues.length);
                for (var i = 0; i < totalIssues.length; i++) {
                    var dateOpened = new Date(totalIssues[i].created_at);
                    if ((today.getTime() - dateOpened.getTime()) < 1000 * 60 * 60 * 24) { /** get Issues opened in last 24 hours */
                        dayCount = dayCount + 1;
                        response.day = dayCount;
                    }
                    if ((today.getTime() - dateOpened.getTime()) > 1000 * 60 * 60 * 24 * 7) { /** get Issues opened in last 7 days*/
                        weekCount = weekCount + 1;
                        response.week = weekCount;
                    }
                    if ((today.getTime() - dateOpened.getTime()) < 1000 * 60 * 60 * 24 * 7 && today.getTime() - dateOpened.getTime() > 1000 * 60 * 60 * 24) { /** get Issues opened in last 7 days and not within last 24 hours*/
                        withinWeekNotInDayCount = withinWeekNotInDayCount + 1
                        response.weekdate = withinWeekNotInDayCount;
                    }
                }
                if (i >= totalIssues.length) {
                    console.log('calling final response');
                    callback(res);
                }

            }
        }
        //        }
        if (err) {
            console.log('error' + err);
            response.error = 'error fetching statistics';
            res.jsonp(response);
        }
    });
};

function sendResponse(res) {
    console.log('fifth:' + totalPRCount);
    response.totalIssues = response.totalIssues - totalPRCount;
    totalIssues = [];
    res.jsonp(response); /** sending issues statistics to client*/
}
module.exports = function (app) {

    /** get all Issues */
    app.get('/api/Issues', function (req, res) {
        var repoArray = [];
        repoArray = req.query.id.split('/'); /** splitting the url entered by user for getting the username and repository name from it*/
        ghrepo = client.repo(repoArray[3] + '/' + repoArray[4]);
        getIssues(res);

    });
};