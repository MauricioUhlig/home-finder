package models

type Address struct {
	Street      string  `gorm:"type:varchar(255);null" json:"Street"`
	HouseNumber string  `gorm:"type:varchar(50);null" json:"HouseNumber"`
	District    string  `gorm:"type:varchar(100);not null" json:"District"`
	City        string  `gorm:"type:varchar(100);not null" json:"City"`
	CEP         string  `gorm:"type:varchar(20);null" json:"CEP"`
	Lat         float64 `gorm:"type:decimal(10,8);not null" json:"Lat"`
	Lng         float64 `gorm:"type:decimal(10,8);not null" json:"Lng"`
}
