package models

import (
	"time"

	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	LocationID uint      `gorm:"not null" json:"locationId"`      // Foreign key for Location
	AuthorID   uint8     `gorm:"not null" json:"authorId"`        // Foreign key for User
	User       User      `gorm:"foreignKey:AuthorID" json:"user"` // Relationship with User
	Date       time.Time `gorm:"not null" json:"date"`            // Use time.Time for timestamps
	Comment    string    `gorm:"type:text;not null" json:"comment"`
}
