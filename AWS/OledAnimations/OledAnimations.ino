#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Custom I2C Pins for NodeMCU v2 OLED display from AGENTS.md
#define OLED_SDA D5  // GPIO 14
#define OLED_SCL D6  // GPIO 12

// Animation Configuration
#define ANIMATION_DURATION_MS 10000 // 10 seconds per animation
int currentAnimation = 0;
unsigned long lastSwitchTime = 0;

// ==========================================
// Animation 1: 3D Starfield (Warp Speed)
// ==========================================
#define NUM_STARS 60
struct Star {
  float x, y, z;
};
Star stars[NUM_STARS];

void initStarfield() {
  for (int i = 0; i < NUM_STARS; i++) {
    stars[i].x = random(-64, 64);
    stars[i].y = random(-32, 32);
    stars[i].z = random(1, 100);
  }
}

void drawStarfield() {
  display.clearDisplay();
  for (int i = 0; i < NUM_STARS; i++) {
    stars[i].z -= 1.8; // Speed of travel
    if (stars[i].z <= 0) {
      stars[i].x = random(-64, 64);
      stars[i].y = random(-32, 32);
      stars[i].z = 100;
    }
    
    // Project 3D coordinate to 2D screen coordinate
    int sx = (stars[i].x * 35) / stars[i].z + 64;
    int sy = (stars[i].y * 35) / stars[i].z + 32;
    
    if (sx >= 0 && sx < SCREEN_WIDTH && sy >= 0 && sy < SCREEN_HEIGHT) {
      // Draw larger particles as they get closer
      if (stars[i].z < 25) {
        display.fillRect(sx, sy, 2, 2, SSD1306_WHITE);
      } else {
        display.drawPixel(sx, sy, SSD1306_WHITE);
      }
    }
  }
  display.display();
}

// ==========================================
// Animation 2: Rotating 3D Wireframe Cube
// ==========================================
float cubeVertices[8][3] = {
  {-16, -16, -16},
  { 16, -16, -16},
  { 16,  16, -16},
  {-16,  16, -16},
  {-16, -16,  16},
  { 16, -16,  16},
  { 16,  16,  16},
  {-16,  16,  16}
};

int cubeEdges[12][2] = {
  {0, 1}, {1, 2}, {2, 3}, {3, 0}, // Back Face
  {4, 5}, {5, 6}, {6, 7}, {7, 4}, // Front Face
  {0, 4}, {1, 5}, {2, 6}, {3, 7}  // Edge Connections
};

float angleX = 0;
float angleY = 0;
float angleZ = 0;

void drawCube() {
  display.clearDisplay();
  int projected[8][2];
  
  for (int i = 0; i < 8; i++) {
    float x = cubeVertices[i][0];
    float y = cubeVertices[i][1];
    float z = cubeVertices[i][2];
    
    // Rotate around X-axis
    float y1 = y * cos(angleX) - z * sin(angleX);
    float z1 = y * sin(angleX) + z * cos(angleX);
    
    // Rotate around Y-axis
    float x2 = x * cos(angleY) + z1 * sin(angleY);
    float z2 = -x * sin(angleY) + z1 * cos(angleY);
    
    // Rotate around Z-axis
    float x3 = x2 * cos(angleZ) - y1 * sin(angleZ);
    float y3 = x2 * sin(angleZ) + y1 * cos(angleZ);
    
    // Ortographic projection with screen center offsets
    projected[i][0] = (int)(x3) + 64;
    projected[i][1] = (int)(y3) + 32;
  }
  
  // Draw all 12 wireframe edges
  for (int i = 0; i < 12; i++) {
    display.drawLine(
      projected[cubeEdges[i][0]][0], projected[cubeEdges[i][0]][1],
      projected[cubeEdges[i][1]][0], projected[cubeEdges[i][1]][1], 
      SSD1306_WHITE
    );
  }
  
  // Increment rotation angles
  angleX += 0.04;
  angleY += 0.05;
  angleZ += 0.02;
  
  display.display();
}

// ==========================================
// Animation 3: Double Sine Wave Interference
// ==========================================
float phase1 = 0;
float phase2 = 0;

void drawWaves() {
  display.clearDisplay();
  
  int prevX = 0;
  int prevY = 0;
  
  for (int x = 0; x < SCREEN_WIDTH; x++) {
    // Wave 1: amplitude 14, wavelength approx 40px
    float y1 = 14.0 * sin(x * 0.15 + phase1);
    // Wave 2: amplitude 8, wavelength approx 25px
    float y2 = 8.0 * sin(x * 0.25 + phase2);
    
    int y = (int)(y1 + y2) + 32;
    
    if (x > 0) {
      display.drawLine(prevX, prevY, x, y, SSD1306_WHITE);
    } else {
      display.drawPixel(x, y, SSD1306_WHITE);
    }
    
    // Static center line background (dotted reference grid)
    if (x % 8 == 0) {
      display.drawPixel(x, 32, SSD1306_WHITE);
    }
    
    prevX = x;
    prevY = y;
  }
  
  phase1 += 0.06;
  phase2 -= 0.09;
  
  display.display();
}

// ==========================================
// Animation 4: Vector Bouncing Lines (Mesh)
// ==========================================
struct BouncingPoint {
  float x, y;
  float dx, dy;
};
BouncingPoint bp1, bp2;

#define MESH_HISTORY_SIZE 6
struct LineCoords {
  int x1, y1, x2, y2;
};
LineCoords meshHistory[MESH_HISTORY_SIZE];
int meshHistoryIdx = 0;

void initBouncingLines() {
  bp1.x = random(10, 118); bp1.y = random(10, 54);
  bp1.dx = (random(10, 20) / 10.0) * (random(0, 2) ? 1 : -1);
  bp1.dy = (random(10, 20) / 10.0) * (random(0, 2) ? 1 : -1);
  
  bp2.x = random(10, 118); bp2.y = random(10, 54);
  bp2.dx = (random(10, 20) / 10.0) * (random(0, 2) ? 1 : -1);
  bp2.dy = (random(10, 20) / 10.0) * (random(0, 2) ? 1 : -1);
  
  for (int i = 0; i < MESH_HISTORY_SIZE; i++) {
    meshHistory[i] = {0, 0, 0, 0};
  }
}

void drawBouncingLines() {
  display.clearDisplay();
  
  // Move points
  bp1.x += bp1.dx; bp1.y += bp1.dy;
  bp2.x += bp2.dx; bp2.y += bp2.dy;
  
  // Bounce bp1
  if (bp1.x <= 0 || bp1.x >= SCREEN_WIDTH - 1)   { bp1.dx *= -1; bp1.x = constrain(bp1.x, 0, SCREEN_WIDTH - 1); }
  if (bp1.y <= 0 || bp1.y >= SCREEN_HEIGHT - 1)  { bp1.dy *= -1; bp1.y = constrain(bp1.y, 0, SCREEN_HEIGHT - 1); }
  
  // Bounce bp2
  if (bp2.x <= 0 || bp2.x >= SCREEN_WIDTH - 1)   { bp2.dx *= -1; bp2.x = constrain(bp2.x, 0, SCREEN_WIDTH - 1); }
  if (bp2.y <= 0 || bp2.y >= SCREEN_HEIGHT - 1)  { bp2.dy *= -1; bp2.y = constrain(bp2.y, 0, SCREEN_HEIGHT - 1); }
  
  // Update trailing line history
  meshHistory[meshHistoryIdx] = {(int)bp1.x, (int)bp1.y, (int)bp2.x, (int)bp2.y};
  meshHistoryIdx = (meshHistoryIdx + 1) % MESH_HISTORY_SIZE;
  
  // Draw the current line and trailing echo lines
  for (int i = 0; i < MESH_HISTORY_SIZE; i++) {
    int idx = (meshHistoryIdx + i) % MESH_HISTORY_SIZE;
    if (meshHistory[idx].x1 != 0 || meshHistory[idx].y1 != 0) {
      if (i < MESH_HISTORY_SIZE - 2) {
        // Draw old trails as dotted lines for a fading effect
        int x1 = meshHistory[idx].x1, y1 = meshHistory[idx].y1;
        int x2 = meshHistory[idx].x2, y2 = meshHistory[idx].y2;
        int dx = abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
        int dy = -abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
        int err = dx + dy, e2;
        int step = 0;
        while (true) {
          if (step % 4 == 0) {
            display.drawPixel(x1, y1, SSD1306_WHITE);
          }
          step++;
          if (x1 == x2 && y1 == y2) break;
          e2 = 2 * err;
          if (e2 >= dy) { err += dy; x1 += sx; }
          if (e2 <= dx) { err += dx; y1 += sy; }
        }
      } else {
        // Draw newest lines fully solid
        display.drawLine(meshHistory[idx].x1, meshHistory[idx].y1, meshHistory[idx].x2, meshHistory[idx].y2, SSD1306_WHITE);
      }
    }
  }
  
  display.display();
}

// ==========================================
// Animation 5: Particle Vortex (Spiral Galaxy)
// ==========================================
#define NUM_PARTICLES 70
struct Particle {
  float angle;
  float radius;
  float speed;
};
Particle particles[NUM_PARTICLES];
float pulseAngle = 0;

void initVortex() {
  for (int i = 0; i < NUM_PARTICLES; i++) {
    particles[i].angle = random(0, 360) * 0.0174533; // Radians
    particles[i].radius = random(4, 75);
    // Speed increases closer to center
    particles[i].speed = (random(5, 15) / 10.0) * (0.01 + 0.06 * (2.0 / (particles[i].radius + 1.0)));
  }
}

void drawVortex() {
  display.clearDisplay();
  
  pulseAngle += 0.04;
  float pulse = 8.0 * sin(pulseAngle);
  
  for (int i = 0; i < NUM_PARTICLES; i++) {
    particles[i].angle += particles[i].speed;
    particles[i].radius -= 0.15; // Gravitational pull to center
    
    if (particles[i].radius < 2) {
      // Reset back to outer boundary
      particles[i].radius = random(55, 75);
      particles[i].angle = random(0, 360) * 0.0174533;
    }
    
    // Add spiral arm perturbation
    float r = particles[i].radius + pulse * cos(particles[i].angle * 3.0);
    
    int px = (int)(64 + r * cos(particles[i].angle));
    int py = (int)(32 + r * sin(particles[i].angle));
    
    if (px >= 0 && px < SCREEN_WIDTH && py >= 0 && py < SCREEN_HEIGHT) {
      display.drawPixel(px, py, SSD1306_WHITE);
    }
  }
  
  // Draw the core of the vortex
  display.drawCircle(64, 32, 2, SSD1306_WHITE);
  display.drawCircle(64, 32, 4, SSD1306_WHITE);
  
  display.display();
}

// ==========================================
// Setup and Loop Execution
// ==========================================
void setup() {
  Serial.begin(115200);
  
  // Initialize I2C with customized D5 (SDA) and D6 (SCL) pins
  Wire.begin(OLED_SDA, OLED_SCL);
  
  // Start the SSD1306 display
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Freeze if screen initialization fails
  }
  
  // Display initial boot splash screen using lines and dots
  display.clearDisplay();
  display.drawRect(5, 5, SCREEN_WIDTH - 10, SCREEN_HEIGHT - 10, SSD1306_WHITE);
  display.drawCircle(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 12, SSD1306_WHITE);
  display.drawLine(0, 0, SCREEN_WIDTH - 1, SCREEN_HEIGHT - 1, SSD1306_WHITE);
  display.drawLine(0, SCREEN_HEIGHT - 1, SCREEN_WIDTH - 1, 0, SSD1306_WHITE);
  display.display();
  delay(1500);
  
  // Initialize first animation
  initStarfield();
  lastSwitchTime = millis();
}

void loop() {
  // Check if it's time to cycle to the next animation
  if (millis() - lastSwitchTime > ANIMATION_DURATION_MS) {
    currentAnimation = (currentAnimation + 1) % 5;
    lastSwitchTime = millis();
    
    // Initialize animation specific structures if needed
    if (currentAnimation == 0) initStarfield();
    else if (currentAnimation == 3) initBouncingLines();
    else if (currentAnimation == 4) initVortex();
  }
  
  // Render active animation frame
  switch(currentAnimation) {
    case 0:
      drawStarfield();
      break;
    case 1:
      drawCube();
      break;
    case 2:
      drawWaves();
      break;
    case 3:
      drawBouncingLines();
      break;
    case 4:
      drawVortex();
      break;
  }
  
  delay(15); // Target ~60 FPS
}
