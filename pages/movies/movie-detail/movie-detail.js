// pages/movies/more-detail/more-detail.js
import { Movie } from "class/Movie.js";
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id;
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    var movie = new Movie(url);
    var that = this;
    // movie.getMovieData(function (movie) {
    //   that.setData({
    //     movie: movie
    //   })
    // })
    movie.getMovieData((movie) => {
      that.setData({
        movie: movie
      })
    })
  },


  onShareAppMessage: function () {
    var title = this.data.movie.title;
    var movieid = this.data.movie.movieid;

    return {
      title: title,
      path: '/pages/movies/movie-detail/movie-detail?id=' + movieid,
    }
  },

  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src],
    })
  },

  viewMovieCastImg: function (e) {
    var src = e.currentTarget.dataset.castsrc;
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src],
    })
  },

  processDoubanData: function (data) {
    // if(data){
    //   return "";
    // }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    console.log(movie)
    this.setData({
      movie: movie
    })
  }

})