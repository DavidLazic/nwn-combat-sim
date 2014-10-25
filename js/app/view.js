APP.VIEW = (function($, app) {

    var privateObj,
        publicObj;

    privateObj = {

        /**
         * For each new report line move the scroller down.
         */
        scrollControl: function(elem){

            var scrollHeight = elem.prop('scrollHeight');

            elem.scrollTop(scrollHeight);
        }

    };

    publicObj = {

        /**
         * Loop through {object} and {label} arrays and populate fields with array data.
         * @params {array}
         * @return {string}
         */
        populateFields: function(objects, labels, avatar, health, cb){

            avatar[0].attr('src', avatar[1]);

            health[0].html(health[1]);

            $.each(objects, function(i){
                $(this).html(labels[i]);
            });

            if(cb){
                cb();
            }
        },

        /**
         * Convert the given message array into a string message.
         * @param {array}
         * @return {string}
         */
        writeMessage: function(array){

            var $log = $('#report-log'),
                message = array.join('');

            $log.append(message);

            privateObj.scrollControl($log);
        },

        /**
         * Clear view fields if idle.
         */
        clearView: function(config){

            config.$clear.text('');

            config.$avatar.attr('src', config.idleURL);

            config.$startCombat.removeClass('disabled');

            config.$log.html('');
        },

        /**
         * Update object's current HP.
         */
        updateCurrentHP: function(currentHP, object){

            object.html(currentHP);
        },

        /**
         * Callback function for calculating and writing modifier values.
         */
        writeModifier: function(){

            var calculate = app.CALCULATE,
                $modifier = $('.modifier');

            $.each($modifier, function(){

                var value = parseInt($(this).prev().text()),
                    modValue = calculate.calculateModifier(value);

                $(this).html(modValue);
            });
        }

    };

    return publicObj;

}(jQuery, APP));