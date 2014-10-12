APP.AJAX_WRAPPER = (function($, view){

	var privateMethod,
		publicMethod;

	privateMethod = {

		/**
		 * Create object.
		 * @return {object}
		 */
		createInstance: function(url, label){

			var ajaxObj = {};

			ajaxObj.type = 'GET';
			ajaxObj.url = url;
			ajaxObj.dataType = 'JSON';

			ajaxObj.success = function(data){
				privateMethod.ajaxSuccess(data, label);
			};

			ajaxObj.error = function(data){
				privateMethod.ajaxError(data);
			}

			return ajaxObj;
		},


		/**
		 * Match the given label with the right object.
		 * @param label{string}
		 * @return {object}
		 */
		ajaxSuccess: function(data, label){

			for (var i = 0; i < data.length; i++){

				if(data[i].label === label){

					var currentObject = data[i];

					this.renderObject(currentObject);
				}
			}
		},

		ajaxError: function(data){
			console.log(data);
		},

		/**
		 * Render given object's properties.
		 * @params {object}
		 * @return {array}
		 */
		renderObject: function(object){

			var $avatar = $('#avatar'),
				$race = $('#race'),
				$alignment = $('#alignment'),
				$AC = $('#ac'),
				$HP = $('#hp'),
				$AB = $('#ab'),
				$DC = $('#dc'),
				$damage = $('#damage'),
				$str = $('#strength'),
				$dex = $('#dexterity'),
				$con = $('#constitution'),
				$intel = $('#intelligence'),
				$wis = $('#wisdom'),
				$cha = $('#charisma'),

				avatar = 'img/' + object.avatarURL + '.jpg',
				race = object.race,
				alignment = object.alignment,
				AC = object.armorClass,
				HP = object.hitPoints,
				AB = '+' + object.attackBonus.join('/+'),
				DC = object.diceRoll[0] + 'd' + object.diceRoll[1],
				damage = object.damage[0] + '-' + object.damage[1] + ' + ' + object.damage[2],
				str = object.strength,
				dex = object.dexterity,
				con = object.constitution,
				intel = object.intelligence,
				wis = object.wisdom,
				cha = object.charisma,

				objectsArray = [$race, $alignment, $AC, $HP, $AB, $DC, $damage, $str, $dex, $con, $intel, $wis, $cha],
				labelsArray = [race, alignment, AC, HP, AB, DC, damage, str, dex, con, intel, wis, cha],
				avatarArray = [$avatar, avatar];

			view.populateFields(objectsArray, labelsArray, avatarArray, this.calculateModifier);
		},

		/**
		 * Calculate ability modifier based on the current ability value.
		 * For each 2 levels of certain ability starting from level 9, modifier gets raised by 1.
		 */
		calculateModifier: function(){

			var $modifier = $('.modifier');

			$.each($modifier, function(){

				var value = parseInt($(this).prev().text()),
					modValue = Math.floor((value - 9) / 2);

				$(this).html(modValue);
			});
		}
	};

	publicMethod = {

		/**
		 * Send request with created object.
		 */

		sendRequest: function(url, label){

			var $object = privateMethod.createInstance(url, label);

			$.ajax($object);
		}
	};

	return publicMethod;

}(jQuery, APP.EVENT_HANDLER));