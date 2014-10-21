APP.EVENT_HANDLER = (function($, app){

    var privateObj,
        publicObj;

    privateObj = {

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
        },

        /**
         * Switch class "active" for navigation buttons and switch view containers.
         */
        switchView: function(e){

            var $target = $(e.target).parent(),
                $creature = $target.parents('#creature'),
                $character = $target.parents('#character'),
                $charContainer = $('#character .content-container'),
                $creatureContainer = $('#creature .content-container'),

                character = $character.data('id'),
                creature = $creature.data('id');

            if($target.hasClass('active')){

                return false;

            }else{

                $target.addClass('active');
                $target.siblings().removeClass('active');

                if(typeof character == 'string'){

                    $charContainer.toggleClass('active');

                }else if(typeof creature == 'string'){

                    $creatureContainer.toggleClass('active');
                }
            }
        },

        /**
         * Parallax effect for the background image.
         */
        parallax: function(){

            var $body = $('body'),
                calculate = app.CALCULATE,

                speed = $body.data('speed'),
                coords = calculate.calculateCoords(speed);

            $body.css({'background-position' : coords});
        }
    };

    publicObj = {

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
                $buttonFight = $('#btn-combat'),
                $menuButtons = $('.btn-menu'),
                $win = $(window);

            $selectList.on('change', $.proxy(privateObj, 'getData'));
            $buttonFight.on('click', $.proxy(privateObj, 'getData'));
            $menuButtons.on('click', $.proxy(privateObj, 'switchView'));
            $win.on('scroll', $.proxy(privateObj, 'parallax'));
        }




    };

    return publicObj;

}(jQuery, APP));

$(function(){
    APP.EVENT_HANDLER.init();
});
