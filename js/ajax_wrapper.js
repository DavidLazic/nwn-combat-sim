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

					view.renderObject(currentObject);
				}
			}
		},

		ajaxError: function(data){
			console.log(data);
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