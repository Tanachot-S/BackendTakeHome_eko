//Implement related to Jsend

exports.success = function (data) {
    return {
        status: "success",
        data: data
    }
}

exports.fail = function (data) {
    return {
        status: "fail",
        data: data
    }
}

exports.error = function (message) {
    return {
        status: "error",
        message: message
    }
}