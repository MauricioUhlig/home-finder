package models

import "gorm.io/gorm"

type LocationMetrics struct {
	gorm.Model
	LocationID   uint    `gorm:"not null" json:"locationId"`
	Stars        float64 `gorm:"type:decimal(3,2);not null" json:"stars"`
	Location     uint8   `gorm:"default:0;not null" json:"location"`
	Neighborhood uint8   `gorm:"default:0;not null" json:"neighborhood"`
	Safety       uint8   `gorm:"default:0;not null" json:"safety"`
	CustBenefit  uint8   `gorm:"default:0;not null" json:"cust_benefit"`
}
