APP.AJAX_WRAPPER = (function($, app, view, calculate){

    var privateMethod,
        publicMethod,
        view = app.EVENT_HANDLER,
        calculate = app.CALCULATE,
        combat = app.COMBAT_MODULE;

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

            var obj = $('[data-property]'),
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

            var $selected = $('#select-opponent option:selected'),
                myChar = {},
                myOpp = {};

            myChar.name = 'Galadriel',
            myChar.strength = parseInt($('#char-strength').text()),
            myChar.hp = parseInt($('#char-current-hp').text()),
            myChar.ac = parseInt($('#char-ac').text()),
            myChar.diceRoll = [1, 8],
            myChar.ab = [68, 63, 58, 53],
            myChar.dmg = calculate.calculateDamage(myChar);

            myOpp.name = $selected.text(),
            myOpp.hp = object.hitPoints,
            myOpp.ac = object.armorClass,
            myOpp.diceRoll = object.diceRoll,
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

}(jQuery, APP, APP.EVENT_HANDLER, APP.CALCULATE));