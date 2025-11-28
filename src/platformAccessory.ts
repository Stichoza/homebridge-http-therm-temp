import type { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';
import type { HttpThermostatTemperaturePlatform } from './platform.js';

export class HttpThermostatTemperatureAccessory {
  private service: Service;

  private state = {
    On: true,
    Temperature: 23,
    TargetTemperature: 23,
  };

  constructor(
    private readonly platform: HttpThermostatTemperaturePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Stichoza')
      .setCharacteristic(this.platform.Characteristic.Model, 'HTTP Thermostat Temperature')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, '1.0.0');

    this.service = this.accessory.getService(this.platform.Service.Thermostat) || this.accessory.addService(this.platform.Service.Thermostat);

    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.displayName);

    this.service.getCharacteristic(this.platform.Characteristic.CurrentHeatingCoolingState)
        .onGet(this.handleCurrentHeatingCoolingStateGet.bind(this));

      this.service.getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState)
        .onGet(this.handleTargetHeatingCoolingStateGet.bind(this))
        .onSet(this.handleTargetHeatingCoolingStateSet.bind(this));

      this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
        .onGet(this.handleCurrentTemperatureGet.bind(this));

      this.service.getCharacteristic(this.platform.Characteristic.TargetTemperature)
        .onGet(this.handleTargetTemperatureGet.bind(this))
        .onSet(this.handleTargetTemperatureSet.bind(this));

      this.service.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits)
        .onGet(this.handleTemperatureDisplayUnitsGet.bind(this))
        .onSet(this.handleTemperatureDisplayUnitsSet.bind(this));

    setInterval(() => {
      // TODO: Handle temperature update and thermostat toggle
    }, 60000);
  }

  handleCurrentHeatingCoolingStateGet() {
    //this.log.debug('Triggered GET CurrentHeatingCoolingState');

    // set this to a valid value for CurrentHeatingCoolingState
    const currentValue = this.platform.Characteristic.CurrentHeatingCoolingState.OFF;

    return currentValue;
  }


  /**
   * Handle requests to get the current value of the "Target Heating Cooling State" characteristic
   */
  handleTargetHeatingCoolingStateGet() {
    //this.log.debug('Triggered GET TargetHeatingCoolingState');

    // set this to a valid value for TargetHeatingCoolingState
    const currentValue = this.platform.Characteristic.TargetHeatingCoolingState.OFF;

    return currentValue;
  }

  /**
   * Handle requests to set the "Target Heating Cooling State" characteristic
   */
  handleTargetHeatingCoolingStateSet(value: CharacteristicValue) {
    //this.log.debug('Triggered SET TargetHeatingCoolingState:' value);
  }

  /**
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  handleCurrentTemperatureGet() {
    //this.log.debug('Triggered GET CurrentTemperature');

    // set this to a valid value for CurrentTemperature
    const currentValue = -270;

    return currentValue;
  }


  /**
   * Handle requests to get the current value of the "Target Temperature" characteristic
   */
  handleTargetTemperatureGet() {
    //this.log.debug('Triggered GET TargetTemperature');

    // set this to a valid value for TargetTemperature
    const currentValue = 10;

    return currentValue;
  }

  /**
   * Handle requests to set the "Target Temperature" characteristic
   */
  handleTargetTemperatureSet(value: CharacteristicValue) {
    //this.log.debug('Triggered SET TargetTemperature:' value);
  }

  /**
   * Handle requests to get the current value of the "Temperature Display Units" characteristic
   */
  handleTemperatureDisplayUnitsGet() {
    //this.log.debug('Triggered GET TemperatureDisplayUnits');

    // set this to a valid value for TemperatureDisplayUnits
    const currentValue = this.platform.Characteristic.TemperatureDisplayUnits.CELSIUS;

    return currentValue;
  }

  /**
   * Handle requests to set the "Temperature Display Units" characteristic
   */
  handleTemperatureDisplayUnitsSet(value: CharacteristicValue) {
    //this.log.debug('Triggered SET TemperatureDisplayUnits:' value);
  }
}
