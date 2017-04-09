var postsData = require("../../data/posts-data.js")

Page({
  data: {

  },


  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log(postsData.postList);
    this.setData({
      posts_key: postsData.postList

    });


  },

  onShareAppMessage: function () {
    var title = this.data.title;

    return {
      title: "文与字",
      path: '/pages/posts/post',
    }
  },

  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    //console.log("on post id is " + postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid;
    //console.log("on post id is " + postId);
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }


})