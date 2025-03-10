package controllers

import (
	"time"

	"github.com/MauricioUhlig/home-finder/middleware"
	"github.com/dgrijalva/jwt-go"
)

// Claims struct to store the JWT claims
type Claims struct {
	UserID uint8  `json:"userID"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

func GenerateToken(userID uint8, role string) (string, error) {
	// Set the token expiration time (e.g., 24 hours)
	expirationTime := time.Now().Add(24 * time.Hour)

	// Create the JWT claims
	claims := &Claims{
		UserID: userID,
		Role:   role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),  // Token expiration time
			IssuedAt:  time.Now().Unix(),      // Token issuance time
			Issuer:    "mauriciouhlig.dev.br", // Token issuer
		},
	}

	// Create the token with the claims and sign it using the secret key
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(middleware.JWTKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
