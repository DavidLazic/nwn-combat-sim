APP.CALCULATE = (function($, app){

    var privateMethod,
        publicMethod;

        privateMethod = {

        };

        publicMethod = {

            /**
             * Calculate ability modifier based on the current ability value.
             * For each 2 levels of certain ability starting from level 10, modifier gets raised by 1.
             */
             calculateModifier: function(object){

                var $modifier = $('.modifier'),
                    maxHP = $('#hp').text(),
                    $currentHP = $('#current-hp');

                    $currentHP.html(maxHP);

                $.each($modifier, function(){

                    var value = parseInt($(this).prev().text()),
                    modValue = Math.floor((value - 10) / 2);

                    $(this).html(modValue);
                });
            },

            /**
             * e.g. diceRoll (2d8) results in 2-16 + strModifier.
             * @param {object}
             * @return {string}
             */
             calculateDamage: function(object){

                var diceRoll = object.diceRoll,
                    strModifier = Math.floor((object.strength - 10) / 2),
                    dmgMIN = diceRoll[0],
                    dmgMAX = diceRoll[1] * dmgMIN,
                    dmg = dmgMIN + '-' + dmgMAX + ' + ' + strModifier;

                return dmg;
            }
        };

        return publicMethod;

}(jQuery, APP));