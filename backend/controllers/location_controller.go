package controllers

import (
	"net/http"

	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/models"
	"github.com/gin-gonic/gin"
)

type locationController struct{}

type locationCompact struct {
	ID      uint
	Address struct {
		Lat float64
		Lng float64
	} `gorm:"embedded"`
	Title       string
	Description string
	Color       string
	Price       uint32
}

var LocationController locationController

// CreateLocation creates a new location
func (ctrl *locationController) Create(c *gin.Context) {
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
func (ctrl *locationController) GetAll(c *gin.Context) {
	var locations []locationCompact

	// Fetch all locations from the database
	if err := database.DB.Table("locations").Select("ID, Lat, Lng, Title, Description, Color, Price").Scan(&locations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch locations"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": locations})
}

// GetLocationByID retrieves a location by its ID
func (ctrl *locationController) GetByID(c *gin.Context) {
	var location models.Location
	id := c.Param("id")

	// Fetch the location by ID
	if err := database.DB.Preload("Phones").Preload("Images").First(&location, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": location})
}

// UpdateLocation updates an existing location
func (ctrl *locationController) Update(c *gin.Context) {
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
func (ctrl *locationController) Delete(c *gin.Context) {
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
