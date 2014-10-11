APP.EVENT_HANDLER = (function($, app){

	var privateMethod,
		publicMethod;

	privateMethod = {
		doAlert: function(message){
			console.log(message);
		},
		append: function(data){
			var	report = $('.report-log');

			report.html(data);
		}
	};

	publicMethod = {

		/**
		 *
		 * Initialize main function
		 */
		init: function(){
			this.bindEvents();
		},

		/**
		 * Bind events for creature selection and fight
		 */
		bindEvents: function(){
			var $buttonFight = $('#btn-fight');
			// Fight and selection

			$buttonFight.on('click', function(){
				// privateMethod.doAlert('true');
				$.ajax({
					type: 'GET',
					url: 'js/creatureDB',
					dataType: 'JSON',
					success: function(data){
						console.log(data[0].name, data[0].race, data[0].damage);
						// app.EVENT_HANDLER.append(data);
					}
				})
			});
		}
	};

	return publicMethod;

}(jQuery, APP));

$(function(){
	APP.EVENT_HANDLER.init();
});
