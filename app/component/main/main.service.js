angular.module('main')
.service('MainService', function ($q, GlobalFunction, GlobalSetting) {
    
    this.getResult = function (data) {
        var deferred = $q.defer();

        var url = GlobalSetting.getUrl('PUBLIC', 'foo/get-result');
        var option = {};
        var header = {};

        GlobalFunction.httpPost(url, data, option, header, function (err, result) {
            if (!err) {
                deferred.resolve(result);
            } else {
                deferred.reject(result);
            }
        });

        return deferred.promise;
    }

}); 