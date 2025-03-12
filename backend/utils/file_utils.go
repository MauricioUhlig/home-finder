package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/MauricioUhlig/home-finder/database"
	"github.com/MauricioUhlig/home-finder/models"
)

const FilesDir = "./uploads"
const UploadDir = FilesDir + "/temp"
const FilesCommited = FilesDir + "/commited"

// CleanupOldFiles deletes files older than 12 hours
func CleanupOldFiles() {
	for {
		// Get the current time
		now := time.Now()

		// Walk through the upload directory
		filepath.Walk(UploadDir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			// Skip directories
			if info.IsDir() {
				return nil
			}

			// Check if the file is older than 12 hours
			if now.Sub(info.ModTime()) > 12*time.Hour {
				os.Remove(path)
			}

			return nil
		})

		// Sleep for 1 hour before the next cleanup
		time.Sleep(1 * time.Hour)
	}
}

// MoveFiles moves specific files from srcDir to dstDir
func MoveFile(srcDir, dstDir string, filename string) error {
	// Ensure the destination directory exists
	if err := os.MkdirAll(dstDir, os.ModePerm); err != nil {
		return fmt.Errorf("failed to create destination directory: %v", err)
	}

	// Move each file
	srcPath := filepath.Join(srcDir, filename)
	dstPath := filepath.Join(dstDir, filename)

	// Check if the source file exists
	if _, err := os.Stat(srcPath); os.IsNotExist(err) {
		return fmt.Errorf("file %s does not exist in source directory", filename)
	}

	// Move the file
	if err := os.Rename(srcPath, dstPath); err != nil {
		return fmt.Errorf("failed to move file %s: %v", filename, err)
	}

	fmt.Printf("Moved file: %s -> %s\n", srcPath, dstPath)

	return nil
}

func MoveFileAndUpdate(files []models.Image) {
	for _, file := range files {
		fmt.Printf("\nFile: %d %s\n",file.ID, file.URL)
		if strings.HasPrefix(file.URL, "/api/files/temp") {
			filename := strings.Replace(file.URL, "/api/files/temp/", "", 1)
			if err := MoveFile(UploadDir, FilesCommited, filename); err != nil {
				continue
			}
			file.URL = "/api/files/commited/" + filename
			if err := database.DB.Save(file).Error; err != nil {
				panic(err)
			}
			fmt.Printf("\nReady: %s\n", file.URL)
		}
	}
}
