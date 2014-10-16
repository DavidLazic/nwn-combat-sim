APP.COMBAT_MODULE = (function($, app){

    var privateMethod,
        publicMethod;

    privateMethod = {

    };

    publicMethod = {

        startFight: function(objA, objB){
            console.log(objA.dmg);
        }
    };

    return publicMethod;

}(jQuery, APP));