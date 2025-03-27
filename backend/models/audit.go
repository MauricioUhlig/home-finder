package models

type Audit struct {
	CreatedByUserID uint8  `gorm:"null" json:"CreatedByUserID"`
	CreatedBy       string `gorm:"null" json:"CreatedBy"`
	CreatedByUser   User   `gorm:"foreignKey:CreatedByUserID" json:"-"`
	UpdatedByUserID uint8  `gorm:"null" json:"UpdatedByUserID"`
	UpdatedBy       string `gorm:"null" json:"UpdatedBy"`
	UpdatedByUser   User   `gorm:"foreignKey:UpdatedByUserID" json:"-"`
}
