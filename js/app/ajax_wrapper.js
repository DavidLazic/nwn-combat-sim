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
		 * Create arrays from output objects and field labels.
		 * @params {object}
		 * @return {array}
		 */
		renderObject: function(object){

			var obj = $('[data-property]'),
				objectsArray = [],
				labelsArray = [],

				$avatar = $('#avatar'),
				avatar = 'img/' + object.avatarURL + '.jpg',
				avatarArray = [$avatar, avatar];

			$.each(obj, function(){

				var label = $(this).data('property'),
					labelValue;

				if(label === 'attackBonus'){
					labelValue = '+' + object[label].join('/+');
				}else if(label === 'diceRoll'){
					labelValue = object[label][0] + 'd' + object[label][1];
				}else if(label === 'damage'){
					labelValue = object[label][0] + '-' + object[label][1] + ' + ' + object[label][2];
				}else{
					labelValue = object[label];
				}

				objectsArray.push($(this));
				labelsArray.push(labelValue);

			});

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