# Parser for classic crontab. For syntax, check: man 5 crontab
# Note that Vixie crontab extensions are not included, as any other extension
# Linux, FreeBSD, MacOS X (macos) all use Vixie extensions
# Solaris as opposed, uses classic crontab syntax
# Any valid classic crontab can be used on Linux, FreeBSD, MacOS X (macos)

classicCrontab -> "\n":* anyLine ("\n":+ anyLine):* "\n":* {% classicCrontab %}

anyLine ->
      envSet {% id %}
    | cronStat {% id %}
    | blankLine {% function(d) { return null; }%}
    | comment {% function(d) { return null; }%}

envSet -> envIdent "=" shellString:? {% envSet %}

cronStat -> [ \t]:* minutes _ hours _ daysOfMonth _ monthsOfYear _ daysOfWeek _ cronShellCmd {% cronStat %}

comment -> "#" [^\n]:* {% function(d) { return null; }%}

blankLine -> _ {% function(d) { return null; }%}

minutes ->
      "*" {% minuteAll %}
    | "*/" ([23456] | "10" | "12" | "15" | "20" | "30") {% minuteJump %}
    | minute "-" minute {% minuteRange %}
    | minute ("," minute):* {% minuteList %}

hours ->
      "*" {% hourAll %}
    | "*/" ([23468] | "12") {% hourJump %}
    | hour "-" hour {% hourRange %}
    | hour ("," hour):* {% hourList %}

daysOfMonth ->
      "*" {% allDaysOfMonth %}
    | "*/" ([2356] | "10" | "15") {% dayOfMonthJump %}
    | dayOfMonth "-" dayOfMonth {% dayOfMonthRange %}
    | dayOfMonth ("," dayOfMonth):* {% dayOfMonthList %}

monthsOfYear ->
      "*" {% allMonthsOfYear %}
    | "*/" [2346] {% monthOfYearJump %}
    | monthOfYearNum "-" monthOfYearNum {% monthOfYearRange %}
    | monthOfYearNum ("," monthOfYearNum):* {% monthOfYearList %}
    | monthOfYearLit "-" monthOfYearLit {% monthOfYearRange %}
    | monthOfYearLit ("," monthOfYearLit):* {% monthOfYearList %}

daysOfWeek ->
      "*" {% allDaysOfWeek %}
    | dayOfWeekNum "-" dayOfWeekNum {% dayOfWeekRange %}
    | dayOfWeekNum ("," dayOfWeekNum):* {% dayOfWeekList %}
    | dayOfWeekLit "-" dayOfWeekLit {% dayOfWeekRange %}
    | dayOfWeekLit ("," dayOfWeekLit):* {% dayOfWeekList %}

cronShellCmd -> shellCmd shellStdIn:? {% cronShellCmd %}

envIdent -> [a-zA-Z_] [0-9a-zA-Z_]:* {% function(d) { return d[0] + d[1].join("") } %}

shellString ->
      ("\\":? [^\r\n'"\\] | "\\" "\"" | "\\" "'" | "\\" "\\"):+ {% unQuotedString %}
    | "\"" doubleQuotedContent:* "\"" {% function(d) { return d[1].join(""); } %}
    | "'" singleQuotedContent:* "'" {% function(d) { return d[1].join(""); } %}

doubleQuotedContent ->
      [^\r\n"\\] {% function(d) { return d[0]; } %}
    | "\\" [^\r\n"\\] {% function(d) { return d.join(""); } %}
    | "\\\\" {% function(d) { return "\\"; } %}
    | "\\\"" {% function(d) { return "\""; } %}

singleQuotedContent ->
      [^\r\n'\\] {% function(d) { return d[0]; } %}
    | "\\" [^\r\n'\\] {% function(d) { return d.join(""); } %}
    | "\\\\" {% function(d) { return "\\"; } %}
    | "\\'" {% function(d) { return "'"; } %}

minute -> [0-5]:? [0-9] {% minute %}

hour -> ([01]:? [0-9] | "2" [0-3]) {% hour %}

dayOfMonth -> ("0":? [1-9] | [12] [0-9] | "3" [01]) {% dayOfMonth %}

monthOfYearNum -> ("0":? [1-9] | "1" [0-2]) {% monthOfYearNum %}

monthOfYearLit ->
    [jJ] [aA] [nN] {% function(d) { return 1; } %}
    | [fF] [eE] [bB] {% function(d) { return 2; } %}
    | [mM] [aA] [rR] {% function(d) { return 3; } %}
    | [aA] [pP] [rR] {% function(d) { return 4; } %}
    | [mM] [aA] [yY] {% function(d) { return 5; } %}
    | [jJ] [uU] [nN] {% function(d) { return 6; } %}
    | [jJ] [uU] [lL] {% function(d) { return 7; } %}
    | [aA] [uU] [gG] {% function(d) { return 8; } %}
    | [sS] [eE] [pP] {% function(d) { return 9; } %}
    | [oO] [cC] [tT] {% function(d) { return 10; } %}
    | [nN] [oO] [vV] {% function(d) { return 11; } %}
    | [dD] [eE] [cC] {% function(d) { return 12; } %}

dayOfWeekNum -> [0-6] {% function(d) { return parseInt(d[0]); } %}

dayOfWeekLit ->
      [sS] [uU] [nN] {% function(d) { return 0; } %}
    | [mM] [oO] [nN] {% function(d) { return 1; } %}
    | [tT] [uU] [eE] {% function(d) { return 2; } %}
    | [wW] [eE] [dD] {% function(d) { return 3; } %}
    | [tT] [hH] [uU] {% function(d) { return 4; } %}
    | [fF] [rR] [iI] {% function(d) { return 5; } %}
    | [sS] [aA] [tT] {% function(d) { return 6; } %}

shellCmd -> [^\n\s%\\] ([^\r\n%\\] | "\\\\" | "\\%"):* {% shellCmd %}

shellStdIn -> "%" shellStdInChar:* {% shellStdIn %}

shellStdInChar ->
      [^\r\n%] {% function(d) { return d[0]; } %}
    | "%" {% function(d) { return "\n"; } %}

_ -> [ \t]:+ {% function(d) { return null; } %}

@{%

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

%}
