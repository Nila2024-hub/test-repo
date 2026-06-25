#include <Wire.h>
#include <Adafruit_PN532.h>

// Custom I2C pins for OLED and PN532 from AGENTS.md
#define I2C_SDA D5  // GPIO 14
#define I2C_SCL D6  // GPIO 12

// PN532 IRQ and RESET pins
// NOTE: Since we are using standard I2C, these pins are not physically required to be connected.
// We specify D3 (GPIO 0) and D4 (GPIO 2) as dummy pins because they are pre-pulled high on NodeMCU v2.
#define PN532_IRQ   D3  // GPIO 0
#define PN532_RESET D4  // GPIO 2

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

void setup(void) {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n----------------------------------------");
  Serial.println("PN532 RFID Reader Test Sketch starting...");
  Serial.println("----------------------------------------");

  // Initialize the shared I2C bus with custom pins (D5 for SDA, D6 for SCL)
  Wire.begin(I2C_SDA, I2C_SCL);

  // Start communication with PN532
  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("Error: Could not find PN532 board!");
    Serial.println("Please double check:");
    Serial.println("1. Wiring connections:");
    Serial.println("   - PN532 SDA -> NodeMCU D5 (GPIO 14)");
    Serial.println("   - PN532 SCL -> NodeMCU D6 (GPIO 12)");
    Serial.println("   - PN532 VCC -> NodeMCU 3V3 (or 5V)");
    Serial.println("   - PN532 GND -> NodeMCU GND");
    Serial.println("2. DIP switches on the PN532 board must be set to I2C mode:");
    Serial.println("   - Switch 1 (SET0) -> OFF (0 / L)");
    Serial.println("   - Switch 2 (SET1) -> ON (1 / H)");
    while (1) {
      delay(1000);
    }
  }
  
  // Got version data, print chip version details
  Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  
  // Set the max number of retry attempts to read from a card
  // This prevents the library from locking up forever if no card is present
  nfc.setPassiveActivationRetries(0xFF);
  
  // Configure board to read RFID tags (SAM = Secure Access Module configuration)
  nfc.SAMConfig();
  
  Serial.println("Waiting for an ISO14443A card (RFID tag/card)...");
  Serial.println("Place your RFID tag on the reader...");
}

void loop(void) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on tag type)
  
  // Scan for cards with a 1-second (1000ms) timeout
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength, 1000);
  
  if (success) {
    Serial.println("\n[RFID Card Detected!]");
    Serial.print("  UID Length: "); Serial.print(uidLength, DEC); Serial.println(" bytes");
    
    // Print the UID in hex format
    Serial.print("  UID Value:  ");
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) Serial.print("0");
      Serial.print(uid[i], HEX);
      Serial.print(" ");
    }
    Serial.println();
    
    // Determine card type
    if (uidLength == 4) {
      Serial.println("  Card Type:  Mifare Classic (4-byte UID)");
    } else if (uidLength == 7) {
      Serial.println("  Card Type:  Mifare Ultralight / NTAG (7-byte UID)");
    }
    Serial.println("----------------------------------------");
    
    // Delay 1.5 seconds before next read to prevent spamming the output
    delay(1500);
  } else {
    // Scan timed out (normal if no card is near the reader)
  }
}
