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
        endKill: '</span></div>'
    }

    privateObj = {

        startRound: function(myChar, myOpp, charHP, oppHP){

            // Length/duration of one round which is determined
            // by the total number of both object's attacks per round.
            var roundLength = myChar.ab.length + myOpp.ab.length,

                randomDelay = calculate.randomValue(500, 300),

                $startCombat = $('#btn-combat'),

                $charCurrentHP = $('#char-current-hp'),
                $oppCurrentHP = $('#current-hp'),

                charMaxAttacks = myChar.ab.length,
                charAC = myChar.ac,
                charHP = charHP || myChar.hp,
                charName = myChar.name,

                oppMaxAttacks = myOpp.ab.length,
                oppAC = myOpp.ac,
                oppHP = oppHP || myOpp.hp,
                oppName = myOpp.name,

                // While iterating over total attacks, set attack counters to 0.
                charAttack = 0,
                oppAttack = 0,

                hasEnded = false,
                // Iterator for inner (setTimeout) loop.
                index = 0,

                messageArray = [];

            for(var i = 0; i < roundLength; i++){

                // For readability purposes of the combat report log, setTimeout is needed.
                setTimeout(function(){

                    // While character's or opponent's health are above 0, do combat.
                    if(charHP > 0 && oppHP > 0 && hasEnded == false){
                        // Hit can be 0 or 1 based on Math.random().
                        // Random "hit" value gives the combat a bit more reality, as objects won't be hitting each other
                        // in linear way, e.g. 1-1-1-1 / 2-2-2-2.
                        var hit = calculate.randomValue(2);

                    // If battle has ended interrupt loop.
                    }else if(hasEnded == true){

                        return false;

                    // If one of the objects has HP below 0, declare winner and set combat end to true.
                    }else{

                        if(charHP <= -1){

                            messageArray = [messages.oppSpan, oppName, messages.killed, charName, messages.endKill];
                            view.writeMessage(messageArray);
                            $startCombat.removeClass('disabled');

                        }else if(oppHP <= -1){

                            messageArray = [messages.charSpan, charName, messages.killed, oppName, messages.endKill];
                            view.writeMessage(messageArray);
                            $startCombat.removeClass('disabled');
                        }

                        hasEnded = true;

                        return false;
                    }


                    if(hit == 1){

                        // If the object has any attacks left, he will make a hit.
                        if(charAttack < charMaxAttacks){

                            // For each hit chance, calculate the attack roll.
                            var charBaseAttackBonus = privateObj.increaseABIterateCount(myChar, charAttack),
                                charAttackRoll = calculate.calculateAttackRoll(charBaseAttackBonus);

                            // If current attack roll surpases opponent object's AC, calculate damage done for successful hit.
                            if(charAttackRoll.attackRoll > oppAC){

                                var charDamageDone = calculate.calculateDamage(myChar.diceRoll, myChar.strength, true, true);

                                oppHP -= charDamageDone;
                                view.updateCurrentHP(oppHP, $oppCurrentHP);

                                messageArray = [messages.charSpan, charName, messages.attacks, oppName, messages.hit, charAttackRoll.baseRoll, messages.add, charBaseAttackBonus, messages.equals, charAttackRoll.attackRoll, messages.end];

                                view.writeMessage(messageArray);

                                messageArray = [messages.charSpan, charName, messages.damages, oppName, messages.damage, charDamageDone, messages.dmgPre, charDamageDone, messages.dmgAfter];

                                view.writeMessage(messageArray);

                            }else{

                                messageArray = [messages.charSpan, charName, messages.attacks, oppName, messages.miss, charAttackRoll.baseRoll, messages.add, charBaseAttackBonus, messages.equals, charAttackRoll.attackRoll, messages.end];

                                view.writeMessage(messageArray);
                            }

                            charAttack++;

                        }else{

                            var oppBaseAttackBonus = privateObj.increaseABIterateCount(myOpp, oppAttack),
                                oppAttackRoll = calculate.calculateAttackRoll(oppBaseAttackBonus);

                            if(oppAttackRoll.attackRoll > charAC){

                                var oppDamageDone = calculate.calculateDamage(myOpp.diceRoll, myOpp.strength, true, false);

                                charHP -= oppDamageDone;
                                view.updateCurrentHP(charHP, $charCurrentHP);

                                messageArray = [messages.oppSpan, oppName, messages.attacks, charName, messages.hit, oppAttackRoll.baseRoll, messages.add, oppBaseAttackBonus, messages.equals, oppAttackRoll.attackRoll, messages.end];

                                view.writeMessage(messageArray);

                                messageArray = [messages.oppSpan, oppName, messages.damages, charName, messages.damage, oppDamageDone, messages.dmgPre, oppDamageDone, messages.dmgAfter];

                                view.writeMessage(messageArray);

                            }else{

                                messageArray = [messages.oppSpan, oppName, messages.attacks, charName, messages.miss, oppAttackRoll.baseRoll, messages.add, oppBaseAttackBonus, messages.equals, oppAttackRoll.attackRoll, messages.end];

                                view.writeMessage(messageArray);
                            }

                            oppAttack++;
                        }

                    }else{

                        if(oppAttack < oppMaxAttacks){

                            var oppBaseAttackBonus = privateObj.increaseABIterateCount(myOpp, oppAttack),
                                oppAttackRoll = calculate.calculateAttackRoll(oppBaseAttackBonus);

                            if(oppAttackRoll.attackRoll > charAC){

                                var oppDamageDone = calculate.calculateDamage(myOpp.diceRoll, myOpp.strength, true, false);

                                charHP -= oppDamageDone;
                                view.updateCurrentHP(charHP, $charCurrentHP);

                                messageArray = [messages.oppSpan, oppName, messages.attacks, charName, messages.hit, oppAttackRoll.baseRoll, messages.add, oppBaseAttackBonus, messages.equals, oppAttackRoll.attackRoll, messages.end];

                                view.writeMessage(messageArray);

                                messageArray = [messages.oppSpan, oppName, messages.damages, charName, messages.damage, oppDamageDone, messages.dmgPre, oppDamageDone, messages.dmgAfter];

                                view.writeMessage(messageArray);

                            }else{

                                messageArray = [messages.oppSpan, oppName, messages.attacks, charName, messages.miss, oppAttackRoll.baseRoll, messages.add, oppBaseAttackBonus, messages.equals, oppAttackRoll.attackRoll, messages.end];

                                view.writeMessage(messageArray);
                            }

                            oppAttack++;

                        }else{

                            var charBaseAttackBonus = privateObj.increaseABIterateCount(myChar, charAttack),
                                charAttackRoll = calculate.calculateAttackRoll(charBaseAttackBonus);

                            if(charAttackRoll.attackRoll > oppAC){

                                var charDamageDone = calculate.calculateDamage(myChar.diceRoll, myChar.strength, true, true);

                                oppHP -= charDamageDone;
                                view.updateCurrentHP(oppHP, $oppCurrentHP);

                                messageArray = [messages.charSpan, charName, messages.attacks, oppName, messages.hit, charAttackRoll.baseRoll, messages.add, charBaseAttackBonus, messages.equals, charAttackRoll.attackRoll, messages.end];

                                view.writeMessage(messageArray);

                                messageArray = [messages.charSpan, charName, messages.damages, oppName, messages.damage, charDamageDone, messages.dmgPre, charDamageDone, messages.dmgAfter];

                                view.writeMessage(messageArray);

                            }else{

                                messageArray = [messages.charSpan, charName, messages.attacks, oppName, messages.miss, charAttackRoll.baseRoll, messages.add, charBaseAttackBonus, messages.equals, charAttackRoll.attackRoll, messages.end];

                                view.writeMessage(messageArray);

                            }

                            charAttack++;
                        }
                    }

                    // Increase inner loop's iterator count after each iteration.
                    index++;

                    // When inner loop reaches the start the round over with the given values.
                    if(index == roundLength){
                        publicObj.startFight(myChar, myOpp, charHP, oppHP);
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
        increaseABIterateCount: function(object, value){
            var currentValue = object.ab[value];

            return currentValue;
        }

    };

    publicObj = {

        /**
         * Start first round with both object's max hp. e.g. (current charHP and oppHP will be undefined).
         * After the round has ended, use current hp values as parameters for next round.
         */
        startFight: function(myChar, myOpp, charHP, oppHP){

            var $log = $('#report-log'),
                round;

            if(charHP == undefined && oppHP == undefined){

                $log.html('');

                round = privateObj.startRound(myChar, myOpp);

            }else{

                round = privateObj.startRound(myChar, myOpp, charHP, oppHP);
            }
        }
    };

    return publicObj;

}(jQuery, APP, APP.CALCULATE, APP.VIEW));