//Attach coinInt to Interrupt Pin 0 (Digital Pin 2). Pin 3 = Interrpt Pin 1.
const int coinInt = 0;

//Set the coinsValue to a Volatile float
//Volatile as this variable changes any time the Interrupt is triggered
volatile float coinsValue = 0.00;

//A Coin has been inserted flag
int coinsChange = 0;

void setup() {
  //Start Serial Communication
  Serial.begin(9600);
  //If coinInt goes HIGH (a Pulse), call the coinInserted function
  //An attachInterrupt will always trigger, even if your using delays
  attachInterrupt(coinInt, coinInserted, RISING);   
}

//The function that is called every time it recieves a pulse
void coinInserted() {
  //As we set the Pulse to represent 5p or 5c we add this to the coinsValue
  coinsValue = coinsValue + 0.05;
  //Flag that there has been a coin inserted
  coinsChange = 1;
}

void loop() {
  //Check if a coin has been Inserted
  if (coinsChange == 1) {
    //unflag that a coin has been inserted
    coinsChange = 0;
    Serial.print("Credit: £");
    //Print the Value of coins inserted
    Serial.println(coinsValue);
  }
}
