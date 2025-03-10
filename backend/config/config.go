package config

import (
    "os"
    "github.com/joho/godotenv"
)

// LoadEnv loads environment variables from the .env file
func LoadEnv() {
    err := godotenv.Load()
    if err != nil {
        panic("Error loading .env file")
    }
}

// GetEnv returns the value of an environment variable
func GetEnv(key string, defaultValue string) string {
    value := os.Getenv(key)
    if value == "" {
        return defaultValue
    }
    return value
}
