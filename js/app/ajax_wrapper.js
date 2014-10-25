APP.AJAX_WRAPPER = (function($, app, view, calculate, combat){

    var privateObj,
        publicObj;

    privateObj = {

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
                privateObj.ajaxSuccess(data, label, combatStatus);
            };

            ajaxObj.error = function(data){
                privateObj.ajaxError(data);
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

            var render = (combatStatus) ? this.renderForCombat(object) : this.renderForView(object);
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
                health = object.hitPoints,
                healthArray = [$health, health];

            $.each(obj, function(){

                var label = $(this).data('property'),
                    labelValue;

                if(label === 'attackBonus'){
                    labelValue = '+' + object[label].join('/+');
                }else if(label === 'diceRoll'){
                    labelValue = object[label][0] + 'd' + object[label][1];
                }else if(label === 'damage'){
                    labelValue = calculate.calculateDamage(object.diceRoll, object.strength);
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
                                view.writeModifier);
        },

        /**
         * Make @opponent object out of given object.
         * Make @character object out of input values.
         * @param {object}
         */
        renderForCombat: function(object){

            var myChar = this.fighter(),
                myOpp = this.fighter(object);

            combat.startFight(myChar, myOpp, true);
        },

        fighter: function(object){

            var combatant = {};

            combatant.name      = (object) ? object.name : 'Galadriel',
            combatant.strength  = (object) ? object.strength : this.getStrengthInfo(),
            combatant.hp        = (object) ? object.hitPoints : this.getHPInfo(),
            combatant.ac        = (object) ? object.armorClass : this.getACInfo(),
            combatant.diceRoll  = (object) ? object.diceRoll : [1, 8],
            combatant.ab        = (object) ? object.attackBonus : [68, 63, 58, 53],
            combatant.dmg       = calculate.calculateDamage(combatant.diceRoll, combatant.strength);

            return combatant;
        },

        getStrengthInfo: function(){

            var $strength = $('#char-strength'),
                strength = parseInt($strength.text());

            return strength;
        },

        getHPInfo: function(){

            var $hp = $('#char-max-hp'),
                hp = parseInt($hp.text());

            return hp;
        },

        getACInfo: function(){

            var $ac = $('#char-ac'),
                ac = parseInt($ac.text());

            return ac;
        }

    };

    publicObj = {

        /**
         * Send request with created object.
         */
        sendRequest: function(url, label, combatStatus){

            var $object = privateObj.createInstance(url, label, combatStatus);

            $.ajax($object);
        }
    };

    return publicObj;

}(jQuery, APP, APP.VIEW, APP.CALCULATE, APP.COMBAT_MODULE));