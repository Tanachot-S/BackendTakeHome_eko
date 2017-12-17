var route = {};

route["A"] = [{
    "to" : "B",
    "cost" : "1"
},{
    "to" : "C",
    "cost" : "4"
},{
    "to" : "D",
    "cost" : "10"
}];

route["B"] = [{
    "to" : "E",
    "cost" : "3"
}];

route["C"] = [{
    "to" : "F",
    "cost" : "2"
},{
    "to" : "D",
    "cost" : "4"
}]

route["D"] = [{
    "to" : "E",
    "cost" : "1"
}]

route["E"] = [{
    "to" : "A",
    "cost" : "2"
},{
    "to" : "B",
    "cost" : "3"
}]

route["F"] = [{
    "to" : "D",
    "cost" : "1"
}]

exports.getParam = function () {
    return route;
}