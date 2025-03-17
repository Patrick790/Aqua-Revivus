
function getColourGradient(c1, c2)
{
    var c = "#";
    for(var i = 0; i<3; i++)
    {
        var sub1 = c1.substring(1+2*i, 3+2*i);
        var sub2 = c2.substring(1+2*i, 3+2*i);
        var v1 = parseInt(sub1, 16);
        var v2 = parseInt(sub2, 16);
        var v = Math.floor((v1 + v2) / 2);
        var sub = v.toString(16).toUpperCase();
        var padsub = ('0'+sub).slice(-2);
        c += padsub;
    }
    return c;
}

export function getMissingPeriods(periods)
{
    var missingPeriods = [];
    for(var i = 0; i < periods.length; i++)
    {
        var start = periods[i][0].split("T")[0];
        var end = periods[i][1].split("T")[0];
        missingPeriods.push(start + " - " + end);
    }
    return missingPeriods;
}

export function getAverageOfList(list)
{
    var sum = 0;
    for(var i = 0; i < list.length; i++)
    {
        sum += list[i];
    }
    return sum / list.length;
}