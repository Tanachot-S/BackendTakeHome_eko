angular.module('routing', [
    'ui.router',
    'oc.lazyLoad',
]).config(function router($stateProvider, $urlRouterProvider) {
    
    var base_component_path = "component/";

    $stateProvider
        .state('main', {
            url: "/",
            templateUrl: base_component_path + 'main/main.component.html',
            controller: 'MainController',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        files: [
                            base_component_path + 'main/main.component.js',
                            base_component_path + 'main/main.service.js',
                        ]
                    });
                }]
            }
        })

    $urlRouterProvider.otherwise('/');

}).run(function ($rootScope) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
        $rootScope.previous_state = fromState.name;
        $rootScope.current_state = toState.name;
    })
});