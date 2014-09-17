// overcome Timeline's stupid jQuery loading
var $blueline = $.noConflict();
$blueline(document).ready(function() {
  var $ = $blueline;
  function navSmartScroll($destination) {
    var offset = $(".navbar").height() || 0,
        scrollTop = $destination.offset().top - 30;
    $("body,html").animate({scrollTop: scrollTop}, 350);
  }

  // Navbar scrollTo
  $(".navbar .nav a, [data-scroll='true']").click(function (e) {
    var $target = $(this)
      , href = $target.attr("href")
      , hash = href.substring(href.lastIndexOf('/') + 1)
      , $destination = $(hash);

    navSmartScroll($destination);

    return false;
  });

  // More Options
  $(".show-options").click(function (e) {
    $(this).hide();

    $(".more-options").slideDown();

    return false;
  });
 
  $("#font-preview-trigger").popover()
 
  // Preview
  $("#iframe-preview-button").click(function () {
    var $embed = $("#preview");

    $embed.show();
    $("body,html").animate({scrollTop: $embed.offset().top - 60}, 250);
  });



  // Embed Generator
  updateEmbedCode();
  $("#embed_code").click(function() { $(this).select(); });
  $('#embed-width').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-wordpressplugin').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-font').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-height').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-maptype').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-googlemapkey').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-source-url').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-language').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-startatend').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-hashbookmark').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-startatslide').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-startzoomadjust').change(function(evt) { updateEmbedCode(evt); });
  $('#embed-debug').change(function(evt) { updateEmbedCode(evt); });

  $('.collapse').on('show',function(e) {
    window.location.hash = "show-" + $(this).attr('id');
  })

  if (window.location.hash.match(/#show-/)) {
    var $target = $("#" + window.location.hash.substr(6));
    $target.collapse('show');
    navSmartScroll($target.prev());
  }
});
