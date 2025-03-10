package models

type Dimensions struct {
    Front *uint8 `gorm:"null" json:"front"`
    Deep  *uint8 `gorm:"null" json:"deep"`
    Back  *uint8 `gorm:"null" json:"back"`
}