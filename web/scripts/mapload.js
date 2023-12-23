const LoadedPointsEvent = new CustomEvent("PointsLoaded", {detail: {id:"loadNum"}}); // 点位加载完毕事件
const SelectedPointEvent = new CustomEvent("PointSelected"); // 点位选择事件

AMapLoader.load({
    key: "ed729e18de199349c4ab973ba060babe", //申请好的Web端开发者key，调用 load 时必填
    version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    plugin: "AMap.Walking" 
    })
    .then((AMap) => {
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

        var markers = []; // 点位存放数组
        var polylines = []; // 路线存放数组

        // 路线选择事件监听相应函数
        window.parent.addEventListener("message", function(event){
            if (event.data.action === "pointStates"){   // 验证是否为点位消息   
                var points = JSON.parse(sessionStorage.getItem("points")); // 转化本地数据为数组形式
                var longitudes = [];
                var latitudes = [];
                var names = [];
                for (var i = 0; i < event.data.num; i++){
                    longitudes.push(points[i][0]);
                    latitudes.push(points[i][1]);
                    names.push(points[i][2]);
                };
                
                // 设置路线中心点
                map.setCenter([latitudes[0], longitudes[0]]);

                freshMap(event.data.num, longitudes, latitudes, names);
            }
            return;
        }, false);

        // 刷新点位事件监听函数
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

        // 地图刷新函数主体
        function freshMap(num, longitudes, latitudes, names) {
            // 清除地图点位数据
            map.clearMap();
            // 清空数组数据
            markers = [];
            polylines = [];
            
            // 点位HTML数据添加
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
                    
                    // 添加图片点击函数，触发点位选择事件
                    var img = document.querySelector("img.pointImg-" + i);
                    img.addEventListener("click", function(){
                        sessionStorage.setItem("SP", i);
                        document.dispatchEvent(SelectedPointEvent);
                    });
                })(i);
            }

            // 设置鼠标选中显示名称
            let shwoName = document.querySelectorAll("div.num");
            for(var i = 0; i < num; i++){
                shwoName[i].addEventListener("mouseover", function(){
                    shwoName[i].setAttribute("point-name", names[i]);
                })
                shwoName[i].addEventListener("mouseout", function(){
                    shwoName[i].setAttribute("point-name", "");
                })
            }

            // 进行步行路线搜索
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
            
                // 绘制路线图形
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
            
            // 触发点位加载完毕事件
            document.dispatchEvent(LoadedPointsEvent);
        }

    })
    .catch((e) => {
        alert(e); //加载错误提示
    });