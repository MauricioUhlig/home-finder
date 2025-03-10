package models

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	File       string `gorm:"type:varchar(255);not null" json:"file"` // Store file path or base64
	URL        string `gorm:"type:varchar(255);not null" json:"url"`
	LocationID uint   `gorm:"not null" json:"locationId"` // Foreign key for Location
}
