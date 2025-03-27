package controllers

import (
	"net/http"
	"time"

	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/middleware"
	"github.com/MauricioUhlig/home-finder/models"
	"github.com/gin-gonic/gin"
)

type commentPayload struct {
	ID         *uint
	LocationID uint
	Comment    string
	AuthorID   uint8
	AuthorName string
	Date       *time.Time
}
type commentController struct{}

var CommentController commentController

// CreateComment creates a new comment with the AuthorID from JWT claims
func (ctrl *commentController) Create(c *gin.Context) {
	var comment models.Comment
	var payload commentPayload

	comment.Date = time.Now().UTC()

	// Bind JSON input to the Comment struct
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := middleware.GetUserID(c)
	// Set the AuthorID from the JWT claims
	comment.AuthorID = userID

	comment.Comment = payload.Comment
	comment.Date = time.Now().UTC()
	comment.LocationID = payload.LocationID

	// Create the comment in the database
	if err := database.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": comment.ID})
}

// GetCommentsByLocationID retrieves all comments for a specific location
func (ctrl *commentController) GetByLocationID(c *gin.Context) {
	var comments []commentPayload
	locationID := c.Param("locationId")

	// Fetch comments by LocationID
	if err := database.DB.Model(&models.Comment{}).
		Select("comments.id, comments.location_id, comments.comment, comments.date, users.id as author_id, users.username as author_name").
		Joins("LEFT JOIN users ON users.id = comments.author_id").
		Where("comments.location_id = ?", locationID).
		Scan(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": comments})
}

// UpdateComment updates an existing comment
func (ctrl *commentController) Update(c *gin.Context) {
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

	c.JSON(http.StatusOK, gin.H{"data": true})
}

// DeleteComment deletes a comment by its ID
func (ctrl *commentController) Delete(c *gin.Context) {
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
