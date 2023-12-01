let test = document.querySelector("button.test-btn");

AMapLoader.load({
    key: "ed729e18de199349c4ab973ba060babe", //申请好的Web端开发者key，调用 load 时必填
    version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    plugin: "AMap.Walking" 
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
                    latitudes.push(states[i].split(":")[1]);
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

                AMap.plugin('AMap.Walking',function(){
                    const walking = new AMap.Walking({
                        map: map,
                        panel: "panel"
                    });
        
                    for (var i = 0; i < latitudes.length - 1; i++) {
                        (function (index) {
                            walking.search([latitudes[index], longitudes[index]], [latitudes[index + 1], longitudes[index + 1]], function (status, result) {
                                if (status === 'complete') {
                                    // 绘制步行导航路线
                                    var path = result.routes[0].steps.map(step => step.path);
                                    var polyline = new AMap.Polyline({
                                        path: [].concat.apply([], path),
                                        isOutline: true,
                                        outlineColor: "#" + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0'),
                                        borderWeight: 1,
                                        strokeColor: "#" + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0'),
                                        strokeOpacity: 0.9,
                                        strokeWeight: 2,
                                        strokeStyle: "solid",
                                        lineJoin: "round",
                                        lineCap: "round",
                                    });
                                    map.add(polyline);
                                } else {
                                    alert("第" + (index + 1) + "条路线" + "步行导航失败：" + status);
                                }
                            });
                        })(i);
                    }  
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

        var longitudes = [38.878836, 38.879255, 38.881568, 38.884894, 38.886284];
        var latitudes = [121.60142, 121.601946, 121.602505, 121.605681, 121.604963];
        for(var i = 0; i < 5; i++){
            var markerContent = '' +
            '<div class="custom-content-marker">' +
            '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">' + 
            '   <div class="num">'+ (i + 1) +'</div>'
            '</div>'; // 打点图标
            var position = new AMap.LngLat( latitudes[i], longitudes[i]);
            var marker = new AMap.Marker({
                position: position,
                content: markerContent, // 将 html 传给 content
                offset: new AMap.Pixel(-13, -30) // 以 icon 的 [center bottom] 为原点
            });
        
            map.add(marker);
        }

        AMap.plugin('AMap.Walking',function(){
            const walking = new AMap.Walking({
                map: map,
                panel: "panel"
            });

            for (var i = 0; i < latitudes.length - 1; i++) {
                (function (index) {
                    walking.search([latitudes[index], longitudes[index]], [latitudes[index + 1], longitudes[index + 1]], function (status, result) {
                        if (status === 'complete') {
                            // 绘制步行导航路线
                            var path = result.routes[0].steps.map(step => step.path);
                            var polyline = new AMap.Polyline({
                                path: [].concat.apply([], path),
                                isOutline: true,
                                outlineColor: "#" + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0'),
                                borderWeight: 1,
                                strokeColor: "#" + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 255)).toString(16).padStart(2, '0'),
                                strokeOpacity: 0.9,
                                strokeWeight: 2,
                                strokeStyle: "solid",
                                lineJoin: "round",
                                lineCap: "round",
                            });
                            map.add(polyline);
                        } else {
                            alert("第" + (index + 1) + "条路线" + "步行导航失败：" + status);
                        }
                    });
                })(i);
            }  
        })



    })
    .catch((e) => {
        alert(e); //加载错误提示
    });

    