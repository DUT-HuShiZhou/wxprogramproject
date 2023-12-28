// pages/gamepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalscore:null,
    scoreuserget:null,
    totalmissionpointnum:8,
    finishmissionpointnum:4,
    show:false,
    overlay:false,
    resCompass:null, //顺时针旋转角度
    progress:0,
    dramascriptid: null,
    dramascriptcreator:null,
    username:null,
    tooluserget:null,
    days:0,
    hours:0,
    minutes:0,
    seconds:0,
    dateonserver:null,
    activityid:null
  },
  showPopup(){
      this.setData({show: true});
      var that = this;
      wx.startCompass(
        { success: function(){
            wx.onCompassChange(function(res){
                that.setData({
                    resCompass: res
                });
            });
          }
        }
      );
  },
  onClose(){
      this.setData({show: false});
      var that = this;
      wx.stopCompass(
        {
            success: function(res){
                console.log("罗盘已经停止");
            }
        }
      );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
        username:options.username,
        activityid: options.activityid,
        dramascriptid: options.dramascriptid,
    });
    wx.request({
      url: 'http://localhost:8000/wxuserparticipatedatainactivity',
      method: "POST",
      data:{
          username: options.username,
          dramascriptcreator: options.dramascriptcreator,
          activityid: options.activityid
      },
      header:{
        'content-type': 'application/json'
      },
      dataType:"JSON",
      success: function(res){
        var resdata = JSON.parse(res.data);
        console.log(resdata.totalscore);
        console.log(resdata.scoreuserget);
        console.log(resdata.userfirstlogintime);
        console.log(resdata.tooluserget);
        that.setData({
            dateonserver: resdata.userfirstlogintime,
            totalscore: resdata.totalscore,
            scoreuserget: resdata.scoreuserget,
            progress: 100 * (resdata.scoreuserget / resdata.totalscore),
            dramascriptcreator:options.dramascriptcreator
        });
      }
    })
    var dateonserver = new Date("Fri Dec 22 2023 18:06:05 GMT+0800 (中国标准时间)");
    setInterval(()=>{
        var timenow = new Date();
        var days = timenow.getDate() - dateonserver.getDate();
        var hours = timenow.getHours() - dateonserver.getHours();
        var minutes = timenow.getMinutes() - dateonserver.getMinutes();
        var seconds = timenow.getSeconds() - dateonserver.getSeconds();
        this.setData({
            days: days,
            hours: hours,
            minutes: minutes,
            days: days,
            seconds: seconds
        });
    },1000)
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
  getmission(){
    wx.navigateTo({
      url: '/pages/missionpage/missionpage?dramascriptid='+this.data.dramascriptid+'&dramascriptcreator='+this.data.dramascriptcreator+'&userfirstlogintime='+this.data.dateonserver+'&activityid='+this.data.activityid+'&username='+this.data.username,
      success: function(res){

      }
    });
  }
})