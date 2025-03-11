package models

import "gorm.io/gorm"

type Phone struct {
    gorm.Model
    LocationID uint   `gorm:"not null" json:"LocationId"`
    Name       string `gorm:"type:varchar(100);not null" json:"Name"`
    Phone      string `gorm:"type:varchar(20);not null" json:"Phone"`
}