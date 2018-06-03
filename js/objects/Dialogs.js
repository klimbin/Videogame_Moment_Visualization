var BookmarkInput = function() {
  var self = this;
  this.dialogDiv = null;
  this.commentInput = null;
  this.callbackFunc = null;
  this.callbackArgs = null;

  this.init = function() {
    this.dialogDiv = document.getElementById('bookmarkInputDiv');
    this.commentInput = document.getElementById('bookmarkComment');
    this.commentInput.addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
          document.getElementById("bookmark_commit").click();
      }
    });
  }

  this.init();

  this.showDialog = function(callbackFunction, objName, comment) {
    this.dialogDiv.style.display = "block";

    if (comment != undefined && comment.length > 0) {
      this.commentInput.value = comment;
    } else {
      this.commentInput.value = '';
    }

    this.callbackFunc = callbackFunction;
    this.callbackArgs = objName;
    this.commentInput.focus();
  }

  this.dialogReturned = function() {
    this.dialogDiv.style.display = "none";
    comment = this.commentInput.value;

    this.callbackFunc(this.callbackArgs, comment);
    g_dialogVisible = false;
  }

  this.dialogCancelled = function() {
    this.dialogDiv.style.display = "none";
    g_dialogVisible = false;
  }
}
