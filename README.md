# Homebridge HTTP Temperature Thermostat

A Homebridge plugin that creates a thermostat accessory using an external HTTP temperature sensor.

## Features

- Control your thermostat through HomeKit
- Fetch temperature data from an external HTTP endpoint
- Support for JSON responses with configurable JSON path
- Separate URLs for turning thermostat on/off
- Optional status URL to check thermostat state

## Installation

Install the plugin using npm:

```bash
npm install -g homebridge-http-therm-temp
```

## Configuration

Add the platform to your Homebridge `config.json`:

```json
{
  "platforms": [
    {
      "platform": "HttpThermostatTemperature",
      "name": "Thermostat",
      "temperatureUrl": "http://192.168.0.111/temperature",
      "temperatureJsonPath": "temperature",
      "thermostatOnUrl": "http://192.168.0.222/on",
      "thermostatOffUrl": "http://192.168.0.222/off",
      "thermostatStatusUrl": "http://192.168.0.222/status"
    }
  ]
}
```

### Configuration Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `name` | No | Name of the thermostat accessory | `"Thermostat"` |
| `temperatureUrl` | Yes | URL to fetch current temperature | `"http://192.168.0.111/temperature"` |
| `temperatureJsonPath` | Yes | JSON path to extract temperature value | `"temperature"` |
| `thermostatOnUrl` | Yes | URL to turn thermostat on | `"http://192.168.0.222/on"` |
| `thermostatOffUrl` | Yes | URL to turn thermostat off | `"http://192.168.0.222/off"` |
| `thermostatStatusUrl` | No | URL to check thermostat status | `"http://192.168.0.222/status"` |

### Temperature Endpoint

The temperature endpoint should return a JSON response. For example:

```json
{
  "temperature": 22.5
}
```

If your response has a nested structure, adjust the `temperatureJsonPath` accordingly:

```json
{
  "sensor": {
    "temperature": 22.5
  }
}
```

Use `temperatureJsonPath`: `"sensor.temperature"`

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/Stichoza/homebridge-http-therm-temp.git
cd homebridge-http-therm-temp
npm install
```

Build the plugin:

```bash
npm run build
```

Watch for changes during development:

```bash
npm run watch
```

## License

MIT © [Levan Velijanashvili](https://github.com/Stichoza)

## Issues

Report issues at [GitHub Issues](https://github.com/Stichoza/homebridge-http-therm-temp/issues)
