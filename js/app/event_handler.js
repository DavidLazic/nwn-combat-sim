APP.EVENT_HANDLER = (function($, app){

    var privateMethod,
        publicMethod;

    privateMethod = {

        /**
         * Send AJAX request.
         * @param url{string} - defined based on the creature type through "data" attribute.
         * @param selectedValue{string} - label for matching the right object.
         * @param {boolean} - true or false depending on the combat status.
         */
        getData: function(e){

            var $selected = $('#select-opponent option:selected'),
                selectedValue = $selected.val(),
                creatureType = $selected.data('url'),
                $target = $(e.target),
                $startCombat = $('#btn-combat'),

                url = 'js/creatureDB/' + creatureType + '.json',
                ajax = app.AJAX_WRAPPER;

            if(selectedValue == 0 && typeof selectedValue == 'string'){

                var $clear = $('.idle-clear'),
                    $avatar = $('#avatar'),
                    idleURL = '/img/idle_portrait.jpg';

                $clear.text('');
                $avatar.attr('src', idleURL);

                return false;

            }else if($target.is($startCombat)){

                ajax.sendRequest(url, selectedValue, true);
                $startCombat.addClass('disabled');

            }else{

                ajax.sendRequest(url, selectedValue, false);
            }
        }
    };

    publicMethod = {

        /**
         *
         * Initialize main function.
         */
        init: function(){
            this.bindEvents();
        },

        /**
         * Bind @selection and @fight events.
         */
        bindEvents: function(){

            var $selectList = $('#select-opponent'),
                $buttonFight = $('#btn-combat');

            $selectList.on('change', $.proxy(privateMethod, 'getData'));
            $buttonFight.on('click', $.proxy(privateMethod, 'getData'));
        },

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
         * Write the message in report log.
         */
        writeMessage: function(message){

            var $log = $('#report-log');

            $log.append(message);
            this.scrollControl($log);
        },

        /**
         * For each new report line move the scroller down.
         */
        scrollControl: function(elem){

            var scrollHeight = elem.prop('scrollHeight');

            elem.scrollTop(scrollHeight);
        }
    };

    return publicMethod;

}(jQuery, APP));

$(function(){
    APP.EVENT_HANDLER.init();
});
