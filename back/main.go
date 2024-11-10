package main

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	promptpayqr "github.com/kazekim/promptpay-qr-go"
)

// https://youtu.be/psBmEOIGF6c?si=EUv2j9pQ5S-QE7EJ

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.ConfigDefault))

	app.Post("/generateQR", func(c *fiber.Ctx) error {
		type Request struct {
			Amount float64 `json:"amount"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"RespCode":    400,
				"RespMessage": "Invalid request body",
			})
		}

		mobileNumber := "0934178026"
		amount := fmt.Sprintf("%.2f", req.Amount)

		qrCodeBytes, err := promptpayqr.QRForTargetWithAmount(mobileNumber, amount)
		if err != nil {
			log.Println("Error generating QR code:", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"RespCode":    500,
				"RespMessage": "Failed to generate QR code",
			})
		}

		// Dereference pointer to get the actual byte slice
		base64Image := byteToBase64(*qrCodeBytes)

		return c.JSON(fiber.Map{
			"RespCode":    200,
			"RespMessage": "QR Code generated successfully",
			"Result":      "data:image/png;base64," + base64Image,
		})

	})

	log.Fatal(app.Listen(":8000"))
}

func byteToBase64(imgByte []byte) string {
	buffer := new(bytes.Buffer)
	buffer.Write(imgByte) // ใช้โดยตรง ไม่ต้องแปลงเป็น Image
	return base64.StdEncoding.EncodeToString(buffer.Bytes())
}
