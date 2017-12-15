var config_dev = {};
var config_uat = {};
var config_prod = {};

config_dev["APPPATH"] = "tanachot"
config_dev["APPURL"] = "http://localhost"
config_dev["PORT"] = 8080

var env = process.env.NODE_ENV;

exports.getParam = function () {
    if (env == "DEV") {
        return config_dev;
    } else if (env == "UAT") {
        return config_uat;
    } else if (env == "PROD") {
        return config_prod;
    } else {
        return config_dev;
    }
}