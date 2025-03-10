package main

import (
	"github.com/MauricioUhlig/home-finder/config"
	"github.com/MauricioUhlig/home-finder/controllers"
	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
    database.Connect()
	
	// Run migrations
	database.Migrate()

    r := gin.Default()

    
    r.POST("/login", controllers.Login)

    auth := r.Group("/auth")
    auth.Use(middleware.AuthMiddleware())
    {
        auth.POST("/register", controllers.Register)
        auth.GET("/profile", controllers.Profile)
    }

    // admin := r.Group("/admin")
    // admin.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin"))
    // {
    //     admin.GET("/dashboard", controllers.AdminDashboard)
    // }

    r.Run(":8080")
}