var Service, Characteristic;
var inherits = require('util').inherits;
var sender = require('./sender');

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-wifi-er", "Wifi-ER", WifiERAccessory);
}

function WifiERAccessory(log, config) {
  this.log = log;

  this.host = config["host"];
  this.name = config["name"];
  this.data = config["data"];
}

WifiERAccessory.prototype = {

  setPowerState: function (payloadPowerOn, payloadPowerOff, powerOn, callback) {

    if (powerOn) {
      sender(this.host, payloadPowerOn, function (err) {
        callback();
        // callback('error');
      });
    } else {
      sender(this.host, payloadPowerOff, function (err) {
        callback();
        // callback('error');
      });
    }
  },

  identify: function (callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function () {

    var services = [];

    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Wifi-ER")
      .setCharacteristic(Characteristic.Model, "Boiler Wall Switch")
      .setCharacteristic(Characteristic.SerialNumber, this.data["host"]);
    services.push(informationService);

    for (var i = 0; i < this.data.length; i++) {
      var data = this.data[i];
      this.log("add switch service");
      var switchService = new Service.Switch(this.name);
      switchService
        .getCharacteristic(Characteristic.On)
        .on('set', this.setPowerState.bind(this, data["on"], data["off"]));
      services.push(switchService);
    }
    return services;
  }
};

