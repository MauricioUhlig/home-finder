package database

import (
	"github.com/MauricioUhlig/home-finder/config"
	"github.com/MauricioUhlig/home-finder/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
    dsn := "host=" + config.GetEnv("DB_HOST", "localhost") +
        " user=" + config.GetEnv("DB_USER", "yourusername") +
        " password=" + config.GetEnv("DB_PASSWORD", "yourpassword") +
        " dbname=" + config.GetEnv("DB_NAME", "yourdbname") +
        " port=" + config.GetEnv("DB_PORT", "5432") +
        " sslmode=disable"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database")
    }
    DB = db
}

func Migrate() {
    DB.AutoMigrate(&models.User{})
}