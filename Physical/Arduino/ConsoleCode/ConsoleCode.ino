#include <CapacitiveSensor.h>

#include <APA102.h>
#define CSg  8
#define P1pin A0
#define P2pin A1
#define butPin 4
rgb_color cvals[4];
int bvals[4] = {24,24,24,24};
long csval[4];
boolean spressed[4] = {false,false,false,false};
APA102<3,2> leds;
boolean skip = false;
CapacitiveSensor CS[4] = {CapacitiveSensor(8,9),CapacitiveSensor(8,10),CapacitiveSensor(8,11),CapacitiveSensor(8,12)};

void checkSensor(){


        for(int i=0; i < 4 && skip == false; i++) {
                if(skip=false) {
                        csval[i] = CS[i].capacitiveSensor(30);
                        Serial.print(csval[i]);
                        Serial.print("\t");
                        if(csval[i]>5000) {
                                spressed[i] = true;
                                bvals[i] = 30;
                                skip = true;
                                leds.startFrame();
                                for (int j=0; j<4; j++) {
                                        leds.sendColor(200,100,100, bvals[j]);
                                }
                                leds.endFrame(4);
                        }
                }
        }
        skip = false;
        //Serial.println();
}

void setup() {
        pinMode(butPin,INPUT_PULLUP);
        Serial.begin(9600);
        for (int j=0; j<4; j++) {
                leds.sendColor(200,100,100, 30);
        }
}

void loop() {
        //checkSensor();
        delay(20);
        for(int i=0; i < 4; i++) {
                        csval[i] = CS[i].capacitiveSensor(30);
                        Serial.print(csval[i]);
                        Serial.print("\t");
                        if(csval[i]>300) {
                                spressed[i] = true;
                                bvals[i] = 30;
                                skip = true;
                                leds.startFrame();

                        } else {bvals[i] = 1;}
        }
        Serial.println();
        for (int j=0; j<4; j++) {
                leds.sendColor(200,100,100, bvals[j]);
        }
        leds.endFrame(4);
        //Serial.println(csval[1]);
}
