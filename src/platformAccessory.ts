import type { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';
import type { HttpThermostatTemperaturePlatform } from './platform.js';

export class HttpThermostatTemperatureAccessory {
  private service: Service;

  private accessoryState: boolean = true;
  private relayState: boolean = true;
  private currentTemperature: number = 0;
  private targetTemperature: number = 10;

  constructor(
    private readonly platform: HttpThermostatTemperaturePlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Stichoza')
      .setCharacteristic(this.platform.Characteristic.Model, 'HTTP Thermostat Temperature')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'HTT100')
      .setCharacteristic(this.platform.Characteristic.FirmwareRevision, '1.0.0');

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
      .onGet(this.getCurrentHeatingCoolingState.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState)
      .setProps({
        minValue: this.platform.Characteristic.TargetHeatingCoolingState.OFF,
        maxValue: this.platform.Characteristic.TargetHeatingCoolingState.HEAT,
        validValues: [
          this.platform.Characteristic.CurrentHeatingCoolingState.OFF,
          this.platform.Characteristic.CurrentHeatingCoolingState.HEAT,
        ],
      })
      .onGet(this.getTargetHeatingCoolingState.bind(this))
      .onSet(this.setTargetHeatingCoolingState.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetTemperature)
      .onGet(this.getTargetTemperature.bind(this))
      .onSet(this.setTargetTemperature.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits)
      .onGet(this.getTemperatureDisplayUnits.bind(this))
      .onSet(this.setTemperatureDisplayUnits.bind(this));

    setInterval(() => {
      // TODO: Handle temperature update and thermostat toggle
    }, 60000);
  }

  async getCurrentHeatingCoolingState() {
    return this.accessoryState ? this.platform.Characteristic.CurrentHeatingCoolingState.HEAT : this.platform.Characteristic.CurrentHeatingCoolingState.OFF;
  }

  async getTargetHeatingCoolingState() {
    return this.accessoryState ? this.platform.Characteristic.TargetHeatingCoolingState.HEAT : this.platform.Characteristic.TargetHeatingCoolingState.OFF;
  }

  async setTargetHeatingCoolingState(value: CharacteristicValue) {
    this.platform.log.debug('Triggered SET TargetHeatingCoolingState:', value);

    this.accessoryState = value === this.platform.Characteristic.TargetHeatingCoolingState.HEAT;
    this.service.getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState).updateValue(value);
  }

  async getCurrentTemperature() {
    return this.currentTemperature;
  }

  async getTargetTemperature() {
    return this.targetTemperature;
  }

  async setTargetTemperature(value: CharacteristicValue) {
    this.platform.log.debug('Setting current temperature to ', value);

    this.targetTemperature = parseFloat(value as string);
    this.service.getCharacteristic(this.platform.Characteristic.TargetTemperature).updateValue(this.targetTemperature);
  }

  async getTemperatureDisplayUnits() {
    return this.service.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits).value;
  }

  async setTemperatureDisplayUnits(value: CharacteristicValue) {
    this.service.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits).updateValue(value);
  }
}
