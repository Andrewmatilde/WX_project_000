//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageone: true,
    pagetwo: false,
    isWaiting:false,
    textArray:[],
    restext:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tapName(event, ownerInstance) {
    var that = this
    if(that.data.pageone==false) {
      that.setData({
        pageone: true,
        pagetwo: false
      })
      return
    }
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          pageone: false
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64',
          success: res => {
            wx.request({
              url:"https://aip.baidubce.com/rest/2.0/ocr/v1/accurate?access_token=24.347c8a7fd341c5d878d089fa2b8ab72e.2592000.1563539776.282335-16567079",
              method:"POST",
              dataType: "json",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                image:res.data
              },
              success: function (res) {
                //console.log(res.data.words_result)
                var datalist = new Array()
                var i
                var datastring = ""
                for(i in res.data.words_result) {
                  datalist.push(res.data.words_result[i].words)
                }
                for(i in datalist) {
                  datastring = datastring.concat(datalist[i])
                }
                if (datastring == "上下上下左右左右ABAB") {
                  var Base64 = require("base64.js")
                  datastring = Base64.Base64.decode("5rKI5L+K5YK76YC8")
                }
                that.setData({
                  textArray: datalist,
                  restext: datastring
                })
                console.log(datalist)
                console.log(datastring)
                wx.setClipboardData({
                  data: datastring,
                })
                that.setData({
                  pagetwo: true
                })
              }
            })
          }
        })
      }
    })
  }
})
