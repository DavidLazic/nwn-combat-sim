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

				url = 'js/creatureDB/' + creatureType + '.json',
				ajax = app.AJAX_WRAPPER;

			if(selectedValue === 'null'){

				var $clear = $('.idle-clear'),
					$avatar = $('#avatar'),
					idleURL = '/img/idle_portrait.jpg';

				$clear.text('');
				$avatar.attr('src', idleURL);

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
		 * Loop through {object} and {label} arrays and populate fields with array data.
		 * @params {array}
		 * @return {string}
		 */
		populateFields: function(objects, labels, avatar, cb){

			avatar[0].attr('src', avatar[1]);

			$.each(objects, function(i){
				$(this).html(labels[i]);
			});

			cb();
		}
	};

	return publicMethod;

}(jQuery, APP));

$(function(){
	APP.EVENT_HANDLER.init();
});
