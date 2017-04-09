var postsData = require("../../../data/posts-data.js")
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {

        var postId = option.id;
        var postData = postsData.postList[postId];
        this.data.currentPostId = postId;
        this.setData({
            postData: postData
        });

        //wx.setStorageSync('key', "风暴英雄")


        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            // this.data.isPlayingMusic = true;
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor();

    },

    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            })
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },

    onCollectionTap: function (event) {
        this.getPostsCollectedSyc();
        //    this.getPostsCollectedAsy();
    },

    getPostsCollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: "posts_collected",
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },

    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },

    // showModal: function (postsCollected, postCollected) {
    //     var that = this;
    //         wx.showModal({
    //             title: "收藏",
    //             content: postCollected?"收藏该文章？":"取消收藏该文章？",
    //             showCancel: "true",
    //             cancelText: "取消",
    //             cancelColor: "#333",
    //             confirmText: "确认",
    //             confirmColor: "405f80",
    //             success: function (res) {
    //                 if (res.confirm) {
    //                     wx.setStorageSync('posts_collected', postsCollected);
    //                     that.setData({
    //                         collected: postCollected
    //                     })
    //                 }
    //             }
    //         })
    // },

    showToast: function (postsCollected, postCollected) {
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })



    },

    onShareTap: function (event) {
        var itemList = [
            "分享到朋友圈",
            "分享到微信好友",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
                })
            }
        })
    },
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var isPlayingMusic = this.data.isPlayingMusic;
        var postData = postsData.postList[currentPostId];
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            })
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            })
            this.setData({
                isPlayingMusic: true
            })
        }


    }



})