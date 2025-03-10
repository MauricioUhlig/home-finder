package models

import "gorm.io/gorm"

type Location struct {
	gorm.Model
	Address     Address         `gorm:"embedded" json:"address"`
	Title       string          `gorm:"type:varchar(255);not null" json:"title"`
	Description string          `gorm:"type:text;not null" json:"description"`
	Color       string          `gorm:"type:varchar(50);null" json:"color"`
	Marker      string          `gorm:"-" json:"marker"`
	Type        string          `gorm:"type:varchar(50);not null" json:"type"`
	Price       uint32         `gorm:"not null" json:"price"`
	Phones      []Phone         `gorm:"foreignKey:LocationID" json:"phones"`
	Images      []Image         `gorm:"foreignKey:LocationID" json:"images"` // One-to-many relationship
	Comments    []Comment       `gorm:"foreignKey:LocationID" json:"comments"`
	Metrics     LocationMetrics `gorm:"foreignKey:LocationID" json:"metrics"`
	Dimensions  Dimensions      `gorm:"embedded" json:"dimensions"`
	Size        *uint16        `gorm:"null" json:"size"`
	URL         string          `gorm:"type:varchar(255);null" json:"url"`
}
