package controllers

import (
	"net/http"
	"time"

	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type commentPayload struct {
	ID         *uint
	LocationID uint
	Comment    string
	User       *struct {
		ID       uint8
		Username string
	}
	Date *time.Time
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

	// Extract UserID from JWT claims
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	// Set the AuthorID from the JWT claims
	comment.AuthorID = uint8(userID.(float64))

	comment.Comment = payload.Comment
	comment.Date = time.Now().UTC()
	comment.LocationID = payload.LocationID

	// Create the comment in the database
	if err := database.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": ctrl.MapCommentToPayload(comment)})
}

// GetCommentsByLocationID retrieves all comments for a specific location
func (ctrl *commentController) GetByLocationID(c *gin.Context) {
	var comments []models.Comment
	locationID := c.Param("locationId")

	// Fetch comments by LocationID
	if err := database.DB.Preload("User",
		func(db *gorm.DB) *gorm.DB {
			return db.Select("ID, Username")
		}).Where("location_id = ?", locationID).Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ctrl.MapCommentsToPayload(comments)})
}

// GetCommentByID retrieves a comment by its ID
func (ctrl *commentController) GetByID(c *gin.Context) {
	var comment models.Comment
	id := c.Param("id")

	// Fetch the comment by ID
	if err := database.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("ID, Username")
	}).First(&comment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ctrl.MapCommentToPayload(comment)})
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

	c.JSON(http.StatusOK, gin.H{"data": ctrl.MapCommentToPayload(comment)})
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

func (ctrl *commentController) MapCommentsToPayload(comments []models.Comment) []commentPayload {
	var payloads []commentPayload

	for _, comment := range comments {
		payload := ctrl.MapCommentToPayload(comment)
		payloads = append(payloads, payload)
	}

	return payloads
}

func (ctrl *commentController) MapCommentToPayload(comment models.Comment) commentPayload {
	return commentPayload{
		ID:         &comment.ID,
		LocationID: comment.LocationID,
		Comment:    comment.Comment,
		User: &struct {
			ID       uint8
			Username string
		}{
			ID:       comment.User.ID,
			Username: comment.User.Username,
		},
		Date: &comment.Date,
	}
}
