// Format.js formats the raw text of a set of production rules according to the style guide.

var fs = require('fs');

// This function does the following to the raw text file:
// 1. trims each line of text
// 2. aligns '|' character if it appears at the beginning of a line
// 3. aligns post-processing functions along the axis formed by the greatest column
function alignProductionRules(source) {
    // String that will be built containing the well-formatted production rules.
    var processedOutput = '';

    // The array of lines.
    var lines = source.split('\n');

    // The column that denotes the greatest column that begins a post-processing function
    var maxPostProcessing = -1;

    // Iterate over each line and do the following:
    // 1. trim the string for whitespaces
    // 2. align the '|' character
    // 3. look the greatest column containing the beginning of a post-processing function
    for (var i in lines) {

        lines[i] = lines[i].trim();

        if (lines[i].length > 0) {
            if (lines[i].charAt(0) == '|') {
                lines[i] = '    ' + lines[i];
            }
        }

        maxPostProcessing = Math.max(maxPostProcessing, lines[i].search('{%'));

    }

    if (maxPostProcessing != -1) {

        // Iterate over each line and align the post-processing function
        for (var i in lines) {
            var postProcessingIndex = lines[i].search('{%');

            if (postProcessingIndex == -1) {
                continue;
            }

            var spaces = '';

            var spaceDiff = maxPostProcessing - postProcessingIndex;

            while (spaceDiff > 0) {
                spaces += ' ';
                --spaceDiff;
            }

            // Build the string by:
            //   taking the substring up to the post-processing function
            // + spaces equal to the maxPostProcessing column - this line's post-processing function column
            // + taking the substring beginning at the post-processing function
            lines[i] = lines[i].substring(0, postProcessingIndex) + spaces + lines[i].substring(postProcessingIndex);
        }
    }

    // Build the well-formatted string.
    for (var i in lines) {
        processedOutput += lines[i];
        if (i < lines.length - 1) {
            processedOutput += '\n';
        }
    }

    return processedOutput;
}

// This function takes in the name of a file that specifies a set of production rules.
// If the the file cannot be opened and read, the function returns.
// Otherwise, the contents of the file are read and are formatted according to the style guide.
// The formatted file contents are subsequently written to the original file. 
function format(filename) {
    fs.readFile(filename, 'utf-8', function(err, data) {
        if (err) return;

        var formattedOutput = alignProductionRules(data);

        fs.writeFile(filename, formattedOutput, 'utf-8');

    })

}

module.exports = {format, alignProductionRules};