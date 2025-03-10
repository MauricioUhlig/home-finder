package controllers

import (
    "net/http"
    "github.com/MauricioUhlig/home-finder/models"
    "github.com/MauricioUhlig/home-finder/database"
    "github.com/gin-gonic/gin"
)

// CreateLocation creates a new location
func CreateLocation(c *gin.Context) {
    var location models.Location

    // Bind JSON input to the Location struct
    if err := c.ShouldBindJSON(&location); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Create the location in the database
    if err := database.DB.Create(&location).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create location"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"data": location})
}
// GetAllLocations retrieves all locations
func GetAllLocations(c *gin.Context) {
    var locations []models.Location

    // Fetch all locations from the database
    if err := database.DB.Preload("Phones").Preload("Images").Preload("Comments").Preload("Metrics").Find(&locations).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch locations"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": locations})
}
// GetLocationByID retrieves a location by its ID
func GetLocationByID(c *gin.Context) {
    var location models.Location
    id := c.Param("id")

    // Fetch the location by ID
    if err := database.DB.Preload("Phones").Preload("Images").Preload("Comments").Preload("Metrics").First(&location, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": location})
}
// UpdateLocation updates an existing location
func UpdateLocation(c *gin.Context) {
    var location models.Location
    id := c.Param("id")

    // Fetch the location by ID
    if err := database.DB.First(&location, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
        return
    }

    // Bind JSON input to the Location struct
    if err := c.ShouldBindJSON(&location); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Save the updated location
    if err := database.DB.Save(&location).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update location"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": location})
}
// DeleteLocation deletes a location by its ID
func DeleteLocation(c *gin.Context) {
    var location models.Location
    id := c.Param("id")

    // Fetch the location by ID
    if err := database.DB.First(&location, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
        return
    }

    // Delete the location
    if err := database.DB.Delete(&location).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete location"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Location deleted successfully"})
}