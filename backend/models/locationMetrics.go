package models

import "gorm.io/gorm"

type LocationMetrics struct {
	gorm.Model
	LocationID   uint    `gorm:"not null" json:"LocationID"`
	Stars        float64 `gorm:"type:decimal(3,2);not null" json:"Stars"`
	Location     uint8   `gorm:"default:0;not null" json:"Location"`
	Neighborhood uint8   `gorm:"default:0;not null" json:"Neighborhood"`
	Safety       uint8   `gorm:"default:0;not null" json:"Safety"`
	CustBenefit  uint8   `gorm:"default:0;not null" json:"CustBenefit"`
}
