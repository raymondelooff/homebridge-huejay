# Philips Hue for Homebridge

[![npm](https://img.shields.io/npm/v/homebridge-huejay.svg)](https://www.npmjs.com/package/homebridge-huejay)
[![npm](https://img.shields.io/david/raymondelooff/homebridge-huejay.svg)](https://david-dm.org/raymondelooff/homebridge-huejay)
[![npm](https://img.shields.io/npm/dt/homebridge-huejay.svg)](https://www.npmjs.com/package/homebridge-huejay)

Homebridge Huejay is a Homebridge Plugin for Philips Hue accessories based on Huejay. This plugin will add HomeKit support for Hue accessories that don't have HomeKit support (yet), for example the Hue Motion Sensor.

## Features
- Adds HomeKit support for accessories that don't have HomeKit support out-of-the-box, like the Hue Motion Sensor.
- Adds HomeKit support for sensors that are not visible via the official Philips Hue App, like the ambient and temperature sensors of the Hue Motion Sensor.
- Automatic detection of Bridges. Homebridge Huejay also supports multiple Bridges.
- Accessory information is updated when HomeKit requests the value. The information is therefore always up-to-date.

## Installation
Installation is easy, just execute the following command on your Homebridge host machine.

```
npm install -g homebridge-huejay
```

## Configuration
Modify the `config.json` file of your Homebridge installation and add the following section:

```json
"platforms": [
    {
        "platform": "HuePlatform",
        "name": "Hue"
    }
]
```

Optionally, you may enable or disable support for sensors and/or lights. This plugin also supports a 'generic' mode for both sensors and lights. With the generic mode enabled, this plugin will register all lights and/or sensors with generic capabilities (like on/off toggles and brightness in the case of lights, if supported).

```json
"platforms": [
    {
        "platform": "HuePlatform",
        "name": "Hue",
        "enableLights": true,
        "enableGenericLights": false,
        "enableSensors": true,
        "enableGenericSensors": false
    }
]
```

### Automatic Discovery of Bridges
Homebridge Huejay will try to discover Bridges when no Bridges are specified in the configuration. Homebridge Huejay will ask for authentication after every restart of Homebridge if no credentials are listed in your `config.json`. When you press the link button of your Bridge, Homebridge Huejay will connect to your Bridge and log the credentials of the created user. It's recommended to store the credentials in your `config.json` file to let Homebridge Huejay use that credentials when Homebridge is restarted.

You don't have to store the IP of your Bridge in the configuration file. Homebridge Huejay will automatically try to find the Bridge based on the given ID.

```
[4-3-2017 16:05:33] [Hue] Found Hue Bridge with ID: 001011XXXX0XX0X0, IP: 192.168.1.2
[4-3-2017 16:05:33] [Hue] Link button not pressed. Press the link button on your Bridge to authenticate...
[4-3-2017 16:05:38] [Hue] New user created - Username: RlRpseUAXPsMlnLyHXfNPIMt-60MlX06QB5VwpP6
[4-3-2017 16:05:38] [Hue] Loading accessories...
[4-3-2017 16:05:38] [Hue] Loading sensors of Bridge with ID 001011XXXX0XX0X0...
```


```json
"platforms": [
    {
        "platform": "HuePlatform",
        "name": "Hue",
        "clients": [
            {
                "id": "001011XXXX0XX0X0",
                "username": "RlRpseUAXPsMlnLyHXfNPIMt-60MlX06QB5VwpP6"
            }
        ]
    }
]
```

### Advanced Client configuration
You may also pass advanced options to the Huejay clients. Read the [Huejay documentation](https://github.com/sqmk/huejay#client-usage) for more information about the settings.


```json
"platforms": [
    {
        "platform": "HuePlatform",
        "name": "Hue",
        "clients": [
            {
                "id": "001011XXXX0XX0X0",
                "ip": "192.168.1.2",
                "port": 80,
                "timeout": 15000,
                "username": "RlRpseUAXPsMlnLyHXfNPIMt-60MlX06QB5VwpP6"
            }
        ]
    }
]
```

### Ignoring accessories
If you want to disable HomeKit support for a specific accessory you can add the unique ID of the accessory to the `ignoreAccessories` option in the configuration. If you don't know what the unique ID is of a specific accessory, you can look for the 'Serial Number' of the accessory you want to disable. Homebridge Huejay registers the unique ID of an accessory as the 'Serial Number' to HomeKit. You can find the 'Serial Number' at the detail view of the accessory you want to disable. Most of the time it looks like a MAC address.

```json
"platforms": [
    {
        "platform": "HuePlatform",
        "name": "Hue",
        "clients": [
            {
                "id": "001011XXXX0XX0X0",
                "username": "RlRpseUAXPsMlnLyHXfNPIMt-60MlX06QB5VwpP6"
            }
        ],
        "ignoreAccessories": [
            "XX:XX:XX:XX:XX:XX:XX:XX-01-0001"
        ]
    }
]
```

## Issues
If you have any issues with the extension, please let me know via the GitHub [issues section](https://github.com/raymondelooff/homebridge-huejay/issues). Provide as much information as possible, including the system log, so I can try to reproduce the problem. Turn Homebridge debugging on before posting your system log. Make sure you don't post any private information like API keys or secret keys.

## Contribution
Your help is more than welcome! If you own accessories that are not supported by Homebridge Huejay at this moment, feel free to create a pull request with the implementation for other accessories. Make sure to use the same code style as used for the existing code base. Thank you!

## License & Copyright
Copyright (c) 2018 Raymon de Looff <raydelooff@gmail.com>.
This plugin is open-source software licensed under the GPLv3 license.
