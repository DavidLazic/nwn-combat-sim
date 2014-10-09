$(function(){
	SIMULATION.init();
});

SIMULATION = (function($){

	var self = {};

	self.init = function(){
		this.globalDOM();
		this.bindEvents();
	},

	self.globalDOM = function(){
		this.$fight = $('.btn-fight');
		this.$reportLog = $('.report-log');
	},

	self.bindEvents = function(){
		this.$fight.on('click', $.proxy(this, "simulateFight"));
	},

	self.simulateFight = function(){
		var inputLength = $('.hero-ac-input').val().length,
			inputValue = parseInt($('.hero-ac-input').val());

		this.validateInput(inputLength, inputValue);
	},

	self.validateInput = function(length, value){

		var valueNotSet = '<li>You need to set AC value first</li>',
			valueNaN = '<li>AC value must be a number</li>',
			valueRange = '<li>AC value must be between 1 and 99</li>',
			fightStarted = '<li>Fight Started!</li>';

		// if empty
		if(length == 0){
			this.globalMessage(valueNotSet);
		}else{
			// if not a number
			if(isNaN(value)){
				this.globalMessage(valueNaN);
			// if less than 0 or higher than 99
			}else if(value <= 0 || value >= 100){
				this.globalMessage(valueRange);
			}else{
				this.globalMessage(fightStarted);
				this.$fight.addClass('disabled');
			}
		}
	},

	self.globalMessage = function(msg){
		this.$reportLog.html(msg);
	},

	self.hero = function(){
		var $hero = {};

		hero.ac = null;

		hero.setAC = function(){

		}

		return $hero;
	},

	self.opponent = function(){
		var $opponent = {};

		hero.ac = null;

		return $opponent;
	}

	return self;

})(jQuery);