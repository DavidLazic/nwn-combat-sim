APP.CALCULATE = (function($, app){

    var privateMethod,
        publicMethod;

        privateMethod = {

            /**
             * Calculate damage done based on @min, @max and @modifier values.
             * @return {integer}
             */
            damageRoll: function(dmgMIN, dmgMAX, strModifier){

                var baseRoll = Math.floor((Math.random() * (dmgMAX - 1)) + dmgMIN),
                    damage =  baseRoll + strModifier;

                return damage;
            },

            /**
             * Calculate attack roll based on @min, @max, and @currentBonus values.
             * @return {object}
             */
            attackRoll: function(rollMin, rollMax, currentAttackBonus){

                var roll = {},
                    baseRoll = Math.floor((Math.random() * rollMax) + rollMin),
                    attackRoll = baseRoll + currentAttackBonus;

                roll.baseRoll = baseRoll;
                roll.attackRoll = attackRoll;

                return roll;
            }
        };

        publicMethod = {

            /**
             * Calculate ability modifier based on the current ability value.
             * For each 2 levels of certain ability starting from level 10, modifier gets raised by 1.
             */
             calculateModifier: function(object){

                var $modifier = $('.modifier');

                $.each($modifier, function(){

                    var value = parseInt($(this).prev().text()),
                        modValue = Math.floor((value - 10) / 2);

                    $(this).html(modValue);
                });
            },

            /**
             * If object isn't forwarded as an argument, currentHP is maxHP.
             */
            currentHP: function(currentHP, object){

                if(!(object == undefined)){
                    object.html(currentHP);
                }

                return currentHP;
            },

            /**
             * Render damage property for showing in view.
             * e.g. diceRoll (2d8) results in 2-16 + strModifier.
             * @param {object}
             * @return {string}
             */
             calculateDamage: function(object, combatStatus){

                var diceRoll = object.diceRoll,
                    strModifier = Math.floor((object.strength - 10) / 2),
                    dmgMIN = diceRoll[0],
                    dmgMAX = diceRoll[1] * dmgMIN,
                    viewDamage = dmgMIN + '-' + dmgMAX + ' + ' + strModifier;


                if(combatStatus == true){

                    var damage = privateMethod.damageRoll(dmgMIN, dmgMAX, strModifier);

                    return damage;

                }else{

                    return viewDamage;
                }
            },

            /**
             * Based on the given value, calculate attack roll.
             * @param {integer}
             * @return {integer}
             */
            calculateAttackRoll: function(value){

                var rollMin = 1,
                    rollMax = 20,
                    currentAttackBonus = value,
                    attackRoll = privateMethod.attackRoll(rollMin, rollMax, currentAttackBonus);

                return attackRoll;
            },

            randomValue: function(max, min){
                var value;

                if(min == undefined){
                    value = Math.floor(Math.random() * max);
                }else{
                    value = Math.floor(Math.random() * max) + min;
                }

                return value;
            }
        };

        return publicMethod;

}(jQuery, APP));