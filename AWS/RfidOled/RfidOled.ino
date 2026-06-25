#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_PN532.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Custom I2C pins for OLED and PN532 from AGENTS.md
#define OLED_SDA D5  // GPIO 14
#define OLED_SCL D6  // GPIO 12

// PN532 IRQ and RESET pins (Dummy pins since we use I2C polling)
#define PN532_IRQ   D3  // GPIO 0
#define PN532_RESET D4  // GPIO 2

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

// Function prototype
void showIdleScreen();

void setup() {
  Serial.begin(115200);
  delay(1000); // Give serial monitor time to connect
  Serial.println("\n========================================");
  Serial.println("RfidOled Debug Log starting...");
  Serial.println("========================================");

  // Initialize shared I2C bus (D5/D6)
  Serial.println("[Debug] 1. Initializing I2C bus (SDA=D5, SCL=D6)...");
  Wire.begin(OLED_SDA, OLED_SCL);
  Serial.println("[Debug] I2C bus initialized.");

  // Initialize SSD1306 Display
  Serial.println("[Debug] 2. Initializing SSD1306 Display...");
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("[Error] SSD1306 display allocation failed!");
    for(;;); // Freeze
  }
  Serial.println("[Debug] SSD1306 Display initialized successfully.");
  
  // Show Boot Splash
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(15, 20);
  display.println(F("System Booting..."));
  display.drawRoundRect(5, 5, 118, 54, 4, SSD1306_WHITE);
  display.display();
  Serial.println("[Debug] Boot splash screen displayed.");
  delay(1000);

  // Initialize PN532 RFID reader
  Serial.println("[Debug] 3. Initializing PN532 NFC...");
  nfc.begin();
  Serial.println("[Debug] PN532 object initialized. Querying firmware version...");
  
  uint32_t versiondata = nfc.getFirmwareVersion();
  Serial.print("[Debug] Firmware version query complete. Result: 0x");
  Serial.println(versiondata, HEX);

  if (!versiondata) {
    Serial.println("[Error] Could not find PN532 board!");
    
    // Show Error on OLED
    display.clearDisplay();
    display.drawRect(0, 0, 128, 64, SSD1306_WHITE);
    display.setCursor(10, 15);
    display.setTextSize(2);
    display.println(F("PN532 ERR"));
    display.setTextSize(1);
    display.setCursor(10, 38);
    display.println(F("Please check wiring"));
    display.setCursor(10, 48);
    display.println(F("& DIP Switch settings."));
    display.display();
    
    while (1) {
      delay(1000);
    }
  }

  // Got firmware version, print details to Serial
  Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX);
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC);
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  
  // Set the max number of retry attempts to read from a card
  nfc.setPassiveActivationRetries(0xFF);
  
  // Configure board to read RFID tags
  Serial.println("[Debug] 4. Configuring SAM...");
  nfc.SAMConfig();
  Serial.println("[Debug] SAM configuration complete.");
  
  Serial.println(F("Waiting for an RFID card..."));
  
  // Render Initial Idle Screen
  showIdleScreen();
  Serial.println("[Debug] Initialization complete. Scanning started.");
}

void loop() {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on tag type)
  
  // Non-blocking scan for Mifare card with 500ms timeout
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, &uid[0], &uidLength, 500);
  
  if (success) {
    Serial.println(F("RFID Card detected!"));
    
    // Clear and draw detected card info UI
    display.clearDisplay();
    
    // Draw outer card boundary
    display.drawRoundRect(5, 5, 118, 54, 6, SSD1306_WHITE);
    display.drawLine(5, 20, 122, 20, SSD1306_WHITE); // Header divider line
    
    // Header text
    display.setTextSize(1);
    display.setCursor(15, 9);
    display.println(F("CARD DETECTED"));
    
    // UID Length
    display.setCursor(15, 26);
    display.print(F("Len:  "));
    display.print(uidLength);
    display.println(F(" bytes"));
    
    // UID Hex values
    display.setCursor(15, 37);
    display.print(F("UID:  "));
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) display.print(F("0"));
      display.print(uid[i], HEX);
      if (i < uidLength - 1) display.print(F(" "));
    }
    
    // Card Type
    display.setCursor(15, 48);
    display.print(F("Type: "));
    if (uidLength == 4) {
      display.println(F("Mifare Classic"));
    } else if (uidLength == 7) {
      display.println(F("Mifare Ultralight"));
    } else {
      display.println(F("ISO14443A"));
    }
    
    display.display();
    
    // Hold info on screen for 3 seconds
    delay(3000);
    
    // Re-draw idle screen
    showIdleScreen();
  }
}

void showIdleScreen() {
  display.clearDisplay();
  
  // Draw modern framing
  display.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, SSD1306_WHITE);
  display.drawRect(2, 2, SCREEN_WIDTH - 4, SCREEN_HEIGHT - 4, SSD1306_WHITE);
  
  // Draw simple decorative radar/scan lines in corners
  display.drawLine(6, 6, 16, 6, SSD1306_WHITE);
  display.drawLine(6, 6, 6, 16, SSD1306_WHITE);
  
  display.drawLine(121, 6, 111, 6, SSD1306_WHITE);
  display.drawLine(121, 6, 121, 16, SSD1306_WHITE);
  
  display.drawLine(6, 57, 16, 57, SSD1306_WHITE);
  display.drawLine(6, 57, 6, 47, SSD1306_WHITE);
  
  display.drawLine(121, 57, 111, 57, SSD1306_WHITE);
  display.drawLine(121, 57, 121, 47, SSD1306_WHITE);
  
  // Center Text
  display.setTextSize(1);
  display.setCursor(28, 18);
  display.println(F("RFID SCANNER"));
  
  display.setCursor(31, 38);
  display.println(F("Place Tag..."));
  
  display.display();
}
