#include <WiFi.h>                                                     
#include <IOXhop_FirebaseESP32.h>

#define FIREBASE_HOST "Your Firebase Host link"
#define FIREBASE_AUTH "Your Firebase Authorization Key"

#define WIFI_SSID "Your WIFI SSID" 
#define WIFI_PASSWORD "Your WIFI password"


void setup() {

  Serial.begin(9600);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  
  Serial.print("\n Connected to ");
  Serial.println(WIFI_SSID);
  Serial.print("IP Address is: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.setString("User","Harry's Car");
  Firebase.setInt("SOC",80);
  Firebase.setString("Expected Time to complete charging","1 hr 50 min");
  Firebase.setBool("Charging Status",1);
  Firebase.setBool("Finished Charging",0);
  
}

void loop(){

  // Mimics charging by increasing the State of Charge at regular intervals
  
  delay(5000);
  Firebase.setInt("SOC",82);
  Firebase.setString("Expected Time to complete charging","1 hr 45 min");
  delay(5000);
  Firebase.setInt("SOC",84);
  Firebase.setString("Expected Time to complete charging","1 hr 40 min");
  delay(5000);
  Firebase.setInt("SOC",86);
  Firebase.setString("Expected Time to complete charging","1 hr 30 min");
  delay(5000);
  Firebase.setInt("SOC",88);
  Firebase.setString("Expected Time to complete charging","1 hr 20 min");
  delay(5000);
  Firebase.setInt("SOC",90);
  Firebase.setString("Expected Time to complete charging","1 hr 10 min");
  delay(5000);
  Firebase.setInt("SOC",92);
  Firebase.setString("Expected Time to complete charging","1 hr 00 min");
  delay(5000);
  Firebase.setInt("SOC",100);
  Firebase.setString("Expected Time to complete charging","-- Charging Completed --");
  Firebase.setBool("Charging Status",0);
  Firebase.setBool("Finished Charging",1);
}
