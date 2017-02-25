// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


/***** COMMON FUNCTIONS *****/

function toInt(n) {
    return parseInt(n);
}

function jumpRange(maxNum, step) {
    let output = [];

    step = step || 1;
    step = (step < 1) ? 1 : step;

    for (let i = 0; i < maxNum; i += step) {
        output.push(i);
    }

    return output;
}

function numRange(minNum, maxNum) {
    let output = [];

    for (let i = minNum; i <= maxNum; ++i) {
        output.push(i);
    }

    return output;
}

function plusN(n) {
    return function(i) {
        return n + i;
    }
}

function upToN(n) {
    return function(i) {
        return i <= n;
    }
}

function joinListWithKey(key) {
    return function(d) {
        let dict = {};
        dict[d[0]] = true;

        for (let i in d[1]) {
            dict[d[1][i][1]] = true;
        }
        let output = {};
        output[key] = Object.keys(dict).map(toInt);
        return output;
    }
}

/***** FUNCTIONS FOR ENVIRONMENT VARS *****/

function envSet(d) {
    let output = {};

    output[d[0]] = d[2];

    return {env: output};
}

function unQuotedString(d) {
    let output = [];

    for (let i in d[0]) {
        output.push(d[0][i][1]);
    }

    return output.join("");
}

/***** FUNCTIONS FOR MINUTES *****/

function minute(d) {
    return parseInt((d[0] | "") + d[1]);
}

function minuteAll(d) {
    return {minutes: jumpRange(60)};
}

function minuteJump(d) {
    let step = parseInt(d[1]);

    return {minutes: jumpRange(60, step)};
}

function minuteRange(d, l, reject) {
    let minNum = d[0];
    let maxNum = d[2];

    if (maxNum <= minNum) {
        return reject;
    }

    return {minutes: numRange(minNum, maxNum)};
}

function minuteList(d) {
    return joinListWithKey('minutes')(d);
}

/***** FUNCTIONS FOR HOURS *****/

function hour(d) {
    return parseInt((d[0][0] || "") + d[0][1]);
}

function hourAll(d) {
    return {hours: jumpRange(24)};
}

function hourJump(d) {
    let step = parseInt(d[1]);

    return {hours: jumpRange(24, step)};
}

function hourRange(d, l, reject) {
    let minNum = d[0];
    let maxNum = d[2];

    if (maxNum <= minNum) {
        return reject;
    }

    return {hours: numRange(minNum, maxNum)};
}

function hourList(d) {
    return joinListWithKey('hours')(d);
}

/***** FUNCTIONS FOR THE DAYS OF THE MONTH *****/

function dayOfMonth(d) {
    return parseInt((d[0][0] || "") + d[0][1]);
}

function allDaysOfMonth(d) {
    return {daysOfMonth: jumpRange(31).map(plusN(1))};
}

function dayOfMonthJump(d) {
    let step = parseInt(d[1]);

    return {daysOfMonth: jumpRange(31, step).map(plusN(step)).filter(upToN(31))};
}

function dayOfMonthRange(d, l, reject) {
    let minNum = d[0];
    let maxNum = d[2];

    if (maxNum <= minNum) {
        return reject;
    }

    return {daysOfMonth: numRange(minNum, maxNum)};
}

function dayOfMonthList(d) {
    return joinListWithKey('daysOfMonth')(d);
}

/***** FUNCTIONS FOR THE MONTHS OF THE YEAR *****/

function monthOfYearNum(d) {
    return parseInt((d[0][0] || "") + d[0][1]);
}

function allMonthsOfYear(d) {
    return {monthsOfYear: jumpRange(12).map(plusN(1))};
}

function monthOfYearJump(d) {
    let step = parseInt(d[1]);

    return {monthsOfYear: jumpRange(12, step).map(plusN(step)).filter(upToN(12))};
}

function monthOfYearRange(d, l, reject) {
    let minNum = d[0];
    let maxNum = d[2];

    if (maxNum <= minNum) {
        return reject;
    }

    return {monthsOfYear: numRange(minNum, maxNum)};
}

function monthOfYearList(d) {
    return joinListWithKey('monthsOfYear')(d);
}

/***** FUNCTIONS FOR THE DAYS OF THE WEEK *****/

function allDaysOfWeek(d) {
    return {daysOfWeek: jumpRange(7)};
}

function dayOfWeekRange(d, l, reject) {
    let minNum = d[0];
    let maxNum = d[2];

    if (maxNum <= minNum) {
        return reject;
    }

    return {daysOfWeek: numRange(minNum, maxNum)};
}

function dayOfWeekList(d) {
    return joinListWithKey('daysOfWeek')(d);
}

/***** FUNCTIONS FOR SHELL COMMANDS *****/

function shellCmd(d) {
    return d[0] + d[1].join("").trim();
}

function shellStdIn(d) {
    let output = d[1].join("");
    return ((output === "") ? null : output);
}

function cronShellCmd(d) {
    return {cmd: d[0], stdin: d[1]};
}

/***** FUNCTIONS FOR CRON STATEMENTS *****/

function cronStat(d) {
    return {
        cron: {
            minutes: d[1].minutes,
            hours: d[3].hours,
            daysOfMonth: d[5].daysOfMonth,
            monthsOfYear: d[7].monthsOfYear,
            daysOfWeek: d[9].daysOfWeek,
            shell: d[11]
        }
    }
}

function isValidStat(obj) {
    // Accept only cron & env statements
    return (obj && (obj.cron || obj.env));
}

function classicCrontab(d) {
    let output = [];

    if (isValidStat(d[1])) {
        output.push(d[1]);
    }

    for (let i in d[2]) {
        if (isValidStat(d[2][i][1])) {
            output.push(d[2][i][1]);
        }
    }

    return output;
}

var grammar = {
    ParserRules: [
    {"name": "classicCrontab$ebnf$1", "symbols": []},
    {"name": "classicCrontab$ebnf$1", "symbols": [{"literal":"\n"}, "classicCrontab$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "classicCrontab$ebnf$2", "symbols": []},
    {"name": "classicCrontab$ebnf$2$subexpression$1$ebnf$1", "symbols": [{"literal":"\n"}]},
    {"name": "classicCrontab$ebnf$2$subexpression$1$ebnf$1", "symbols": [{"literal":"\n"}, "classicCrontab$ebnf$2$subexpression$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "classicCrontab$ebnf$2$subexpression$1", "symbols": ["classicCrontab$ebnf$2$subexpression$1$ebnf$1", "anyLine"]},
    {"name": "classicCrontab$ebnf$2", "symbols": ["classicCrontab$ebnf$2$subexpression$1", "classicCrontab$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "classicCrontab$ebnf$3", "symbols": []},
    {"name": "classicCrontab$ebnf$3", "symbols": [{"literal":"\n"}, "classicCrontab$ebnf$3"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "classicCrontab", "symbols": ["classicCrontab$ebnf$1", "anyLine", "classicCrontab$ebnf$2", "classicCrontab$ebnf$3"], "postprocess": classicCrontab},
    {"name": "anyLine", "symbols": ["envSet"], "postprocess": id},
    {"name": "anyLine", "symbols": ["cronStat"], "postprocess": id},
    {"name": "anyLine", "symbols": ["blankLine"], "postprocess": function(d) { return null; }},
    {"name": "anyLine", "symbols": ["comment"], "postprocess": function(d) { return null; }},
    {"name": "envSet$ebnf$1", "symbols": ["shellString"], "postprocess": id},
    {"name": "envSet$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "envSet", "symbols": ["envIdent", {"literal":"="}, "envSet$ebnf$1"], "postprocess": envSet},
    {"name": "cronStat$ebnf$1", "symbols": []},
    {"name": "cronStat$ebnf$1", "symbols": [/[ \t]/, "cronStat$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "cronStat", "symbols": ["cronStat$ebnf$1", "minutes", "_", "hours", "_", "daysOfMonth", "_", "monthsOfYear", "_", "daysOfWeek", "_", "cronShellCmd"], "postprocess": cronStat},
    {"name": "comment$ebnf$1", "symbols": []},
    {"name": "comment$ebnf$1", "symbols": [/[^\n]/, "comment$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "comment", "symbols": [{"literal":"#"}, "comment$ebnf$1"], "postprocess": function(d) { return null; }},
    {"name": "blankLine", "symbols": ["_"], "postprocess": function(d) { return null; }},
    {"name": "minutes", "symbols": [{"literal":"*"}], "postprocess": minuteAll},
    {"name": "minutes$string$1", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minutes$subexpression$1", "symbols": [/[23456]/]},
    {"name": "minutes$subexpression$1$string$1", "symbols": [{"literal":"1"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minutes$subexpression$1", "symbols": ["minutes$subexpression$1$string$1"]},
    {"name": "minutes$subexpression$1$string$2", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minutes$subexpression$1", "symbols": ["minutes$subexpression$1$string$2"]},
    {"name": "minutes$subexpression$1$string$3", "symbols": [{"literal":"1"}, {"literal":"5"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minutes$subexpression$1", "symbols": ["minutes$subexpression$1$string$3"]},
    {"name": "minutes$subexpression$1$string$4", "symbols": [{"literal":"2"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minutes$subexpression$1", "symbols": ["minutes$subexpression$1$string$4"]},
    {"name": "minutes$subexpression$1$string$5", "symbols": [{"literal":"3"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "minutes$subexpression$1", "symbols": ["minutes$subexpression$1$string$5"]},
    {"name": "minutes", "symbols": ["minutes$string$1", "minutes$subexpression$1"], "postprocess": minuteJump},
    {"name": "minutes", "symbols": ["minute", {"literal":"-"}, "minute"], "postprocess": minuteRange},
    {"name": "minutes$ebnf$1", "symbols": []},
    {"name": "minutes$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "minute"]},
    {"name": "minutes$ebnf$1", "symbols": ["minutes$ebnf$1$subexpression$1", "minutes$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "minutes", "symbols": ["minute", "minutes$ebnf$1"], "postprocess": minuteList},
    {"name": "hours", "symbols": [{"literal":"*"}], "postprocess": hourAll},
    {"name": "hours$string$1", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "hours$subexpression$1", "symbols": [/[23468]/]},
    {"name": "hours$subexpression$1$string$1", "symbols": [{"literal":"1"}, {"literal":"2"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "hours$subexpression$1", "symbols": ["hours$subexpression$1$string$1"]},
    {"name": "hours", "symbols": ["hours$string$1", "hours$subexpression$1"], "postprocess": hourJump},
    {"name": "hours", "symbols": ["hour", {"literal":"-"}, "hour"], "postprocess": hourRange},
    {"name": "hours$ebnf$1", "symbols": []},
    {"name": "hours$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "hour"]},
    {"name": "hours$ebnf$1", "symbols": ["hours$ebnf$1$subexpression$1", "hours$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "hours", "symbols": ["hour", "hours$ebnf$1"], "postprocess": hourList},
    {"name": "daysOfMonth", "symbols": [{"literal":"*"}], "postprocess": allDaysOfMonth},
    {"name": "daysOfMonth$string$1", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "daysOfMonth$subexpression$1", "symbols": [/[2356]/]},
    {"name": "daysOfMonth$subexpression$1$string$1", "symbols": [{"literal":"1"}, {"literal":"0"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "daysOfMonth$subexpression$1", "symbols": ["daysOfMonth$subexpression$1$string$1"]},
    {"name": "daysOfMonth$subexpression$1$string$2", "symbols": [{"literal":"1"}, {"literal":"5"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "daysOfMonth$subexpression$1", "symbols": ["daysOfMonth$subexpression$1$string$2"]},
    {"name": "daysOfMonth", "symbols": ["daysOfMonth$string$1", "daysOfMonth$subexpression$1"], "postprocess": dayOfMonthJump},
    {"name": "daysOfMonth", "symbols": ["dayOfMonth", {"literal":"-"}, "dayOfMonth"], "postprocess": dayOfMonthRange},
    {"name": "daysOfMonth$ebnf$1", "symbols": []},
    {"name": "daysOfMonth$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "dayOfMonth"]},
    {"name": "daysOfMonth$ebnf$1", "symbols": ["daysOfMonth$ebnf$1$subexpression$1", "daysOfMonth$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "daysOfMonth", "symbols": ["dayOfMonth", "daysOfMonth$ebnf$1"], "postprocess": dayOfMonthList},
    {"name": "monthsOfYear", "symbols": [{"literal":"*"}], "postprocess": allMonthsOfYear},
    {"name": "monthsOfYear$string$1", "symbols": [{"literal":"*"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "monthsOfYear", "symbols": ["monthsOfYear$string$1", /[2346]/], "postprocess": monthOfYearJump},
    {"name": "monthsOfYear", "symbols": ["monthOfYearNum", {"literal":"-"}, "monthOfYearNum"], "postprocess": monthOfYearRange},
    {"name": "monthsOfYear$ebnf$1", "symbols": []},
    {"name": "monthsOfYear$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "monthOfYearNum"]},
    {"name": "monthsOfYear$ebnf$1", "symbols": ["monthsOfYear$ebnf$1$subexpression$1", "monthsOfYear$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "monthsOfYear", "symbols": ["monthOfYearNum", "monthsOfYear$ebnf$1"], "postprocess": monthOfYearList},
    {"name": "monthsOfYear", "symbols": ["monthOfYearLit", {"literal":"-"}, "monthOfYearLit"], "postprocess": monthOfYearRange},
    {"name": "monthsOfYear$ebnf$2", "symbols": []},
    {"name": "monthsOfYear$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "monthOfYearLit"]},
    {"name": "monthsOfYear$ebnf$2", "symbols": ["monthsOfYear$ebnf$2$subexpression$1", "monthsOfYear$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "monthsOfYear", "symbols": ["monthOfYearLit", "monthsOfYear$ebnf$2"], "postprocess": monthOfYearList},
    {"name": "daysOfWeek", "symbols": [{"literal":"*"}], "postprocess": allDaysOfWeek},
    {"name": "daysOfWeek", "symbols": ["dayOfWeekNum", {"literal":"-"}, "dayOfWeekNum"], "postprocess": dayOfWeekRange},
    {"name": "daysOfWeek$ebnf$1", "symbols": []},
    {"name": "daysOfWeek$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "dayOfWeekNum"]},
    {"name": "daysOfWeek$ebnf$1", "symbols": ["daysOfWeek$ebnf$1$subexpression$1", "daysOfWeek$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "daysOfWeek", "symbols": ["dayOfWeekNum", "daysOfWeek$ebnf$1"], "postprocess": dayOfWeekList},
    {"name": "daysOfWeek", "symbols": ["dayOfWeekLit", {"literal":"-"}, "dayOfWeekLit"], "postprocess": dayOfWeekRange},
    {"name": "daysOfWeek$ebnf$2", "symbols": []},
    {"name": "daysOfWeek$ebnf$2$subexpression$1", "symbols": [{"literal":","}, "dayOfWeekLit"]},
    {"name": "daysOfWeek$ebnf$2", "symbols": ["daysOfWeek$ebnf$2$subexpression$1", "daysOfWeek$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "daysOfWeek", "symbols": ["dayOfWeekLit", "daysOfWeek$ebnf$2"], "postprocess": dayOfWeekList},
    {"name": "cronShellCmd$ebnf$1", "symbols": ["shellStdIn"], "postprocess": id},
    {"name": "cronShellCmd$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "cronShellCmd", "symbols": ["shellCmd", "cronShellCmd$ebnf$1"], "postprocess": cronShellCmd},
    {"name": "envIdent$ebnf$1", "symbols": []},
    {"name": "envIdent$ebnf$1", "symbols": [/[0-9a-zA-Z_]/, "envIdent$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "envIdent", "symbols": [/[a-zA-Z_]/, "envIdent$ebnf$1"], "postprocess": function(d) { return d[0] + d[1].join("") }},
    {"name": "shellString$ebnf$1$subexpression$1$ebnf$1", "symbols": [{"literal":"\\"}], "postprocess": id},
    {"name": "shellString$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "shellString$ebnf$1$subexpression$1", "symbols": ["shellString$ebnf$1$subexpression$1$ebnf$1", /[^\r\n'"\\]/]},
    {"name": "shellString$ebnf$1$subexpression$1", "symbols": [{"literal":"\\"}, {"literal":"\""}]},
    {"name": "shellString$ebnf$1$subexpression$1", "symbols": [{"literal":"\\"}, {"literal":"'"}]},
    {"name": "shellString$ebnf$1$subexpression$1", "symbols": [{"literal":"\\"}, {"literal":"\\"}]},
    {"name": "shellString$ebnf$1", "symbols": ["shellString$ebnf$1$subexpression$1"]},
    {"name": "shellString$ebnf$1$subexpression$2$ebnf$1", "symbols": [{"literal":"\\"}], "postprocess": id},
    {"name": "shellString$ebnf$1$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "shellString$ebnf$1$subexpression$2", "symbols": ["shellString$ebnf$1$subexpression$2$ebnf$1", /[^\r\n'"\\]/]},
    {"name": "shellString$ebnf$1$subexpression$2", "symbols": [{"literal":"\\"}, {"literal":"\""}]},
    {"name": "shellString$ebnf$1$subexpression$2", "symbols": [{"literal":"\\"}, {"literal":"'"}]},
    {"name": "shellString$ebnf$1$subexpression$2", "symbols": [{"literal":"\\"}, {"literal":"\\"}]},
    {"name": "shellString$ebnf$1", "symbols": ["shellString$ebnf$1$subexpression$2", "shellString$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "shellString", "symbols": ["shellString$ebnf$1"], "postprocess": unQuotedString},
    {"name": "shellString$ebnf$2", "symbols": []},
    {"name": "shellString$ebnf$2", "symbols": ["doubleQuotedContent", "shellString$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "shellString", "symbols": [{"literal":"\""}, "shellString$ebnf$2", {"literal":"\""}], "postprocess": function(d) { return d[1].join(""); }},
    {"name": "shellString$ebnf$3", "symbols": []},
    {"name": "shellString$ebnf$3", "symbols": ["singleQuotedContent", "shellString$ebnf$3"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "shellString", "symbols": [{"literal":"'"}, "shellString$ebnf$3", {"literal":"'"}], "postprocess": function(d) { return d[1].join(""); }},
    {"name": "doubleQuotedContent", "symbols": [/[^\r\n"\\]/], "postprocess": function(d) { return d[0]; }},
    {"name": "doubleQuotedContent", "symbols": [{"literal":"\\"}, /[^\r\n"\\]/], "postprocess": function(d) { return d.join(""); }},
    {"name": "doubleQuotedContent$string$1", "symbols": [{"literal":"\\"}, {"literal":"\\"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "doubleQuotedContent", "symbols": ["doubleQuotedContent$string$1"], "postprocess": function(d) { return "\\"; }},
    {"name": "doubleQuotedContent$string$2", "symbols": [{"literal":"\\"}, {"literal":"\""}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "doubleQuotedContent", "symbols": ["doubleQuotedContent$string$2"], "postprocess": function(d) { return "\""; }},
    {"name": "singleQuotedContent", "symbols": [/[^\r\n'\\]/], "postprocess": function(d) { return d[0]; }},
    {"name": "singleQuotedContent", "symbols": [{"literal":"\\"}, /[^\r\n'\\]/], "postprocess": function(d) { return d.join(""); }},
    {"name": "singleQuotedContent$string$1", "symbols": [{"literal":"\\"}, {"literal":"\\"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singleQuotedContent", "symbols": ["singleQuotedContent$string$1"], "postprocess": function(d) { return "\\"; }},
    {"name": "singleQuotedContent$string$2", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "singleQuotedContent", "symbols": ["singleQuotedContent$string$2"], "postprocess": function(d) { return "'"; }},
    {"name": "minute$ebnf$1", "symbols": [/[0-5]/], "postprocess": id},
    {"name": "minute$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "minute", "symbols": ["minute$ebnf$1", /[0-9]/], "postprocess": minute},
    {"name": "hour$subexpression$1$ebnf$1", "symbols": [/[01]/], "postprocess": id},
    {"name": "hour$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "hour$subexpression$1", "symbols": ["hour$subexpression$1$ebnf$1", /[0-9]/]},
    {"name": "hour$subexpression$1", "symbols": [{"literal":"2"}, /[0-3]/]},
    {"name": "hour", "symbols": ["hour$subexpression$1"], "postprocess": hour},
    {"name": "dayOfMonth$subexpression$1$ebnf$1", "symbols": [{"literal":"0"}], "postprocess": id},
    {"name": "dayOfMonth$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dayOfMonth$subexpression$1", "symbols": ["dayOfMonth$subexpression$1$ebnf$1", /[1-9]/]},
    {"name": "dayOfMonth$subexpression$1", "symbols": [/[12]/, /[0-9]/]},
    {"name": "dayOfMonth$subexpression$1", "symbols": [{"literal":"3"}, /[01]/]},
    {"name": "dayOfMonth", "symbols": ["dayOfMonth$subexpression$1"], "postprocess": dayOfMonth},
    {"name": "monthOfYearNum$subexpression$1$ebnf$1", "symbols": [{"literal":"0"}], "postprocess": id},
    {"name": "monthOfYearNum$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "monthOfYearNum$subexpression$1", "symbols": ["monthOfYearNum$subexpression$1$ebnf$1", /[1-9]/]},
    {"name": "monthOfYearNum$subexpression$1", "symbols": [{"literal":"1"}, /[0-2]/]},
    {"name": "monthOfYearNum", "symbols": ["monthOfYearNum$subexpression$1"], "postprocess": monthOfYearNum},
    {"name": "monthOfYearLit", "symbols": [/[jJ]/, /[aA]/, /[nN]/], "postprocess": function(d) { return 1; }},
    {"name": "monthOfYearLit", "symbols": [/[fF]/, /[eE]/, /[bB]/], "postprocess": function(d) { return 2; }},
    {"name": "monthOfYearLit", "symbols": [/[mM]/, /[aA]/, /[rR]/], "postprocess": function(d) { return 3; }},
    {"name": "monthOfYearLit", "symbols": [/[aA]/, /[pP]/, /[rR]/], "postprocess": function(d) { return 4; }},
    {"name": "monthOfYearLit", "symbols": [/[mM]/, /[aA]/, /[yY]/], "postprocess": function(d) { return 5; }},
    {"name": "monthOfYearLit", "symbols": [/[jJ]/, /[uU]/, /[nN]/], "postprocess": function(d) { return 6; }},
    {"name": "monthOfYearLit", "symbols": [/[jJ]/, /[uU]/, /[lL]/], "postprocess": function(d) { return 7; }},
    {"name": "monthOfYearLit", "symbols": [/[aA]/, /[uU]/, /[gG]/], "postprocess": function(d) { return 8; }},
    {"name": "monthOfYearLit", "symbols": [/[sS]/, /[eE]/, /[pP]/], "postprocess": function(d) { return 9; }},
    {"name": "monthOfYearLit", "symbols": [/[oO]/, /[cC]/, /[tT]/], "postprocess": function(d) { return 10; }},
    {"name": "monthOfYearLit", "symbols": [/[nN]/, /[oO]/, /[vV]/], "postprocess": function(d) { return 11; }},
    {"name": "monthOfYearLit", "symbols": [/[dD]/, /[eE]/, /[cC]/], "postprocess": function(d) { return 12; }},
    {"name": "dayOfWeekNum", "symbols": [/[0-6]/], "postprocess": function(d) { return parseInt(d[0]); }},
    {"name": "dayOfWeekLit", "symbols": [/[sS]/, /[uU]/, /[nN]/], "postprocess": function(d) { return 0; }},
    {"name": "dayOfWeekLit", "symbols": [/[mM]/, /[oO]/, /[nN]/], "postprocess": function(d) { return 1; }},
    {"name": "dayOfWeekLit", "symbols": [/[tT]/, /[uU]/, /[eE]/], "postprocess": function(d) { return 2; }},
    {"name": "dayOfWeekLit", "symbols": [/[wW]/, /[eE]/, /[dD]/], "postprocess": function(d) { return 3; }},
    {"name": "dayOfWeekLit", "symbols": [/[tT]/, /[hH]/, /[uU]/], "postprocess": function(d) { return 4; }},
    {"name": "dayOfWeekLit", "symbols": [/[fF]/, /[rR]/, /[iI]/], "postprocess": function(d) { return 5; }},
    {"name": "dayOfWeekLit", "symbols": [/[sS]/, /[aA]/, /[tT]/], "postprocess": function(d) { return 6; }},
    {"name": "shellCmd$ebnf$1", "symbols": []},
    {"name": "shellCmd$ebnf$1$subexpression$1", "symbols": [/[^\r\n%\\]/]},
    {"name": "shellCmd$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"\\"}, {"literal":"\\"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "shellCmd$ebnf$1$subexpression$1", "symbols": ["shellCmd$ebnf$1$subexpression$1$string$1"]},
    {"name": "shellCmd$ebnf$1$subexpression$1$string$2", "symbols": [{"literal":"\\"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "shellCmd$ebnf$1$subexpression$1", "symbols": ["shellCmd$ebnf$1$subexpression$1$string$2"]},
    {"name": "shellCmd$ebnf$1", "symbols": ["shellCmd$ebnf$1$subexpression$1", "shellCmd$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "shellCmd", "symbols": [/[^\n\s%\\]/, "shellCmd$ebnf$1"], "postprocess": shellCmd},
    {"name": "shellStdIn$ebnf$1", "symbols": []},
    {"name": "shellStdIn$ebnf$1", "symbols": ["shellStdInChar", "shellStdIn$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "shellStdIn", "symbols": [{"literal":"%"}, "shellStdIn$ebnf$1"], "postprocess": shellStdIn},
    {"name": "shellStdInChar", "symbols": [/[^\r\n%]/], "postprocess": function(d) { return d[0]; }},
    {"name": "shellStdInChar", "symbols": [{"literal":"%"}], "postprocess": function(d) { return "\n"; }},
    {"name": "_$ebnf$1", "symbols": [/[ \t]/]},
    {"name": "_$ebnf$1", "symbols": [/[ \t]/, "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) { return null; }}
]
  , ParserStart: "classicCrontab"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
