/*!
 * jquery.typer.js 0.0.4 - https://github.com/yckart/jquery.typer.js
 * The typewriter effect
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/03/24
*/
(function($){
    $.fn.typer = function(text, options){
        options = $.extend({}, {
            char: '',
            delay: 1000,
            duration: 600,
            endless: true,
            onType: $.noop,
            afterAll: $.noop,
            afterPhrase: $.noop
        }, options || text);

        text = $.isPlainObject(text) ? options.text : text;
        text = $.isArray(text) ? text : text.split(" ");

        return this.each(function(){
            var elem = $(this),
                isVal = {input:1, textarea:1}[this.tagName.toLowerCase()],
                isTag = false,
                timer = 0,
                c = 0;

            (function typetext(i) {
                var e = ({string:1, number:1}[typeof text] ? text : text[i]) + '',
                    char = e.substr(c++, 1);

                if( char === '<' ){
                    isTag = true;
                }
                if( char === '>' ){ isTag = false; }
                elem[isVal ? "val" : "html"](e.substr(0, c + (e.substr(c).indexOf(">") + 1)) + ($.isFunction(options.char) ? options.char() : options.char || ' '));
                c =  c + e.substr(c).indexOf(">");
                if(c <= e.length){
                    if( isTag ){
                        typetext(i);
                    } else {
                        var randomSlowDown = 1;
                        var randomHardSlowDown = (Math.floor(Math.random()*100 % 30) === 0);
                        var randomMediumSlowDown = (Math.floor(Math.random()*100 % 15) === 0);
                        var randomSmallSlowDown = (Math.floor(Math.random()*100 % 4) === 0);

                        randomSlowDown = randomSmallSlowDown ? 2 : randomSlowDown;
                        randomSlowDown = randomMediumSlowDown ? 4 : randomSlowDown;
                        randomSlowDown = randomHardSlowDown ? 8 : randomSlowDown;

                        var randomNumber = Math.floor((Math.random()*options.duration*randomSlowDown));

                        console.log(randomSlowDown, randomNumber);

                        timer = setTimeout(typetext, randomNumber, i);
                    }
                    options.onType(timer);
                } else {
                    c = 0;
                    i++;

                    if (i === text.length && !options.endless) {
                        return;
                    } else if (i === text.length) {
                        i = 0;
                    }
                    timer = setTimeout(typetext, options.delay, i);
                    if(i === text.length - 1) clearTimeout(timer);;
                    clearTimeout(timer);
                    timer = 0;
                }
            })(0);
        });
    };
}(jQuery));
