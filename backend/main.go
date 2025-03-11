package main

import (
	"time"

	"github.com/MauricioUhlig/home-finder/config"
	"github.com/MauricioUhlig/home-finder/controllers"
	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/middleware"
	"github.com/MauricioUhlig/home-finder/utils"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()
	database.Connect()

	// Run migrations
	//database.Migrate()

	r := gin.Default()
	
	go utils.CleanupOldFiles()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Replace with your Angular app's URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

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
		commentRoutes.POST("/", controllers.CommentController.Create)
		commentRoutes.GET("/location/:locationId", controllers.CommentController.GetByLocationID)
		commentRoutes.PUT("/:id", controllers.CommentController.Update)
		commentRoutes.DELETE("/:id", controllers.CommentController.Delete)
	}

	// Location routes
	locationRoutes := api.Group("/locations")
	locationRoutes.Use(middleware.AuthMiddleware())
	{
		locationRoutes.POST("/", controllers.LocationController.Create)
		locationRoutes.GET("/", controllers.LocationController.GetAll)
		locationRoutes.GET("/:id", controllers.LocationController.GetByID)
		locationRoutes.PUT("/:id", controllers.LocationController.Update)
		locationRoutes.DELETE("/:id", controllers.LocationController.Delete)
	}
	// Location routes
	metricsRoutes := api.Group("/metrics")
	metricsRoutes.Use(middleware.AuthMiddleware())
	{
		metricsRoutes.GET("/location/:locationID", controllers.GetMetricsByLocationID)
		metricsRoutes.POST("/:id", controllers.UpdateMetrics)
	}

	fileRoutes := api.Group("/files")
	fileRoutes.Use(middleware.AuthMiddleware())
	{
		fileRoutes.POST("/upload", controllers.UploadFile)
		fileRoutes.Static("/", utils.FilesDir)
	}

	r.Run(":8080")
}
