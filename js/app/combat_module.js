APP.COMBAT_MODULE = (function($, app){

    var privateMethod,
        publicMethod;

    privateMethod = {

    };

    publicMethod = {

        startFight: function(x){
            console.log(parseInt(x.dmg));
        }
    };

    return publicMethod;

}(jQuery, APP));