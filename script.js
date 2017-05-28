function toggleSlider(element) {
  console.log($('#' + element.value), element.checked);
  $('#' + element.value).css('display', (element.checked) ? 'block' : 'none');
}

function clickedCheckbox(element) {
  toggleSlider(element);
}
// some helpers
String.prototype.replaceAllWith = function (swapper) {
    var outPutText = this
    var done = []
    for (find in swapper) {
        var replacement = swapper[find]
        outPutText = outPutText.replace(new RegExp(find, 'g'), function (match, index) {
            r = replacement
            if (done.indexOf(index) >= 0) {
                r = find
            }
            done.push(index)
            return r
        })
    }
    return outPutText
}

String.prototype.shuffle = function(){
    var that=this.split("");
    var len = that.length,t,i
    while(len) {
        i=Math.random()*len-- |0;
        t=that[len],that[len]=that[i],that[i]=t;
    }
    return that.join("");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// start swap characters
swapLettersLight = {
    'b': "d",
    'd': "b",
    'p': 'q',
    'q': 'p',
    'm': 'w',
    'w': 'm'
}

swapLettersHeavy = {
    'a' : 'e',
    'e' : 'a',
    'f' : 'v',
    'v' : 'f'
}

function swapCharacters(intputText, useHeavy) {
    if (useHeavy > .5) {
        swapLetters = $.extend({}, swapLettersLight, swapLettersHeavy)
    }
    else {
        swapLetters = $.extend({}, swapLettersLight)
    }

    outputText = intputText.replaceAllWith(swapLetters)
    return outputText
}
// end swap characters

// start swap tweeklanken
swapLettersLightTweeKlank = {
    'au': "ua",
    'ou': "uo",
    'ei': "ij",
    'ij': "ei",
    'eu': "ue",
    'ui': "iu",
}

swapLettersHeavyTweeKlank = {
    'au': "ua",
    'ou': "uo",
    'ei': "ij",
    'ij': "ei",
    'eu': "ue",
    'ui': "iu",
    'aa': "ee",
    'ee': "aa",
    'ou': "uo",
    'oe': "eo"
}

function swapTweeKlank(intputText, useHeavy) {
    if (useHeavy > .5) {
        swapLetters = $.extend({}, swapLettersLightTweeKlank, swapLettersHeavyTweeKlank)
    }
    else {
        swapLetters = $.extend({}, swapLettersLightTweeKlank)
    }

    outputText = intputText.replaceAllWith(swapLetters)
    return outputText
}
// end swap tweeklanken

// start swap double characters
swapLettersLightDubbeleLetters = {
    'a': "aa",
    'b': "bb",
    'c': "cc",
    'g': "gg",
    'n': "nn",
    'o': "oo",
    's': "ss",
    't': "tt",
    'u': "uu"

}

swapLettersHeavyDubbeleLetters = {
    'a': "aaaa",
    'b': "bbbb",
    'c': "cccc",
    'g': "gggg",
    'e': "eeee",
    'g': "gggg",
    'k': "kkkk",
    'm': "mmmm",
    'n': "nnnn",
    'o': "oooo",
    's': "ssss",
    't': "tttt",
    'u': "uuuu"

}

function swapperDubbeleLetters(intputText, useHeavy) {
    if (useHeavy > .5) {
        swapLetters = $.extend({}, swapLettersLightDubbeleLetters, swapLettersHeavyDubbeleLetters)
    }
    else {
        swapLetters = $.extend({}, swapLettersLightDubbeleLetters)
    }

    outputText = intputText.replaceAllWith(swapLetters)
    return outputText
}
// end swap double characters

// start swap whole words
function swapWords(inputText, swapValue) {
    outputText = ""
    elements = inputText.split(" ")
    // maxSwaps = elements.length * swapValue
    // for (i=0; i<maxSwaps;i++) {
    //     index1 = getRandomInt(0, elements.length-1)
    //     index2 = getRandomInt(0, elements.length-1)
    //     w1 = elements[index1]
    //     w2 = elements[index2]
    //     elements[index1] = w2
    //     elements[index2] = w1
    // }
    maxWordLength = 10 - 10 * swapValue
    for (index=0; index<elements.length; index++) {
      item = elements[index]

      if (item.length > maxWordLength) {
        elements.splice(index, 1)
        elements.splice(getRandomInt(0, elements.length-1), 0, item)
      }
    }
    return elements.join(" ")
}
// end swap whole words

// start zonder spaties
function spatiesWeg(inputText, swapValue) {
    return inputText.replace(new RegExp(" ", 'g'), "")
}
// end zonder spaties

// start swapping inside a word
function insideWordSwap(inputText, swapValue) {
    outputText = ""
    cursor = 0
    minLength  = 3 + 7 * (1-swapValue)
    wordsDone = {}
    wordPattern = /\b(\w+)\b/g
    while (match = wordPattern.exec(inputText)) {
        word = match[0]
        if (word.length > minLength ) {
            if (word in wordsDone) {
                result = wordsDone[word]
            }
            else {
                firstLetter = word[0]
                lastLetter = word[word.length-1]
                middle = word.substring(1,word.length-1)
                middle = middle.shuffle()
                result = firstLetter + middle + lastLetter

                if (!(result in wordsDone)) {
                    wordsDone[word] = result
                }
            }
        }
        else {
            result = word
        }
        outputText += inputText.substring(cursor, match.index) + result
        cursor = match.index + word.length
    }

    outputText += inputText.substring(cursor, inputText.length )
    return outputText
}
// end swapping inside a word

function parseText(inputText) {
    outputText = inputText

    jump = 0
    jumpWoord = 0
    tracking = 0
    trackingWider = 0
    trackingSmaller = 0
    slechteLetterHerkenning = 0
    spiegelSchrift = false
    ondersteBoven = false
    lettersDraaien = 0
    lettersDraaienOnregelmatig = 0
    spatiesBreed = 0
    spatiesNauw = 0
    lettersBeven = 0
    woordenBeven = 0
    lettersHorizontaal = 0
    woordenHorizontaal = 0
    interlinie = 0
    interlinieKlein = 0
    woordenDraaien = 0

    $("#controls .checkbox").each(function() {
        if (this.checked) {
            sliderValue = parseFloat($(this).next().val())
            varValue = $(this).nextAll('input[type=radio]:checked').val();

            switch (this.value) {
            // textual changes
                case "insideWordSwap":
                    outputText = insideWordSwap(outputText, sliderValue)
                    break;
                case "swapWords":
                    outputText = swapWords(outputText, sliderValue)
                    break;
                case "swapCharacters":
                    outputText = swapCharacters(outputText, sliderValue)
                    break;
                case "swapTweeKlank":
                    outputText = swapTweeKlank(outputText, sliderValue)
                    break;
                case "swapperDubbeleLetters":
                    outputText = swapperDubbeleLetters(outputText, sliderValue)
                    break;
                case "spatiesWeg":
                    outputText = spatiesWeg(outputText, sliderValue)
                    break;
                // visual changes
                case "jump":
                    jump = sliderValue
                    break;
                case "jumpWoord":
                    jumpWoord = sliderValue
                    break;
                case "tracking":
                    tracking = sliderValue
                    break;
        				case "trackingWider":
                    trackingWider = sliderValue
        					  break;
        				case "trackingSmaller":
        					  trackingSmaller = sliderValue
        					  break;
        				case "slechteLetterHerkenning":
        					  slechteLetterHerkenning = varValue
        					  break;
                case "spiegelSchrift":
                    spiegelSchrift = true
                    break;
                case "ondersteBoven":
                    ondersteBoven = true
                    break;
                case "lettersDraaien":
                    lettersDraaien = sliderValue
                    break;
                case "lettersDraaienOnregelmatig":
                    lettersDraaienOnregelmatig = sliderValue
                    break;
                case "spatiesBreed":
                    spatiesBreed = sliderValue
                    break;
                case "spatiesNauw":
                    spatiesNauw = sliderValue
                    break;
                case "lettersBeven":
                    lettersBeven = sliderValue
                    break;
                case "woordenBeven":
                    woordenBeven = sliderValue
                    break;
                case "lettersHorizontaal":
                    lettersHorizontaal = sliderValue
                    break;
                case "woordenHorizontaal":
                    woordenHorizontaal = sliderValue
                    break;
                case "interlinie":
                    interlinie = sliderValue
                    break;
                case "interlinieKlein":
                    interlinieKlein = sliderValue
                    break;
               case "woordenDraaien":
                    woordenDraaien = sliderValue
                    break;
               default:
                   break;

                }
          }
    })

    beginWoord = "NEWWORD"

    outputText = outputText.replace(/\S|\s/g, function (match) {
        style = ''
        clss = 'letter'
        letterSpacing = Math.random() * tracking + trackingWider - trackingSmaller
        interlinieValue = 1 + 10 * (interlinie - interlinieKlein) * 10

        if ((spatiesBreed || spatiesNauw) && match == " ") {
           letterSpacing = spatiesBreed - spatiesNauw
        }

        style += "letter-spacing:" + letterSpacing +"em;"
        style += "margin-bottom:" + interlinieValue + "px;"
        style += "display:" + "inline-block;"

        if (jump) {
            style += "position:relative;top:-" + Math.random() * jump +"em;"
        }

        if (spiegelSchrift || lettersDraaien || lettersDraaienOnregelmatig || ondersteBoven || lettersBeven || lettersHorizontaal) {
           if (match != " ") {
             style += "display:inline-block;"
        }

        if (spiegelSchrift || lettersDraaien || lettersDraaienOnregelmatig || ondersteBoven || lettersBeven || lettersHorizontaal) {
             transformStyle = ''

             if (lettersDraaien) {
                letterAngle = lettersDraaien * 40
                transformStyle += "rotate(" + letterAngle + "deg)"
             }

             if (lettersDraaienOnregelmatig) {
                letterAngle = lettersDraaienOnregelmatig * 20 * (Math.random() - .5)
                transformStyle += "rotate(" + letterAngle + "deg)"
             }

             if (lettersBeven) {
               x = lettersBeven * 20 * (Math.random() - .5)
               y = lettersBeven * 20 * (Math.random() - .5)
               transformStyle += "translate(" + x + "px," + y + "px)"
             }

             if (lettersHorizontaal) {
               x = lettersHorizontaal * 20 * (Math.random() - .5)
               y = 0
               transformStyle += "translate(" + x + "px," + y + "px)"
             }

             if (spiegelSchrift) {
                 transformStyle += "scale(-1, 1) "
             }

             if (ondersteBoven) {
                transformStyle += "scale(1, -1) "
             }

             style += "transform: " + transformStyle + ";"
           }
        }

        // samen plakken van all styles
        if (style) {
            style = " style='" + style + "'"
        }
        // samen plakken van alle classes
        if (clss) {
            clss = " class='" + clss + "'"
        }

        if (match == " ") {
            match = "&nbsp;"
            beginWoord = "</span>"
        }

        if (match == "\r" || match == "\n") {
          beginWoord = "</span>"
        }

        if (beginWoord == "NEWWORD") {
          wordStyle = ''

          // als woorden draaien of boven of horizontaal beven dan...
          if (woordenDraaien || woordenBeven || woordenHorizontaal) {
            woordTransformStyle = ""
            //
            if (woordenDraaien) {
              woordAngle = woordenDraaien * 20 * (Math.random() - .5)
              woordTransformStyle += "rotate(" + woordAngle + "deg)"
            }

            if (woordenBeven) {
              x = woordenBeven * 20 * (Math.random() - .5)
              y = woordenBeven * 20 * (Math.random() - .5)
              woordTransformStyle += "translate(" + x + "px," + y + "px)"
            }

            if (woordenHorizontaal) {
              x = woordenHorizontaal * 20 * (Math.random() - .5)
              y = 0
              woordTransformStyle += "translate(" + x + "px," + y + "px)"
            }

            wordStyle += "transform: " + woordTransformStyle + ";"
          }

          if (jumpWoord) {
            wordStyle += "position:relative;top:-" + Math.random() * jumpWoord +"em;"
          }

          if (wordStyle) {
            wordStyle = " style='" + wordStyle + "'"
          }

          beginWoord = "<span class='woord'" + wordStyle + ">"
        }

        result = beginWoord + '<span' + clss + style + '>' + match + '</span>'

        if (beginWoord == "</span>") {
          beginWoord = "NEWWORD"
        }
        else {
          beginWoord = ""
        }

        return result
    })
    outputText = outputText.replace(/\r?\n/g, '<br>')

  output = $("#output")


  if (slechteLetterHerkenning) {
      output.typer([outputText], options={endless:false, duration: 800  * slechteLetterHerkenning})
  }
  else {
      output.html(outputText)
  }

}

$(document).ready(function() {
    $("#controls").on("change input", function () {
        parseText($("#input").val())
    });

    $("#fonts").on("change", function () {
      font = $(this).val()
      body = $(".inAndOutputWrapper")
      body.css("font-family", font)
    });
})
