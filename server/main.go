package main

import (
	"net/http"

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

	r.GET("/checkin", func(c *gin.Context) {
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

	r.Run(":8000")
}
