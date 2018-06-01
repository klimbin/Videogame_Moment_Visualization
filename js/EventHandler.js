var lastClickedTime = null;
var highlighted = null; //current hightlighted object when mouseover

var input = document.getElementById("moment_id");
// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  //event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    document.getElementById("moment_button").click();
  }
});

function onMouseDown(event) {
  //event.preventDefault();
  lastClickedTime = performance.now();
  document.getElementById("moment_id").blur();
}
function onMouseUp(event) {
  //event.preventDefault();
  if (!g_isFlying) {
    //if it's a drag, do nothing;
    if (performance.now() - lastClickedTime > 200)
    {
      return;
    }
    // update the mouse position
  	mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  	mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;

    //var startingTime = performance.now();
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( Object.values(spriteManager.interactionObjects), true );
    //console.log('DEBUGGING: Ray Cast - ' + (performance.now() - startingTime)); startingTime = performance.now();
    resetVisibleLabels();
    resetSprites();
    // console.log('DEBUGGING: Resets   - ' + (performance.now() - startingTime));
    // if there is one (or more) intersections
  	if ( intersects.length > 0 )
  	{
      g_autoRotate = false;
	    ///////////////////////////////////////////////////Chris's Code
      audioManager.playSound(audioManager.soundOnClick); //Sound for Clicking
	    ////////////////////////////////////////////////
      var intersectedObj = intersects[0].object;
      labelManager.showNearbyLabels(Number(intersectedObj.name), ADJACENT_MOMENTS, true);
      urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
      g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  	} else {
      //controls.g_autoRotate = true;
      g_currentTarget = null;
      g_lastSelected.object = null;
      g_autoRotate = true;
      urlManager.updateURL(URLKeys.MOMENT, null);
      //console.log('Nothing got clicked');
    } //end of intersect.length > 0
  } // end of g_isFlying
}

function onMouseMove(event) {
  //event.preventDefault();
  // update the mouse position
  mouse.x = ( event.clientX / window.innerWidth ) * 2.0 - 1.0;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2.0 + 1.0;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( Object.values(spriteManager.interactionObjects), true );
  // if there is one (or more) intersections
  if ( intersects.length > 0 )
  {
    resetHightLight();
    highlighted = intersects[0].object;
    highlighted.material.color.setHex( 0x10ffff );
  } else {
    resetHightLight();
  }
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function resetHightLight() {
  if (highlighted != null)
  {
    highlighted.material.color.setHex( 0xffffff );
  }
}
function resetSprites(){
  for (var corpusname in spriteManager.spriteGroups)
  {
    resetSpritesInCorpus(corpusname);
  }
}
function resetSpritesInCorpus(corpus){
  //if (document.getElementById(corpus + "_check").checked){
  if (corpus in spriteManager.interactionObjects){
    for (var i = 0; i < spriteManager.spriteGroups[corpus].children.length; i++)
    {
      spriteManager.spriteGroups[corpus].children[i].material.opacity = 1.0;
      spriteManager.spriteGroups[corpus].children[i].visible = true;
    }
  }
}
function resetVisibleLabels(){
  cameraManager.clearVisibleLabels();
}
function resetLines(){
  if (g_lastSelected.line != null)
  {
    scene.remove(g_lastSelected.line) ;
    g_lastSelected.line = null;
  }
}
function resetBookmakrs() {
  for (bookmark in bookmarkList) {

  }
}

function onKeydown(event){
  // should check if selected item is part of some object
  if (g_lastSelected.object != null && (event.key == '.' || event.key == '>')){
    if (g_currentTarget >= Object.keys(spriteManager.spriteDictionary).length - 1)
    {
      return;
    }
    g_autoRotate = false;
    ////////////////////////////////////////////////////////////Chris's Code
    audioManager.playSound(audioManager.soundOnNext); //sound for next page
  	//////////////////////////////////////////////////////////////////////
    g_currentTarget += 1;
    labelManager.showNearbyLabels(g_currentTarget, 5, false);
    urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
    g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  } else if (g_lastSelected.object!= null && (event.key == ',' || event.key == '<')){
    if (g_currentTarget == 0)
    {
      return;
    }
    g_autoRotate = false;
    ////////////////////////////////////////////////////////////Chris's Code
    audioManager.playSound(audioManager.soundOnNext); //sound for next page
	  ////////////////////////////////////////////////////////////Chris's Code
    g_currentTarget -= 1;
    labelManager.showNearbyLabels(g_currentTarget, 5, false);
    urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
    g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  }
}
function onKeyup(event){

}

function onMomentInput(event) {
  //Equivalent to clicking on a moment sprite
  var inputMomentId = document.getElementById("moment_id");
  inputMomentId.blur();
  var momentId = Number(inputMomentId.value);
  g_autoRotate = false;
  resetVisibleLabels();
  resetSprites();
  g_currentTarget = momentId;
  labelManager.showNearbyLabels(momentId, ADJACENT_MOMENTS, true);
  urlManager.updateURL(URLKeys.MOMENT, momentId);
  audioManager.playSound(audioManager.soundOnClick);//Sound for Clicking
  g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
}

//Save a new bookmark
function onBookmarking(event) {
  if (g_lastSelected.object != null && (event.key == 'b')){
    bookmarkManager.addBookmark(Number(g_lastSelected.object.name));
    urlManager.updateURL(URLKeys.BOOKMARK, bookmarkManager.getBookmarks());
  }
}
//Retrieve moment by bookmark
function onReadBookmark(event) {
  if (event.key == '_' || event.key == '-' ){
    var momentId = bookmarkManager.getLastBookmark();
  }
  else if (event.key == '+' || event.key == '=' ){
    var momentId = bookmarkManager.getNextBookmark();
  }
  if (momentId != null){
    g_autoRotate = false;
    g_currentTarget = Number(momentId);
    labelManager.showNearbyLabels(g_currentTarget, ADJACENT_MOMENTS);
    urlManager.updateURL(URLKeys.MOMENT, g_currentTarget);
    audioManager.playSound(audioManager.soundOnNext); //sound for next page
    g_lastSelected.object = spriteManager.spriteDictionary[g_currentTarget].object;
  }
}

//////////////////////////////////////////////Chris's code
function myKeyDown(event){
	event = event || window.event;
	switch(event.keyCode){
		case 87:
			moveFoward = true;
			break;
		case 83:
			moveBackward = true;
			break;
		case 65:
			turnLeft = 1;
			break;
 		case 68:
			turnRight = 1;
			break;
		case 82:
			turnUp = 1;
			break;
		case 70:
			turnDown = 1;
			break;
	}
	updateRotation();
};

function myKeyUp (event){
  event = event || window.event;
		switch(event.keyCode){
		case 87:
			moveFoward = false;
			break;
		case 83:
			moveBackward = false;
			break;
		case 65:
			turnLeft = 0;
			break;
 		case 68:
			turnRight = 0;
			break;
		case 82:
			turnUp = 0;
			break;
		case 70:
			turnDown = 0;
			break;
	}
	updateRotation();
};

function updateRotation(){
	rotationVector.x = ( - turnDown + turnUp );
	rotationVector.y = ( - turnRight + turnLeft );
	//update the rotation's direction
};
function resizeTimeline(){
  // var elem = $('#timelineNonDate');
  // elem.html('');
  timeline_width = $( '.timeline-wrapper' ).width();
  console.log('timeline_width:' + timeline_width);
  for (tm in timelineData) {
    var id = "#timeline-" + corpus;
    var elem = $(id);
    elem.html('');
    var timeline = TimeKnots.draw(id, timelineData[tm], {dateDimension:false, color: "#7575a3", width:timeline_width, height: '50', showLabels: true, labelFormat: "%Y",lineWidth:2});
  }
}
