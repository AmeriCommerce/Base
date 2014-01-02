   //in an  iframe, hide scroll bar.
  if (window != window.parent) $("body,html").css("overflow", "hidden");

   //global scope variable to keep popstate from firing on a normal page load.
  var popState = false;

   //global scope variable to allow certain modal pages to not post out to the parent.
  var dontEscape = false;


   //modification to the way bootstrap dropdowns work. this makes them work on hover at normal rez and on click/touch on phone/tablet
  $(function () {
      var $win = $(window);
      $win.resize(function () {
          if ($win.width() > 768)
              $(".navbar-nav > .dropdown > a").attr("data-toggle", "");
          else
              $(".navbar-nav > .dropdown > a").attr("data-toggle", "dropdown");
      }).resize();
      $(".dropdown-menu").find("input, button").each(function () {
          $(this).click(function (e) {
              e.stopPropagation();
          });
      });
  });