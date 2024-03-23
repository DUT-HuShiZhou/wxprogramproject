package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func main() {
	var accesstoken string
	database, err := sqlx.Open("mysql", "root:123456@tcp(127.0.0.1:3306)/wxproj")
	if err != nil {
		println("连接数据库失败：" + err.Error())
	}
	r := gin.Default()
	r.LoadHTMLGlob("../web/htmls/*")
	r.Static("/styles", "../web/styles")
	r.Static("/scripts", "../web/scripts")
	r.Static("/images", "../web/images")
	r.Static("/font", "../web/font")
	r.Static("/layui", "../web/layui")
	r.Static("/text", "../web/text") //未来经过修改后，应该是向文件服务器调用，而不是静态的文件服务
	r.Static("/video", "../web/video")
	r.Static("/audio", "../web/audio")

	r.GET("/index", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	r.GET("/first.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "first.html", nil)
	})
	r.GET("/activity.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "activity.html", nil)
	})
	r.GET("/create.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "create.html", nil)
	})
	r.GET("/line.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "line.html", nil)
	})
	r.GET("/drama.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "drama.html", nil)
	})

	r.GET("/checkin.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "checkin.html", nil)
	})

	r.GET("/htmls/context.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "context.html", nil)
	})
	//这个drama line是否后期是要根据后端数据修改参数大小
	r.GET("/drama-line.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "drama-line.html", nil)
	})
	r.GET("/question_bank.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "question_bank.html", nil)
	})
	r.GET("/chat.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "chat.html", nil)
	})
	//这里要做登录验证数据的处理,前端那边的checkin.js要能够向我们发送信息
	r.POST("/user", func(c *gin.Context) {
		username, flag1 := c.GetPostForm("username")
		if flag1 {
			println(username)
		} else {
			println("获取表单失败")
			c.String(http.StatusOK, "登录失败，请重试（网络原因）")
		}
		userpassword, flag2 := c.GetPostForm("userpassword")
		if flag2 {
			println(userpassword)
		} else {
			println("获取表单失败")
			c.String(http.StatusOK, "登录失败请重试")
		}
		sqlstr := "select user_password from userinfo where user_account= ?"
		var result string
		database.QueryRow(sqlstr, username).Scan(&result)
		if result == "" {
			c.String(http.StatusOK, "account doesn't exist")
		} else {
			if result == userpassword {
				c.String(http.StatusOK, "login success")
			} else {
				c.String(http.StatusOK, "not correct password")
			}
		}
		println("执行到这里了")
		println(result)
	})
	//查询路线列表并发送
	r.POST("/searchRoute", func(c *gin.Context) {
		command, flag1 := c.GetPostForm("type")
		if flag1 {
			//说明正常接收了
			if command == "lines" {
				var linenum string
				var result string
				database.QueryRow("select count(*) from routelistof2513677").Scan(&linenum) //这里后期要改成索引某个用户的数据表
				rows, err := database.Query("select routename,id from routelistof2513677")
				println(linenum)
				result = linenum
				if err != nil {
					println("获取数据失败")
				} else {
					for rows.Next() {
						var routename string
						var routeid int
						rows.Scan(&routename, &routeid)
						var routeidstr = strconv.Itoa(routeid)
						result = result + ";" + routename + ":" + routeidstr
					}
				}
				println(result)
				c.String(http.StatusOK, result)
			}
		} else {
			println("获取表单数据失败") //这部分后期都换成记录运行日志的函数
			c.String(http.StatusOK, "get Form-Data failed")
		}
	})
	r.POST("/createNewRoute", func(c *gin.Context) {
		var routenumstr string
		username, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("用户名称获取失败")
			c.String(http.StatusOK, "用户名称获取失败")
		}
		database.QueryRow("select count(*) from routelistof" + username).Scan(&routenumstr)
		routenum, errflag2 := strconv.Atoi(routenumstr)
		if errflag2 != nil {
			println("获取用户路线个数的格式错误")
			c.String(http.StatusOK, "获取用户路线个数的格式错误")
		}
		routenum++
		routenumstr = strconv.Itoa(routenum)
		_, errflag3 := database.Exec("create table route" + routenumstr + "of" + username + "(pointID int(100),longitude float,latitude float)")
		if errflag3 != nil {
			println("路径数据表创建失败")
			c.String(http.StatusOK, "路径数据表创建失败")
		}
		routename, errflag4 := c.GetPostForm("routename")
		if !errflag4 {
			println("新路线名称获取失败")
			c.String(http.StatusOK, "新路线名称获取失败")
		} else {
			_, errflag5 := database.Exec("insert routelistof"+username+"(id,routename) values(?,?)", routenumstr, routename)
			if errflag5 != nil {
				println("新路线插入路线列表数据库失败")
				c.String(http.StatusOK, "新路线插入路线列表数据库失败")
			}
		}

		numstr, errflag6 := c.GetPostForm("pointNum")
		if errflag6 {
			num, errflag7 := strconv.Atoi(numstr)
			if errflag7 != nil {
				println("用户点位个数格式错误")
				c.String(http.StatusOK, "用户点位数据获取失败(情况2)")
			}
			for i := 1; i <= num; i++ {
				pointdata, errflag8 := c.GetPostForm(strconv.Itoa(i))
				if errflag8 {
					longitude := strings.Split(pointdata, "|")[0]
					latitude := strings.Split(pointdata, "|")[1]

					_, errflag9 := database.Exec("insert route"+routenumstr+"of"+username+"(pointID,longitude,latitude) values(?,?,?)", strconv.Itoa(i), longitude, latitude)
					if errflag9 != nil {
						println("插入点位数据失败")
						c.String(http.StatusOK, "插入点位数据失败")
					}

				} else {
					println("用户点位经纬度数据获取失败")
					c.String(http.StatusOK, "用户点位数据获取失败(情况3)")
				}
			}
		} else {
			println("用户点位个数获取失败")
			c.String(http.StatusOK, "用户点位数据获取失败(情况2)")
		}
	})
	//注册新账号
	r.POST("/createAccount", func(c *gin.Context) {
		username, errflag1 := c.GetPostForm("username")
		if !errflag1 {
			println("获取用户名失败")
			c.String(http.StatusOK, "获取用户名失败")
		}
		useraccount, errflag2 := c.GetPostForm("useraccount")
		if !errflag2 {
			println("获取用户账号失败")
			c.String(http.StatusOK, "获取用户账号失败")
		}
		userpassword, errflag3 := c.GetPostForm("userpassword")
		if !errflag3 {
			println("获取用户密码失败")
			c.String(http.StatusOK, "获取用户密码失败")
		}
		_, errflag4 := database.Exec("insert into userinfo(user_account,user_name,user_password) values(?,?,?)", useraccount, username, userpassword)
		if errflag4 != nil {
			println("创建用户账号记录失败（数据库")
			c.String(http.StatusOK, "创建用户失败（情况1），请联系技术人员解决")
		} else {
			//创建每个用户都有的几个表:路线列表，活动列表，剧本列表
			_, errflag5 := database.Exec("create table routelistof" + useraccount + `(
				id INT UNSIGNED AUTO_INCREMENT,
				routename varchar(100),
				primary key (id)
			)`)
			if errflag5 != nil {
				println("创建用户路线列表数据库失败")
				c.String(http.StatusOK, "创建用户失败(情况2)")
			} else {
				//创建活动列表和剧本列表，if嵌套问题由于赶工期暂时不管
				_, errflag6 := database.Exec("create table activitylistof" + useraccount + `(
					id INT UNSIGNED AUTO_INCREMENT,
					activityname varchar(100),
					testQRCodeurl varchar(100),
					formalQRCodeurl varchar(100),
					totalParticipateNum int(100),
					avarageParticipateTime int(100),
					primary key(id)
				)`)
				if errflag6 != nil {
					println("创建用户活动列表数据库失败")
					c.String(http.StatusOK, "创建用户失败(情况3)")
				} else {
					_, errflag7 := database.Exec("create table dramascriptlistof" + useraccount + `(
						id INT UNSIGNED AUTO_INCREMENT,
						dramascriptname varchar(100),
						primary key(id)
					)`)
					if errflag7 != nil {
						println("创建用户剧本列表数据库失败")
						c.String(http.StatusOK, "创建用户失败（情况4）")
					}
				}
			}
			println("创建用户成功")
			c.String(http.StatusOK, "创建用户成功，10s后跳转到登录页面进行登录")
		}
	})
	r.POST("/getPoints", func(c *gin.Context) {
		var result string
		var pointsnum int
		username, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取用户名失败")
		} else {
			println(username)
		}
		id, errflag2 := c.GetPostForm("RouteId")
		if !errflag2 {
			println("获取路线id失败")
		} else {
			println(id)
			rows, errflag3 := database.Query("select * from route" + id + "of" + username)
			if errflag3 != nil {
				println("线路点位获取失败")
			} else {
				database.QueryRow("select count(*) from route" + id + "of" + username).Scan(&pointsnum)
				pointsnumstr := strconv.Itoa(pointsnum)
				result = result + pointsnumstr
				for rows.Next() {
					var pointID int
					var longitude float32
					var latitude float32 //我在mysql中定义的是float类型变量，不知道获取的时候会不会自动转换
					var pointName string
					var pointDescription string
					//rows.Scan(&pointID)
					rows.Scan(&pointID, &longitude, &latitude, &pointName, &pointDescription)
					pointIDstr := strconv.Itoa(pointID)
					longitudestr := strconv.FormatFloat(float64(longitude), 'f', 6, 32)
					latitudestr := strconv.FormatFloat(float64(latitude), 'f', 6, 32)
					println(pointIDstr, longitudestr, latitudestr, pointName, pointDescription) //测试用,已经成功
					result = result + ";" + longitudestr + ":" + latitudestr + ":" + pointName + ":" + pointDescription
				}
				c.String(http.StatusOK, result)
			}
		}
	})
	r.POST("/wxGetPoints", func(c *gin.Context) {
		var result string
		var pointsnum int
		username, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取用户名失败")
		} else {
			println("用户名（wxGetPoints）:" + username)
		}
		id, errflag2 := c.GetPostForm("RouteId")
		if !errflag2 {
			println("获取路线id失败")
		} else {
			println("id（wxGetPoints）:" + id)
			rows, errflag3 := database.Query("select * from route" + id + "of" + username)
			if errflag3 != nil {
				println("线路点位获取失败")
			} else {
				database.QueryRow("select count(*) from route" + id + "of" + username).Scan(&pointsnum)
				pointsnumstr := strconv.Itoa(pointsnum)
				result = result + pointsnumstr
				for rows.Next() {
					var pointID int
					var longitude float32
					var latitude float32 //我在mysql中定义的是float类型变量，不知道获取的时候会不会自动转换
					var pointName string
					var pointDescription string
					//rows.Scan(&pointID)
					rows.Scan(&pointID, &longitude, &latitude, &pointName, &pointDescription)
					pointIDstr := strconv.Itoa(pointID)
					longitudestr := strconv.FormatFloat(float64(longitude), 'f', 6, 32)
					latitudestr := strconv.FormatFloat(float64(latitude), 'f', 6, 32)
					println(pointIDstr, longitudestr, latitudestr, pointName, pointDescription) //测试用,已经成功
					if result == "" {
						result = longitudestr + ":" + latitudestr + ":" + pointName + ":" + pointDescription + ":" + pointIDstr
					} else {
						result = result + ";" + longitudestr + ":" + latitudestr + ":" + pointName + ":" + pointDescription + ":" + pointIDstr
					}
				}
				c.String(http.StatusOK, result)
			}
		}
	})
	r.POST("/changeOrder", func(c *gin.Context) {
		username, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取用户名失败")
		} else {
			println(username)
		}
		pointList, errflag2 := c.GetPostForm("pointslist")
		if !errflag2 {
			println("获取点位列表失败")
		} else {
			println(pointList)
		}
		pointnumstr, errflag3 := c.GetPostForm("pointnum") //应该发过来的是文本
		if !errflag3 {
			println("获取点位个数错误")
		} else {
			println(pointnumstr)
		}
		routeid, errflag4 := c.GetPostForm("routeid")
		if !errflag4 {
			println("获取路线id失败")
		}
		pointnum, errflag5 := strconv.Atoi(pointnumstr)
		if errflag5 != nil {
			println("传入的点位个数格式错误")
		} else {
			for i := 0; i < pointnum; i++ {
				var errflag6 error
				var errflag7 error
				var pointID int
				var longitude float64
				var latitude float64
				var pointName string
				var pointDescription string
				pointID = i + 1
				longitude, errflag6 = strconv.ParseFloat(strings.Split(strings.Split(pointList, ";")[i], ":")[0], 32) //使用;分隔每个点,使用：分隔每个点的属性
				if errflag6 != nil {
					println("点位longitude格式错误")
				}
				latitude, errflag7 = strconv.ParseFloat(strings.Split(strings.Split(pointList, ";")[i], ":")[1], 32)
				if errflag7 != nil {
					println("点位latitude格式错误")
				}
				pointName = strings.Split(strings.Split(pointList, ";")[i], ":")[2]
				pointDescription = strings.Split(strings.Split(pointList, ";")[i], ":")[3]
				_, errflag8 := database.Exec("update route" + routeid + "of" + username + " set longitude = " + strconv.FormatFloat(longitude, 'f', 6, 32) + ",latitude = " + strconv.FormatFloat(latitude, 'f', 6, 32) + ",pointName = " + pointName + ",pointDescription = " + pointDescription + " where pointID = " + strconv.Itoa(pointID))
				if errflag8 != nil {
					println("更新单个点位失败")
				}
			}
			println("更新所有点位成功")
			c.String(http.StatusOK, "调整点位顺序成功")
		}
	})
	r.POST("/wxgetmissionlist", func(c *gin.Context) {
		var queryres string
		var missionlist []interface{}
		var revdata struct {
			Dramascriptid string `json:"dramascriptid"`
			//Missionname   string `json:"missionname"`
			Username string `json:"username"`
		}
		var mission struct {
			Missionid            int    `json:"missionid"`
			Nextmissionid        int    `json:"nextmissionid"`
			Missionname          string `json:"missionname"`
			Status               string `json:"status"`
			Score                int    `json:"score"`
			Pointid              string `json:"pointid"`
			HasARornot           bool   `json:"hasARornot"`
			ARmodelurl           string `json:"ARmodelurl"`
			ModeofAR             string `json:"modeofAR"`
			TwoDMarkerimageurl   string `json:"twoDMarkerimageurl"`
			ThreeDMarkervideourl string `json:"threeDMarkervideourl"`
			ARdescription        string `json:"ardescription"`
		}
		var resultjson struct {
			Data interface{} `json:"data"`
		}
		errflag1 := c.BindJSON(&revdata)
		if errflag1 != nil {
			println("获取剧本名称和任务名称失败")
		} else {
			println(revdata.Dramascriptid)
			//println(revdata.Missionname)
			println(revdata.Username)
			database.QueryRow("select id from dramascriptlistof"+revdata.Username+" where id= ?", revdata.Dramascriptid).Scan(&queryres)
			println(queryres)
			rows, errflag2 := database.Query("select missionid,nextmissionid,missionname,status,score,pointid,hasARornot,ARmodelurl,modeofAR,2DMarkerimageurl,3DMarkervideourl,ARdescription from dramascript" + queryres + "of" + revdata.Username)
			if errflag2 != nil {
				println("获取任务列表失败")
				fmt.Println(errflag2)
			} else {
				for rows.Next() {
					rows.Scan(&mission.Missionid, &mission.Nextmissionid, &mission.Missionname, &mission.Status, &mission.Score, &mission.Pointid, &mission.HasARornot, &mission.ARmodelurl, &mission.ModeofAR, &mission.TwoDMarkerimageurl, &mission.ThreeDMarkervideourl, &mission.ARdescription)
					missionlist = append(missionlist, mission)
				}
			}
			print(mission.Missionname)
			resultjson.Data = missionlist
			c.JSON(http.StatusOK, resultjson)

		}

	})
	r.POST("/wxgetquestiondata", func(c *gin.Context) {
		var queryres string
		var revdata struct {
			Dramascriptid string `json:"dramascriptid"`
			Missionname   string `json:"missionname"`
			Username      string `json:"username"`
		}
		var questiondata struct {
			Mediatype                string `json:"mediatype"`
			Mediaaddress             string `json:"mediaaddress"`
			Mediadescription         string `json:"mediadescription"`
			Questiontype             string `json:"questiontype"`
			Questiondescription      string `json:"questiondescription"`
			Questioninfo             string `json:"questioninfo"`
			Questionanswerdescrption string `json:"questionanswerdescription"`
			Hasbeforeoverlay         string `json:"hasbeforeoverlay"`
			Hasafteroverlay          string `json:"hasafteroverlay"`
			Beforeoverlayinfo        string `json:"beforeoverlayinfo"`
			Beforeoverlayimageurl    string `json:"beforeoverlayimageurl"`
			Beforedialogaudiourllist string `json:"beforedialogaudiourllist"`
			Afteroverlayinfo         string `json:"afteroverlayinfo"`
			Afteroverlayimageurl     string `json:"afteroverlayimageurl"`
			Afterdialogaudiourllist  string `json:"afterdialogaudiourllist"`
			Falltoolornot            bool   `json:"falltoolornot"`
			Falltoolname             string `json:"falltoolname"`
		}
		var resultjson struct {
			Data interface{} `json:"data"`
		}
		errflag1 := c.BindJSON(&revdata)
		if errflag1 != nil {
			println("获取剧本名称和任务名称失败")
		} else {
			println(revdata.Dramascriptid)
			println(revdata.Missionname)
			println(revdata.Username)
			database.QueryRow("select id from dramascriptlistof"+revdata.Username+" where dramascriptname= ?", revdata.Dramascriptid).Scan(&queryres)
			println(queryres)
			database.QueryRow("select mediatype,mediaaddress,mediadescription,questiontype,questiondescription,questioninfo,questionanswerdescription from dramascript"+queryres+"of"+revdata.Username+" where missionname= ?", revdata.Missionname).Scan(&questiondata.Mediatype, &questiondata.Mediaaddress, &questiondata.Mediadescription, &questiondata.Questiontype, &questiondata.Questiondescription, &questiondata.Questioninfo, &questiondata.Questionanswerdescrption)
			database.QueryRow("select hasbeforeoverlay,beforeoverlayinfo,beforeoverlayimageurl,beforedialogaudiourllist from dramascript"+queryres+"of"+revdata.Username+" where missionname= ?", revdata.Missionname).Scan(&questiondata.Hasbeforeoverlay, &questiondata.Beforeoverlayinfo, &questiondata.Beforeoverlayimageurl, &questiondata.Beforedialogaudiourllist)
			database.QueryRow("select hasafteroverlay,afteroverlayinfo,afteroverlayimageurl,afterdialogaudiourllist from dramascript"+queryres+"of"+revdata.Username+" where missionname= ?", revdata.Missionname).Scan(&questiondata.Hasafteroverlay, &questiondata.Afteroverlayinfo, &questiondata.Afteroverlayimageurl, &questiondata.Afterdialogaudiourllist)
			database.QueryRow("select falltoolornot,falltoolname from dramascript"+queryres+"of"+revdata.Username+" where missionname= ?", revdata.Missionname).Scan(&questiondata.Falltoolornot, &questiondata.Falltoolname)
			resultjson.Data = questiondata
			c.JSON(http.StatusOK, resultjson)
		}

	})
	r.POST("/wxuserparticipatedatainactivity", func(c *gin.Context) {
		var resdata struct {
			Username           string `json:"username"`
			Dramascriptcreator string `json:"dramascriptcreator"`
			Activityid         string `json:"activityid"`
		}
		var data2send struct {
			TotalScore         int    `json:"totalscore"`
			Scoreuserget       int    `json:"scoreuserget"`
			Userfirstlogintime string `json:"userfirstlogintime"`
			Tooluserget        string `json:"tooluserget"`
			Pointusernowat     int    `json:"pointusernowat"` //这里改成了pointid
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("用户活动参与情况获取失败")
		} else {
			println(resdata.Activityid)
			println(resdata.Dramascriptcreator)
			println(resdata.Username)
			database.QueryRow("select scoreuserneedtoget from activitylistof"+resdata.Dramascriptcreator+" where activityid= ?", resdata.Activityid).Scan(&data2send.TotalScore)
			println(data2send.TotalScore)
			database.QueryRow("select scoreuserget,tooluserget,userfirstlogintime,pointusernowat from activity"+resdata.Activityid+"of"+resdata.Dramascriptcreator+" where username= ?", resdata.Username).Scan(&data2send.Scoreuserget, &data2send.Tooluserget, &data2send.Userfirstlogintime, &data2send.Pointusernowat)
			println(data2send.Scoreuserget, data2send.Tooluserget, data2send.Userfirstlogintime)
		}
		c.JSON(http.StatusOK, data2send)
	})
	r.POST("/wxupdatescoreuserget", func(c *gin.Context) {
		var resdata struct {
			Scoreuserget       int    `json:"scoreuserget"` //这里打算后期写一下用户使用了道具之后，对道具的清除操作
			Username           string `json:"username"`
			Dramascriptcreator string `json:"dramascriptcreator"`
			Activityid         string `json:"activityid"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("获取微信小程序反馈的更新用户分数失败")
		} else {
			println("update activity" + resdata.Activityid + "of" + resdata.Dramascriptcreator + " set scoreuserget=" + strconv.Itoa(resdata.Scoreuserget) + " where username= ?")
			_, errflag2 := database.Exec("update activity"+resdata.Activityid+"of"+resdata.Dramascriptcreator+" set scoreuserget="+strconv.Itoa(resdata.Scoreuserget)+" where username= ?", resdata.Username)
			if errflag2 != nil {
				println("更新用户分数失败")
				println(errflag2)
				c.String(http.StatusOK, "更新用户分数失败")
			} else {
				c.String(http.StatusOK, "成功更新用户分数")
			}
		}
	})
	r.POST("/wxgettoolinfo", func(c *gin.Context) {
		var toolinfolist []interface{}
		var resdata struct {
			Tooluserget string `json:"tooluserget"`
		}
		var data2send struct {
			Data interface{} `json:"data"`
		}
		var toolinfo struct {
			Toolid               string `json:"toolid"`
			Toolname             string `json:"toolname"`
			Toolimageurl         string `json:"toolimageurl"`
			Toolinfo             string `json:"toolinfo"`
			Toolanimationname    string `json:"toolanimationname"`
			Tooldirectlyuseornot bool   `json:"tooldirectlyuseornot"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("请求用户数据失败(获取道具具体信息)")
		} else {
			println("获取道具信息测试:" + resdata.Tooluserget)
			if resdata.Tooluserget == "" {
				toolinfolist = nil
				data2send.Data = toolinfolist
			} else {
				var toolusergetlist = strings.Split(resdata.Tooluserget, ",")
				for _, element := range toolusergetlist {
					println(element)
					database.QueryRow("select id,toolname,toolimageurl,tooldescription,toolanimationname,candirectlyuseornot from toollist where toolname=?", element).Scan(&toolinfo.Toolid, &toolinfo.Toolname, &toolinfo.Toolimageurl, &toolinfo.Toolinfo, &toolinfo.Toolanimationname, &toolinfo.Tooldirectlyuseornot)
					toolinfolist = append(toolinfolist, toolinfo)
				}
				data2send.Data = toolinfolist
			}

			c.JSON(http.StatusOK, data2send)
		}
	})
	r.POST("/wxgetpetlist", func(c *gin.Context) {
		var petlist []interface{}
		var petinfo struct {
			Petid                  int    `json:"petid"`
			Name                   string `json:"name"`
			Petname                string `json:"petname"`
			Petfullbodyimageurl    string `json:"petfullbodyimageurl"`
			Pettransparentimageurl int    `json:"pettransparentimageurl"`
			Petinhouseimageurl     string `json:"petinhouseimageurl"`
			Toolcanuse             string `json:"toolcanuse"`
		}
		var resultjson struct {
			Data interface{} `json:"data"`
		}

		rows, errflag2 := database.Query("select petid,name,petname,petfullbodyimageurl,pettransparentimageurl,petinhouseimageurl,toolcanuse from petlist")
		if errflag2 != nil {
			println("获取宠物列表失败")
			fmt.Println(errflag2)
		} else {
			for rows.Next() {
				rows.Scan(&petinfo.Petid, &petinfo.Name, &petinfo.Petname, &petinfo.Petfullbodyimageurl, &petinfo.Pettransparentimageurl, &petinfo.Petinhouseimageurl, &petinfo.Toolcanuse)
				petlist = append(petlist, petinfo)
			}
		}
		resultjson.Data = petlist
		c.JSON(http.StatusOK, resultjson)
	})
	r.POST("/wxpetcheckout", func(c *gin.Context) {
		var resdata struct {
			Petname string `json:"petname"`
		}
		var petinfo struct {
			Toolcanuse string `json:"toolcanuse"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("请求用户数据失败（检查宠物可用道具）")
		} else {
			database.QueryRow("select toolcanuse from petlist").Scan(&petinfo.Toolcanuse)
			println(petinfo.Toolcanuse)
			c.JSON(http.StatusOK, petinfo)
		}
	})
	r.POST("/wxupdatetooluserget", func(c *gin.Context) {
		var resdata struct {
			Username           string `json:"username"`
			Newtooluserget     string `json:"newtooluserget"`
			Dramascriptcreator string `json:"dramascriptcreator"`
			Activityid         string `json:"activityid"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("请求用户数据失败(更新道具列表)")
		} else {
			println("update activity" + resdata.Activityid + "of" + resdata.Dramascriptcreator + " set tooluserget='" + resdata.Newtooluserget + "' where username='" + resdata.Username + "'")
			_, err := database.Exec("update activity" + resdata.Activityid + "of" + resdata.Dramascriptcreator + " set tooluserget='" + resdata.Newtooluserget + "' where username='" + resdata.Username + "'")
			if err != nil {
				println("更新道具失败:" + err.Error())
			}
		}
	})
	r.POST("/wxgetstoreinfo", func(c *gin.Context) {
		var toolinfolist []interface{}
		var data2send struct {
			Data interface{} `json:"data"`
		}
		var toolinfo struct {
			Toolid            string `json:"toolid"`
			Toolname          string `json:"toolname"`
			Toolimageurl      string `json:"toolimageurl"`
			Toolinfo          string `json:"toolinfo"`
			Toolanimationname string `json:"toolanimationname"`
			Scoreneedtobuy    int    `json:"scoreneedtobuy"`
		}
		rows, errflag := database.Query("select id,toolname,toolimageurl,tooldescription,toolanimationname,scoreneedtobuy  from toollist where canbuyornot=1")
		if errflag != nil {
			println("获取数据库信息失败（获取积分商店可兑换信息）")
		} else {
			for rows.Next() {
				err := rows.Scan(&toolinfo.Toolid, &toolinfo.Toolname, &toolinfo.Toolimageurl, &toolinfo.Toolinfo, &toolinfo.Toolanimationname, &toolinfo.Scoreneedtobuy)
				if err != nil {
					println("查询错误：" + err.Error())
				}
				toolinfolist = append(toolinfolist, toolinfo)
			}
		}
		data2send.Data = toolinfolist
		c.JSON(http.StatusOK, data2send)
	})
	r.POST("/wxgetsingletoolinfo", func(c *gin.Context) {
		var resdata struct {
			Toolname string `json:"toolname"`
		}
		var toolinfo struct {
			Toolid            string `json:"toolid"`
			Toolname          string `json:"toolname"`
			Toolimageurl      string `json:"toolimageurl"`
			Toolinfo          string `json:"toolinfo"`
			Toolanimationname string `json:"toolanimationname"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("请求用户数据失败(获取单个道具具体信息)")
		} else {
			println(resdata.Toolname)
			database.QueryRow("select id,toolname,toolimageurl,tooldescription,toolanimationname from toollist where toolname=?", resdata.Toolname).Scan(&toolinfo.Toolid, &toolinfo.Toolname, &toolinfo.Toolimageurl, &toolinfo.Toolinfo, &toolinfo.Toolanimationname)
			c.JSON(http.StatusOK, toolinfo)
		}
	})
	r.POST("/wxupdatepointusernowat", func(c *gin.Context) {
		var resdata struct {
			Username           string `json:"username"`
			Newpointusernowat  int    `json:"newpointusernowat"`
			Dramascriptcreator string `json:"dramascriptcreator"`
			Activityid         string `json:"activityid"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("请求用户数据失败（更新点位信息）")
		} else {
			println("结构体数据:" + strconv.Itoa(resdata.Newpointusernowat) + "," + resdata.Username + "," + resdata.Dramascriptcreator + "," + resdata.Activityid)
			println("update activity" + resdata.Activityid + "of" + resdata.Dramascriptcreator + " set pointusernowat=" + strconv.Itoa(resdata.Newpointusernowat) + " where username='" + resdata.Username + "';")
			_, errflag2 := database.Exec("update activity"+resdata.Activityid+"of"+resdata.Dramascriptcreator+" set pointusernowat="+strconv.Itoa(resdata.Newpointusernowat)+" where username=?", resdata.Username)
			if errflag2 != nil {
				println("更新用户点位失败（数据库错误）")
			}
		}
	})
	r.POST("/getaccesstoken", func(c *gin.Context) {
		access_token, errflag1 := c.GetPostForm("accesstoken")
		if !errflag1 {
			println("获取accesstoken失败")
		} else {
			accesstoken = access_token
			println("access_token:" + accesstoken)
		}
	})
	r.POST("/textsecuritycheck", func(c *gin.Context) {
		var resdata struct {
			Textneedtocheck string `json:"textneedtocheck"`
		}
		var data2send struct {
			Content string `json:"content"`
		}
		var checkresult struct {
			Errcode int    `json:"errcode"`
			Errmsg  string `json:"errmsg"`
		}
		errflag1 := c.BindJSON(&resdata)
		data2send.Content = resdata.Textneedtocheck
		println(resdata.Textneedtocheck)
		body, _ := json.Marshal(data2send)
		if errflag1 != nil {
			println("获取需进行安全检查的文本失败")
		} else {
			resp, err := http.Post("https://api.weixin.qq.com/wxa/msg_sec_check?access_token="+accesstoken, "application/json", bytes.NewBuffer(body))
			if err != nil {
				fmt.Println(err)
			}

			defer resp.Body.Close()
			body, err := io.ReadAll(resp.Body)
			if err != nil {
				// handle error
				println("读取反馈错误")
			}

			fmt.Println(string(body))
			errflag2 := json.Unmarshal(body, &checkresult)
			if errflag2 != nil {
				println("内容安全api返回的内容不正常")
			} else {
				if checkresult.Errcode == 87014 {
					println("发现违法违规信息")
					c.String(http.StatusOK, "发现违法违规信息")
				}
				if checkresult.Errcode == 0 {
					println("内容正常")
					c.String(http.StatusOK, "内容正常")
				}
			}
		}
	})
	r.POST("/miniprogramlogin", func(c *gin.Context) {
		var resdata struct {
			Js_code string `json:"js_code"`
		}
		var loginresult struct {
			Session_key string `json:"session_key"`
			Openid      string `json:"openid"`
		}
		var userinfotosend struct {
			Description       string `json:"description"`
			Useropenid        string `json:"useropenid"`
			Username          string `json:"username"`
			Useravatarurl     string `json:"useravatarurl"`
			Totalscoreuserget int    `json:"totalscoreuserget"`
			Userprovince      string `json:"userprovince"`
			Usercity          string `json:"usercity"`
		}
		errflag1 := c.BindJSON(&resdata)
		var appid = "wxa7500b2f7fe874cc"
		var secret = "ce09f70a9d609854eaddb5fb13760381"
		println(resdata.Js_code)
		if errflag1 != nil {
			println("获取js_code失败")
		} else {
			resp, err := http.Get("https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code=" + resdata.Js_code + "&grant_type=authorization_code")
			if err != nil {
				fmt.Println(err)
			}

			defer resp.Body.Close()
			body, err := io.ReadAll(resp.Body)
			if err != nil {
				// handle error
				println("读取反馈错误")
			}

			fmt.Println(string(body))
			errflag2 := json.Unmarshal(body, &loginresult)
			if errflag2 != nil {
				println("反馈的登录信息不是json")
			} else {
				var haveuserinfoornot int
				println(loginresult.Openid)
				database.QueryRow("select exists(select * from miniprogramuserinfo where useropenid=?)", loginresult.Openid).Scan(&haveuserinfoornot)
				println(haveuserinfoornot)
				if haveuserinfoornot == 0 {
					var dataneedtosend struct {
						Description string `json:"description"`
						Useropenid  string `json:"useropenid"`
					}
					dataneedtosend.Description = "无该用户记录，需要注册"
					dataneedtosend.Useropenid = loginresult.Openid
					c.JSON(http.StatusOK, dataneedtosend)
				} else {
					userinfotosend.Description = "成功登录"
					database.QueryRow("select useropenid,username,useravatarurl,totalscoreuserget,userprovince,usercity from miniprogramuserinfo where useropenid=?", loginresult.Openid).Scan(&userinfotosend.Useropenid, &userinfotosend.Username, &userinfotosend.Useravatarurl, &userinfotosend.Totalscoreuserget, &userinfotosend.Userprovince, &userinfotosend.Usercity)
					c.JSON(http.StatusOK, userinfotosend)
				}
			}
		}
	})
	r.POST("/miniprogramregister", func(c *gin.Context) {
		var resdata struct {
			Useropenid        string `json:"useropenid"`
			Username          string `json:"username"`
			Useravatarurl     string `json:"useravatarurl"`
			Totalscoreuserget int    `json:"totalscoreuserget"`
			Userprovince      string `json:"userprovince"`
			Usercity          string `json:"usercity"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("获取小程序用户注册信息失败")
		} else {
			_, errflag2 := database.Exec("insert into miniprogramuserinfo(useropenid,username,useravatarurl,totalscoreuserget,userprovince,usercity) values(?,?,?,?,?,?)", resdata.Useropenid, resdata.Username, resdata.Useravatarurl, resdata.Totalscoreuserget, resdata.Userprovince, resdata.Usercity)
			if errflag2 != nil {
				println("向数据库插入小程序用户注册信息失败")
			}
		}
	})
	r.POST("/miniprogramchangeuserregion", func(c *gin.Context) {
		var resdata struct {
			Useropenid   string `json:"useropenid"`
			Userprovince string `json:"userprovince"`
			Usercity     string `json:"usercity"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("获取小程序用户修改地区数据失败")
		} else {
			_, errflag2 := database.Exec("update miniprogramuserinfo set userprovince=?,usercity=? where useropenid=?", resdata.Userprovince, resdata.Usercity, resdata.Useropenid)
			if errflag2 != nil {
				println("小程序用户修改地区数据失败")
			} else {
				c.String(http.StatusOK, "修改成功")
			}
		}
	})
	r.POST("/miniprogramchangeusername", func(c *gin.Context) {
		var resdata struct {
			Useropenid string `json:"useropenid"`
			Username   string `json:"username"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("获取小程序用户修改昵称数据失败")
		} else {
			_, errflag2 := database.Exec("update miniprogramuserinfo set username=? where useropenid=?", resdata.Username, resdata.Useropenid)
			if errflag2 != nil {
				println("小程序用户修改地区数据失败")
				//这里要向小程序发送错误代码从而正确处理错误，这个要注意
			} else {
				c.String(http.StatusOK, "修改成功")
			}
		}
	})
	r.POST("/miniprogramgetuseractivitylist", func(c *gin.Context) {
		var resdata struct {
			Useropenid string `json:"useropenid"`
		}
		println(resdata.Useropenid)
		var queryresult struct {
			Activityuserparticipate string `json:"activityuserparticipate"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("接收小程序用户获取活动列表数据失败")
		} else {
			database.QueryRow("select activityuserparticipate from miniprogramuserinfo where useropenid=?", resdata.Useropenid).Scan(&queryresult.Activityuserparticipate)
			println("活动列表:" + queryresult.Activityuserparticipate)
			c.String(http.StatusOK, queryresult.Activityuserparticipate) //需要补充错误处理
		}
	})
	r.POST("/miniprogramgetactivityinfo", func(c *gin.Context) {
		var resdata struct {
			Dramascriptcreator string `json:"dramascriptcreator"`
			Activityid         string `json:"activityid"`
		}
		var data2send struct {
			Routeid       int    `json:"routeid"`
			Dramascriptid int    `json:"dramascriptid"`
			Activityname  string `json:"activityname"`
		}
		errflag1 := c.BindJSON(&resdata)
		println(resdata.Activityid)
		println(resdata.Dramascriptcreator)
		if errflag1 != nil {
			println("接收小程序用户请求获取活动具体信息数据失败")
		} else {
			errflag2 := database.QueryRow("select routeid,dramascriptid,activityname from activitylistof"+resdata.Dramascriptcreator+" where activityid=?", resdata.Activityid).Scan(&data2send.Routeid, &data2send.Dramascriptid, &data2send.Activityname)
			if errflag2 != nil {
				println("数据库查询失败（小程序用户请求获取活动具体信息）") //前面用过queryrow的地方仿效做一下错误处理的预案代码
			}
			c.JSON(http.StatusOK, data2send)
		}
	})
	r.POST("/miniprogramchecknewmemberinactivityornot", func(c *gin.Context) {
		var resdata struct {
			Username           string `json:"username"`
			Useropenid         string `json:"useropenid"`
			Activityid         string `json:"activityid"`
			Dramascriptcreator string `json:"dramascriptcreator"`
			Timenow            string `json:"timenow"`
		}
		errflag1 := c.BindJSON(&resdata)
		if errflag1 != nil {
			println("接收用户检查是否为活动新用户数据错误")
		} else {
			var isnewmemberornot int
			errflag2 := database.QueryRow("select exists(select * from activity"+resdata.Activityid+"of"+resdata.Dramascriptcreator+" where useropenid=?)", resdata.Useropenid).Scan(&isnewmemberornot)
			if errflag2 != nil {
				println("数据库读取失败（检查是否为活动新用户）")
			} else {
				if isnewmemberornot == 0 {
					_, errflag3 := database.Exec("insert into activity"+resdata.Activityid+"of"+resdata.Dramascriptcreator+"(useropenid,userfirstlogintime,username) values(?,?,?)", resdata.Useropenid, resdata.Timenow, resdata.Username) //点位(pointnowuserat)和初始道具和初始得分在创建表的时候设置一个默认值
					if errflag3 != nil {
						println("在活动中新建用户数据失败")
					}
					var activityuserparticipate string
					var activityuserparticipatelist []string
					errflag4 := database.QueryRow("select activityuserparticipate from miniprogramuserinfo where useropenid=?", resdata.Useropenid).Scan(&activityuserparticipate)
					if errflag4 != nil {
						println(("数据库读取失败（向小程序用户信息中添加本次活动内容）"))
					}
					if activityuserparticipate == "" {
						activityuserparticipatelist = append(activityuserparticipatelist, ("activity" + resdata.Activityid + "of" + resdata.Dramascriptcreator))
					} else {
						activityuserparticipatelist = strings.Split(activityuserparticipate, ";")
						for _, value := range activityuserparticipatelist {
							if value == ("activity" + resdata.Activityid + "of" + resdata.Dramascriptcreator) {
								return
							}
						}
						activityuserparticipatelist = append(activityuserparticipatelist, ("activity" + resdata.Activityid + "of" + resdata.Dramascriptcreator))
					}
					activityuserparticipate = strings.Join(activityuserparticipatelist, ";")
					_, errflag5 := database.Exec("update miniprogramuserinfo set activityuserparticipate=? where useropenid=?", activityuserparticipate, resdata.Useropenid)
					if errflag5 != nil {
						println("向小程序用户信息中活动列表中插入本次活动失败") //这些地方要写错误处理
					}
				}
			}
		}
	})
	/*
		r.POST("/webgetuseractivitylist",func(c *gin.Context) {
			username,errflag1 :=c.GetPostForm("un")
			if(errflag1!=nil){
				println("获取表单数据【用户名】失败（网页获取活动列表）")
			}else{
				println(username)
			}
			type,errflag2 := c.GetPostForm("type")
			if(errflag2!=nil){
				println("获取表单数据【命令类型】失败（网页获取活动列表）")
			}else{
				println(type)
			}
		})
	*/
	r.POST("/webgetroutepoints", func(c *gin.Context) {
		var result string
		username, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取用户名失败")
		} else {
			println(username)
		}
		id, errflag2 := c.GetPostForm("RouteId")
		if !errflag2 {
			println("获取路线id失败")
		} else {
			println(id)
			rows, errflag3 := database.Query("select * from route" + id + "of" + username) //这里好像有bug,依靠的是路线列表生成的时候是查询现有路线列表，从而显示的元素的id和实际的id是对应的，如果用户新建了以后会不会出bug?
			if errflag3 != nil {
				println("线路点位获取失败")
			} else {
				for rows.Next() {
					var pointID int
					var longitude float32
					var latitude float32 //我在mysql中定义的是float类型变量，不知道获取的时候会不会自动转换
					var pointName string
					var pointDescription string
					//rows.Scan(&pointID)
					rows.Scan(&pointID, &longitude, &latitude, &pointName, &pointDescription)
					pointIDstr := strconv.Itoa(pointID)
					longitudestr := strconv.FormatFloat(float64(longitude), 'f', 6, 32)
					latitudestr := strconv.FormatFloat(float64(latitude), 'f', 6, 32)
					println(pointIDstr, longitudestr, latitudestr, pointName, pointDescription) //测试用,已经成功
					if result == "" {
						result = pointName + ":" + pointDescription + ":" + longitudestr + ":" + latitudestr + ":" + pointIDstr
					} else {
						result = result + ";" + pointName + ":" + pointDescription + ":" + longitudestr + ":" + latitudestr + ":" + pointIDstr
					}
				}
				c.String(http.StatusOK, result)
			}
		}
	})
	r.POST("/webgetmissionindramascriptlist", func(c *gin.Context) { //这里需要等待李立写一下剧本基本信息选取才行
		dramascriptcreator, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取表单数据【剧本创建者】失败(剧本创作获取某个点位的任务列表)") //如果失败则反馈错误信息到网页，这里暂时不写
		} else {
			println(dramascriptcreator)
		}
		dramascriptid, errflag2 := c.GetPostForm("dramascriptid")
		if !errflag2 {
			println("获取表单数据【剧本id】失败(剧本创作获取某个点位的任务列表)")
		} else {
			println(dramascriptid)
		}
		pointid, errflag3 := c.GetPostForm("pointid")
		if !errflag3 {
			println("获取表单数据【点位id】失败(剧本创作获取某个点位的任务列表)")
		} else {
			println(pointid)
		}

	})
	r.POST("/webgetdramascriptlist", func(c *gin.Context) {
		var result string
		//以formdata形式传递参数过来
		dramascriptcreator, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取表单数据【剧本创建者】失败（剧本创作选择剧本功能）")
		} else {
			println(dramascriptcreator)
		}
		routeid, errflag2 := c.GetPostForm("LineID")
		if !errflag2 {
			println("获取表单数据【路线id】失败（剧本创作选择剧本功能）")
		} else {
			println(routeid)
		}
		println("select dramascriptname,dramascriptdescription,id from dramascriptlistof" + dramascriptcreator + " where routeid=" + routeid)
		rows, errflag3 := database.Query("select dramascriptname,dramascriptdescription,id from dramascriptlistof" + dramascriptcreator + " where routeid=" + routeid) //查询指定路线的的所有剧本
		if errflag3 != nil {
			fmt.Println(errflag3)
			println("剧本列表获取失败（剧本创作选择剧本功能）")
		} else {
			for rows.Next() {
				var dramascriptid int
				var dramascriptname string
				var dramascriptdescription string
				rows.Scan(&dramascriptname, &dramascriptdescription, &dramascriptid)
				var dramascriptidstr = strconv.Itoa(dramascriptid)
				if result == "" {
					result = dramascriptname + ":" + dramascriptdescription + ":" + dramascriptidstr
				} else {
					result = result + ";" + dramascriptname + ":" + dramascriptdescription + ":" + dramascriptidstr
				}
			}
			println(result)
			c.String(http.StatusOK, result)
		}
	}) //网页进入剧本创作后首先进入剧本选择界面，则首先需要获取用户的剧本列表信息
	r.POST("/webcreatenewdramacript", func(c *gin.Context) {
		var newdramascriptid int
		dramascriptcreator, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取表单数据【剧本创建者】失败（剧本创作创建新剧本功能）")
		} else {
			println(dramascriptcreator)
		}
		dramascriptname, errflag2 := c.GetPostForm("DramaName")
		if !errflag2 {
			println("获取表单数据【剧本名称】失败（剧本创作创建新剧本功能）")
		} else {
			println(dramascriptname)
		}
		dramascriptdescription, errflag3 := c.GetPostForm("DramaMarker")
		if !errflag3 {
			println("获取表单数据【剧本描述】失败（剧本创作创建新剧本功能）")
		} else {
			println(dramascriptdescription)
		}
		routeid, errflag4 := c.GetPostForm("LineID")
		if !errflag4 {
			println("获取表单数据【路线id】失败（剧本创作创建新剧本功能）")
		} else {
			println(routeid)
		}
		errflag5 := database.QueryRow("select count(*) from dramascriptlistof" + dramascriptcreator).Scan(&newdramascriptid)
		if errflag5 != nil {
			println("数据库查询【剧本列表中剧本个数】错误（剧本创作创建新剧本功能）")
		} else {
			newdramascriptid += 1
			_, errflag6 := database.Exec("insert into dramascriptlistof"+dramascriptcreator+"(id,dramascriptname,dramascriptdescription,routeid) values(?,?,?,?)", newdramascriptid, dramascriptname, dramascriptdescription, routeid)
			if errflag6 != nil {
				println("向数据库中插入数据【新剧本有关记录】失败（剧本创作创建新剧本功能）")
			} else {
				_, errflag7 := database.Exec("create table dramascript" + strconv.Itoa(newdramascriptid) + "of" + dramascriptcreator + "(missionid int unsigned,missionname varchar(100) not null default(''),missiontype tinyint(1) default(1),mediatype varchar(50) not null default(''),mediaaddress varchar(200) not null default(''),mediadescription varchar(200) not null default(''),questiontype varchar(50) not null default(''),questiondescription varchar(200) not null default(''),questioninfo varchar(300) not null default(''),questionanswerdescription varchar(100) not null default(''),status tinyint(1) default 0,score int default 0,hasbeforeoverlay tinyint(1) default 0,beforeoverlayinfo varchar(200) not null default(''),beforeoverlayimageurl varchar(200) not null default(''),beforedialogaudiourllist varchar(500) not null default(''),hasafteroverlay tinyint(1) default 0,afteroverlayinfo varchar(200) not null default(''),afteroverlayimageurl varchar(200) not null default(''),afterdialogaudiourllist varchar(500) not null default(''),pointid int default 0,pointname varchar(200) not null default(''),falltoolornot tinyint(1) default 0,ARmodelurl varchar(500) not null default(''),modeofAR varchar(100) not null default(''),2DMarkerimageurl varchar(500) not null default(''),3DMarkervideourl varchar(500) not null default(''),ARdescription varchar(200) not null default(''))")
				if errflag7 != nil {
					println("创建新剧本对应的新表失败（剧本创作创建新剧本功能）")
				} else {
					c.String(http.StatusOK, strconv.Itoa(newdramascriptid))
				}
			}
		}
	})
	r.POST("/webgetpointmissions", func(c *gin.Context) {
		var result string
		dramascriptcreator, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取表单数据（剧本创建者）失败（获取属于该点位的任务列表）")
		} else {
			println(dramascriptcreator)
		}
		pointid, errflag2 := c.GetPostForm("PointID")
		if !errflag2 {
			println("获取表单数据（点位Id）失败（获取属于该点位的任务列表）")
		} else {
			println(pointid)
		}
		dramascriptid, errflag3 := c.GetPostForm("DramaID")
		if !errflag3 {
			println("获取表单数据（剧本id）失败（获取属于该点位的任务列表）")
		} else {
			println(dramascriptid)
		}
		rows, errflag4 := database.Query("select missionname,missiontype,missionid,mediatype,questiontype from dramascript"+dramascriptid+"of"+dramascriptcreator+" where pointid=?", pointid)
		if errflag4 != nil {
			fmt.Println(errflag4)
			println("数据库查询（属于某个点位的任务列表）失败（获取属于该点位的任务列表）")
		} else {
			var missionname string
			var missiontype int
			var missionid int
			var mediatype string
			var questiontype string
			for rows.Next() {
				rows.Scan(&missionname, &missiontype, &missionid, &mediatype, &questiontype)
				if result == "" {
					result = missionname + ":" + strconv.Itoa(missiontype) + ":" + strconv.Itoa(missionid) + ":" + mediatype + "|" + questiontype
				} else {
					result = result + ";" + missionname + ":" + strconv.Itoa(missiontype) + ":" + strconv.Itoa(missionid) + ":" + mediatype + "|" + questiontype
				}
			}
			c.String(http.StatusOK, result)
		}
	})
	r.POST("/webGetTasks", func(c *gin.Context) {
		un, errflag1 := c.GetPostForm("un")
		if !errflag1 {
			println("获取表单数据（用户名）失败，（网页获取任务具体信息）")
		} else {
			println(un)
		}
		pointid, errflag2 := c.GetPostForm("PointID")
		if !errflag2 {
			println("获取表单数据（点位id）失败，（网页获取任务具体信息）")
		} else {
			println(pointid)
		}
		dramascriptid, errflag3 := c.GetPostForm("DramaID")
		if !errflag3 {
			println("获取表单数据（剧本id）失败，（网页获取任务具体信息）")
		} else {
			println(dramascriptid)
		}
		missionid, errflag4 := c.GetPostForm("ID")
		if !errflag4 {
			println("获取表单数据（任务ID）失败，（网页获取任务具体信息）")
		} else {
			println(missionid)
		}
		var data2send struct {
			Missionstatus             int
			Nextmissionid             int
			Missionnote               string
			Mediatype                 string
			Mediaaddress              string
			Questionname              string
			Questiondescription       string
			Questioninfo              string
			Questionanswerdescription string
			Score                     int
			HasARornot                int
			ModeofAR                  string
			ARResourceUrl             string
		}
		errflag5 := database.QueryRow("select missionStatus,nextmissionid,missionnote,mediatype,mediaaddress,questionname,questiondescription,questioninfo,questionanswerdescription,score from dramascript"+dramascriptid+"of"+un+" where missionid=?", missionid).Scan(&data2send.Missionstatus, &data2send.Nextmissionid, &data2send.Missionnote, &data2send.Mediatype, &data2send.Mediaaddress, &data2send.Questionname, &data2send.Questiondescription, &data2send.Questioninfo, &data2send.Questionanswerdescription, &data2send.Score)
		if errflag5 != nil {
			fmt.Println(errflag5)
			println("数据库查询失败（网页获取任务具体信息）")
		} else {
			var optionslist = strings.Split(data2send.Questioninfo, ";")
			c.String(http.StatusOK, strconv.Itoa(data2send.Missionstatus)+";"+strconv.Itoa(data2send.Nextmissionid)+";"+data2send.Missionnote+";"+data2send.Mediatype+"|90x40|5x0|"+data2send.Mediaaddress+":question|90x60|5x0|*|"+data2send.Questionname+"~!"+data2send.Questioninfo+"~@"+strings.Join(optionslist, "~#")+"~@"+data2send.Questionanswerdescription+"~@"+strconv.Itoa(data2send.Score))
		}
	})
	r.POST("/webgetactivitylist", func(c *gin.Context) {
		//就用formdata发过来吧
		un, errflag1 := c.GetPostForm("un") //剧本创建者账号
		var activityname string
		var testQRCodeurl string
		var formalQRCodeurl string
		var totalParticipateNum int
		var avarageParticipateTime float64
		var result string
		var activitynum int
		if !errflag1 {
			println("获取表单数据(剧本创建者账号)失败,（网页获取活动列表）")
		} else {
			println(un)
			errflag3 := database.QueryRow("select count(*) from activitylistof" + un).Scan(&activitynum)
			if errflag3 != nil {
				fmt.Println(errflag3)
				println("数据库查询失败（获取活动数）（网页获取活动列表）")
			}
			rows, errflag2 := database.Query("select activityname,testQRCodeurl,formalQRCodeurl,totalParticipateNum,avarageParticipateTime from activitylistof" + un)
			if errflag2 != nil {
				fmt.Println(errflag2)
				println("数据库查询(活动列表数据)失败，（网页获取活动列表）)")
			} else {
				for rows.Next() {
					rows.Scan(&activityname, &testQRCodeurl, &formalQRCodeurl, &totalParticipateNum, &avarageParticipateTime)
					if result == "" {
						result = strconv.Itoa(activitynum) + ";" + activityname + ":" + testQRCodeurl + ":" + formalQRCodeurl + ":" + strconv.Itoa(totalParticipateNum) + ":" + strconv.FormatFloat(avarageParticipateTime, 'f', 2, 64)
					} else {
						result = result + ";" + activityname + ":" + testQRCodeurl + ":" + formalQRCodeurl + ":" + strconv.Itoa(totalParticipateNum) + ":" + strconv.FormatFloat(avarageParticipateTime, 'f', 2, 64)
					}
				}
				c.String(http.StatusOK, result)
			}
		}
	})
	r.POST("/webgetquestionbank", func(c *gin.Context) {
		//用formdata
		un, errflag1 := c.GetPostForm("un")
		var missionid int
		var missionname string
		var mediatype string //题目类型
		var score int
		var result string
		if !errflag1 {
			println("获取表单数据（剧本创建者用户名）失败,（网页获取题库列表信息）")
		} else {
			println(un)
			rows, errflag2 := database.Query("select missionid,missionname,mediatype,score from questionbankof" + un)
			if errflag2 != nil {
				fmt.Println(errflag2)
				println("数据库查询（题库列表数据）失败，（网页获取题库列表信息）")
			} else {
				for rows.Next() {
					rows.Scan(&missionid, &missionname, &mediatype, &score)
					if result == "" {
						result = strconv.Itoa(missionid) + missionname + mediatype + strconv.Itoa(score)
					} else {
						result = result + ";" + strconv.Itoa(missionid) + missionname + mediatype + strconv.Itoa(score)
					}
				}
				c.String(http.StatusOK, result)
			}
		}
	})
	r.Run(":8000")
}
