angular.module('todoController', [])

// inject the Todo service factory into our controller
.controller('mainController', ['$scope', '$http', 'Todos', function ($scope, $http, Todos) {
    $scope.clicked = false;
    $scope.save = function () {
        if ($scope.url) {
            $scope.statistics = {};
            $scope.clicked = true;
            var value = $scope.url;
            $scope.urlEntered = value;
            Todos($scope.urlEntered)
                .success(function (data) {
                    console.dir(data);
                    $scope.statistics = data;
                    if (!data.day) {
                        $scope.statistics.day = 0;
                    }
                    if (!data.week) {
                        $scope.statistics.week = 0;
                    }
                    if (!data.weekdate) {
                        $scope.statistics.weekdate = 0;
                    }
                });
        } else {
            alert('enter githud repo');
        }
    }

 }]);