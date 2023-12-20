// pages/gamepage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalmissionpointnum:8,
    finishmissionpointnum:4,
    show:false,
    overlay:false,
    resCompass:null, //顺时针旋转角度
    progress:0,
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
    var finishnum = this.data.finishmissionpointnum;
    var totalnum = this.data.totalmissionpointnum;
    console.log(100 * (finishnum / totalnum));
    this.setData({
        progress: 100 * (finishnum / totalnum)
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

  }
})