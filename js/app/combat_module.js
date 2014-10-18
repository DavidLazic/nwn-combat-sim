APP.COMBAT_MODULE = (function($, app, calculate, view){

    var privateMethod,
        publicMethod,
        calculate = app.CALCULATE,
        view = app.EVENT_HANDLER;

    privateMethod = {

        startRound: function(myChar, myOpp){

            // Length/duration of one round which is determined
            // by the total number of both object's attacks per round.
            var roundLength = myChar.ab.length + myOpp.ab.length;

            for(var i = 0; i < roundLength; i++){

                var randomDelay = calculate.randomValue(500, 300);

                // While iterating over total attacks, set attack counters to 0.
                var charMaxAttacks = myChar.ab.length,
                    charAttack = 0,
                    charAC = myChar.ac,
                    charHP = myChar.hp,
                    charName = myChar.name,

                    oppMaxAttacks = myOpp.ab.length,
                    oppAttack = 0,
                    oppAC = myOpp.ac,
                    oppHP = myOpp.hp,
                    oppName = myOpp.name;

                // For readability purposes of the combat report log, setTimeout is needed.
                setTimeout(function(){

                    // Hit can be 0 or 1 based on Math.random().
                    // Random "hit" value gives the combat a bit more reality, as objects won't be hitting each other
                    // in a linear way, e.g. 1-1-1-1 / 2-2-2-2.
                    var hit = calculate.randomValue(2);

                    if(hit == 1){

                        // If the object has any attacks left, he will make a hit.
                        if(charAttack < charMaxAttacks){

                            // For each hit chance, calculate the attack roll.
                            var charBaseAttackBonus = privateMethod.increaseABIterateCount(myChar, charAttack),
                                charAttackRoll = calculate.calculateAttackRoll(charBaseAttackBonus);

                            // If current attack roll surpases opponent object's AC, calculate damage done for successful hit.
                            if(charAttackRoll[1] > oppAC){

                                var charDamageDone = calculate.calculateDamage(myChar, true);

                                view.writeMessage(charName, oppName, charAttackRoll[0], charBaseAttackBonus, charAttackRoll[1], true);

                            }else{

                               view.writeMessage(charName, oppName, charAttackRoll[0], charBaseAttackBonus, charAttackRoll[1], false);
                            }

                            charAttack++;

                        }else{

                            var oppBaseAttackBonus = privateMethod.increaseABIterateCount(myOpp, oppAttack),
                                oppAttackRoll = calculate.calculateAttackRoll(oppBaseAttackBonus);

                            if(oppAttackRoll > charAC){

                                var oppDamageDone = calculate.calculateDamage(myOpp, true);

                                view.writeMessage(oppName, charName, oppAttackRoll[0], oppBaseAttackBonus, oppAttackRoll[1], true);

                            }else{

                                view.writeMessage(oppName, charName, oppAttackRoll[0], oppBaseAttackBonus, oppAttackRoll[1], false);
                            }

                            oppAttack++;
                        }

                    }else{

                        if(oppAttack < oppMaxAttacks){

                            var oppBaseAttackBonus = privateMethod.increaseABIterateCount(myOpp, oppAttack),
                                oppAttackRoll = calculate.calculateAttackRoll(oppBaseAttackBonus);

                            if(oppAttackRoll > charAC){

                                var oppDamageDone = calculate.calculateDamage(myOpp, true);

                                view.writeMessage(oppName, charName, oppAttackRoll[0], oppBaseAttackBonus, oppAttackRoll[1], true);

                            }else{

                                view.writeMessage(oppName, charName, oppAttackRoll[0], oppBaseAttackBonus, oppAttackRoll[1], false);
                            }

                            oppAttack++;

                        }else{

                            var charBaseAttackBonus = privateMethod.increaseABIterateCount(myChar, charAttack),
                                charAttackRoll = calculate.calculateAttackRoll(charBaseAttackBonus);

                            if(charAttackRoll[1] > oppAC){

                                var charDamageDone = calculate.calculateDamage(myChar, true);

                                view.writeMessage(charName, oppName, charAttackRoll[0], charBaseAttackBonus, charAttackRoll[1], true);
                            }else{

                                view.writeMessage(charName, oppName, charAttackRoll[0], charBaseAttackBonus, charAttackRoll[1], false);
                            }

                            charAttack++;
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
        increaseABIterateCount: function(object, value){
            var currentValue = object.ab[value];

            return currentValue;
        }
    };

    publicMethod = {

        startFight: function(myChar, myOpp){

            var round = privateMethod.startRound(myChar, myOpp);
        }
    };

    return publicMethod;

}(jQuery, APP, APP.CALCULATE, APP.EVENT_HANDLER));