angular.module('main')
.controller('MainController', function ($scope, $state, MainService) {
    
    $scope.submit = function () {
        console.log($scope.data);
        MainService.getResult($scope.data).then(function (result) {
            alert(result.data);
        });
    }

}); 
