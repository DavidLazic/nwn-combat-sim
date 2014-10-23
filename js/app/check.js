APP.CHECK = (function($, app){

    var privateObj,
        publicObj;

    privateObj = {

        checkWinner: function(fighter){

            var winner = {};

            winner.character = (fighter[1].hp <= 0) ? 'true' : 'false';
            winner.opponent = (fighter[0].hp <= 0) ? 'true' : 'false';

            return winner;
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

        checkRoundEnd: function(myChar, myOpp, hasEnded){

            var round =  {},
                fighter = [];

            fighter.push(myChar, myOpp);

            round.hasEnded = hasEnded;
            round.bothAlive = privateObj.checkHP(fighter);
            round.declareWinner = privateObj.checkWinner(fighter);

            return round;
        },

    };

    return publicObj;

}(jQuery, APP));
