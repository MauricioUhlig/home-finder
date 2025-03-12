package models

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	URL        string `gorm:"type:varchar(255);not null" json:"URL"`
	LocationID uint   `gorm:"not null" json:"LocationId"` // Foreign key for Location
}
