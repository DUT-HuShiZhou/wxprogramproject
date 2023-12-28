// pages/questionpage/questionpage.js
const testaudio = wx.createInnerAudioContext();
const test2audio = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    missionscore:null,
    mediadata:null, //视频url: http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4
    questiondata:null,//图片url:https://youimg1.c-ctrip.com/target/100e190000015nd637840.jpg
    isaudioplay:false,
    days:null,
    hours:null,
    minutes:null,
    second:null,
    activityid:null,
    username:null,
    dramascriptcreator:null,
    hasoverlay:0,
    overlayvisible:true,
    hasuserchoosecurrectanswer:false,
    overlayimageurl:null,
    overlayinfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    that.setData({
        activityid: options.activityid,
        username: options.username,
        dramascriptcreator:options.dramascriptcreator
    });
    wx.request({
        url: 'http://localhost:8000/wxgetquestiondata',
        method:'POST',
        data: {
            dramascriptid: options.dramascriptid,
            missionname:options.missionname,
            username:options.dramascriptcreator,
        },
        header: {
            'content-type': 'application/json'
        },
        dataType: 'JSON',
        success(res){
            var resdata;
            var answerlist = []; 
            console.log("success");
            resdata = JSON.parse(res.data).data;
            console.log(resdata);
            answerlist=resdata.questioninfo.split(";");
            console.log(answerlist);
            that.setData({
                mediadata: {"type": resdata.mediatype,"url": resdata.mediaaddress},
                questiondata: {"type": resdata.questiontype,"answerlist": answerlist,"question": resdata.questiondescription,"currectanswer": resdata.questionanswerdescription},
                missionscore:parseInt(options.missionscore),
                hasoverlay:resdata.hasoverlay,
                overlayinfo:resdata.overlayinfo,
                overlayimageurl:resdata.overlayimageurl
            });
        },
        fail(){
            console.log("failed");
        },
        complete(){
            console.log("complete");
        }
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
  audioplay(){
    if(this.data.mediadata.type == 'audio'){
        testaudio.src = this.data.mediadata.url;
    }
    testaudio.play();
    console.log(testaudio.duration);
    this.setData({isaudioplay: true});
  },
  audiopause(){
    testaudio.pause();
    this.setData({isaudioplay: false});
  },
  checkanswer(e){
      let pages = getCurrentPages();
      var prevPage = pages[pages.length - 3];
      console.log(prevPage);
      var scoreuserget = prevPage.data.scoreuserget;
      console.log(e.currentTarget.dataset.answername);
      if(e.currentTarget.dataset.answername == this.data.questiondata.currectanswer){
          this.setData(
              {
                  hasuserchoosecurrectanswer: true
              }
          );
          scoreuserget = scoreuserget + this.data.missionscore;
          prevPage.setData({
              scoreuserget: scoreuserget,
              progress: 100 * (scoreuserget / prevPage.data.totalscore)
          });
          wx.request({
            url: 'http://localhost:8000/wxupdatescoreuserget',
            method:"POST",
            data:{
                scoreuserget: scoreuserget,
                username: this.data.username,
                dramascriptcreator: this.data.dramascriptcreator,
                activityid: this.data.activityid
            },
            dataType:"JSON",
            header:{
                'content-type': 'application/json'
            },
            success: function(res){

            }
          })
      }
  },
  gobacktomissionpage(){
      let pages = getCurrentPages()
      console.log(pages)
      wx.navigateBack(
      {
              
      }
      );
  },
  handleclick(){
      console.log("已经按压");
      this.setData({
        overlayvisible: false,
      });
  }
})