package models

import "time"

type Audit struct {
	CreatedByUserID uint8  `gorm:"null" json:"CreatedByUserID"`
	CreatedBy       string `gorm:"->" json:"CreatedBy"`
	CreatedByUser   User   `gorm:"foreignKey:CreatedByUserID" json:"-"`
	UpdatedByUserID uint8  `gorm:"null" json:"UpdatedByUserID"`
	UpdatedBy       string `gorm:"->" json:"UpdatedBy"`
	UpdatedByUser   User   `gorm:"foreignKey:UpdatedByUserID" json:"-"`
	CreatedAt       time.Time
	UpdatedAt       time.Time
}
