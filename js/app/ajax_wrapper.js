APP.AJAX_WRAPPER = (function($, app){

    var privateMethod,
        publicMethod;

    privateMethod = {

        /**
         * Create object.
         * @return {object}, {boolean}
         */
        createInstance: function(url, label, combatStatus){

            var ajaxObj = {};

            ajaxObj.type = 'GET';
            ajaxObj.url = url;
            ajaxObj.dataType = 'JSON';

            ajaxObj.success = function(data){
                privateMethod.ajaxSuccess(data, label, combatStatus);
            };

            ajaxObj.error = function(data){
                privateMethod.ajaxError(data);
            }

            return ajaxObj;
        },


        /**
         * Match the given label with the right object.
         * @param label{string}, {boolean}
         * @return {object}, {boolean}
         */
        ajaxSuccess: function(data, label, combatStatus){

            for (var i = 0; i < data.length; i++){

                if(data[i].label === label){

                    var currentObject = data[i];

                    this.renderObject(currentObject, combatStatus);
                }
            }
        },

        ajaxError: function(data){
            console.log(data);
        },

        /**
         * Render given object in certain way depending on the combatStatus.
         * @param {object}, {boolean}
         */
        renderObject: function(object, combatStatus){

            if(combatStatus == true){
                this.renderForCombat(object);
            }else{
                this.renderForView(object);
            }
        },

        /**
         * Render given object's properties for view.
         * Create arrays from output objects and field labels.
         * @params {object}
         * @return {array}
         */
        renderForView: function(object){

            var view = app.EVENT_HANDLER,
                calculate = app.CALCULATE,
                obj = $('[data-property]'),
                objectsArray = [],
                labelsArray = [],

                $avatar = $('#avatar'),
                avatar = 'img/' + object.avatarURL + '.jpg',
                avatarArray = [$avatar, avatar],

                $health = $('#current-hp'),
                maxHP = object.hitPoints,
                health = calculate.currentHP(maxHP),
                healthArray = [$health, health];

            $.each(obj, function(){

                var label = $(this).data('property'),
                    labelValue;

                if(label === 'attackBonus'){
                    labelValue = '+' + object[label].join('/+');
                }else if(label === 'diceRoll'){
                    labelValue = object[label][0] + 'd' + object[label][1];
                }else if(label === 'damage'){
                    labelValue = calculate.calculateDamage(object);
                }else{
                    labelValue = object[label];
                }

                objectsArray.push($(this));
                labelsArray.push(labelValue);

            });

            view.populateFields(objectsArray,
                                labelsArray,
                                avatarArray,
                                healthArray,
                                calculate.calculateModifier);
        },

        /**
         * Make @opponent object out of given object.
         * Make @character object out of input values.
         * @param {object}
         */
        renderForCombat: function(object){

            var combat = app.COMBAT_MODULE,
                calculate = app.CALCULATE,
                myChar = {},
                myOpp = {};

            myChar.strength = 21,
            // myChar.strength = parseInt($('#char-str').text()),
            myChar.hp = 226,
            // myChar.hp = $('#char-hp').text(),
            myChar.ac = 59,
            // myChar.ac = $('#char-ac').val(),
            myChar.diceRoll = [1, 8],
            myChar.ab = [57, 52, 47, 42],
            myChar.dmg = calculate.calculateDamage(myChar);

            myOpp.hp = object.hitPoints,
            myOpp.ac = object.armorClass,
            myOpp.ab = object.attackBonus,
            myOpp.dmg = calculate.calculateDamage(object);

            combat.startFight(myChar, myOpp);
        }

    };

    publicMethod = {

        /**
         * Send request with created object.
         */
        sendRequest: function(url, label, combatStatus){

            var $object = privateMethod.createInstance(url, label, combatStatus);

            $.ajax($object);
        }
    };

    return publicMethod;

}(jQuery, APP));