APP.CALCULATE = (function($, app, ajax){

    var privateMethod,
        publicMethod;

        privateMethod = {

            /*
             * Calculate damage done based on @min, @max and @modifier values.
             */
            damageRoll: function(dmgMIN, dmgMAX, strModifier){

                var baseRoll = Math.floor((Math.random() * (dmgMAX - 1)) + dmgMIN),
                    damage =  baseRoll + strModifier;

                return damage;
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
             * Render damage property for showing in view
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

            }
        };

        return publicMethod;

}(jQuery, APP, APP.AJAX_WRAPPER));