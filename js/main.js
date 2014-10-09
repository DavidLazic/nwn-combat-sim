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
		this.validateInput(this.hero());
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

	self.setValue = function(){

	},

	self.hero = function(){
		var hero = {};

		hero.ac = {
			max: 100,
			min: 0,
			currentValue: null
		},

		hero.checkInput = function(){
			var inputValue = parseInt($('.ac-input').val()),
				length = $('.ac-input').val().length;

			// if empty
			if(length == 0){
				self.globalMessage(self.valueNotSet);
			}else{
				// if not a number
				if(isNaN(inputValue)){
					self.globalMessage(self.valueNaN);
				// if less than 0 or higher than 99
				}else if(inputValue <= this.ac.min || inputValue >= this.ac.max){
					self.globalMessage(self.valueRange);
				}else{
					return true;
				}
			}
		}

		return hero;
	}

	return self;

})(jQuery);