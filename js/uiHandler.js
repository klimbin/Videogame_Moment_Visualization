function showPage() {
  $("#loading-scene").fadeOut(1000);
  document.getElementById("container").style.display = "block";
  //document.getElementById("float_div").style.display = "block";
  document.getElementById("top_bar").style.display = "block";
  document.getElementById("bottomright-bar").style.display = "block";
}

function addGameInfo(game) {
  $('#game-info').text(game);
}
function addCorporaButtons(){
  var idx = 0;
  for (corpus in spriteManager.spriteGroups){
    var id = corpus + "-btn";
    var wrapper = id + "-wrapper";
    $('#corpora_bar').prepend("<div id='" + wrapper + "'></div>");
    $('#' + wrapper).prepend("<button class='button-sm button-sm-clicked' id='" + id + "' onclick='onShowCorpus(this.id)'>" + corpus + "</button>");
    height = 5;
    gap = 5;
    pct = gap + (gap+height)*idx;
    $('#' + wrapper).css("position", "absolute");
    $('#' + wrapper).css("top", pct+"%");
    $('#' + wrapper).css("left", "15%");
    $('#' + wrapper).css("width", "70%");
    $('#' + wrapper).css("height", height+"%");
    $('#' + id).css("position", "absolute");
    $('#' + id).css("height", "100%");
    $('#' + id).css("width", "100%");
    idx ++;
  }
}
function onShowCorporaBar(id) {
  var isClicked = $('#' + id).hasClass("button-clicked");
  if (isClicked) {
    //document.getElementById("float_div").style.display = "none";
    document.getElementById("corpora_bar").style.display = "none";
    $('#corpora-btn').switchClass('button-clicked', 'button','fast');
  } else {
    //document.getElementById("float_div").style.display = "block";
    document.getElementById("corpora_bar").style.display = "block";
    $('#corpora-btn').switchClass('button', 'button-clicked','fast');
  }
}
function onShowBookmarkBar(id){
  var isBkmkBtnClicked = $('#' + id).hasClass("button-clicked");
  if (isBkmkBtnClicked) {
    $('#bookmark-btn').switchClass('button-clicked', 'button','fast');
    //bookmarkManager.hideBookmarkLabels();
    //Add time div
    document.getElementById("timeline-wrapper").style.display = "none";
  } else {
    $('#bookmark-btn').switchClass('button', 'button-clicked','fast');
    //bookmarkManager.showBookmarkLabels();
    //Hide time div
    document.getElementById("timeline-wrapper").style.display = "block";
  }
}
function onShowCorpus(id){
  var group = id.substr(0, id.lastIndexOf("-btn"));
  var isCorpusBtnClicked = $('#' + id).hasClass("button-sm-clicked");
  if ( isCorpusBtnClicked ) {
    $('#' + id).switchClass('button-sm-clicked', 'button-sm','fast');
    //Hide corpus
    spriteManager.toggleSpriteGroup(group, false);
    spriteManager.toggleGroupRaycasting(group,false);
  } else {
    $('#' + id).switchClass('button-sm', 'button-sm-clicked','fast');
    //Show corpus
    spriteManager.toggleSpriteGroup(group, true);
    spriteManager.toggleGroupRaycasting(group,true);
  }
}
function onShowAnimationBar(id) {
  var isAnimationBtnClicked = $('#' + id).hasClass("button-clicked");
  if ( isAnimationBtnClicked ) {
    $('#' + id).switchClass('button-clicked', 'button','fast');
    document.getElementById("animation_bar").style.display = "none";
  } else {
    $('#' + id).switchClass('button', 'button-clicked','fast');
    document.getElementById("animation_bar").style.display = "block";

  }
}

//Make the DIV element draggagle:
dragElement(document.getElementById(("animation_bar")));
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function onPlay(id) {
  if (id == "playpause-btn") {
    startId = Number(document.getElementById('startId').value);
    stopId = Number(document.getElementById('stopId').value);
    element = document.getElementById('playpause');
    if ( element.innerText == "play_circle_outline") {
      element.innerText = "pause_circle_outline";
      //pause animation
      animationPlaying = false;
    } else {
      element.innerText = "play_circle_outline";
      //play animation
      animationPlaying = true;
    }
  }
}
function animation(startId, stopId) {
  autoRotate = false;
  for (var i = startId; i <= stopId; i++) {
    if (animationPlaying) {
      labelManager.showNearbyLabels(i, 0);
      urlManager.updateURL(URLKeys.MOMENT, i);
    }
  }
}

// var timelineData = [
// {"value": 0, "name": "Start", radius: "7"},
// {"value": 4500, "name": "End", radius: "7"}];
var timelineData = {};
function addTimelineDivs(){
  //<div class = "timeline" id="timelineNonDate" style="display:none;"></div>
  css_class = 'timeline';
  text_class = 'timeline-text';
  timeline_number = Object.keys(spriteManager.spriteGroups).length;
  if (timeline_number == 1) {
    div_height_pct = 50;
  } else {
    div_height_pct = 100.0 /timeline_number;
  }

  var idx = 0;
  for (corpus in spriteManager.spriteGroups){
    var pct = idx * div_height_pct;
    var id = "timeline-" + corpus;
    var text_id = id + "-textbox";
    $('#timeline-wrapper').prepend("<div id='" + text_id + "', class='" + text_class + "'>" + corpus + "</div>");
    $('#' + text_id).css("position", "absolute");
    $('#' + text_id).css("bottom", pct+"%");
    $('#' + text_id).css("height", div_height_pct+"%");

    $('#timeline-wrapper').prepend("<div id='" + id + "', class='" + css_class + "'></div>");
    $('#' + id).css("position", "absolute");
    $('#' + id).css("bottom", pct+"%");
    $('#' + id).css("height", div_height_pct+"%");
    idx++ ;
  }
}
function createTimeline(){
  timeline_width = $( '.timeline-wrapper' ).width()* 0.9;
  for (corpus in spriteManager.spriteGroups) {
    if (!timelineData.hasOwnProperty(corpus)){
      var id = "#timeline-" + corpus;
      var elem = $(id);
      elem.html('');
      start = 0;
      stop = spriteManager.spriteGroups[corpus].children.length-1;
      start_spriteId = Number(spriteManager.spriteGroups[corpus].children[start].name);
      stop_spriteId = Number(spriteManager.spriteGroups[corpus].children[stop].name);

      timelineData[corpus] = [{"value": start, "name": spriteManager.spriteDictionary[start_spriteId].game + " " + spriteManager.spriteDictionary[start_spriteId].corpus, img: spriteManager.spriteDictionary[start_spriteId].image, radius: "6", momentId: start_spriteId},
      {"value": stop, "name": spriteManager.spriteDictionary[stop_spriteId].game + " " + spriteManager.spriteDictionary[stop_spriteId].corpus, img: spriteManager.spriteDictionary[stop_spriteId].image, radius: "6", momentId: stop_spriteId}];
      TimeKnots.draw(id, timelineData[corpus], {dateDimension:false, color: "#7575a3", width:timeline_width, height: '50', showLabels: true, labelFormat: "%Y",lineWidth:2});
    }
  }
}
function addTimeline(momentId){
  timeline_width = $( '.timeline-wrapper' ).width()* 0.9;
  corpus = spriteManager.spriteDictionary[momentId].corpus;
  momentIndex = spriteManager.spriteDictionary[momentId].momentIndex;
  timelineData[corpus].push({"value": momentIndex, "name": spriteManager.spriteDictionary[momentId].game + " " + spriteManager.spriteDictionary[momentId].corpus, img: spriteManager.spriteDictionary[momentId].image,radius: "3", momentId: momentId});
  for (corpus in spriteManager.spriteGroups) {
    var id = "#timeline-" + corpus;
    var elem = $(id);
    elem.html('');
    //timelineData[corpus].push({"value": spriteManager.spriteDictionary[momentId].momentIndex, "name": spriteManager.spriteDictionary[momentId].game + " " + spriteManager.spriteDictionary[momentId].corpus, img: spriteManager.spriteDictionary[momentId].image,radius: "3"});
  	var timeline = TimeKnots.draw(id, timelineData[corpus], {dateDimension:false, color: "#7575a3", width:timeline_width, height: '50', showLabels: true, labelFormat: "%Y",lineWidth:2});
  }
}

function deleteTimeline(selectedObject){
	console.log("deleted");
	var momentId = Number(selectedObject.name);
  var corpus = spriteManager.spriteDictionary[momentId].corpus;
	var imglink = spriteManager.spriteDictionary[momentId].image;
	timelineData[corpus] = timelineData[corpus].filter(function(object) {
		return object.img !== imglink;
	});
  // var elem = $('#timelineNonDate');
  // elem.html('');
  timeline_width = $( '.timeline-wrapper' ).width() * 0.9;
  for (corpus in spriteManager.spriteGroups) {
    var id = "#timeline-" + corpus;
    var elem = $(id);
    elem.html('');
	  var timeline = TimeKnots.draw(id, timelineData[corpus], {dateDimension:false, color: "#7575a3", width:timeline_width, height: '50', showLabels: true, labelFormat: "%Y",lineWidth:2});
  }
}
