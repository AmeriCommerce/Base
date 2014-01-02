/* 
*  checkout.js
*  -----------------
*  contains functionality related to the checkout page in the Base/DejaVu themes
*/

// grab an instance of the .NET page request manager. This allows us to re-run functions after .NET Update Panels refesh and such.
var prm = Sys.WebForms.PageRequestManager.getInstance();

// run at DOM ready.
$(function () {
  // grab the same prm as before
  var prm = window.prm || Sys.WebForms.PageRequestManager.getInstance();

  // focused input will attempt to refocus an input after a partial page update.
  window.focusedInput = undefined;

  // keeps track of the custom payment method selected in order to make the "accordionized" selection work right with them.
  window.selectedCustomPayment = undefined;

  // keeps track of where the page was scrolled to when a partial refresh happens.
  window.lastTop = 0;

  // keeps track of the height of the checkout page, this varies as the page grows and shrinks
  window.checkoutHeight = 0;
  window.checkoutOffset = 0;

  // assign the currently focused item to the focusedInput global.
  var grabFocusedInput = function () {
    focusedInput = $(":focus");
  };

  // this function will run at page load and anytime a partial refresh happens.
  // if you are changing things on the checkout page via javascript they need to go here (or atleast get called from here)
  var checkoutEvents = function () {
    // rescroll the window to the last point stored.
    setTimeout(function(){
      if (window.lastTop > 0)
        $(window).scrollTop(window.lastTop);
    }, 1);

    // set the checkout height whenever the page changes
    window.checkoutHeight = $(".checkout").outerHeight();
    window.checkoutOffset = $(".checkout").offset().top;

    // grab the shopping cart totals and append them to the side bar.
    var totals = $(".main-totals-area").clone();
    $(".side-totals-area").html(totals.html());

    // make the "what's this" link on the CVV open as a modal.
    $(".ExplainCVVText").addClass("quick-view").data("title", "What is CVV?").data("href", $(".ExplainCVVText").attr("href"));

    //trigger input events.
    triggerInputs();

    // turn the payments dropdown into a fancy "accoridionized" section.
    var paymentSelect = $(".payment-select select");
    // shows predefined divs based on the "paymenttype" attribute set on the <option>. then the string is used as a class name for the element to find.
    paymentSelect.find("option").each(function () {
      var paymentType = $(this).attr("paymenttype");
      if (paymentType)
        $("." + paymentType).removeClass("hide");
      if (!paymentType && $(this).val() == "-2")
        $(".NoPaymentDue").removeClass("hide");
    });

    // activate the selected method.
    var selectedType = paymentSelect.find("option:selected").attr("paymenttype");
    if (selectedType) {
      $("." + selectedType).addClass("active");
    }
    // hide the default select box after wards.
    $(".payment-method-select").hide();

    // lots of interesting stuff required to make custom payments work in the same fashion.
    var customMethods = paymentSelect.find("option").filter(function (i, el) {
      return $(el).attr("paymenttype") == "Custom";
    });

    // this keeps the same methods from getting repeated over and over.
    $(".CustomPayments .payment-method").remove();

    // custom payments need to use the payment name instead of the paymenttype since all of them have the "Custom" type.
    customMethods.each(function () {
      var paymentName = $(this).attr("paymenttypename");

      // build a payment-method section that is the same as the defaults.
      var paymentMethod = $("<div class='payment-method Custom' data-payment-name='" + paymentName + "'>");
      var panel = $("<div class='panel pad-20'>");
      panel.html("<div data-payment-name='" + paymentName + "' class='payment-name custom-payment-name h4 bold'> " + paymentName + " </div><div class='payment-wrapper'></div>");
      panel.appendTo(paymentMethod);
      $(".CustomPayments").append(paymentMethod);
    });

    // activate the selected custom payment method's area
    if (window.selectedCustomPayment) {
      // the custom payment method's fields will render in this area by default when the page partially reloads
      // we'll grab this in order to insert it into the correct area.
      var paymentFields = $(".ActiveCustomPayment").html();
      $(".payment-method.Custom[data-payment-name='" + window.selectedCustomPayment + "']")
        .addClass("active")
        .find(".payment-wrapper").html(paymentFields);
    }

    // add bootstrap button classes.
    $("input[type=button], input[type=submit]").addClass("btn btn-default");

    //console.log(focusedInput);
    //if (focusedInput)
    //  focusedInput.focus();
  };

  // makes sure the sliding form label functionality works initially for prefilled form fields.
  var triggerInputs = function () {
    $("input[type=text], input[type=password], textarea").trigger("blur");
    $("#txtPassword1, #txtPassword2").attr("placeholder", "");
  };

  // event handler for form inputs to make the labels "slide"
  var labelHandler = function (e) {
    var el = e.target;
    var label = $(el).closest("label");
    var eventType = e.type;

    // the animations are handled with CSS. 
    if (eventType == "focusin") {
      label.addClass("active");
      focusedInput = $(el);
    } else if (eventType == "focusout") {
      label.removeClass("active");

      if (el.value != "") {
        label.addClass("filled");
      } else {
        label.removeClass("filled");
      }
    }
  };

  // event handler for when a payment method is clicked.
  var handlePaymentSwitch = function (e) {
    var el, paymentType, val, paymentSelect = $(".payment-select select");

    // if we call it manually there is no event.
    if (typeof e != "undefined"){
      var el = e.target;
      var paymentType = $(el).data("payment-name");
      window.lastTop = $(window).scrollTop();
    } else {
      paymentType = paymentSelect.find("option:selected").attr("paymenttype");
    }

    // don't trigger if a button inside the payment method area was clicked
    // also logic for handling standard vs custom payment methods.
    if (el && $(el).not(":button")){
      if (!$(el).hasClass("custom-payment-name") && paymentType != "Custom") {
        val = paymentSelect.find("[paymenttype='" + paymentType + "']").val();
      } else {
        if (paymentType != "Custom"){
          val = paymentSelect.find("[paymenttypename='" + paymentType + "']").val();
        } else {
          val = paymentSelect.val();
          paymentType = paymentSelect.find("option:selected").attr("paymenttypename");
        }
        window.selectedCustomPayment = paymentType;
      }
      paymentSelect.val(val).change();

      // it was called manually, run the checkout events.
      if (!el)
        checkoutEvents();
    }
  };

  // make right side totals area "sticky"
  var floatingTotals = $(".floating-totals");
  var floatingTotalsPanel = floatingTotals.find(".panel");
  var win = $(window);
  var topMargin = 20;
  positionTotals = function(){

    // set the checkout height whenever the page changes
    var div = $("<div class='col-sm-3'>")
    div.appendTo(".checkout");
    var w = div.width();
    div.remove();
    floatingTotalsPanel.outerWidth(w);
    window.checkoutHeight = $(".checkout").outerHeight();
    window.checkoutOffset = $(".checkout").offset().top;

    var winTop = win.scrollTop();
    floatingTotals.css({"position":"relative", "bottom":""});
    if (winTop > floatingTotals.offset().top && win.width() > 768){
      if (winTop < (window.checkoutHeight + window.checkoutOffset - floatingTotalsPanel.outerHeight() - topMargin)){
        floatingTotalsPanel.css({
          "position" : "fixed",
          "top" : 0,
          "margin-top": topMargin
        });
        floatingTotals.parent().css("position", "relative");
      } else {
        floatingTotalsPanel.css({
          "position" : "static"
        });
        floatingTotals.css({
          "position" : "absolute",
          "bottom" : 0
        });
        floatingTotals.parent().css("position", "static");
      }
    } else {
      floatingTotalsPanel.css({"position" : "static", "width" : ""});
    }
  };

  // add our methods to the page request manager.
  // this makes the methods run anytime a partial page refresh happens
  prm.add_beginRequest(grabFocusedInput);
  prm.add_endRequest(checkoutEvents);

  // attach events
  $(".checkout")
    .on("focus blur change", "textarea, input[type=text], input[type=password]", labelHandler)
    .on("focus", "select", function (e) {
      focusedInput = $(e.target);
    });
  $(document).on("click", ".payment-name, .payment-name *", handlePaymentSwitch);
  $(window).on("scroll resize", positionTotals).trigger("scroll resize");
  $(document).on("click", ".remove-payment input", function(e){ e.stopPropagation() });
  // run events at page load.
  setTimeout(handlePaymentSwitch, 75);
  setTimeout(checkoutEvents, 100);
});