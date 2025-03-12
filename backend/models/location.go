package models

import "gorm.io/gorm"

type Location struct {
	gorm.Model
	Address     Address         `gorm:"embedded" json:"Address"`
	Title       string          `gorm:"type:varchar(255);not null" json:"Title"`
	Description string          `gorm:"type:text;not null" json:"Description"`
	Color       string          `gorm:"type:varchar(50);null" json:"Color"`
	Type        string          `gorm:"type:varchar(50);not null" json:"Type"`
	Price       uint32          `gorm:"not null" json:"Price"`
	Phones      []Phone         `gorm:"foreignKey:LocationID" json:"Phones"`
	Images      []Image         `gorm:"foreignKey:LocationID" json:"Images"`
	Comments    []Comment       `gorm:"foreignKey:LocationID" json:"-"` //Comments are collected in another route
	Metrics     LocationMetrics `gorm:"foreignKey:LocationID" json:"-"` //Metrics are collected in another route
	Dimensions  Dimensions      `gorm:"embedded" json:"Dimensions"`
	Size        *uint16         `gorm:"null" json:"Size"`
	URL         string          `gorm:"type:varchar(255);null" json:"URL"`
}
