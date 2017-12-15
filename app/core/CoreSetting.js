angular.module('main')
    .factory('GlobalSetting', function () {
            
    var SERVICE_URL = {            
        PUBLIC: "public",
    };

    return {
        getUrl: function(name,context) {
            return SERVICE_URL[name] + '/' + context;
        }
    };  

});