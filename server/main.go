package main

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func main() {
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

	r.GET("/context.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "context.html", nil)
	})
	//这个drama line是否后期是要根据后端数据修改参数大小
	r.GET("/drama-line.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "drama-line.html", nil)
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
				rows, err := database.Query("select routename from routelistof2513677")
				println(linenum)
				result = linenum
				if err != nil {
					println("获取数据失败")
				} else {
					for rows.Next() {
						var routename string
						rows.Scan(&routename)
						result = result + ";" + routename
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
			Missionname   string `json:"missionname"`
			Username      string `json:"username"`
		}
		var mission struct {
			Missionid   int    `json:"missionid"`
			Missionname string `json:"missionname"`
			Status      string `json:"status"`
			Score       int    `json:"score"`
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
			rows, errflag2 := database.Query("select missionid,missionname,status,score from dramascript" + queryres + "of" + revdata.Username)
			if errflag2 != nil {
				println("获取任务列表失败")
			} else {
				for rows.Next() {
					rows.Scan(&mission.Missionid, &mission.Missionname, &mission.Status, &mission.Score)
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
			database.QueryRow("select scoreuserget,tooluserget,userfirstlogintime from activity"+resdata.Activityid+"of"+resdata.Dramascriptcreator+" where username= ?", resdata.Username).Scan(&data2send.Scoreuserget, &data2send.Tooluserget, &data2send.Userfirstlogintime)
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
	r.Run(":8000")
}
