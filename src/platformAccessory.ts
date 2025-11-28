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
      .setProps({
        minValue: this.platform.Characteristic.CurrentHeatingCoolingState.OFF,
        maxValue: this.platform.Characteristic.CurrentHeatingCoolingState.HEAT,
        validValues: [
          this.platform.Characteristic.CurrentHeatingCoolingState.OFF,
          this.platform.Characteristic.CurrentHeatingCoolingState.HEAT,
        ],
      })
      .onGet(this.handleCurrentHeatingCoolingStateGet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState)
      .setProps({
        minValue: this.platform.Characteristic.TargetHeatingCoolingState.OFF,
        maxValue: this.platform.Characteristic.TargetHeatingCoolingState.HEAT,
        validValues: [
          this.platform.Characteristic.CurrentHeatingCoolingState.OFF,
          this.platform.Characteristic.CurrentHeatingCoolingState.HEAT,
        ],
      })
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

  async handleCurrentHeatingCoolingStateGet() {
    this.platform.log.debug('Triggered GET CurrentHeatingCoolingState');

    const currentValue = this.platform.Characteristic.CurrentHeatingCoolingState.OFF;

    return currentValue;
  }

  async handleTargetHeatingCoolingStateGet() {
    this.platform.log.debug('Triggered GET TargetHeatingCoolingState');

    const currentValue = this.platform.Characteristic.TargetHeatingCoolingState.OFF;

    return currentValue;
  }

  async handleTargetHeatingCoolingStateSet(value: CharacteristicValue) {
    this.platform.log.debug('Triggered SET TargetHeatingCoolingState:', value);
  }

  async handleCurrentTemperatureGet() {
    this.platform.log.debug('Triggered GET CurrentTemperature');

    const currentValue = -270;

    return currentValue;
  }

  async handleTargetTemperatureGet() {
    this.platform.log.debug('Triggered GET TargetTemperature');

    const currentValue = 10;

    return currentValue;
  }

  async handleTargetTemperatureSet(value: CharacteristicValue) {
    this.platform.log.debug('Triggered SET TargetTemperature:', value);
  }

  async handleTemperatureDisplayUnitsGet() {
    const currentValue = this.platform.Characteristic.TemperatureDisplayUnits.CELSIUS;

    return currentValue;
  }

  async handleTemperatureDisplayUnitsSet(value: CharacteristicValue) {
    this.platform.log.debug('Triggered SET TemperatureDisplayUnits:', value);
  }
}
