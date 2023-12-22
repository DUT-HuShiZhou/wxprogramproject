// pages/page1/page1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    dramascriptid:null,
    numofpets:4,
    username:null,
    avatarurl:null,
    schoolname:"DUT"
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ active: event.detail });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
        username: options.username,
        avatarurl: options.avatarurl
    });
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
  scanCodeEvent: function(){
      var that = this;
      wx.scanCode({
          onlyFromCamera:true,
          success(res){
              console.log("扫码成功" + JSON.stringify(res));
              that.setData({
                  dramascriptid:res.result.split(",")[0],
              });
              if(that.data.dramascriptid != null){
                  wx.navigateTo({
                url: '/pages/gamepage/gamepage?dramascriptid='+that.data.dramascriptid+'&dramascriptcreator='+res.result.split(",")[1]+'&activityid='+res.result.split(",")[2]+'&username='+that.data.username,
                success: function(res){
        
                }
                });
              }
              
          }
      })
  },
})