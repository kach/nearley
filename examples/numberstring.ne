@{%

var nameMap = {
    one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,
    ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,
    twenty:20,thirty:30,fourty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90,
    hundred:100,thousand:1000,million:1000000,billion:1000000000
};

var nameToVal = function(d) {
    return nameMap[d];
};

var nothing = function (d) {
    return null;
};

var sumParts = function(d) {
    var retVal = 0;
    for(var i=0;i<d.length;i++) {
        var curVal = d[i];
        if(curVal!==null&&!isNaN(curVal)) {
            retVal = retVal+parseInt(curVal);
        }
    }
    return retVal;
};

var multParts = function(d) {
    var retVal = 1;
    for(var i=0;i<d.length;i++) {
        var curVal = d[i];
        if(curVal!==null&&!isNaN(curVal)) {
            retVal = retVal*parseInt(curVal);
        }
    }
    return retVal;
};

var findFirstNestedValueFromArray = function(d) {
    if(d instanceof Array) return findFirstNestedValueFromArray(d[0]);
    return d;
};
%}

matchString[X] -> $X {% nameToVal %}

main -> billionsNumber {% findFirstNestedValueFromArray %}

billionsNumber -> billionsSimple|billionsCompound|millionsNumber
millionsNumber -> millionsSimple|millionsCompound|thousandsNumber
thousandsNumber -> thousandsSimple|thousandsCompound|hundredsNumber
hundredsNumber -> hundredsSimple|hundredsCompound|tensNumber
tensNumber -> teenSimple|tensSimple|tensCompound|singlesSimple
    
billionsCompound -> billionsSimple space billionsNumber {% sumParts %}
millionsCompound -> millionsSimple space millionsNumber {% sumParts %}
thousandsCompound -> thousandsSimple space hundredsNumber {% sumParts %}
hundredsCompound -> hundredsSimple space tensNumber {% sumParts %}
tensCompound -> tensSimple space singlesSimple {% sumParts %}

billionsSimple -> millionsNumber space matchString["billion"] {% multParts %}
millionsSimple -> thousandsNumber space matchString["million"] {% multParts %}
thousandsSimple -> hundredsNumber space matchString["thousand"] {% multParts %}
hundredsSimple -> tensNumber space matchString["hundred"] {% multParts %}

teenSimple -> ("ten"|"eleven"|"twelve"|"thirteen"|"fourteen"|"fifteen"|"sixteen"|"seventeen"|"eighteen"|"nineteen") {% nameToVal %}
tensSimple -> ("twenty"|"thirty"|"fourty"|"fifty"|"sixty"|"seventy"|"eighty"|"ninety") {% nameToVal %}
singlesSimple -> ("one"|"two"|"three"|"four"|"five"|"six"|"seven"|"eight"|"nine") {% nameToVal %}
   
space -> [\s] {% nothing %}