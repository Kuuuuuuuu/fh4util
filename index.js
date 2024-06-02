const dgram = require("dgram");
const port = 6969;

class Server {
  /**
   * @type {Data}
   * @private
   */
  lastUpdate = null;

  constructor() {
    const listener = dgram.createSocket("udp4");

    listener.bind(port, "127.0.0.1", () => {
      console.log(`listening on ${listener.address().address}:${listener.address().port}`);
    });

    listener.on("message", (msg) => {
      this.lastUpdate = new Data(msg);
    });

    listener.on("error", (err) => {
      console.error(`Error: ${err}`);
      listener.close();
    });
  }

  getData() {
    return this.lastUpdate;
  }
}

class Data {
  /**
   * @param {Buffer} data
   */
  constructor(data) {
    this.IsRaceOn = data.readInt32LE(0);
    this.TimestampMS = data.readUInt32LE(4);

    this.EngineRPM = {
      Idle: data.readFloatLE(12),
      Max: data.readFloatLE(8),
      Current: data.readFloatLE(16),
    };

    this.Acceleration = this.readVector3(data, 20);
    this.Velocity = this.readVector3(data, 32);
    this.AngularVelocity = this.readVector3(data, 44);

    this.Yaw = data.readFloatLE(56);
    this.Pitch = data.readFloatLE(60);
    this.Roll = data.readFloatLE(64);

    this.NormalizedSuspensionTravel = this.readFourFloats(data, 68);
    this.TireSlipRatio = this.readFourFloats(data, 84);
    this.WheelRotationSpeed = this.readFourFloats(data, 100);

    this.WheelOnRumbleStrip = this.readFourInts(data, 116);
    this.WheelInPuddleDepth = this.readFourFloats(data, 132);
    this.SurfaceRumble = this.readFourFloats(data, 148);
    this.TireSlipAngle = this.readFourFloats(data, 164);
    this.TireCombinedSlip = this.readFourFloats(data, 180);
    this.SuspensionTravel = this.readFourFloats(data, 196);

    this.Car = {
      Ordinal: data.readInt32LE(212),
      Class: data.readInt32LE(216),
      PI: data.readInt32LE(220),
      DrivetrainType: data.readInt32LE(224),
      NumCylinders: data.readInt32LE(228),
      PositionX: data.readFloatLE(232),
      PositionY: data.readFloatLE(236),
      PositionZ: data.readFloatLE(240),
      Speed: data.readFloatLE(244),
      Power: data.readFloatLE(248),
      Torque: data.readFloatLE(252),
      Boost: data.readFloatLE(272),
      Fuel: data.readFloatLE(276),
      DistanceTraveled: data.readFloatLE(280),
    };

    this.TireTemperature = this.readFourFloats(data, 256);

    this.LapStats = {
      BestLap: data.readFloatLE(284),
      LastLap: data.readFloatLE(288),
      CurrentLap: data.readFloatLE(292),
      CurrentRaceTime: data.readFloatLE(296),
      LapNumber: data.readUInt16LE(300),
    };

    this.RacePosition = data.readUInt8(302);
    this.Accel = data.readUInt8(303);
    this.Brake = data.readUInt8(304);
    this.Clutch = data.readUInt8(305);
    this.Handbrake = data.readUInt8(306);
    this.Gear = data.readUInt8(307);
    this.Steer = data.readInt8(308);
  }

  /**
   * @param {Buffer} data
   * @param {number} offset
   * @returns {Object}
   * @private
   */
  readVector3(data, offset) {
    return {
      X: data.readFloatLE(offset),
      Y: data.readFloatLE(offset + 4),
      Z: data.readFloatLE(offset + 8),
    };
  }

  /**
   * @param {Buffer} data
   * @param {number} offset
   * @returns {Object}
   * @private
   */
  readFourFloats(data, offset) {
    return {
      FrontLeft: data.readFloatLE(offset),
      FrontRight: data.readFloatLE(offset + 4),
      RearLeft: data.readFloatLE(offset + 8),
      RearRight: data.readFloatLE(offset + 12),
    };
  }

  /**
   * @param {Buffer} data
   * @param {number} offset
   * @returns {Object}
   * @private
   */
  readFourInts(data, offset) {
    return {
      FrontLeft: data.readInt32LE(offset),
      FrontRight: data.readInt32LE(offset + 4),
      RearLeft: data.readInt32LE(offset + 8),
      RearRight: data.readInt32LE(offset + 12),
    };
  }
}

module.exports = Server;
