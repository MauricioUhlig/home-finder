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
	//database.Migrate()

	r := gin.Default()
    api := r.Group("/api")

	api.POST("/login", controllers.Login)

	auth := api.Group("/auth")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.POST("/register", controllers.Register)
		auth.GET("/profile", controllers.Profile)
	}

	// Comment routes
	commentRoutes := api.Group("/comments")
    commentRoutes.Use(middleware.AuthMiddleware())
	{
		commentRoutes.POST("/", controllers.CreateComment)
		commentRoutes.GET("/location/:id", controllers.GetCommentsByLocationID)
		commentRoutes.GET("/:id", controllers.GetCommentByID)
		commentRoutes.PUT("/:id", controllers.UpdateComment)
		commentRoutes.DELETE("/:id", controllers.DeleteComment)
	}

	// Location routes
	locationRoutes := api.Group("/locations")
    locationRoutes.Use(middleware.AuthMiddleware())
	{
		locationRoutes.POST("/", controllers.CreateLocation)
		locationRoutes.GET("/", controllers.GetAllLocations)
		locationRoutes.GET("/:id", controllers.GetLocationByID)
		locationRoutes.PUT("/:id", controllers.UpdateLocation)
		locationRoutes.DELETE("/:id", controllers.DeleteLocation)
	}
	// admin := r.Group("/admin")
	// admin.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin"))
	// {
	//     admin.GET("/dashboard", controllers.AdminDashboard)
	// }

	r.Run(":8080")
}
