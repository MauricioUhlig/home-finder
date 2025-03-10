package models

import "gorm.io/gorm"

type Phone struct {
    gorm.Model
    LocationID uint   `gorm:"not null" json:"locationId"`
    Name       string `gorm:"type:varchar(100);not null" json:"name"`
    Phone      string `gorm:"type:varchar(20);not null" json:"phone"`
}