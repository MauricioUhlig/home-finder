package models

type Address struct {
	Street      string  `gorm:"type:varchar(255);null" json:"street"`
	HouseNumber string  `gorm:"type:varchar(50);null" json:"houseNumber"`
	District    string  `gorm:"type:varchar(100);not null" json:"district"`
	City        string  `gorm:"type:varchar(100);not null" json:"city"`
	CEP         string  `gorm:"type:varchar(20);null" json:"cep"`
	Lat         float64 `gorm:"type:decimal(10,8);not null" json:"lat"`
	Lng         float64 `gorm:"type:decimal(10,8);not null" json:"lng"`
}
