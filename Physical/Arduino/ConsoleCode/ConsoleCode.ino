#include <CapacitiveSensor.h>

#include <APA102.h>
#define CSg  8
#define P1pin A0
#define P2pin A1
#define butPin 2
rgb_color cvals[4];
int bvals[4] = {24, 24, 24, 24};
long csval[4];
boolean spressed[4] = {false, false, false, false};
APA102<3, 4> leds;
boolean skip = false;
boolean ready = true;
rgb_color on1;
rgb_color off1;
rgb_color on2;
rgb_color off2;
char command;
char clist1[4] = {'a', 'b', 'c', 'd'};
char clist2[4] = {'e', 'f', 'g', 'h'};
int CSstate = 0;
long timesince = 0;
long butTime = 0;
int inByte;
int pot1val;
int pot2val;
CapacitiveSensor CS[4] = {CapacitiveSensor(8, 9), CapacitiveSensor(8, 10), CapacitiveSensor(8, 11), CapacitiveSensor(8, 12)};

void checkSensor() {


  for (int i = 0; i < 4 && skip == false; i++) {
    if (skip = false) {
      csval[i] = CS[i].capacitiveSensor(30);
      Serial.print(csval[i]);
      Serial.print("\t");
      if (csval[i] > 5000) {
        spressed[i] = true;
        bvals[i] = 30;
        skip = true;
        leds.startFrame();
        for (int j = 0; j < 4; j++) {
          leds.sendColor(200, 100, 100, bvals[j]);
        }
        leds.endFrame(4);
      }
    }
  }
  skip = false;
  //Serial.println();
}

void setup() {
  on1.red = 250;
  on1.green = 250;
  on1.blue = 250;
  off1.red = 0;
  off1.green = 0;
  off1.blue = 250;
  on2.red = 250;
  on2.green = 250;
  on2.blue = 250;
  off2.red = 250;
  off2.green = 0;
  off2.blue = 0;
  pinMode(butPin, INPUT_PULLUP);
  Serial.begin(9600);
  for (int j = 0; j < 4; j++) {
    leds.sendColor(200, 100, 100, 30);
  }
}

void loop() {
  pot1val = map(analogRead(A0),0,1024,-500,500);
  pot2val = map(analogRead(A1),0,1024,0,90);
  timesince = millis() - butTime;
  int butval = digitalRead(butPin);
  //Serial.println('x');
  //Serial.println(CSstate);
  //Serial.println(timesince);
  if (timesince > 1000) {
    if ( butval == 0) {
      //Serial.println('x');
      int currentstate = CSstate;
      if (currentstate == 0) {
        CSstate = 1;
      }
      if (currentstate == 1) {
        CSstate = 0;
      }
      butTime = millis();
    }
  }
  //checkSensor();
  delay(20);
  for (int i = 0; i < 4; i++) {
    CS[i].set_CS_AutocaL_Millis(0xFFFFFFFF);
    csval[i] = CS[i].capacitiveSensor(20);
    //Serial.print(csval[i]);
    //Serial.print("\t");
    if (ready == true) {
      if (csval[i] > 2000) {
        spressed[i] = true;
        switch (CSstate) {
          case 0:
            cvals[i] = on1;
            break;
          case 1:
            cvals[i] = on2;
            break;
        }
        skip = true;


      } else {
        switch (CSstate) {
          case 0:
            cvals[i] = off1;
            break;
          case 1:
            cvals[i] = off2;
            break;
        }
        spressed[i] = false;
      }
    }
  }
  leds.write(cvals, 4, 8);
  //Serial.println(csval[1]);

  for (int k = 0; k < 4; k++) {
    if (spressed[k] == true) {
      switch (CSstate) {
        case 0:
          command = clist1[k];
          break;
        case 1:
          command = clist2[k];
          break;
      }
    }
  }
  if (skip == true) {
    //Serial.println(command);
    skip = false;
  }
    inByte = Serial.read();
    Serial.flush();
    if(command!=NULL) {Serial.println(command);}
    //Serial.print(',');
    //Serial.print(pot1val);
    //Serial.print(',');
    //Serial.print(pot2val);
    //Serial.print(',');
    //Serial.print(12);
    //Serial.println();
    command = NULL;
    delay(100);
}
