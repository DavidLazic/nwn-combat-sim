APP.COMBAT_MODULE = (function($, app, calculate, view, messages, check){

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
         * Determine if the attack was successful.
         * @return {object}
         */
        checkHit: function(attacker, value, opponent){

            var BAB = this.currentBAB(attacker, value),
                roll = calculate.calculateAttackRoll(BAB),
                hit = {};

            hit = check.checkHitType(roll, opponent);

            return hit;
        },



        criticalAttack: function(attacker, viewObject, defender, damage, hit){

            defender.hp -= damage;

            view.updateCurrentHP(defender.hp, viewObject);

            messages.createMessage.attack(attacker,
                                          defender,
                                          messages.critHit,
                                          hit.roll.baseRoll,
                                          hit.roll.currentAttackBonus,
                                          hit.roll.attackRoll);

            messages.createMessage.damage(attacker,
                                          defender,
                                          damage);
        },

        normalAttack: function(attacker, viewObject, defender, damage, hit){

            defender.hp -= damage;

            view.updateCurrentHP(defender.hp, viewObject);

            messages.createMessage.attack(attacker,
                                          defender,
                                          messages.hit,
                                          hit.roll.baseRoll,
                                          hit.roll.currentAttackBonus,
                                          hit.roll.attackRoll);

            messages.createMessage.damage(attacker,
                                          defender,
                                          damage);
        },

        missAttack: function(attacker, defender, hit){

            messages.createMessage.attack(attacker,
                                          defender,
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

                damage = (check.checkDamageDone(myOpp.diceRoll, myOpp.strength, true, false)) * 2;

                this.criticalAttack(myOpp, $charCurrentHP, myChar, damage, hit);

            }else if(typeof hit.strike == 'string' && hit.strike == 'true'){

                damage = check.checkDamageDone(myOpp.diceRoll, myOpp.strength, true, false);

                this.normalAttack(myOpp, $charCurrentHP, myChar, damage, hit);

            }else{

                this.missAttack(myOpp, myChar, hit);
            }

            this.counter.opponent++;
        },

        charAttack: function(myChar, myOpp){

            var $oppCurrentHP = $('#current-hp'),

                hit,
                damage;

            hit = this.checkHit(myChar, this.counter.character, myOpp);

            if(typeof hit.criticalHit == 'string' && hit.criticalHit == 'true'){

                damage = (check.checkDamageDone(myChar.diceRoll, myChar.strength, true, true)) * 2;

                this.criticalAttack(myChar, $oppCurrentHP, myOpp, damage, hit);

            }else if(typeof hit.strike == 'string' && hit.strike == 'true'){

                damage = check.checkDamageDone(myChar.diceRoll, myChar.strength, true, true);

                this.normalAttack(myChar, $oppCurrentHP, myOpp, damage, hit);

            }else{

                this.missAttack(myChar, myOpp, hit);
            }

            this.counter.character++;
        },

        /**
         * Objects get an attack chance based on the result of @roll.
         */
        continueRound: function(myChar, myOpp, roll){

            var hasAttacks;

            if(typeof roll == 'number' && roll == 1){

                hasAttacks =  check.checkAttacksLeft(myChar, this.counter.character);

                if(typeof hasAttacks == 'string' && hasAttacks == 'true'){

                    this.charAttack(myChar, myOpp);

                }else{

                    this.oppAttack(myChar, myOpp);
                }

            }else if(typeof roll == 'number' && roll === 0){

                hasAttacks = check.checkAttacksLeft(myOpp, this.counter.opponent);

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

            var $startCombat = $('#btn-combat'),
                round = check.checkRoundEnd(myChar, myOpp, this.hasEnded);

            // If the battle has ended interrupt the loop.
            if(round.hasEnded == true){

                return 'true';

            }else{

                if(round.bothAlive == 'true'){

                    // Can be 0 or 1 based on Math.random().
                    // Random outcome gives the combat a bit more reality, as objects won't be attacking each other
                    // in linear way, e.g. 1-1-1-1 / 2-2-2-2.
                    var randomRoll = calculate.randomValue(2);

                    return randomRoll;

                }else{

                    messages.createMessage.kill(round.winner, round.loser);

                    this.hasEnded = true;

                    $startCombat.removeClass('disabled');

                    return 'true';
                }
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
        },

        resetRound: function(newRound, myChar){

            var $charCurrentHP = $('#char-current-hp');

            if(newRound){
                this.counter.character = 0;
                this.counter.opponent = 0;
                this.hasEnded = false;
                view.updateCurrentHP(myChar.hp, $charCurrentHP);
            }
        }

    };

    publicObj = {

        /**
         * Start first round with both object's max hp. e.g. (current charHP and oppHP will be undefined).
         * After the round has ended, use current hp values as parameters for next round.
         */
        startFight: function(myChar, myOpp, newRound){

            myChar.span = messages.charSpan;
            myOpp.span = messages.oppSpan;

            privateObj.resetRound(newRound, myChar);

            var round = privateObj.startRound(myChar, myOpp);
        }
    };

    return publicObj;

}(jQuery, APP, APP.CALCULATE, APP.VIEW, APP.MESSAGES, APP.CHECK));