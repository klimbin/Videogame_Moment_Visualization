function BookmarkManager() {
  this.bookmarkList=[];
  this.bookmarksDict={};
  this.numberOfPages=0;
  this.currentPage=0;

  this.addBookmark = function(momentId) {
    if (!this.bookmarksDict.hasOwnProperty(momentId)){
      this.numberOfPages += 1;
      this.currentPage = this.numberOfPages - 1;
      this.bookmarksDict[momentId] = this.numberOfPages-1;
      this.bookmarkList[this.numberOfPages-1] = momentId;
    }
    addTimeline(momentId);
  }
  this.getLastBookmark = function() {
    this.momentId = null;
    if (this.currentPage > 0){
      this.currentPage -= 1;
    }
    if (this.currentPage < 0) {
      this.currentPage = 0;
    } else {
      this.momentId = this.bookmarkList[this.currentPage];
    }
    return this.momentId;
  }
  this.getNextBookmark = function() {
    this.momentId = null;
    if (this.currentPage < this.numberOfPages-1)
    {
      this.currentPage += 1;
    }
    if (this.currentPage > this.numberOfPages-1) {
      this.currentPage = this.numberOfPages-1;
    } else {
      this.momentId = this.bookmarkList[this.currentPage];
    }
    return this.momentId;
  }
  this.showBookmarkLabels = function() {
    if (this.bookmarkList.length == 0){
      return;
    }
    g_currentTarget = this.bookmarkList[0];
    for (var i= this.bookmarkList.length-1; i>= 0; i--){
      labelManager.showNearbyLabels(this.bookmarkList[i], 0, true);
    }
  }
  this.hideBookmarkLabels = function() {
    for (var key in this.bookmarksDict){
      labelManager.removeLabelFromScene(key);
    }
  }
  this.getBookmarks = function() {
    return this.bookmarkList;
  }
}
