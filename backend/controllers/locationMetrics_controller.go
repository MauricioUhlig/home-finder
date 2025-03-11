package controllers

import (
	"net/http"

	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetMetricsByLocationID(c *gin.Context) {
	locationID := c.Param("locationID")

	var metrics models.LocationMetrics
	result := database.DB.Where("location_id = ?", locationID).First(&metrics)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Metrics not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": metrics})
}

// Update updates or inserts metrics (upsert)
func UpdateMetrics(c *gin.Context) {
	var input models.LocationMetrics
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if metrics exist for the given LocationID
	var existingMetrics models.LocationMetrics
	result := database.DB.Where("location_id = ?", input.LocationID).First(&existingMetrics)

	if result.Error == nil {
		// Update existing metrics
		existingMetrics.Stars = input.Stars
		existingMetrics.Location = input.Location
		existingMetrics.Neighborhood = input.Neighborhood
		existingMetrics.Safety = input.Safety
		existingMetrics.CustBenefit = input.CustBenefit

		if err := database.DB.Save(&existingMetrics).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": existingMetrics})
		return
	} else if result.Error == gorm.ErrRecordNotFound {
		// Insert new metrics
		if err := database.DB.Create(&input).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, input)
		return
	} else {
		// Handle other errors
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
}
