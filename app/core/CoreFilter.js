angular.module('main')

    .filter("DateRangeFilter", function () {
        return function (items, column, from, to) {
            
            if (column && from && to) {

                var df = parseInt(from.split('-').join(''));
                var dt = parseInt(to.split('-').join(''));
                var result = [];
                var data;
                var splitcol = column.split('.');
                var length = items.length;
                for (var index = 0; index < length; index++) {
                    var element = items[index];

                    if (splitcol.length > 1) {
                        if (element[splitcol[0]][splitcol[1]] != undefined) {
                            var temp = element[splitcol[0]][splitcol[1]].split(' ');
                            data = temp[0];
                        }
                    } else {
                        data = element[splitcol[0]];
                    }
                    data = new Date(new Date(data).getTime() + (60 * 7 * 60000)).toISOString();
                    if (data != undefined) {
                        var dateval = parseInt(data.split('-').join(''));
                        if (dateval >= df && dateval <= dt) {
                            result.push(element);
                        }
                    }
                }
                return result;
            } else {
                return items;
            }
        };
    })

    .filter("RealDateRangeFilter", function () {
        return function (items, column, from, to) {
            if (column && from && to) {
                if (from instanceof Date && to instanceof Date) {
                    var df = new Date(from).getTime();
                    var dt = new Date(to);
                    dt.setHours(23, 59, 59, 999);
                    dt = new Date(dt).getTime();

                    var result = [];
                    var data;
                    var splitcol = column.split('.');
                    var length = items.length;
                    for (var index = 0; index < length; index++) {
                        var element = items[index];

                        if (splitcol.length > 1) {
                            var tempval = element;
                            for (var index = 0; index < splitcol.length; index++) {
                                var key = splitcol[index];
                                if (tempval[key]) {
                                    tempval = tempval[key];
                                }
                            }
                        } else {
                            data = element[splitcol[0]];
                        }
                        //get gmt+7 time
                        data = new Date(data).getTime() + (60 * 7 * 60000);
                        if (data != undefined) {
                            var dateval = parseInt(data);
                            if (dateval >= df && dateval <= dt) {
                                result.push(element);
                            }
                        }
                    }
                    return result;
                } else {
                    return items;
                }
            } else {
                return items;
            }
        };
    })

    .filter("DateFilter", function () {
        return function (items, column, date) {
            if (column && date instanceof Date) {


                date = new Date(new Date(date).getTime() + (60 * 7 * 60000)).toISOString();

                var dateint = parseInt(date.split('-').join(''));
                var result = [];
                var data;
                var splitcol = column.split('.');
                var length = items.length;

                for (var index = 0; index < length; index++) {
                    var element = items[index];

                    if (splitcol.length > 1) {
                        if (element[splitcol[0]][splitcol[1]] != undefined) {
                            var temp = element[splitcol[0]][splitcol[1]].split(' ');
                            data = temp[0];
                        }
                    } else {
                        data = element[splitcol[0]];
                    }

                    data = new Date(new Date(data).getTime() + (60 * 7 * 60000)).toISOString();

                    if (data != undefined) {
                        var dateval = parseInt(data.split('-').join(''));

                        if (dateval == dateint) {
                            result.push(element);
                        }
                    }
                }
                return result;
            } else {
                return items;
            }

        };
    })
    
    .filter('StatusFilter', function () {
        var statHash = {
            "approve" : "อนุมัติส่ง"
        };

        return function (input) {
            if (!input) {
                return statHash;
            } else {
                return statHash[input];
            }
        };
    })