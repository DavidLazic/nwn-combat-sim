APP.CHECK = (function($, app){

    var privateObj,
        publicObj;

    privateObj = {

        /**
         * Check the winner.
         * @param {array}
         * @return {object}
         */
        checkWinner: function(fighters){

            var fighter = {};

            $.each(fighters, function(i){

                if(this.hp > 0){
                    fighter.winner = this;
                }else{
                    fighter.loser = this;
                }
            });

            return fighter;
        },

        /**
         * Check if both fighters' HP is above zero.
         * @param {array}
         * @return {string}
         */
        checkHP: function(fighter){

            var bothAlive = (fighter[0].hp > 0 && fighter[1].hp > 0) ? 'true' : 'false';

            return bothAlive;
        },
    };

    publicObj = {

        /**
         * @param {object}, hasEnded{boolean}
         * @return {object}
         */
        checkRoundEnd: function(myChar, myOpp, hasEnded){

            var round =  {},
                fighter = [],
                declareWinner;


            fighter.push(myChar, myOpp);
            declareWinner = privateObj.checkWinner(fighter);

            round.hasEnded = hasEnded;
            round.bothAlive = privateObj.checkHP(fighter);
            round.winner = declareWinner.winner;
            round.loser = declareWinner.loser;

            return round;
        },

        /**
         * Determine if the object can make an attack.
         * @return {string}
         */
        checkAttacksLeft: function(object, counter){

            var attacks = (counter < object.ab.length) ? 'true' : 'false';

            return attacks;
        },

        /**
         * Determine the type of an attack.
         * @return {object}
         */
        checkHitType: function(roll, opponent){

            var hit = {};

            if(roll.baseRoll == 1){

                hit.strike = 'false';

            }else if(roll.baseRoll == 20){

                hit.criticalHit = 'true';

            }else if(roll.attackRoll > opponent.ac){

                hit.strike = 'true';
            }

            hit.roll = roll;

            return hit;
        },

        /**
         * Determine the amount of the damage done.
         * @return {integer}
         */
        checkDamageDone: function(diceRoll, strength, combatStatus, damageBonus){

            var calculate = app.CALCULATE,
                damage = calculate.calculateDamage(diceRoll, strength, combatStatus, damageBonus);

            return damage;
        }
    };

    return publicObj;

}(jQuery, APP));
