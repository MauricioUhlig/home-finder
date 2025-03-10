package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint8 `gorm:"primarykey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Username  string         `gorm:"unique;not null"`
	Password  string         `gorm:"not null"`
	Role      string         `gorm:"not null"`
}
