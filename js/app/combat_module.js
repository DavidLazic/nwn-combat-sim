APP.COMBAT_MODULE = (function($, app, calculate){

    var privateMethod,
        publicMethod,
        calculate = app.CALCULATE;

    privateMethod = {

        startRound: function(myChar, myOpp){

            // Length/duration of one round which is determined
            // by the total number of both object's attacks per round.
            var roundLength = myChar.ab.length + myOpp.ab.length;

            for(var i = 0; i < roundLength; i++){

                // While iterating over total attacks, set attack counters to 0.
                var charMaxAttacks = myChar.ab.length,
                    oppMaxAttacks = myOpp.ab.length,
                    charAttack = 0,
                    oppAttack = 0;

                // For readability purposes of the combat report log, setTimeout is needed.
                setTimeout(function(){

                    // Hit can be 0 or 1 based on Math.random().
                    // Random "hit" value gives the combat a bit more reality, as objects won't be hitting each other
                    // in a linear way, e.g. 1-1-1-1 / 2-2-2-2.
                    var hit = Math.floor(Math.random() * 2);

                    if(hit == 1){
                        // If object has any attacks left, he will make a hit.
                        if(charAttack < charMaxAttacks){
                            var baseAttackBonus = privateMethod.increaseABIterateCount(myChar, charAttack),
                                attackRoll = calculate.calculateAttackRoll(baseAttackBonus);
                            console.log('myChar hits.');
                            console.log(attackRoll);
                            charAttack++;
                            console.log('Attacks number:', charAttack);
                        }else{
                            console.log('myOpp hits.');
                            oppAttack++;
                            console.log('Attacks number:', oppAttack);
                        }

                    }else{

                        if(oppAttack < oppMaxAttacks){
                            console.log('myOpp hits.');
                            oppAttack++;
                            console.log('Attacks number:', oppAttack);
                        }else{
                            var baseAttackBonus = privateMethod.increaseABIterateCount(myChar, charAttack),
                                attackRoll = calculate.calculateAttackRoll(baseAttackBonus);
                            console.log('myChar hits.');
                            console.log(attackRoll);
                            charAttack++;
                            console.log('Attacks number:', charAttack);
                        }
                    }

                }, 300 * i);
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

}(jQuery, APP, APP.CALCULATE));