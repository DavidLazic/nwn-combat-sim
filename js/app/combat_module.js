APP.COMBAT_MODULE = (function($, app, calculate, view){

    var privateObj,
        publicObj,
        calculate = app.CALCULATE,
        view = app.VIEW,
        messages;

    /**
     * HTML format for "writeMessage" on the view.
     */
    messages = {

        charSpan: '<div class="text"><span class="capitalize character">',
        oppSpan: '<div class="text"><span class="capitalize opponent">',

        attacks: '</span> attacks <span class="capitalize">',
        damages: '</span> damages <span class="capitalize">',
        killed: '</span> killed <span class="capitalize">',

        hit: '</span> : *hit* : (',
        miss: '</span> : *miss* : (',
        damage: '</span> : ',

        add: ' + ',
        reduce: ' - ',
        equals: ' = ',

        end: ')</div>',
        dmgPre: ' (',
        dmgAfter: ' Physical)</div>',
        endKill: '</span></div>',

        createMessage: {

            message: [],

            attack: function(attackerSpan, attacker, defender, attack, baseRoll, BAB, attackRoll){

                this.message = [attackerSpan,
                                attacker,
                                messages.attacks,
                                defender,
                                attack,
                                baseRoll,
                                messages.add,
                                BAB,
                                messages.equals,
                                attackRoll,
                                messages.end];

                view.writeMessage(this.message);
            },

            damage: function(attackerSpan, attacker, defender, damageDone){

                this.message = [attackerSpan,
                                attacker,
                                messages.damages,
                                defender,
                                messages.damage,
                                damageDone,
                                messages.dmgPre,
                                damageDone,
                                messages.dmgAfter];

                view.writeMessage(this.message);
            },

            kill: function(attackerSpan, attacker, defender){

                this.message = [attackerSpan,
                                attacker,
                                messages.killed,
                                defender,
                                messages.endKill];

                view.writeMessage(this.message);
            }
        }
    };

    privateObj = {

        // While iterating over total attacks, set initial attack counters to 0.
        charAttackCounter: 0,
        oppAttackCounter: 0,

        hasEnded: false,

        checkDamageDone: function(diceRoll, strength, combatStatus, damageBonus){

            var damage = calculate.calculateDamage(diceRoll, strength, combatStatus, damageBonus);

            return damage;
        },

        checkHit: function(attacker, value, opponent){

            var BAB = this.currentBAB(attacker, value),
                roll = calculate.calculateAttackRoll(BAB),
                hit = {};

            hit.roll = roll;

            hit.strike = (roll.attackRoll > opponent.ac) ? 'true' : 'false';

            return hit;
        },

        checkAttacksLeft: function(object, counter){

            var attacks = (counter < object.ab.length) ? 'true' : 'false';

            return attacks;
        },

        continueRound: function(myChar, myOpp, roll){
        console.log(this.charAttackCounter, this.oppAttackCounter);

            var $charCurrentHP = $('#char-current-hp'),
                $oppCurrentHP = $('#current-hp'),

                hasAttacks,
                hit,
                damage;

            if(typeof roll == 'number' && roll == 1){

                hasAttacks =  this.checkAttacksLeft(myChar, this.charAttackCounter);
                console.log(hasAttacks);
                if(typeof hasAttacks == 'string' && hasAttacks == 'true'){

                    hit = this.checkHit(myChar, this.charAttackCounter, myOpp);

                    if(typeof hit.strike == 'string' && hit.strike == 'true'){

                        damage = this.checkDamageDone(myChar.diceRoll, myChar.strength, true, true);

                        myOpp.hp -= damage;

                        view.updateCurrentHP(myOpp.hp, $oppCurrentHP);

                        messages.createMessage.attack(messages.charSpan,
                                                   myChar.name,
                                                   myOpp.name,
                                                   messages.hit,
                                                   hit.roll.baseRoll,
                                                   hit.roll.currentAttackBonus,
                                                   hit.roll.attackRoll);

                        messages.createMessage.damage(messages.charSpan,
                                                      myChar.name,
                                                      myOpp.name,
                                                      damage);
                    }else{

                        messages.createMessage.attack(messages.charSpan,
                                                    myChar.name,
                                                    myOpp.name,
                                                    messages.miss,
                                                    hit.roll.baseRoll,
                                                    hit.roll.currentAttackBonus,
                                                    hit.roll.attackRoll);
                    }

                    this.charAttackCounter++;

                }else{

                    hit = this.checkHit(myOpp, this.oppAttackCounter, myChar);

                    if(typeof hit.strike == 'string' && hit.strike == 'true'){

                        damage = this.checkDamageDone(myOpp.diceRoll, myOpp.strength, true, false);

                        myChar.hp -= damage;

                        view.updateCurrentHP(myChar.hp, $charCurrentHP);

                        messages.createMessage.attack(messages.oppSpan,
                                                   myOpp.name,
                                                   myChar.name,
                                                   messages.hit,
                                                   hit.roll.baseRoll,
                                                   hit.roll.currentAttackBonus,
                                                   hit.roll.attackRoll);

                        messages.createMessage.damage(messages.oppSpan,
                                                      myOpp.name,
                                                      myChar.name,
                                                      damage);
                    }else{
                        messages.createMessage.attack(messages.oppSpan,
                                                    myOpp.name,
                                                    myChar.name,
                                                    messages.miss,
                                                    hit.roll.baseRoll,
                                                    hit.roll.currentAttackBonus,
                                                    hit.roll.attackRoll);
                    }

                    this.oppAttackCounter++;
                }

            }else if(typeof roll == 'number' && roll === 0){

                hasAttacks = this.checkAttacksLeft(myOpp, this.oppAttackCounter);

                if(typeof hasAttacks == 'string' && hasAttacks == 'true'){

                    hit = this.checkHit(myOpp, this.oppAttackCounter, myChar);

                    if(typeof hit.strike == 'string' && hit.strike == 'true'){

                        damage = this.checkDamageDone(myOpp.diceRoll, myOpp.strength, true, false);

                        myChar.hp -= damage;

                        view.updateCurrentHP(myChar.hp, $charCurrentHP);

                        messages.createMessage.attack(messages.oppSpan,
                                                   myOpp.name,
                                                   myChar.name,
                                                   messages.hit,
                                                   hit.roll.baseRoll,
                                                   hit.roll.currentAttackBonus,
                                                   hit.roll.attackRoll);

                        messages.createMessage.damage(messages.oppSpan,
                                                      myOpp.name,
                                                      myChar.name,
                                                      damage);
                    }else{

                        messages.createMessage.attack(messages.oppSpan,
                                                    myOpp.name,
                                                    myChar.name,
                                                    messages.miss,
                                                    hit.roll.baseRoll,
                                                    hit.roll.currentAttackBonus,
                                                    hit.roll.attackRoll);
                    }

                    this.oppAttackCounter++;

                }else{

                    hit = this.checkHit(myChar, this.charAttackCounter, myOpp);
                    console.log(hasAttacks);
                    if(typeof hit.strike == 'string' && hit.strike == 'true'){

                        damage = this.checkDamageDone(myChar.diceRoll, myChar.strength, true, true);

                        myOpp.hp -= damage;

                        view.updateCurrentHP(myOpp.hp, $oppCurrentHP);

                        messages.createMessage.attack(messages.charSpan,
                                                   myChar.name,
                                                   myOpp.name,
                                                   messages.hit,
                                                   hit.roll.baseRoll,
                                                   hit.roll.currentAttackBonus,
                                                   hit.roll.attackRoll);

                        messages.createMessage.damage(messages.charSpan,
                                                      myChar.name,
                                                      myOpp.name,
                                                      damage);
                    }else{
                        messages.createMessage.attack(messages.charSpan,
                                                    myChar.name,
                                                    myOpp.name,
                                                    messages.miss,
                                                    hit.roll.baseRoll,
                                                    hit.roll.currentAttackBonus,
                                                    hit.roll.attackRoll);
                    }

                    this.charAttackCounter++;
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

            // If battle has ended interrupt loop.
            }else if(this.hasEnded){

                return 'true';

            // If one of the objects has HP below 0, declare winner and set combat end to true.
            }else{

                if(myChar.hp <= -1){

                    messages.createMessage.kill(messages.oppSpan, myOpp.name, myChar.name);

                }else if(myOpp.hp <= -1){

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

                // For readability purposes of the combat report log and realistic HP substraction, setTimeout is needed.
                setTimeout(function(){

                    // Check if round has ended.
                    combatEnd = privateObj.checkRoundEnd(myChar, myOpp);

                    if(typeof combatEnd == 'string' && combatEnd == 'true'){

                        return false;

                    }else{

                        privateObj.continueRound(myChar, myOpp, combatEnd);

                        // Increase inner loop's iterator count after each iteration.
                        index++;

                        // When inner loop reaches the start the round over with the given values.
                        if(index == roundLength){

                            publicObj.startFight(myChar, myOpp);
                            privateObj.charAttackCounter = 0;
                            privateObj.oppAttackCounter = 0;
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
        startFight: function(myChar, myOpp){

            var $log = $('#report-log'),
                round;

            // if(charHP == undefined && oppHP == undefined){

            //     $log.html('');

                round = privateObj.startRound(myChar, myOpp);

            // }else{

                // round = privateObj.startRound(myChar, myOpp, charHP, oppHP);
            // }
        }
    };

    return publicObj;

}(jQuery, APP, APP.CALCULATE, APP.VIEW));