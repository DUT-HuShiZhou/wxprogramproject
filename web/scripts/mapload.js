let test = document.querySelector("button.test-btn");

AMapLoader.load({
    key: "ed729e18de199349c4ab973ba060babe", //申请好的Web端开发者key，调用 load 时必填
    version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    })
    .then((AMap) => {
        window.addEventListener("message", function(event){
            if (event.origin !== "index.html"){
                alert("路线访问错误!");
            }else {
                var states = event.data.states.split(";");
                var longitudes = []
                var latitudes = []
                for (var i = 0; i < states.length; i++){
                    longitudes.push(states[i].split(":")[0]);
                    latitudes.push(states.split(":")[1]);
                }

                const layer = new AMap.createDefaultLayer({
                    zooms: [3, 20], //可见级别
                    visible: true, //是否可见
                    opacity: 1, //透明度
                    zIndex: 0, //叠加层级
                });
        
                const map = new AMap.Map("pointsplace", {
                    viewMode: '3D', //默认使用 2D 模式
                    zoom: 16, //地图级别
                    pitch:30, //俯仰角度 0为完全俯视
                    center: [latitudes[0], longitudes[0]], //地图中心点
                    mapStyle: "amap://styles/normal", //设置地图的显示样式
                    layers:[layer],
                });
                const traffic = new AMap.TileLayer.Traffic({
                    autoRefresh: true, //是否自动刷新，默认为false
                    interval: 180, //刷新间隔，默认180s
                });
                map.add(traffic);
                        
                const markerContent = '' +
                '<div class="custom-content-marker">' +
                '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">'; // 打点图标

                for(var i = 0; i < event.data.num; i++){
                    const position = new AMap.LngLat(latitudes[i], longitudes[i]);
                    const marker = new AMap.Marker({
                        position: position,
                        content: markerContent, // 将 html 传给 content
                        offset: new AMap.Pixel(-13, -30) // 以 icon 的 [center bottom] 为原点
                    });
                
                    map.add(marker);
                }

                map.plugin('AMap.Walking', function () {
                    var walking = new AMap.Walking({
                        policy: AMap.WalkingPolicy.LEAST_TIME,
                        map: map,
                        panel: "panel"
                    })

                    // path 是驾车导航的起、途径和终点，最多支持16个途经点
                    var path = []
                    
                    for (var i = 0; i < 5; i++){
                        path.push([latitudes[i], longitudes[i]]);
                    }
                    // 查询导航路径并开启拖拽导航
                    route.search(path)
                })
            }
            return;
        });

        const layer = new AMap.createDefaultLayer({
            zooms: [3, 20], //可见级别
            visible: true, //是否可见
            opacity: 1, //透明度
            zIndex: 0, //叠加层级
        });

        const map = new AMap.Map("pointsplace", {
            viewMode: '3D', //默认使用 2D 模式
            zoom: 18, //地图级别
            pitch:30, //俯仰角度 0为完全俯视
            center: [121.60142, 38.878836], //地图中心点
            mapStyle: "amap://styles/normal", //设置地图的显示样式
            layers:[layer],
        });
        const traffic = new AMap.TileLayer.Traffic({
            autoRefresh: true, //是否自动刷新，默认为false
            interval: 180, //刷新间隔，默认180s
        });
        map.add(traffic);

        const markerContent = '' +
        '<div class="custom-content-marker">' +
        '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">'; // 打点图标

        var longitudes = [38.878836, 38.879255, 38.881568, 38.884894, 38.886344];
        var latitudes = [121.60142, 121.601946, 121.602505, 121.605681, 121.604963];
        for(var i = 0; i < 5; i++){
            const position = new AMap.LngLat( latitudes[i], longitudes[i]);
            const marker = new AMap.Marker({
                position: position,
                content: markerContent, // 将 html 传给 content
                offset: new AMap.Pixel(-13, -30) // 以 icon 的 [center bottom] 为原点
            });
        
            map.add(marker);
        }
    })
    .catch((e) => {
        alert(e); //加载错误提示
    });