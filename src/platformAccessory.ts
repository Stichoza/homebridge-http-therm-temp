import type { CharacteristicValue, PlatformAccessory, Service } from 'homebridge';
import type { HttpThermostatTemperaturePlatform } from './platform.js';

export class HttpThermostatTemperatureAccessory {
  private service: Service;

  // TODO: Maintain values after restart
  private accessoryState: boolean = true;
  private relayState: boolean = true;
  private currentTemperature: number = 0;
  private targetTemperature: number = 24;

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

    setInterval(this.updateTemperature.bind(this), 60000);
    setInterval(this.updateRelayState.bind(this), 5000);// TODO: Change to 60000 after fixing relay code: https://github.com/Stichoza/esp-thermostat-controller/
  }

  async getCurrentHeatingCoolingState() {
    return this.accessoryState ? this.platform.Characteristic.CurrentHeatingCoolingState.HEAT : this.platform.Characteristic.CurrentHeatingCoolingState.OFF;
  }

  async getTargetHeatingCoolingState() {
    return this.accessoryState ? this.platform.Characteristic.TargetHeatingCoolingState.HEAT : this.platform.Characteristic.TargetHeatingCoolingState.OFF;
  }

  async setTargetHeatingCoolingState(value: CharacteristicValue) {
    this.platform.log.info('Setting thermostat state to:', value);

    this.accessoryState = value === this.platform.Characteristic.TargetHeatingCoolingState.HEAT;
    this.service.getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState).updateValue(value);
    await this.updateRelayState();
    this.service.getCharacteristic(this.platform.Characteristic.CurrentHeatingCoolingState).updateValue(value);
  }

  async getCurrentTemperature() {
    return this.currentTemperature;
  }

  async getTargetTemperature() {
    return this.targetTemperature;
  }

  async setTargetTemperature(value: CharacteristicValue) {
    this.platform.log.info('Setting target temperature to:', value);

    this.targetTemperature = parseFloat(value as string);
    this.service.getCharacteristic(this.platform.Characteristic.TargetTemperature).updateValue(this.targetTemperature);
    await this.updateRelayState();
  }

  async getTemperatureDisplayUnits() {
    return this.service.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits).value;
  }

  async setTemperatureDisplayUnits(value: CharacteristicValue) {
    this.service.getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits).updateValue(value);
  }

  async updateTemperature() {
    try {
      const response = await fetch(this.platform.config.temperatureUrl);
      const data = await response.json();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.currentTemperature = this.platform.config.temperatureJsonPath.split('.').reduce((o: any, k: any) => {
        return o && o[k];
      }, data) as number;

      this.service.getCharacteristic(this.platform.Characteristic.CurrentTemperature).updateValue(this.currentTemperature);
    } catch (error) {
      this.platform.log.error('Error getting temperature:', error);
    }
  }

  async updateRelayState() {
    const oldState = this.relayState;
    this.relayState = this.accessoryState && this.currentTemperature < this.targetTemperature;
    
    if (oldState !== this.relayState) {
      this.platform.log.info('Turning relay', this.relayState ? 'on' : 'off');
    }

    try {
      await fetch(this.relayState ? this.platform.config.thermostatOnUrl : this.platform.config.thermostatOffUrl);
    } catch (error) {
      this.platform.log.error('Error updating relay state:', error);
    }
  }
}
