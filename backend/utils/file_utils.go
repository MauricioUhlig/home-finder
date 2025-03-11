package utils

import (
	"os"
	"path/filepath"
	"time"
)

const FilesDir = "./uploads"
const UploadDir = FilesDir +"/temp"

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