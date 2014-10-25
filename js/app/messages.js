APP.MESSAGES = (function($, app, view){

    var publicObj;

    publicObj = {

        /**
        * HTML format for "writeMessage" on the view.
        */
        charSpan: '<div class="text"><span class="capitalize character">',
        oppSpan: '<div class="text"><span class="capitalize opponent">',

        attacks: '</span> attacks <span class="capitalize">',
        damages: '</span> damages <span class="capitalize">',
        killed: '</span> killed <span class="capitalize">',

        hit: '</span> : *hit* : (',
        critHit: '</span> : *critical hit* : (',
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

            attack: function(attacker, defender, attack, baseRoll, BAB, attackRoll){

                this.message = [attacker.span,
                                attacker.name,
                                publicObj.attacks,
                                defender.name,
                                attack,
                                baseRoll,
                                publicObj.add,
                                BAB,
                                publicObj.equals,
                                attackRoll,
                                publicObj.end];

                view.writeMessage(this.message);
            },

            damage: function(attacker, defender, damageDone){

                this.message = [attacker.span,
                                attacker.name,
                                publicObj.damages,
                                defender.name,
                                publicObj.damage,
                                damageDone,
                                publicObj.dmgPre,
                                damageDone,
                                publicObj.dmgAfter];

                view.writeMessage(this.message);
            },

            kill: function(attacker, defender){

                this.message = [attacker.span,
                                attacker.name,
                                publicObj.killed,
                                defender.name,
                                publicObj.endKill];

                view.writeMessage(this.message);
            }
        }
    };

    return publicObj;

}(jQuery, APP, APP.VIEW));