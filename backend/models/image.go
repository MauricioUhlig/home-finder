package models

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	File       string `gorm:"type:varchar(255);not null" json:"File"` // Store file path or base64
	URL        string `gorm:"type:varchar(255);not null" json:"URL"`
	LocationID uint   `gorm:"not null" json:"LocationId"` // Foreign key for Location
}
