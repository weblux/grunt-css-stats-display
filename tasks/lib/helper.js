'use strict'

module.exports = {
  getWorstSelectors: getWorstSelectors,
  getUniqueMediaQueries: getUniqueMediaQueries,
  getTextColors: getTextColors,
  getBackgroundColors: getBackgroundColors,
  getUniqueZIndex: getUniqueZIndex
}

/**
 * get the worst selectors out of the css stats json
 * @param  {Object} selectors  json string
 * @param  {[type]} threshold
 * @return {Object} selectors over the threshold
 */
function getWorstSelectors (selectors = [], threshold = 40) {
  var results = []

  selectors.forEach(function (selector) {
    if (selector.specificity >= parseInt(threshold)) {
      results.push(selector)
    }
  })

  return results
}

/**
 * sort and get unique media queries
 * @param {Array} mediaQueries
 */
function getUniqueMediaQueries (mediaQueries = []) {
  var results = []

  mediaQueries.forEach(function (mediaQuery) {
    if (results.indexOf(mediaQuery.value) === -1) {
      results.push(mediaQuery.value)
    }
  })

  return results
}

function getTextColors (textColors = []) {
  var results = []

  textColors.forEach(function (textColor) {
    textColor = textColor.toUpperCase()
    if (results.indexOf(textColor) === -1 && textColor[0] === '#') {
      results.push(textColor)
    }
  })

  return results
}

function getBackgroundColors (backgroundColor = [], background = []) {
  var plain = []
  var gradient = []

  backgroundColor.forEach(function (background) {
    background = background.toUpperCase()

    if (background !== 'TRANSPARENT' && background !== 'NONE' && plain.indexOf(background) === -1) {
      plain.push(background)
    }
  })

  background.forEach(function (background) {
    background = background.toUpperCase()
    var regex = /(#[0123456789ABCDEF]{3,6})|(HSLA\(.*\))|(HSL\(.*\))|(RGBA\(.*\))|(RGB\(.*\))/gm.exec(background)
    if (regex !== null) {
      if (background.indexOf('GRADIENT') === -1) {
        background = regex[0]
        if (plain.indexOf(background) === -1) {
          plain.push(background)
        }
      } else {
        if (gradient.indexOf(background) === -1) {
          gradient.push(background)
        }
      }
    }
  })

  return {
    plain: plain,
    gradient: gradient
  }
}

function getUniqueZIndex (zIndex = []) {
  var results = []

  zIndex.forEach(function (index) {
    if (results.indexOf(index) === -1) {
      results.push(index)
    }
  })

  results.sort(function (a, b) {
    return a - b
  })

  return results
}
