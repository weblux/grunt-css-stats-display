'use strict';

module.exports = {
    getWorstSelectors: getWorstSelectors,
    stripCommas: stripCommas
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
        formattedSpecificity = Number(selectors[i].specificity.replace(/,/g, ''));
        if (formattedSpecificity >= parseInt(threshold)) {
            results.push(selectors[i]);
        }
    }

    return results;
}

function stripCommas(specificity) {
    if (specificity.match(/,/g)) {
        return specificity.replace(/,/g, '');
    }
    return specificity;
}
