APP.COMBAT_MODULE = (function($, app, calculate, view, messages){

    var privateObj,
        publicObj;

    privateObj = {

        // Set initial attack counters to 0.
        counter: {

            character: 0,

            opponent: 0
        },

        hasEnded: false,

        /**
         * Determine the amount of the damage done.
         * @return {integer}
         */
        checkDamageDone: function(diceRoll, strength, combatStatus, damageBonus){

            var damage = calculate.calculateDamage(diceRoll, strength, combatStatus, damageBonus);

            return damage;
        },

        /**
         * Determine if the attack was successful.
         * @return {object}
         */
        checkHit: function(attacker, value, opponent){

            var BAB = this.currentBAB(attacker, value),
                roll = calculate.calculateAttackRoll(BAB),
                hit = {};

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
         * Determine if the object can make an attack.
         * @return {string}
         */
        checkAttacksLeft: function(object, counter){

            var attacks = (counter < object.ab.length) ? 'true' : 'false';

            return attacks;
        },

        criticalAttack: function(attackerSpan, attacker, viewObject, defender, damage, hit){

            defender.hp -= damage;

            view.updateCurrentHP(defender.hp, viewObject);

            messages.createMessage.attack(attackerSpan,
                                          attacker.name,
                                          defender.name,
                                          messages.critHit,
                                          hit.roll.baseRoll,
                                          hit.roll.currentAttackBonus,
                                          hit.roll.attackRoll);

            messages.createMessage.damage(attackerSpan,
                                          attacker.name,
                                          defender.name,
                                          damage);
        },

        normalAttack: function(attackerSpan, attacker, viewObject, defender, damage, hit){

            defender.hp -= damage;

            view.updateCurrentHP(defender.hp, viewObject);

            messages.createMessage.attack(attackerSpan,
                                          attacker.name,
                                          defender.name,
                                          messages.hit,
                                          hit.roll.baseRoll,
                                          hit.roll.currentAttackBonus,
                                          hit.roll.attackRoll);

            messages.createMessage.damage(attackerSpan,
                                          attacker.name,
                                          defender.name,
                                          damage);
        },

        missAttack: function(attackerSpan, attacker, defender, hit){

            messages.createMessage.attack(attackerSpan,
                                          attacker.name,
                                          defender.name,
                                          messages.miss,
                                          hit.roll.baseRoll,
                                          hit.roll.currentAttackBonus,
                                          hit.roll.attackRoll);
        },

        oppAttack: function(myChar, myOpp){

            var $charCurrentHP = $('#char-current-hp'),

                hit,
                damage;

            hit = this.checkHit(myOpp, this.counter.opponent, myChar);

            if(typeof hit.criticalHit == 'string' && hit.criticalHit == 'true'){

                damage = (this.checkDamageDone(myOpp.diceRoll, myOpp.strength, true, false)) * 2;

                this.criticalAttack(messages.oppSpan, myOpp, $charCurrentHP, myChar, damage, hit);

            }else if(typeof hit.strike == 'string' && hit.strike == 'true'){

                damage = this.checkDamageDone(myOpp.diceRoll, myOpp.strength, true, false);

                this.normalAttack(messages.oppSpan, myOpp, $charCurrentHP, myChar, damage, hit);

            }else{

                this.missAttack(messages.oppSpan, myOpp, myChar, hit);
            }

            this.counter.opponent++;
        },

        charAttack: function(myChar, myOpp){

            var $oppCurrentHP = $('#current-hp'),

                hit,
                damage;

            hit = this.checkHit(myChar, this.counter.character, myOpp);

            if(typeof hit.criticalHit == 'string' && hit.criticalHit == 'true'){

                damage = (this.checkDamageDone(myChar.diceRoll, myChar.strength, true, true)) * 2;

                this.criticalAttack(messages.charSpan, myChar, $oppCurrentHP, myOpp, damage, hit);

            }else if(typeof hit.strike == 'string' && hit.strike == 'true'){

                damage = this.checkDamageDone(myChar.diceRoll, myChar.strength, true, true);

                this.normalAttack(messages.charSpan, myChar, $oppCurrentHP, myOpp, damage, hit);

            }else{

                this.missAttack(messages.charSpan, myChar, myOpp, hit);
            }

            this.counter.character++;
        },

        /**
         * Objects get an attack chance based on the result of @roll.
         */
        continueRound: function(myChar, myOpp, roll){

            var hasAttacks;

            if(typeof roll == 'number' && roll == 1){

                hasAttacks =  this.checkAttacksLeft(myChar, this.counter.character);

                if(typeof hasAttacks == 'string' && hasAttacks == 'true'){

                    this.charAttack(myChar, myOpp);

                }else{

                    this.oppAttack(myChar, myOpp);
                }

            }else if(typeof roll == 'number' && roll === 0){

                hasAttacks = this.checkAttacksLeft(myOpp, this.counter.opponent);

                if(typeof hasAttacks == 'string' && hasAttacks == 'true'){

                    this.oppAttack(myChar, myOpp);

                }else{

                    this.charAttack(myChar, myOpp);
                }
            }

        },

        /**
         * Check if object's HP are above 0.
         * @return {integer} / {string}
         */
        checkRoundEnd: function(myChar, myOpp){

            var $startCombat = $('#btn-combat');

            // While character's or opponent's health are above 0, do combat.
            if(myChar.hp > 0 && myOpp.hp > 0 && this.hasEnded == false){

                // Can be 0 or 1 based on Math.random().
                // Random outcome gives the combat a bit more reality, as objects won't be hitting each other
                // in linear way, e.g. 1-1-1-1 / 2-2-2-2.
                var combatEnd = calculate.randomValue(2);

                return combatEnd;

            // If battle has ended interrupt the loop.
            }else if(this.hasEnded){

                return 'true';

            // If one of the objects has HP below 0, declare winner and set combat end to true.
            }else{

                if(myChar.hp <= 0){

                    messages.createMessage.kill(messages.oppSpan, myOpp.name, myChar.name);

                }else if(myOpp.hp <= 0){

                    messages.createMessage.kill(messages.charSpan, myChar.name, myOpp.name);
                }

                this.hasEnded = true;

                $startCombat.removeClass('disabled');

                return 'true';
            }
        },

        startRound: function(myChar, myOpp){

            // Length/duration of one round which is determined
            // by the total number of both object's attacks per round.
            var roundLength = myChar.ab.length + myOpp.ab.length,
                randomDelay = calculate.randomValue(500, 300),

                combatEnd,

                // Iterator for inner (setTimeout) loop.
                index = 0;

            for(var i = 0; i < roundLength; i++){

                // For readability purposes of the combat report log and realistic HP substraction, setTimeout is used.
                setTimeout(function(){

                    // Check if round has ended.
                    combatEnd = privateObj.checkRoundEnd(myChar, myOpp);

                    if(typeof combatEnd == 'string' && combatEnd == 'true'){

                        return false;

                    }else{

                        privateObj.continueRound(myChar, myOpp, combatEnd);

                        // Increase inner loop's iterator count after each iteration.
                        index++;

                        // When inner loop reaches the max of iterations, start a round over.
                        if(index == roundLength){

                            publicObj.startFight(myChar, myOpp);

                            // Reset counters.
                            privateObj.counter.character = 0;
                            privateObj.counter.opponent = 0;
                        }
                    }

                }, randomDelay * i);
            }
        },

        /**
         * For each iteration of the combat loop, if object makes a hit,
         * move the iterator to the next attack bonus value.
         * @param {object}, {integer}
         * @return {integer}
         */
        currentBAB: function(object, value){
            var currentValue = object.ab[value];

            return currentValue;
        }

    };

    publicObj = {

        /**
         * Start first round with both object's max hp. e.g. (current charHP and oppHP will be undefined).
         * After the round has ended, use current hp values as parameters for next round.
         */
        startFight: function(myChar, myOpp, newRound){

            if(newRound){
                privateObj.counter.character = 0;
                privateObj.counter.opponent = 0;
                privateObj.hasEnded = false;
            }

            var round = privateObj.startRound(myChar, myOpp);
        }
    };

    return publicObj;

}(jQuery, APP, APP.CALCULATE, APP.VIEW, APP.MESSAGES));