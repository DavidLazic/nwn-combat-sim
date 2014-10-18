APP.COMBAT_MODULE = (function($, app){

    var privateMethod,
        publicMethod;

    privateMethod = {

        startRound: function(i, charMaxAttacks, oppMaxAttacks){
            var attacks = charMaxAttacks;
        }
    };

    publicMethod = {

        startFight: function(myChar, myOpp){

            var roundLength = myChar.ab.length + myOpp.ab.length;

            for(var i = 0; i < roundLength; i++){
                var charMaxAttacks = myChar.ab.length,
                    oppMaxAttacks = myOpp.ab.length;

                setTimeout(function(){

                    var hitsFirst = Math.floor(Math.random() * 2);

                    if(hitsFirst == 1) {

                        if(charMaxAttacks > 0){
                            console.log('myChar hits.');
                            charMaxAttacks--;
                            console.log('Attacks remaining:', charMaxAttacks);
                        }else{
                            console.log('myOpp hits.');
                            oppMaxAttacks--;
                            console.log('Attacks remaining:', oppMaxAttacks);
                        }

                    }else{

                        if(oppMaxAttacks > 0){
                            console.log('myOpp hits.');
                            oppMaxAttacks--;
                            console.log('Attacks remaining:', oppMaxAttacks);
                        }else{
                             console.log('myChar hits.');
                            charMaxAttacks--;
                            console.log('Attacks remaining:', charMaxAttacks);
                        }
                    }

                }, 300 * i);
            }
        }
    };

    return publicMethod;

}(jQuery, APP));