angular.module('gitService', [])

/** service for requesting node server from angular client*/
.factory('Issues', ['$http', function ($http) {
    return function (url) {
        return $http({
            method: 'GET',
            url: '/api/Issues',
            params: {
                id: url
            }
        });
    }
 }]);