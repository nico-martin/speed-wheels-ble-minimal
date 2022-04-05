class SpeedwheelsController {
  connected;
  device;
  motor;

  constructor() {
    this.connected = false;
    this.device = null;
    this.motor = null;
  }

  async connect() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{
        namePrefix: 'SpeedWheels',
      }],
      optionalServices: [
        'c10e3e56-fdd3-11eb-9a03-0242ac130003',
      ],
    });

    this.device = device;

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('c10e3e56-fdd3-11eb-9a03-0242ac130003');
    this.motor = await service.getCharacteristic('35a1022c-fdd3-11eb-9a03-0242ac130003');

    //this.device.addEventListener('gattserverdisconnected', () => this.onDisconnect(this.device));

    return this.motor;
  }

  async setSpeed(left, right) {
    if (!this.motor) {
      return new Error('Not yet connected');
    }
    await this.motor.writeValue(new Uint8Array([left + 100, right + 100]));
  }
}