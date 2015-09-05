angular.module('todoService', [])

// super simple service
// each function returns a promise object
.factory('Todos', ['$http', function ($http) {
    return function (url) {
        return $http({
            method: 'GET',
            url: '/api/todos',
            params: {
                id: url
            }
        });
    }
 }]);