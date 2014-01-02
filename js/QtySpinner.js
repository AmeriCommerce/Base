/*
*   QtySpinner.js
***************************************************************
*	  Adds Increment/Decrement buttons to the right of quantity text boxes.
*   *Assumes site uses Deputy.css
*
* 	Copyright 2013 AmeriCommerce
*/

;(function ($, window, document){
  
  var defaults = {
    increment : 1,
    delay : 250,
    interval : 50,
    allowNegative: false,
    minQty : 0,
    maxQty : false
  };
  
  function QtySpinner ( element, options){
    var self = this;
    this.element = element;

    this.dataWrapper = $(element).closest(".qty-wrapper");

    this.quantities = {
      minQty : parseInt(self.dataWrapper.data("qty-min") ? self.dataWrapper.data("qty-min") : defaults.minQty, 10) || 0,
      maxQty : parseInt(self.dataWrapper.data("qty-max") ? self.dataWrapper.data("qty-max") : defaults.maxQty, 10) || 0,
      increment : parseInt(self.dataWrapper.data("qty-inc") ? self.dataWrapper.data("qty-inc") : defaults.increment) || 1
    };

    this._defaults = $.extend({}, defaults, this.quantities);
    
    this.options = $.extend({}, this._defaults, options);
    
    
    this.wrapper = null;
    this.up = null
    this.down = null;
    
    this.interval = null;
    this.timeout = null;
    
    this.val = parseInt(this.element.value);
    
    this.init();
  }
  
  QtySpinner.prototype = {
    init: function(){
      $(this.element).wrap("<span class='rel in-block qty-spinner no-ul'>");
      this.wrapper = $(this.element).parent();
      this.wrapper.append("<a class='abs icon-chevron-up'></a><a class='abs icon-chevron-down'></a>").css("margin-right", 30);
      $("a", this.wrapper).css({ 
        "left": "100%", 
        "padding": 0, 
        "margin-left" : 5, 
        "font-size" : "17px",
        "cursor" : "pointer"
      }).width(25);
      this.up = $("a:first", this.wrapper);
      this.down = $("a:last", this.wrapper);
      this.up.css("top", 0);
      this.down.css("bottom", 0);
      
      this.bind();
    },
    
    bind: function(){
      var self = this;
      this.up.mousedown(function(){
        self.increment();
        
        self.timeout = setTimeout(function(){
          self.interval = setInterval($.proxy(self.increment, self), self.options.interval);
        }, self.options.delay);
        
      }).mouseup(function(){
        clearTimeout(self.timeout);
        clearInterval(self.interval);
      });
      
      this.down.mousedown(function(){
        self.decrement();
        
        self.timeout = setTimeout(function(){
          self.interval = setInterval($.proxy(self.decrement, self), self.options.interval);
        }, self.options.delay);
        
      }).mouseup(function(){
        clearTimeout(self.timeout);
        clearInterval(self.interval);
      });
    },
    
    increment: function(){
      var self = this;
      this.val = parseInt(self.element.value, 10) + this.options.increment;
      if (!this.options.maxQty || this.val <= this.options.maxQty)
        this.element.value = this.val;
    },
    
    decrement: function(){
      var self = this;
      this.val = parseInt(self.element.value, 10) - this.options.increment;
      if (this.val >= this.options.minQty || this.options.allowNegative)
        this.element.value = this.val;
    }
  };
  
  
  $.fn.qtySpinner = function(options){
    return this.each(function(){
      if (!$.data(this, "plugin_qtySpinner")){
        $.data(this, "plugin_qtySpinner", new QtySpinner(this, options));
      }
    })
  }
  
  $(function(){
    $(".ShoppingCartQtyTextbox").qtySpinner();
  });
  
})(jQuery, window, document);