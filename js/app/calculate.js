APP.CALCULATE = (function($, app){

    var privateObj,
        publicObj;

        privateObj = {

            /**
             * Calculate damage done based on @min, @max and @modifier values.
             * In case of the character object, there's a @weaponBonus damage.
             * @return {integer}
             */
            damageRoll: function(dmgMIN, dmgMAX, strModifier, weaponBonus){

                var baseRoll = Math.floor((Math.random() * (dmgMAX - 1)) + dmgMIN),
                    damage = baseRoll + strModifier + weaponBonus;

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

        publicObj = {

            /**
             * Calculate ability modifier based on the current ability value.
             * For each 2 levels of certain ability starting from level 10, modifier gets raised by 1.
             */
             calculateModifier: function(value){

                var modValue = Math.floor((value - 10) / 2);

                return modValue;
            },

            /**
             * Render damage property for showing in view.
             * e.g. diceRoll (2d8) results in 2-16 + strModifier.
             * If combatStatus is active, render damage done.
             * @param {integer}, {boolean}
             * @return {integer} / {string}
             */
             calculateDamage: function(diceRoll, strength, combatStatus, weaponBonus){

                var strModifier = this.calculateModifier(strength),
                    dmgMIN = diceRoll[0],
                    dmgMAX = diceRoll[1] * dmgMIN,
                    viewDamage = dmgMIN + '-' + dmgMAX + ' + ' + strModifier,
                    damage;

                if(combatStatus){

                    if(weaponBonus){

                        damage = privateObj.damageRoll(dmgMIN, dmgMAX, strModifier, 13);

                    }else{

                        damage = privateObj.damageRoll(dmgMIN, dmgMAX, strModifier, 0);
                    }

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
                    attackRoll = privateObj.attackRoll(rollMin, rollMax, currentAttackBonus);

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
            },

            /**
             * Calculate top position for the background.
             */
            calculateCoords: function(speed){

                var posTop = $(window).scrollTop(),
                    yPos = -(posTop / speed),
                    coords = '0px ' + yPos + 'px';

                return coords;
            }
        };

        return publicObj;

}(jQuery, APP));