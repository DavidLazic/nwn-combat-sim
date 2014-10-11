APP.EVENT_HANDLER = (function($, app){

	var privateMethod,
		publicMethod;

	privateMethod = {

		/**
		 * Send AJAX request.
		 * @param url{string} - defined based on the creature type through "data" attribute.
		 * @param selectedValue{string} - label for matching the right object.
		 */
		getData: function(){

			var $selected = $('#select-opponent option:selected'),
				selectedValue = $selected.val(),
				creatureType = $selected.data('url'),

				url = 'js/' + creatureType + '.json',
				ajax = app.AJAX_WRAPPER;

			if(selectedValue === 'null'){
				return false;
			}else{
				ajax.sendRequest(url, selectedValue);
			}
		}
	};

	publicMethod = {

		/**
		 *
		 * Initialize main function.
		 */
		init: function(){
			this.bindEvents();
		},

		/**
		 * Bind @selection and @fight events.
		 */
		bindEvents: function(){

			var $selectList = $('#select-opponent'),
				$buttonFight = $('#btn-fight');

			$selectList.on('change', $.proxy(privateMethod, 'getData'));
			$buttonFight.on('click', $.proxy(privateMethod, 'startFight'));
		},

		/**
		 * Render given object's properties.
		 * @params {object}
		 * @return {object}, {string}
		 */
		renderObject: function(object){

			var $race = $('#race'),
				$alignment = $('#alignment'),
				$AC = $('#ac'),
				$HP = $('#hp'),
				$AB = $('#ab'),
				$DC = $('#dc'),
				$damage = $('#damage'),

				race = object.race,
				alignment = object.alignment,
				AC = object.armorClass,
				HP = object.hitPoints,
				AB = '+' + object.attackBonus.join('/+'),
				DC = object.diceRoll[0] + 'd' + object.diceRoll[1],
				damage = object.damage[0] + '-' + object.damage[1] + ' + ' + object.damage[2],

				objectsArray = [$race, $alignment, $AC, $HP, $AB, $DC, $damage],
				labelsArray = [race, alignment, AC, HP, AB, DC, damage];

				this.populateFields(objectsArray, labelsArray);
		},

		populateFields: function(objects, labels){

			for(var i = 0; i < objects.length; i++){

				objects[i].html(labels[i]);
			}
		}
	};

	return publicMethod;

}(jQuery, APP));

$(function(){
	APP.EVENT_HANDLER.init();
});
