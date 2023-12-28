// pages/missionpage/missionpage.js
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    missionlist:null,
    dramascriptcreator:null,
    dramascriptid:null,
    day:0,
    hours:0,
    minutes:0,
    seconds:0,
    activityid:null,
    username:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    console.log(options.userfirstlogintime);
    var userfirstlogintime = new Date(options.userfirstlogintime);
    console.log(options.dramascriptid);
    this.setData({
        activityid: options.activityid,
        dramascriptid: options.dramascriptid,
        dramascriptcreator: options.dramascriptcreator,
        username:options.username
    })
    //先执行获取服务器记录的时间的部分，暂时没写
    var i = 1;
    setInterval(function(){
        var time = new Date();
        time.getTime();
        that.setData({
            seconds:time.getSeconds()-userfirstlogintime.getSeconds(),
            minutes:time.getMinutes()-userfirstlogintime.getMinutes(),
            hours:time.getHours()-userfirstlogintime.getHours(),
            days:time.getDate()-userfirstlogintime.getDate(),
        });
    },1000);
    wx.request({
        url: 'http://localhost:8000/wxgetmissionlist',
        method:'POST',
        data: {
            dramascriptid: this.data.dramascriptid,
            username:this.data.dramascriptcreator,
        },
        header: {
            'content-type': 'application/json'
        },
        dataType: 'JSON',
        success(res){
            var resdata;
            var Missionlist = [];
            console.log("success");
            resdata = JSON.parse(res.data).data;
            resdata.forEach(element => {
                Missionlist.push(element);
            });
            console.log(Missionlist);
            that.setData({
                missionlist: Missionlist
            });

        },
        fail(){
            console.log("failed");
        },
        complete(){
            console.log("complete");
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  backtolastpage(){
      let pages = getCurrentPages();
      console.log(pages);
      wx.navigateBack({
          success: function(res){
              
          }
      });
  },
  getmissionname(e){
      console.log(e.currentTarget.dataset.missionname);
      wx.navigateTo({
        url: '/pages/questionpage/questionpage?missionname='+e.currentTarget.dataset.missionname+'&dramascriptcreator='+this.data.dramascriptcreator+'&dramascriptid='+this.data.dramascriptid+'&missionscore='+e.currentTarget.dataset.missionscore+'&activityid='+this.data.activityid+'&username='+this.data.username,
        success: function(res){

        }
      })
  }
})