var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty.wchusbserial1410", {
  baudrate: 9600
});


serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });
});
