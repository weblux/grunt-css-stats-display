'use strict';

module.exports = {
    getWorstSelectors: getWorstSelectors,
    getUniqueMediaQueries: getUniqueMediaQueries
};

/**
 * get the worst selectors out of the css stats json
 * @param  {Object} selectors  json string
 * @param  {[type]} threshold
 * @return {Object} selectors over the threshold
 */
function getWorstSelectors(selectors, threshold) {
    var i,
        formattedSpecificity,
        results = [];

    for (var i = 0; i < selectors.length; i++) {
        if (selectors[i].specificity >= parseInt(threshold)) {
            results.push(selectors[i]);
        }
    }
    return results;
}

/**
 * sort and get unique media queries
 * @param {Array} mediaQueries
 */
function getUniqueMediaQueries(mediaQueries) {
    var i,
        results = [];

    for (i = 0; i < mediaQueries.length; i++) {
        if (results.indexOf(mediaQueries[i].value) === -1) {
            results.push(mediaQueries[i].value);
        }
    }

    return results;
}
