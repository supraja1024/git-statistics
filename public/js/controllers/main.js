angular.module('parentController', [])

// inject the Issues service factory into our controller
.controller('mainController', ['$scope', '$http', 'Issues', function ($scope, $http, Issues) {
    $scope.clicked = false;
    $scope.getOpenIssues = function () {
        if ($scope.url) {
            $scope.statistics = {};
            $scope.clicked = true;
            var value = $scope.url;
            $scope.urlEntered = value;
            Issues($scope.urlEntered)
                .success(function (data) { /** service call for fetching the open issues statistics */
                    if (data.error) {
                        alert(data.error);
                    } else {
                        console.dir(data);
                        $scope.statistics = data;
                        if (!data.day) {
                            $scope.statistics.day = 0; /** assigining zero if the server doesn't return anything as the node server doesn't return zero */
                        }
                        if (!data.week) {
                            $scope.statistics.week = 0; /** assigining zero if the server doesn't return anything as the node server doesn't return zero */
                        }
                        if (!data.weekdate) {
                            $scope.statistics.weekdate = 0; /** assigining zero if the server doesn't return anything as the node server doesn't return zero */
                        }
                    }
                }).error(function (err) {
                    alert(err);
                });
        } else {
            alert('please enter valid githud repository url');
        }
    }

 }]);