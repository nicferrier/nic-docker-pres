/*
 simple little javascript to make org-mode presentations

 export your org-mode to HTML with this at the end:

 #+HTML: <script src="app.js"></script>

 I also go to town and use a nice stylesheet.

 Publish it with elnode with M-x elnode-make-js-server
 */

var $ = require("jquery"); window.$=$;
var util = require("util");

$(function () {
  var imgShow = function (e)  {
    var img = $("img", e);
    if (img.length > 0) {
      $("body").css(
        "background", 
        util.format("url(%s) no-repeat center center fixed", img[0].src)
      ).css(
        "background-size", "cover"
      ).css(
        "-moz-background-size", "cover"
      );
    }
    else {
      $("body").css(
        "background-color", "#339977"
      ).css("background-image", "none");
    }
  };

  var slide = function (panel) {
    $(".displayed").removeClass("displayed");
    $(panel).addClass("displayed");
    imgShow(panel);
  };

  $(window).on("popstate", function (evt) {
    $("#_org").addClass("hidden");
    var loc = document.location.hash;
    if (loc == "") {
      $(".displayed").removeClass("displayed");
      var init = $($(".outline-2")[0]);
      init.addClass("displayed");
      imgShow(init);
    }
    else {
      slide ($(loc));
    }
  });

  var nextSlide = function () {
    var toShow = $(".displayed").next();
    if (toShow[0]) {
      history.pushState(
        {}, "", 
        document.location.protocol 
          +  "//" + document.location.host
          + document.location.pathname
          + "#" + toShow.attr("id")
      );
      slide(toShow);
    }
    return false;
  };

  // Add the events for nexting

  $("body").keydown(function (evt) { 
    if (String.fromCharCode(evt.which) == " ") {
      nextSlide();
    }
    if (String.fromCharCode(evt.which) == "O") {
      var object = $(".displayed")[0]; // capture so we could toggle. maybe.
      $(".displayed").removeClass("displayed");
      $("#_org").removeClass("hidden");
    }
  });

  // Make sure we can advance in other ways
  $(".title").after("<div id=\"next\"></div>");
  $("#next").text(">").click(nextSlide);

  // Initialize
  if (document.location.hash != "") {
    slide($(document.location.hash));
  }
  else {
    var init = $($(".outline-2")[0]);
    init.addClass("displayed");
    imgShow(init);
  }

  // Pull in the org source
  var orgHref = document.location.href.replace(/#.*/, "").replace(".html", ".org");
  console.log("org href:", orgHref);
  if ($("#_org")[0] == undefined) {
    $.ajax(orgHref, {
      dataType: "text",
      success: function (data) {
        $("body").append(
          util.format(
            "<pre class=\"hidden\" id=\"_org\">%s</pre>", 
            data.replace("<", "&amp;lt;"))
        );
      }
    });
  }
});
