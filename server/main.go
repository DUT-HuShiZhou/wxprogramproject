package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	//"github.com/jmoiron/sqlx"
)

func main() {
	//database,err:=sqlx.Open("mysql","root:******@tcp(127.0.0.1:3306)/mytest")
	r := gin.Default()
	r.LoadHTMLGlob("../web/htmls/*")
	r.Static("/styles", "../web/styles")
	r.Static("/scripts", "../web/scripts")
	r.Static("/images", "../web/images")
	r.Static("/font", "../web/font")

	r.GET("/index.html", func(c *gin.Context) {
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
	//这里要做登录验证数据的处理,前端那边的checkin.js要能够向我们发送信息

	r.Run(":8000")
}
