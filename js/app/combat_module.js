APP.COMBAT_MODULE = (function($, app, calculate, view){

    var privateMethod,
        publicMethod,
        calculate = app.CALCULATE,
        view = app.EVENT_HANDLER;

    privateMethod = {

        startRound: function(myChar, myOpp, charHP, oppHP){

            // Length/duration of one round which is determined
            // by the total number of both object's attacks per round.
            var roundLength = myChar.ab.length + myOpp.ab.length;

            for(var i = 0; i < roundLength; i++){

                var randomDelay = calculate.randomValue(500, 300),

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
                    index = 0;

                // For readability purposes of the combat report log, setTimeout is needed.
                setTimeout(function(){

                    // While character's or opponent's health are above 0, do combat.
                    if(charHP > 0 && oppHP > 0 && hasEnded == false){
                        // Hit can be 0 or 1 based on Math.random().
                        // Random "hit" value gives the combat a bit more reality, as objects won't be hitting each other
                        // in linear way, e.g. 1-1-1-1 / 2-2-2-2.
                        var hit = calculate.randomValue(2);

                    }else if(hasEnded == true){

                        return false;

                    }else{

                        if(charHP <= 0){
                            view.declareWin(oppName, charName);
                        }else if(oppHP <= 0){
                            view.declareWin(charName, oppName);
                        }

                        hasEnded = true;

                        return false;
                    }


                    if(hit == 1){

                        // If the object has any attacks left, he will make a hit.
                        if(charAttack < charMaxAttacks){

                            // For each hit chance, calculate the attack roll.
                            var charBaseAttackBonus = privateMethod.increaseABIterateCount(myChar, charAttack),
                                charAttackRoll = calculate.calculateAttackRoll(charBaseAttackBonus);

                            // If current attack roll surpases opponent object's AC, calculate damage done for successful hit.
                            if(charAttackRoll.attackRoll > oppAC){

                                var charDamageDone = calculate.calculateDamage(myChar, true);

                                oppHP -= charDamageDone;
                                calculate.currentHP(oppHP, $oppCurrentHP);

                                view.writeMessage(charName,
                                                  oppName,
                                                  charAttackRoll.baseRoll,
                                                  charBaseAttackBonus,
                                                  charAttackRoll.attackRoll,
                                                  charDamageDone,
                                                  true);

                            }else{

                                view.writeMessage(charName,
                                                 oppName,
                                                 charAttackRoll.baseRoll,
                                                 charBaseAttackBonus,
                                                 charAttackRoll.attackRoll,
                                                 false);
                            }

                            charAttack++;

                        }else{

                            var oppBaseAttackBonus = privateMethod.increaseABIterateCount(myOpp, oppAttack),
                                oppAttackRoll = calculate.calculateAttackRoll(oppBaseAttackBonus);

                            if(oppAttackRoll.attackRoll > charAC){

                                var oppDamageDone = calculate.calculateDamage(myOpp, true);

                                charHP -= oppDamageDone;
                                calculate.currentHP(charHP, $charCurrentHP);

                                view.writeMessage(oppName,
                                                  charName,
                                                  oppAttackRoll.baseRoll,
                                                  oppBaseAttackBonus,
                                                  oppAttackRoll.attackRoll,
                                                  oppDamageDone,
                                                  true);

                            }else{

                                view.writeMessage(oppName,
                                                  charName,
                                                  oppAttackRoll.baseRoll,
                                                  oppBaseAttackBonus,
                                                  oppAttackRoll.attackRoll,
                                                  false);
                            }

                            oppAttack++;
                        }

                    }else{

                        if(oppAttack < oppMaxAttacks){

                            var oppBaseAttackBonus = privateMethod.increaseABIterateCount(myOpp, oppAttack),
                                oppAttackRoll = calculate.calculateAttackRoll(oppBaseAttackBonus);

                            if(oppAttackRoll.attackRoll > charAC){

                                var oppDamageDone = calculate.calculateDamage(myOpp, true);

                                charHP -= oppDamageDone;
                                calculate.currentHP(charHP, $charCurrentHP);

                                view.writeMessage(oppName,
                                                  charName,
                                                  oppAttackRoll.baseRoll,
                                                  oppBaseAttackBonus,
                                                  oppAttackRoll.attackRoll,
                                                  oppDamageDone,
                                                  true);

                            }else{

                                view.writeMessage(oppName,
                                                  charName,
                                                  oppAttackRoll.baseRoll,
                                                  oppBaseAttackBonus,
                                                  oppAttackRoll.attackRoll,
                                                  false);
                            }

                            oppAttack++;

                        }else{

                            var charBaseAttackBonus = privateMethod.increaseABIterateCount(myChar, charAttack),
                                charAttackRoll = calculate.calculateAttackRoll(charBaseAttackBonus);

                            if(charAttackRoll.attackRoll > oppAC){

                                var charDamageDone = calculate.calculateDamage(myChar, true);

                                oppHP -= charDamageDone;
                                calculate.currentHP(oppHP, $oppCurrentHP);

                                view.writeMessage(charName,
                                                  oppName,
                                                  charAttackRoll.baseRoll,
                                                  charBaseAttackBonus,
                                                  charAttackRoll.attackRoll,
                                                  charDamageDone,
                                                  true);

                            }else{

                                view.writeMessage(charName,
                                                  oppName,
                                                  charAttackRoll.baseRoll,
                                                  charBaseAttackBonus,
                                                  charAttackRoll.attackRoll,
                                                  false);
                            }

                            charAttack++;
                        }
                    }

                    index++;

                    if(index == roundLength){
                        publicMethod.startFight(myChar, myOpp, charHP, oppHP);
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

    publicMethod = {

        startFight: function(myChar, myOpp, charHP, oppHP){

            if(charHP == undefined && oppHP == undefined){
                var round = privateMethod.startRound(myChar, myOpp);
            }else{
                if(charHP > 0 && oppHP > 0){
                    var round = privateMethod.startRound(myChar, myOpp, charHP, oppHP);
                }else{
                    return false;
                }
            }
        }
    };

    return publicMethod;

}(jQuery, APP, APP.CALCULATE, APP.EVENT_HANDLER));