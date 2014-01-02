
//use twitter's typeahead but use our autocomplete endpoint.
$(".search-box input[type=text]").typeahead({ 
  remote : {
    url : "/store/Autocomplete.aspx?q=%QUERY", 
    filter : function(res){
      var results = [];
      $.each(res, function(i, datum){
        var newDatum = {
          value : datum.Name,
          tokens : datum.Name.split(" "),
          product : datum.Type == "Product"
        }
        results.push($.extend(newDatum, datum))
      });
      return results;
    }
  },
  template : "<strong>{{Name}}</strong> {{#product}}- {{ItemNumber}} {{/product}}  - <small class='text-muted'>{{Type}}</small>", 
  engine : Hogan, 
  limit : 10
});
$(document).on("click", ".tt-suggestion", function(e){
  e.stopPropagation();
});
$(document).on("typeahead:opened typeahead:autocompleted", function(){
  $(".tt-dropdown-menu").appendTo(".search-box");
});

// used for the dropdown shopping cart "x" button. 
$(".clear-item-link").click(function (e) {
  $(this).closest(".media").find("input[type=text]").val(0).trigger("change");

  flashUpdateAttention();

  e.preventDefault();
  e.stopPropagation();
});

function flashUpdateAttention(callback) {

  $(".update-qty-link").addClass("alert alert-warning");
  $(".update-qty-link a").addClass("alert-link");

  $(".update-attention").hide().removeClass("hide").fadeIn()
  .animate({
    "margin-right": 50
  }, 250, function () {
    $(this).animate({
      "margin-right": 0
    }, 200, function () {
      $(this).animate({
        "margin-right": 25
      }, 150, function () {
        $(this).animate({
          "margin-right": 0
        }, 50, function () {
          $(this).fadeOut(2000);
        });
      });
    });
  });
}

//set placeholder text for several text boxes
$("#txtRedirectSearchBox").attr("placeholder", "Search");
$(".LoginContinueThemeButton").val("Register");
$("#txtEmailAddress").attr("placeholder", "Affiliate Code");
$("#txtPassword").attr("placeholder", "Password");
$(".EmailAddressTextbox").attr("placeholder", "Email address");
$(".PasswordTextbox").attr("placeholder", "Password");
$(".LoginContinueThemeButton").val("Register");


// quick-view modals.
$(function () {
  //modal's markup is located in the footer.
  $modal = $("#iframe-modal");
  $(document).on("click", ".quick-view", function (e) {
    $modal.find(".modal-title").text($(this).data("title"));
    $modal.find("#modal-iframe").attr("src", $(this).data("href"));
    $modal.modal();
    e.preventDefault();
  });
  $modal.on("hidden.bs.modal", function () {
    $(this).find("#modal-iframe").attr("src", "about:blank").height(400);
  })

});

if ($(".category-product").length){
  var colClasses = $.grep($(".category-product")[0].classList, function(cl) { return cl.indexOf("col-") > -1 });
  colClasses = colClasses.join(" ");
}

$(".layout-grid, .layout-list").click(function(e){
  e.preventDefault();
  $(".category-product").toggleClass(colClasses + " grid-view col-xs-12 list-view clearfix left");
  $(".category-product .thumbnail").toggleClass("col-md-4")
  $(".category-product .caption").toggleClass("center left pad-l-20 no-overflow col-md-8");
  $(this).toggleClass("icon-th icon-align-justify");
});


 // add bootstrap button classes to buttons.
 $('button, input[type=button], :submit').addClass('btn btn-default');
 $(".SignInThemeButton, .AddToCartThemeButton, .CheckoutThemeButton, .PlaceOrderThemeButton").removeClass("btn-default").addClass("btn-primary");


//We're in an iframe!!!
//do special stuff to handle stuff
if (window != window.parent) {

  //makes modals open form posts in main window instead of inside iframe. such as adding to cart from quick view.
  //set dontEscape = true on a page to make it post inside the iframe.
  if (!dontEscape)
    $("form").attr("target", "_top");

  //get rid of everything but content.
  $(".page-header").hide();
  $(".LayoutTop, .LayoutBottom, .LayoutLeftColumn, .LayoutRightColumn, p:contains(by AmeriCommerce)").hide();
  $(function(){
    $("p:contains(AmeriCommerce)").hide();
  });
  
  //set iframe height to the height of the page.
  //use window.load to ensure that images and stuff are loaded and other scripts have initialized such as the thumbnail slider
  $(window).load(function () {
    var pageHeight = $("body").height();

    //put in a try catch because sometimes the iframe is https and can't access the parent window. :( ex. login page.
    try {
      window.top.$("#modal-iframe").animate({
        "height": pageHeight,
        "opacity": 1
      }, 100);
    } catch (err) {
      $("body,html").css("overflow", "");
    }

  });
}




   //initialize AC Client API just incase anything needs it.
  AC.init({
    storeDomain: window.location.hostname
  });


   // could be uncommented to allow attribute, category, and paging links on the category pages to be ajax loaded.
  /*
        if (window.history.pushState){
          $(function(){
            bindLinks();
          });
          
          function bindLinks(){
            $(".attribute-link, .category-link, .breadcrumb a, .ProductListPaging a")
            .bind("click", function(e){
              
              //global scope variable defined in head tags.
              popState = true;
              
              
              var href = $(this).attr("href");
              
              
              loadContent(href);
              
              window.history.pushState(null, "", href);
              
              e.preventDefault();
            });
            
            window.onpopstate = function(event){
              if (popState)
                loadContent(location.href); 
            } 
          }
          
          function loadContent(href){
            var progress = $("<div class='progress progress-striped active'><div class='progress-bar' style='width:100%'></div></div>").height(0).hide();
            
            progress.prependTo(".LayoutContent");
            progress.show().animate({"height": 25}, 250);
            $.get(href, function(data){
              var div = $("<div>");
              div[0].innerHTML = data;
              $(".LayoutLeftColumnInner .Control, .LayoutContent").fadeOut(250, function(){
                
                if (div.find(".LayoutLeftColumn").length){
                  $(".LayoutLeftColumn")
                  .html(div.find(".LayoutLeftColumn").html()).fadeIn(250);
                  $(".LayoutContent")
                  .html(div.find(".LayoutContent").html()).fadeIn(250);
                } else {
                  $(".LayoutMiddle")
                  .html(div.find(".LayoutMiddle").html()).fadeIn(250);
                }
                
                $("body").animate({scrollTop: 0}, 500); 
                bindLinks();
              }); 
            });
            
            
            return false;
          }
          
        }
        */