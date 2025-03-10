package controllers

import (
	"net/http"
	"time"

	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/models"
	"github.com/gin-gonic/gin"
)

// CreateComment creates a new comment with the AuthorID from JWT claims
func CreateComment(c *gin.Context) {
    var comment models.Comment

    comment.Date = time.Now().UTC()

    // Bind JSON input to the Comment struct
    if err := c.ShouldBindJSON(&comment); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Extract UserID from JWT claims
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // Set the AuthorID from the JWT claims
    comment.AuthorID = uint8(userID.(float64))

    // Create the comment in the database
    if err := database.DB.Create(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"data": comment})
}


// GetCommentsByLocationID retrieves all comments for a specific location
func GetCommentsByLocationID(c *gin.Context) {
    var comments []models.Comment
    locationID := c.Param("locationId")

    // Fetch comments by LocationID
    if err := database.DB.Preload("User").Where("location_id = ?", locationID).Find(&comments).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": comments})
}

// GetCommentByID retrieves a comment by its ID
func GetCommentByID(c *gin.Context) {
    var comment models.Comment
    id := c.Param("id")

    // Fetch the comment by ID
    if err := database.DB.Preload("User").First(&comment, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": comment})
}
// UpdateComment updates an existing comment
func UpdateComment(c *gin.Context) {
    var comment models.Comment
    id := c.Param("id")

    // Fetch the comment by ID
    if err := database.DB.First(&comment, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
        return
    }

    // Bind JSON input to the Comment struct
    if err := c.ShouldBindJSON(&comment); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Save the updated comment
    if err := database.DB.Save(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update comment"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"data": comment})
}
// DeleteComment deletes a comment by its ID
func DeleteComment(c *gin.Context) {
    var comment models.Comment
    id := c.Param("id")

    // Fetch the comment by ID
    if err := database.DB.First(&comment, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
        return
    }

    // Delete the comment
    if err := database.DB.Delete(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}