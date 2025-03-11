package controllers

import (
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/MauricioUhlig/home-finder/utils"
	"github.com/gin-gonic/gin"
)

// UploadFile handles file uploads
func UploadFile(c *gin.Context) {
	// Ensure the upload directory exists
	if err := os.MkdirAll(utils.UploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Get the file from the form data
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Generate a unique filename with a timestamp
	timestamp := time.Now().Format("20060102_150405")
	ext := filepath.Ext(file.Filename)
	filename := timestamp + "_" + file.Filename[:len(file.Filename)-len(ext)] + ext

	// Save the file to the upload directory
	filePath := filepath.Join(utils.UploadDir, filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "filename": filename, "uri":"/api/files/temp/"+filename})
}