$(".ProductDetailsQuantityPriceTable").addClass("table");
$(function () {
    //modal's markup is located in the footer.
    $modal = $("#iframe-modal");
    $("a[href*=WriteReview]").click(function (e) {
        $modal.find(".modal-title").text("Write a Review");
        $modal.find("#modal-iframe").attr("src", $(this).attr("href") + "&PreviewLayoutName=WriteReviewModal");
        $modal.modal();
        e.preventDefault();
    });
    $(".estimate-shipping").click(function (e) {
        $modal.find(".modal-title").text("Estimate Shipping");
        $modal.find("#modal-iframe")
            .attr("src", $(this).attr("href") + "&qty=" + $("#txtQuantity").val());
        $modal.modal();
        e.preventDefault();
    });

    $modal.on("hidden.bs.modal", function () {
        $(this).find("#modal-iframe").attr("src", "about:blank");
    })
});


$(".main-product-photo").zoom({
    url: $(".main-product-photo").attr("href"),
    on: "mouseover",
    duration: 250
});

$(".product-thumbnails").bxSlider({
    minSlides: 2,
    maxSlides: 4,
    moveSlides: 1,
    mode: 'horizontal',
    slideWidth: 75,
    slideMargin: 20
});

$(document).delegate(".product-thumbnails a", "click", function (e) {
    var href = $(this).attr("href");
    $(".product-thumbnails a").removeClass("active");
    $(this).addClass("active");
    $(".main-product-photo").attr("href", href);
    $(".main-product-photo img, .big-image img").attr("src", href);
    e.preventDefault();
    e.stopPropagation();
});

$(".main-product-photo").click(function (e) {
    var href = $(this).attr("href");
    var div = $("<div>", {
        "class": "big-image"
    }).css({
        "position": "fixed",
        "display": "none",
        "top": 0,
        "bottom": 0,
        "left": "0",
        "right": "0",
        "text-align": "center",
        "background": "rgba(0,0,0,0.5)",
        "line-height": $(window).height() + "px",
        "width": "100%",
        "height": "100%",
        "cursor": "pointer",
        "z-index": 99999
    });


    var thumbdiv = div.clone();
    thumbdiv.attr("class", "big-image-thumbs").css({
        "top": "",
        "height": "",
        "background": "",

        "z-index": 100000
    }).fadeTo(100, 0.25).bind("mouseenter", function () {
        $(this).fadeTo(250, 0.9);
    }).bind("mouseleave", function () {
        $(this).fadeTo(250, 0.25);
    });
    var thumbs = $(".product-thumbnails").clone();

    thumbs.appendTo(thumbdiv);
    thumbs.bxSlider({
        minSlides: 2,
        maxSlides: 4,
        moveSlides: 1,
        mode: 'horizontal',
        slideWidth: 75,
        slideMargin: 20,
        pager: false
    });


    var bigImg = $("<img>", {
        "src": href
    }).css({
        "vertical-align": "middle",
        "max-width": "100%",
        "max-height": "100%"
    }).removeAttr("width").removeAttr("height").appendTo(div);


    // from this point down, using $which and whichWindow in place of $ and window.
    // this is for when the product is opened in an iframe (such as a quickview) it will open the zoomed image in the main page.
    var $which = $;
    var whichWindow = window;
    if (window != window.parent) {
        //window.top.$("body").append(thumbdiv)
        div.fadeIn();
        window.top.$("body").append(div)
        $which = window.top.$;
        whichWindow = window.top;
    } else {
        thumbdiv.appendTo("body");
        div.appendTo("body").fadeIn();

    }


    $which(window.top).bind("click.closezoom keydown.closezoom", function (e) {
        if (e.type === "keydown" && e.which != 27 || e.target == ".product-thumbnails a" || e.target.className.indexOf("bx") != -1)
            return;

        div.fadeOut(function () {
            div.remove();
            thumbdiv.remove();
        });
        thumbdiv.fadeOut();
        $which(whichWindow).unbind("click.closezoom keydown.closezoom");
        return false;
    }).resize(function () {
        $which(".big-image").css({
            "line-height": $which(window.top).height() + "px",
            "cursor": "pointer"
        });
    });
    e.preventDefault();
    e.stopPropagation();
});