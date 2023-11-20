package main

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func loginCheck() {

}
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
	r.POST("/createNewRoute",func(c *gin.Context) {
		var routenumstr string
		username,errflag1:=c.GetPostForm("username")
		if(!errflag1){
			println("用户名称获取失败")
			c.String(http.StatusOK,"用户名称获取失败")
		}
		database.QueryRow("select count(*) from routelistof"+username).Scan(&routenumstr)
		routenum,errflag2:=strconv.Atoi(routenumstr)
		if(errflag2!=nil){
			println("获取用户路线个数的格式错误")
			c.String(http.StatusOK,"获取用户路线个数的格式错误")
		}
		routenum++
		routenumstr=strconv.Itoa(routenum)
		_,errflag3:=database.Exec("create table route"+routenumstr+"of"+username+"(pointID int(100),longitude float,latitude float)")
		if(errflag3!=nil){
			println("路径数据表创建失败")
			c.String(http.StatusOK,"路径数据表创建失败")
		}
		routename,errflag4:=c.GetPostForm("routename")
		if(!errflag4){
			println("新路线名称获取失败")
			c.String(http.StatusOK,"新路线名称获取失败")
		}else{
			_,errflag5:=database.Exec("insert routelistof"+username+"(id,routename) values(?,?)",routenumstr,routename)
			if(errflag5!=nil){
				println("新路线插入路线列表数据库失败")
				c.String(http.StatusOK,"新路线插入路线列表数据库失败")
			}
		}
		
		numstr,errflag6:=c.GetPostForm("pointNum")
		if(errflag6){
			num,errflag7:=strconv.Atoi(numstr)
			if(errflag7!=nil){
				println("用户点位个数格式错误")
				c.String(http.StatusOK,"用户点位数据获取失败(情况2)")
			}
			for i:=1;i <= num;i++{
				pointdata,errflag8:=c.GetPostForm(strconv.Itoa(i))
				if(errflag8){
					longitude:=strings.Split(pointdata, "|")[0]
					latitude:=strings.Split(pointdata,"|")[1]
					
					_,errflag9:=database.Exec("insert route"+routenumstr+"of"+username+"(pointID,longitude,latitude) values(?,?,?)",strconv.Itoa(i),longitude,latitude)
					if(errflag9!=nil){
						println("插入点位数据失败")
						c.String(http.StatusOK,"插入点位数据失败")
					}

				}else{
					println("用户点位经纬度数据获取失败")
					c.String(http.StatusOK,"用户点位数据获取失败(情况3)")
				}
			}
		}else{
			println("用户点位个数获取失败")
			c.String(http.StatusOK,"用户点位数据获取失败(情况2)")
		}
	})
	r.Run(":8000")
}
