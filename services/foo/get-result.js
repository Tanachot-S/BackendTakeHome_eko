var routeTemplate = require('../../route').getParam();
var Graph = require('node-dijkstra');

exports.doProcess = function (req, res, lib) {

    var params = req.body;
    var resultCost = "Not found case.";

    if (params.case == 1) {
        resultCost = case1(params.route);
    } else if (params.case == 2) {
        resultCost = case2(params);
    } else if (params.case == 3) {
        resultCost = case3(params.route);
    }

    res.json(lib.message.success(resultCost));

    function case1(route) {
        var arrRoute = route.split("-");
        var cost = 0;
        var i = 0;

        while (i < arrRoute.length) {
            var start = arrRoute[i];//A
            var to = arrRoute[i + 1];//B
            var haveRoute = false;
            if (to) {
                routeTemplate[start.toUpperCase()].forEach(function (route) {
                    // console.log("Route: "+route.to + " Data: "+ to);
                    if (route.to == to.toUpperCase()) {
                        cost = cost + parseInt(route.cost);
                        haveRoute = true;
                    }
                });
            } else {
                haveRoute = true;
            }
            if (!haveRoute) {
                return "No Such Route.";
            }
            i++;
        }
        cost = "Cost: " + cost;
        return cost;
    }

    function case2(data) {
        var arrRoute = data.route.split("-");
        if (arrRoute.length != 2) {
            return "Enter 2 towns only.";
        }

        var haveRoute = 0;
        var start = arrRoute[0];
        var end = arrRoute[1];
        var queue = [];
        var storePush = [];
        
        queue.push(start);
        for(var i = 0 ; i < queue.length ; i++){
            var nodeNow = queue[i];
            if(storePush.indexOf(nodeNow) == -1){
                if(nodeNow != start && nodeNow != end){
                    storePush.push(nodeNow);
                }
                
                routeTemplate[nodeNow.toUpperCase()].forEach(function (route) {
                    queue.push(route.to);
                });

                if(data.maxstop == i + 1){
                    break;
                }
            }
        }

        haveRoute = storePush.length;
        if(haveRoute != 0){
            haveRoute = "Have Route: " + haveRoute;
        } else {
            haveRoute = "No Such Route.";
        }
        return haveRoute;
    }

    function case3(route) {
        var arrRoute = route.split("-");
        if (arrRoute.length != 2) {
            return "Enter 2 towns only.";
        }

        var cost = 0;
        //init
        var templateGraph = addTemplateGraph();

        if (arrRoute[0] != arrRoute[1]) {
            cost = templateGraph.path(arrRoute[0], arrRoute[1], { cost: true }).cost;
        } else {
            var total = "No Such Route.";
            var keyRoute = Object.keys(routeTemplate);
            for (var i = 0; i < keyRoute.length; i++) {
                if (keyRoute[i] != arrRoute[0]) {
                    var distanceLast = templateGraph.path(arrRoute[0], keyRoute[i], { cost: true }).cost;
                    if (distanceLast != 0) {
                        //check origin
                        var include = templateGraph.path(keyRoute[i], arrRoute[0], { cost: true }).cost;
                        if (include != 0) {
                            var storeDistance = distanceLast + include;
                            if (total == "No Such Route." || total > storeDistance) {
                                total = storeDistance;
                            }
                        }
                    }
                }
            }//end for
            cost = total;
        }

        if(cost != 0){
            cost = "Minimum Cost: " + cost;
        } else {
            cost = "No Such Route.";
        }
        return cost;
    }

    function addTemplateGraph(str) {
        var keyRoute = Object.keys(routeTemplate);
        var templateGraph = new Graph();
        for (var i = 0; i < keyRoute.length; i++) {
            var link = {};
            routeTemplate[keyRoute[i]].forEach(function (route) {
                var obj = JSON.parse(JSON.stringify(route));
                link[obj.to] = obj.cost;
            });
            templateGraph.addNode(keyRoute[i], link);
            
        }
        return templateGraph;
    }

}