// Application namespace
var APP = APP || {};

// $(function(){
//  SIMULATION.init();
// });

// SIMULATION = (function($, w){

//  var self = {};

//  self.valueNotSet = '<li>You need to set AC value first</li>',
//  self.valueNaN = '<li>AC value must be a number</li>',
//  self.valueRange = '<li>AC value must be between 1 and 99</li>',
//  self.fightStarted = '<li>Fight Started!</li>',

//  self.init = function(){
//      this.globalDOM();
//      this.bindEvents();
//  },

//  self.globalDOM = function(){
//      this.$set = $('.btn-set');
//      this.$fight = $('.btn-fight');
//      this.$reportLog = $('.report-log');
//  },

//  self.bindEvents = function(){
//      this.$fight.on('click', $.proxy(this, "startFight"));
//      this.$set.on('click', $.proxy(this, "setValue"));
//  },

//  self.startFight = function(){
//      this.validateInput(this.character());
//  },

//  self.validateInput = function(obj){

//      if(obj.checkInput() == true){
//          self.globalMessage(self.fightStarted);
//          self.$fight.addClass('disabled');
//      }
//  },

//  self.globalMessage = function(msg){
//      this.$reportLog.html(msg);
//  },

//  self.setValue = function(e){
//      var object = $(e.target).data('object'),
//          property = $(e.target).data('property'),
//          currentObject = eval(this[object]),
//          currentProperty = eval(currentObject()[property]),
//          value = parseInt($(e.target).parent().find('input').val());

//      currentProperty(value);
//      this.character().checkInput(value);
//  },

//  self.character = function(){
//      var character = {};

//      character.ac = function(val){
//          console.log(val);
//          return {
//              max: 100,
//              min: 0,
//              currentValue: val || null
//          }
//      },

//      character.checkInput = function(val){
//          var inputValue = val,
//              length = $('.ac-input').val().length,
//              max = this.ac().max,
//              min = this.ac().min,
//              currentValue = this.ac().currentValue;
//              // console.log(val, inputValue, currentValue);

//          // if empty
//          if(length == 0 || inputValue == null){
//              self.globalMessage(self.valueNotSet);
//          }else{
//              // if not a number
//              if(isNaN(inputValue)){
//                  self.globalMessage(self.valueNaN);
//              // if less than 0 or higher than 99
//              }else if(inputValue <= min || inputValue >= max){
//                  self.globalMessage(self.valueRange);
//              }else{
//                  return true;
//              }
//          }
//      }

//      return character;
//  }

//  return self;

// })(jQuery, window);