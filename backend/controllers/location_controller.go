package controllers

import (
	"net/http"

	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/models"
	"github.com/MauricioUhlig/home-finder/utils"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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
	if err := database.DB.Model(&models.Location{}).Select("ID, Lat, Lng, Title, Description, Color, Price").Scan(&locations).Error; err != nil {
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
	var inputLocation models.Location
	id := c.Param("id")

	// Fetch the existing location by ID
	var existingLocation models.Location
	if err := database.DB.Preload("Phones").Preload("Images").First(&existingLocation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
		return
	}

	// Bind JSON input to the inputLocation struct
	if err := c.ShouldBindJSON(&inputLocation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the location fields (excluding nested associations)
	existingLocation.Title = inputLocation.Title
	existingLocation.Description = inputLocation.Description
	existingLocation.Color = inputLocation.Color
	existingLocation.Type = inputLocation.Type
	existingLocation.Price = inputLocation.Price
	existingLocation.Dimensions = inputLocation.Dimensions
	existingLocation.Size = inputLocation.Size
	existingLocation.URL = inputLocation.URL
	existingLocation.Address = inputLocation.Address

	// Handle Phones
	if err := updatePhones(database.DB, &existingLocation, inputLocation.Phones); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update phones"})
		return
	}
	if err := updateImages(database.DB, &existingLocation, inputLocation.Images); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update images"})
		return
	}

	database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&existingLocation).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update location"})
			return err
		}
		if err := tx.Save(&existingLocation.Phones).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update phones"})
			return err
		}
		if err := tx.Save(&existingLocation.Images).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update images"})
			return err
		}
		return nil
	})

	go utils.MoveFileAndUpdate(existingLocation.Images)

	c.JSON(http.StatusOK, gin.H{"data": existingLocation})
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

func updatePhones(db *gorm.DB, location *models.Location, inputPhones []models.Phone) error {
	// Create a map of input phones for quick lookup
	inputPhoneMap := make(map[uint]models.Phone)
	for _, phone := range inputPhones {
		if phone.ID != 0 { // Only consider phones with an existing ID
			inputPhoneMap[phone.ID] = phone
		}
	}

	// Iterate over existing phones in reverse order
	for i := len(location.Phones) - 1; i >= 0; i-- {
		existingPhone := location.Phones[i]
		if inputPhone, exists := inputPhoneMap[existingPhone.ID]; exists {
			// Update the existing phone
			location.Phones[i].Name = inputPhone.Name
			location.Phones[i].Phone = inputPhone.Phone
		} else {
			// Delete the phone if it's not in the input
			if err := db.Delete(&existingPhone).Error; err != nil {
				return err
			}
			// Remove the phone from the location's Phones slice
			location.Phones = append(location.Phones[:i], location.Phones[i+1:]...)
		}
	}

	// Add new phones
	for _, inputPhone := range inputPhones {
		if inputPhone.ID == 0 { // New phone (ID is 0 or not set)
			location.Phones = append(location.Phones, inputPhone)
		}
	}

	return nil
}

func updateImages(db *gorm.DB, location *models.Location, inputImages []models.Image) error {
	inputImageMap := make(map[uint]models.Image)
	for _, image := range inputImages {
		if image.ID != 0 { // Only consider images with an existing ID
			inputImageMap[image.ID] = image
		}
	}

	// Iterate over existing images in reverse order
	for i := len(location.Images) - 1; i >= 0; i-- {
		existingImage := location.Images[i]
		if _, exists := inputImageMap[existingImage.ID]; !exists {
			// Delete the image if it's not in the input
			if err := db.Delete(&existingImage).Error; err != nil {
				return err
			}
			// Remove the image from the location's Phones slice
			location.Images = append(location.Images[:i], location.Images[i+1:]...)
		}
	}

	// Add new phones
	for _, inputImage := range inputImages {
		if inputImage.ID == 0 { // New phone (ID is 0 or not set)
			location.Images = append(location.Images, inputImage)
		}
	}


	return nil
}
