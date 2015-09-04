var app = angular.module('myApp', []);
app.controller('personCtrl', function($scope) {
    $scope.message = "hello";
    $scope.clicked = false;
    $scope.save = function(){
        $scope.clicked = true;
    }
});