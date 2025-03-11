package models

type Dimensions struct {
    Front *uint8 `gorm:"null" json:"Front"`
    Deep  *uint8 `gorm:"null" json:"Deep"`
    Back  *uint8 `gorm:"null" json:"Back"`
}