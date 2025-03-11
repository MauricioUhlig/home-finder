package models

import (
	"time"

	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	LocationID uint      `gorm:"not null" json:"LocationID"`      
	AuthorID   uint8     `gorm:"not null" json:"AuthorID"`        
	User       User      `gorm:"foreignKey:AuthorID" json:"User"` 
	Date       time.Time `gorm:"not null" json:"Date"`            
	Comment    string    `gorm:"type:text;not null" json:"Comment"`
}
