function toggleSlider(element) {
  $('#' + element.value).css('display', (element.checked) ? 'block' : 'none');
  if($('.' + element.value).length > 0) {
      $('.' + element.value).css('display', (element.checked) ? 'inline-block' : 'none');
  }
}

function clickedCheckbox(element) {
  toggleSlider(element);
}

function checkboxClear() {
    $.each($('.checkbox'), function(i, element) {
        $('#' + element.value).css('display', 'none');
        if ($('.' + element.value).length > 0) {
            $('.' + element.value).css('display', 'none');
        }
        element.checked = false;
        parseText($("#input").val());
    });

}

// this function places the correct indice in front of each label in the menu,
// so you don't have to do it manually when adding one
function setCountingLabels() {
    $('label').each(function (i, element) {
        if(!element.id) {
            $(element).prepend("<span class='indice-span'>" + (i + 1) + "</span>");
        }
    })
}

function resetLanguage(element, event) {
    event.preventDefault();
    checkboxClear();
    $('#fonts').val('Helvetica');
    var body = $(".inAndOutputWrapper");
    body.css("font-family", 'Helvetica');
}

// some helpers
String.prototype.replaceAllWith = function (swapper) {
    var outPutText = this;
    var done = [];
    for (find in swapper) {
        var replacement = swapper[find]
        outPutText = outPutText.replace(new RegExp(find, 'g'), function (match, index) {
            var r = replacement;
            if (done.indexOf(index) >= 0) {
                r = find;
            }
            done.push(index);
            return r;
        })
    }
    return outPutText;
}

String.prototype.shuffle = function(){
    var that =  this.split("");
    var len  =  that.length, t, i;
    while(len) {
        i = Math.random()*len-- | 0;
        t = that[len];
        that[len] = that[i];
        that[i] = t;
    }
    return that.join("");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function swapCharacters(intputText, useHeavy) {
    var swaplettersTest = {
        'b': "d",
        'd': "b",
        'p': 'q',
        'q': 'p',
        'm': 'w',
        'w': 'm',
        'a' : 'e',
        'e' : 'a',
        'f' : 'v',
        'v' : 'f'
    }
    let keys = Object.keys(swaplettersTest);
    let neededSwaps = keys.slice(Math.floor(useHeavy*keys.length), swaplettersTest.length);
    for(var i = 0; i < neededSwaps.length; i++){
        delete swaplettersTest[neededSwaps[i]];
    }
    return intputText.replaceAllWith(swaplettersTest);
}
// end swap characters

// start swap tweeklanken
function swapTweeKlank(intputText, useHeavy) {
    var swaplettersTest = {
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
    let keys = Object.keys(swaplettersTest);
    let neededSwaps = keys.slice(Math.floor(useHeavy*keys.length), swaplettersTest.length);
    for(var i = 0; i < neededSwaps.length; i++){
        delete swaplettersTest[neededSwaps[i]];
    }
    return intputText.replaceAllWith(swaplettersTest);
}
// end swap tweeklanken

// start swap double characters
function swapperDubbeleLetters(intputText, useHeavy) {
    var swaplettersTest = {
        'a': "aa",
        'b': "bb",
        'c': "cc",
        'g': "gg",
        'n': "nn",
        'o': "oo",
        's': "ss",
        't': "tt",
        'u': "uu",
    };

    let keys = Object.keys(swaplettersTest);
    let neededSwaps = keys.slice(Math.floor(useHeavy*keys.length), swaplettersTest.length);
    console.log(neededSwaps);
    for(var i = 0; i < neededSwaps.length; i++){
        delete swaplettersTest[neededSwaps[i]];
    }
    return intputText.replaceAllWith(swaplettersTest);
}
// end swap double characters

// start swap whole words
function swapWords(inputText, swapValue) {
    var outputText = "";
    var elements = inputText.split(" ");

    var maxWordLength = 10 - 10 * swapValue;
    for (index = 0; index < elements.length; index++) {
        var item = elements[index];

        if (item.length > maxWordLength) {
            elements.splice(index, 1);
            elements.splice(getRandomInt(index-2, index+2), 0, item);
        }
    }
    return elements.join(" ");
}
// end swap whole words

// start zonder spaties
function spatiesWeg(inputText, swapValue) {
    return inputText.replace(new RegExp(" ", 'g'), "")
}
// end zonder spaties

// start swapping inside a word
function insideWordSwap(inputText, swapValue) {
    var outputText = "";
    var cursor = 0;
    var minLength  = 3 + 7 * (1-swapValue);
    var wordsDone = {};
    var wordPattern = /\b(\w+)\b/g;
    while (match = wordPattern.exec(inputText)) {
        var word = match[0];
        var result = word;
        if (word.length > minLength ) {
            if (word in wordsDone) {
                result = wordsDone[word];
            }
            else {
                var firstLetter = word[0];
                var lastLetter = word[word.length-1];
                var middle = word.substring(1,word.length-1).shuffle();
                result = firstLetter + middle + lastLetter;

                if (!(result in wordsDone)) {
                    wordsDone[word] = result;
                }
            }
        }
        outputText += inputText.substring(cursor, match.index) + result;
        cursor = match.index + word.length;
    }

    outputText += inputText.substring(cursor, inputText.length);
    return outputText;
}
// end swapping inside a word

var isTyping = false;
var timing = 0;

function parseText(inputText) {
    var outputText = inputText;

    var jump = 0;
    var jumpWoord = 0;
    var tracking = 0;
    var trackingWider = 0;
    var trackingSmaller = 0;
    var slechteLetterHerkenning = 0;
    var spiegelSchrift = false;
    var ondersteBoven = false;
    var lettersDraaien = 0;
    var lettersDraaienOnregelmatig = 0;
    var spatiesBreed = 0;
    var spatiesNauw = 0;
    var lettersBeven = 0;
    var woordenBeven = 0;
    var lettersHorizontaal = 0;
    var woordenHorizontaal = 0;
    var interlinie = 0;
    var interlinieKlein = 0;
    var woordenDraaien = 0;

    $("#controls .checkbox").each(function() {
        if (this.checked) {
            var sliderValue = parseFloat($(this).siblings(".slider").val());
            if(sliderValue !== 0) {
                console.log(sliderValue);
                var varValue = $(this).nextAll('input[type=radio]:checked').val();
                switch (this.value) {
                // textual changes
                    case "insideWordSwap":
                        outputText = insideWordSwap(outputText, sliderValue);
                        break;
                    case "swapWords":
                        outputText = swapWords(outputText, sliderValue);
                        break;
                    case "swapCharacters":
                        outputText = swapCharacters(outputText, sliderValue);
                        break;
                    case "swapTweeKlank":
                        outputText = swapTweeKlank(outputText, sliderValue);
                        break;
                    case "swapperDubbeleLetters":
                        outputText = swapperDubbeleLetters(outputText, sliderValue);
                        break;
                    case "spatiesWeg":
                        outputText = spatiesWeg(outputText, sliderValue);
                        break;
                    // visual changes
                    case "jump":
                        jump = sliderValue;
                        break;
                    case "jumpWoord":
                        jumpWoord = sliderValue;
                        break;
                    case "tracking":
                        tracking = sliderValue;
                        break;
                    case "trackingWider":
                        trackingWider = sliderValue;
                        break;
                    case "trackingSmaller":
                        trackingSmaller = sliderValue;
                        break;
                    case "slechteLetterHerkenning":
                        slechteLetterHerkenning = 1;
                        break;
                    case "spiegelSchrift":
                        spiegelSchrift = true;
                        break;
                    case "ondersteBoven":
                        ondersteBoven = true;
                        break;
                    case "lettersDraaien":
                        lettersDraaien = sliderValue;
                        break;
                    case "lettersDraaienOnregelmatig":
                        lettersDraaienOnregelmatig = sliderValue;
                        break;
                    case "spatiesBreed":
                        spatiesBreed = sliderValue;
                        break;
                    case "spatiesNauw":
                        spatiesNauw = sliderValue;
                        break;
                    case "lettersBeven":
                        lettersBeven = sliderValue;
                        break;
                    case "woordenBeven":
                        woordenBeven = sliderValue;
                        break;
                    case "lettersHorizontaal":
                        lettersHorizontaal = sliderValue;
                        break;
                    case "woordenHorizontaal":
                        woordenHorizontaal = sliderValue;
                        break;
                    case "interlinie":
                        interlinie = sliderValue
                        break;
                    case "interlinieKlein":
                        interlinieKlein = sliderValue;
                        break;
                case "woordenDraaien":
                        woordenDraaien = sliderValue;
                        break;
                default:
                    break;
                    }
                }
          }
    });

    var beginWoord = "NEWWORD";

    outputText = outputText.replace(/\S|\s/g, function (match) {
        var style = '';
        var clss = 'letter';
        var letterSpacing = (Math.random() * tracking + trackingWider - trackingSmaller) * 0.15;
        var interlinieValue = 1 + 10 * (interlinie - interlinieKlein);

        if ((spatiesBreed || spatiesNauw) && match == " ") {
           letterSpacing = spatiesBreed - spatiesNauw;
        }

        style += "letter-spacing:" + letterSpacing +"em;"
        style += "margin-bottom:" + interlinieValue + "px;";
        style += "display:" + "inline-block;";

        if (jump) {
            style += "position:relative;top:-" + Math.random() * jump +"em;";
        }

        if (spiegelSchrift || lettersDraaien || lettersDraaienOnregelmatig || ondersteBoven || lettersBeven || lettersHorizontaal) {
           if (match != " ") {
             style += "display:inline-block;";
        }

        if (spiegelSchrift || lettersDraaien || lettersDraaienOnregelmatig || ondersteBoven || lettersBeven || lettersHorizontaal) {
             var transformStyle = '';

             if (lettersDraaien) {
                transformStyle += "rotate(" + lettersDraaien * 20 + "deg)";
             }

             if (lettersDraaienOnregelmatig) {
                transformStyle += "rotate(" + lettersDraaienOnregelmatig * 40 * (Math.random() - .5) + "deg)";
             }

             if (lettersBeven) {
               var x = lettersBeven * 20 * (Math.random() - .5);
               var y = lettersBeven * 20 * (Math.random() - .5);
               transformStyle += "translate(" + x + "px," + y + "px)";
             }

             if (lettersHorizontaal) {
               var x = lettersHorizontaal * 20 * (Math.random() - .5);
               var y = 0;
               transformStyle += "translate(" + x + "px," + y + "px)";
             }

             if (spiegelSchrift) {
                 transformStyle += "scale(-1, 1) ";
             }

             if (ondersteBoven) {
                transformStyle += "scale(1, -1) ";
             }

             style += "transform: " + transformStyle + ";";
           }
        }

        // samen plakken van all styles
        if (style) {
            style = " style='" + style + "'";
        }
        // samen plakken van alle classes
        if (clss) {
            clss = " class='" + clss + "'";
        }

        if (match == " ") {
            match = "&nbsp;";
            beginWoord = "</span>";
        }

        if (match == "\r" || match == "\n") {
          beginWoord = "</span><br />";
        }

        if (beginWoord == "NEWWORD") {
          var wordStyle = '';

          // als woorden draaien of boven of horizontaal beven dan...
          if (woordenDraaien || woordenBeven || woordenHorizontaal) {
            var woordTransformStyle = "";

            if (woordenDraaien) {
              woordTransformStyle += "rotate(" + woordenDraaien * 20 * (Math.random() - .5) + "deg)";
            }

            if (woordenBeven) {
              var x = woordenBeven * 20 * (Math.random() - .5);
              var y = woordenBeven * 20 * (Math.random() - .5);
              woordTransformStyle += "translate(" + x + "px," + y + "px)";
            }

            if (woordenHorizontaal) {
              var x = woordenHorizontaal * 20 * (Math.random() - .5);
              var y = 0;
              woordTransformStyle += "translate(" + x + "px," + y + "px)";
            }

            wordStyle += "transform: " + woordTransformStyle + ";";
          }

          if (jumpWoord) {
            wordStyle += "position:relative;top:-" + Math.random() * jumpWoord +"em;";
          }

          if (wordStyle) {
            wordStyle = " style='" + wordStyle + "'";
          }

          beginWoord = "<span class='woord'" + wordStyle + ">";
        }

        var result = beginWoord + '<span' + clss + style + '>' + match + '</span>';

        if (beginWoord == "</span>") {
          beginWoord = "NEWWORD";
        }
        else {
          beginWoord = "";
        }

        return result;
    })
    outputText = outputText.replace(/\r?\n/g, '<br>')

  var output = $("#output");

  if (slechteLetterHerkenning) {
      if(!isTyping) {
        isTyping = true;
      } else {
          clearTimeout(timing);
      }
      output.typer([outputText], options={endless:false, duration: 100  * slechteLetterHerkenning, onType: function(timer){
        //console.log(timer);
        timing = timer;
        }});
  }
  else {
      clearTimeout(timing);
      isTyping = false;
      output.html(outputText);
  }
}

$(document).ready(function() {
    $("#controls").on("change input", function () {
        parseText($("#input").val());
        $("#input").focus();
    });
    $("#radio-controls").on("change input", function () {
        parseText($("#input").val());
    });

    $("#fonts").on("change", function () {
      var font = $(this).val();
      var body = $(".inAndOutputWrapper");
      body.css("font-family", font);
    });

    $("#font-size").on("change", function () {
      var fontSize = $(this).val();
      var innBody = $(".InputWrapper");
      var outBody = $("#output");
      innBody.css("font-size", fontSize + "em");
      outBody.css("font-size", fontSize + "em");
    });

    setCountingLabels();
    parseText($("#input").val());
})
