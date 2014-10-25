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

    };

    return publicObj;

}(jQuery, APP));
