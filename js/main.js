$(function(){
	SIMULATION.init();
});

SIMULATION = (function($){

	var self = {};

	self.valueNotSet = '<li>You need to set AC value first</li>',
	self.valueNaN = '<li>AC value must be a number</li>',
	self.valueRange = '<li>AC value must be between 1 and 99</li>',
	self.fightStarted = '<li>Fight Started!</li>',

	self.init = function(){
		this.globalDOM();
		this.bindEvents();
	},

	self.globalDOM = function(){
		this.$set = $('.btn-set');
		this.$fight = $('.btn-fight');
		this.$reportLog = $('.report-log');
	},

	self.bindEvents = function(){
		this.$fight.on('click', $.proxy(this, "startFight"));
		this.$set.on('click', $.proxy(this, "setValue"));
	},

	self.startFight = function(){
		this.validateInput(this.char());
	},

	self.validateInput = function(obj){

		if(obj.checkInput() == true){
			self.globalMessage(self.fightStarted);
			self.$fight.addClass('disabled');
		}
	},

	self.globalMessage = function(msg){
		this.$reportLog.html(msg);
	},

	self.setValue = function(e){
		var object = $(e.target).data('object'),
			property = $(e.target).data('property'),
			currentObject = eval(this[object]),
			currentProperty = eval(currentObject()[property]),
			value = parseInt($(e.target).parent().find('input').val());

		currentProperty(value);
		console.log(currentProperty());
	},

	self.char = function(){
		var char = {};

		char.ac = function(val){
			return {
				max: 100,
				min: 0,
				currentValue: val || null
			}
		},

		char.checkInput = function(){
			var inputValue = parseInt($('.ac-input').val()),
				length = $('.ac-input').val().length;

			// if empty
			if(length == 0 || this.ac().currentValue == null){
				self.globalMessage(self.valueNotSet);
			}else{
				// if not a number
				if(isNaN(inputValue)){
					self.globalMessage(self.valueNaN);
				// if less than 0 or higher than 99
				}else if(inputValue <= this.ac().min || inputValue >= this.ac().max){
					self.globalMessage(self.valueRange);
				}else{
					console.log(this.ac().currentValue);
					return true;
				}
			}
		}

		return char;
	}

	return self;

})(jQuery);