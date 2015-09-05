var github = require('octonode');
var client = github.client({
    username: 'supraja1024',
    password: 'supraja1'
});

function getTodos(res, temp1) {
    var response = {};
    var totalOpenCount = 0;
    var totalIssues = [];
    var dayCount = 0;
    var weekCount = 0;
    var weekdateCount = 0;
    var ghrepo = client.repo(temp1[3] + '/' + temp1[4]);
    temp(1);

    function temp(pages) {
        ghrepo.issues({
            page: pages,
            per_page: 100,
            state: 'open'
        }, function (err, issue) {
            console.log(issue.length);
            for (var i = 0; i < issue.length; i++) {
                totalIssues.push(issue[i]);
            }
            totalOpenCount = totalOpenCount + issue.length;
            if (issue.length > 0) {
                pages = pages + 1;
                temp(pages);
            } else {
                var today = new Date();
                for (var i = 0; i < totalIssues.length; i++) {
                    var dateOpened = new Date(totalIssues[i].created_at);
                    if ((today.getTime() - dateOpened.getTime()) < 1000 * 60 * 60 * 24) {
                        dayCount = dayCount + 1;
                        response.day = dayCount;
                    }
                    if ((today.getTime() - dateOpened.getTime()) < 1000 * 60 * 60 * 24 * 7) {
                        weekCount = weekCount + 1;
                        response.week = weekCount;
                    }
                    if ((today.getTime() - dateOpened.getTime()) < 1000 * 60 * 60 * 24 * 7 && today.getTime() - dateOpened.getTime() > 1000 * 60 * 60 * 24) {
                        weekdateCount = weekdateCount + 1;
                        response.weekdate = weekdateCount;
                    }
                }
                if (i >= totalIssues.length) {
                    res.jsonp(response);
                }
            }
        });
    }
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        var temp1 = [];
        temp1 = req.query.id.split('/');
        getTodos(res, temp1);
    });


    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};