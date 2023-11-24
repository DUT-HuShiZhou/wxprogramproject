AMapLoader.load({
    key: "ed729e18de199349c4ab973ba060babe", //申请好的Web端开发者key，调用 load 时必填
    version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    })
    .then((AMap) => {
        const map = new AMap.Map("pointsplace", {
            viewMode: '2D', //默认使用 2D 模式
            zoom: 11, //地图级别
            center: [116.397428, 39.90923], //地图中心点
            mapStyle: "amap://styles/normal", //设置地图的显示样式
          });
    })
    .catch((e) => {
        console.error(e); //加载错误提示
    });