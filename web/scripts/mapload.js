const LoadedPointsEvent = new CustomEvent("PointsLoaded", {detail: {id:"loadNum"}});
const SelectedPointEvent = new CustomEvent("PointSelected");

AMapLoader.load({
    key: "ed729e18de199349c4ab973ba060babe", //申请好的Web端开发者key，调用 load 时必填
    version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    plugin: "AMap.Walking" 
    })
    .then((AMap) => {
        var longitudes = [38.878836, 38.879255, 38.881568, 38.884894, 38.886284];
        var latitudes = [121.60142, 121.601946, 121.602505, 121.605681, 121.604963];
        sessionStorage.setItem("points",JSON.stringify([[38.878836,121.60142,"你好0",0],[38.879255,121.601946,"你好1",0],[38.881568,121.602505,"你好2",0],[38.884894,121.605681,"你好3",0],[38.886284, 121.604963,"你好4",0]]));
        var names = ["你好0", "你好1", "你好2", "你好3", "你好4"];

        const layer = new AMap.createDefaultLayer({
            zooms: [3, 20], //可见级别
            visible: true, //是否可见
            opacity: 1, //透明度
            zIndex: 0, //叠加层级
        });        
        let map = new AMap.Map("pointsplace", {
            viewMode: '3D', //默认使用 2D 模式
            zoom: 16, //地图级别
            pitch:30, //俯仰角度 0为完全俯视
            center: [116.397428, 39.90923], //地图中心点 默认为北京 setCenter()可修改中心点位置
            mapStyle: "amap://styles/normal", //设置地图的显示样式
            layers:[layer],
        });
        const traffic = new AMap.TileLayer.Traffic({
            autoRefresh: true, //是否自动刷新，默认为false
            interval: 180, //刷新间隔，默认180s
        });
        map.add(traffic);

        map.setCenter([latitudes[0], longitudes[0]]);

        var markers = [];
        var polylines = [];

        window.parent.addEventListener("message", function(event){
            if (event.data.action === "pointStates"){   // 验证是否为点位消息   
                var points = JSON.parse(sessionStorage.getItem("points"));
                var longitudes = [];
                var latitudes = [];
                var names = [];
                for (var i = 0; i < event.data.num; i++){
                    longitudes.push(points[i][0]);
                    latitudes.push(points[i][1]);
                    names.push(points[i][2]);
                };

                map.setCenter([latitudes[0], longitudes[0]]);

                freshMap(event.data.num, longitudes, latitudes, names);
            }
            return;
        }, false);

        document.addEventListener("resetPoints", function(event) {
            if (sessionStorage.getItem("cachePoints")){
                var points = JSON.parse(sessionStorage.getItem("cachePoints"));
            }
            else{
                var points = JSON.parse(sessionStorage.getItem("points"));
            }
            var longitudes = [];
            var latitudes = [];
            var names = [];
            for (var i = 0; i < points.length; i++){
                longitudes.push(points[i][0]);
                latitudes.push(points[i][1]);
                names.push(points[i][2]);
            };
            map.setCenter([latitudes[0], longitudes[0]]);

            freshMap(points.length, longitudes, latitudes, names);
        })

        freshMap(5, longitudes, latitudes, names)

        function freshMap(num, longitudes, latitudes, names) {
            map.clearMap();
            markers = [];
            polylines = [];
            
            for(var i = 0; i < num; i++){       
                (function(i){       
                    var markerContent = '' +
                    '<div class="custom-content-marker">' +
                    '   <img class="pointImg-' + i + '"' + ' src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png">' + 
                    '   <div class="num" point-name=' + names[i] + '>'+ String(i + 1) +'</div>'
                    '</div>'; // 打点图标

                    var position = new AMap.LngLat(latitudes[i], longitudes[i]);
                    markers.push(new AMap.Marker({
                        position: position,
                        content: markerContent, // 将 html 传给 content
                        offset: new AMap.Pixel(-13, -30) // 以 icon 的 [center bottom] 为原点
                    }));
                
                    map.add(markers[i]);
                    
                    var img = document.querySelector("img.pointImg-" + i);
                    img.addEventListener("click", function(){
                        sessionStorage.setItem("SP", i);
                        document.dispatchEvent(SelectedPointEvent);
                    });
                })(i);
            }

            let shwoName = document.querySelectorAll("div.num");
            for(var i = 0; i < num; i++){
                shwoName[i].addEventListener("mouseover", function(){
                    shwoName[i].setAttribute("point-name", names[i]);
                })
                shwoName[i].addEventListener("mouseout", function(){
                    shwoName[i].setAttribute("point-name", "");
                })
            }
            AMap.plugin('AMap.Walking', function () {
                const walking = new AMap.Walking({
                    map: map,
                    panel: "panel"
                });
            
                function drawPolyline(index, path) {
                    polylines[index] = new AMap.Polyline({
                        path: path,
                        isOutline: true,
                        outlineColor: "#" + (Math.floor(Math.random() * 200) + 55).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 200) + 55).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 200) + 55).toString(16).padStart(2, '0'),
                        borderWeight: 1,
                        strokeColor: "#" + (Math.floor(Math.random() * 200) + 55).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 200) + 55).toString(16).padStart(2, '0') + (Math.floor(Math.random() * 200) + 55).toString(16).padStart(2, '0'),
                        strokeOpacity: 0.9,
                        strokeWeight: 2,
                        strokeStyle: "solid",
                        lineJoin: "round",
                        lineCap: "round",
                    });
                    map.add(polylines[index]);
                }
            
                for (var i = 0; i < latitudes.length - 1; i++) {
                    (function (index) {
                        walking.search([latitudes[index], longitudes[index]], [latitudes[index + 1], longitudes[index + 1]], function (status, result) {
                            if (status === 'complete') {
                                // 绘制步行导航路线
                                var path = result.routes[0].steps.map(step => step.path);
                                drawPolyline(index, [].concat.apply([], path));
                            } else {
                                alert("第" + (index + 1) + "条路线" + "步行导航失败：" + status);
                            }
                        });
                    })(i);
                }
            });
            
            document.dispatchEvent(LoadedPointsEvent);
        }

    })
    .catch((e) => {
        alert(e); //加载错误提示
    });