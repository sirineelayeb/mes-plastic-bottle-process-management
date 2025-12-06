const mqtt = require("mqtt");
const logger = require("../utils/logger");
const brokerConfig = require("../config/mqtt-config");

const initMQTT = (io) => {
  const brokerUrl = brokerConfig.host;
  const options = {
    clientId: brokerConfig.options.clientId,
    clean: brokerConfig.options.clean,
  };

  logger.info("MQTT", "Connecting to broker...");
  const client = mqtt.connect(brokerUrl, options);

  // Track active machines
  const activeMachines = new Map();

  // Track last payload timestamp to handle 10s inactivity
  const lastPayloadTime = new Map();

  client.on("connect", () => {
    logger.success("MQTT", "Connected to broker");

    client.subscribe("machines/+/status", { qos: 1 }, (err) => {
      if (err) logger.error("MQTT", `Subscription error (status): ${err.message}`);
      else logger.success("MQTT", "Subscribed to machines/+/status");
    });

    client.subscribe("machines/+/sensors", { qos: 1 }, (err) => {
      if (err) logger.error("MQTT", `Subscription error (sensors): ${err.message}`);
      else logger.success("MQTT", "Subscribed to machines/+/sensors");
    });
  });

  const broadcastToPMs = (event, data) => {
    if (!io) return;
    io.sockets.sockets.forEach((socket) => {
      if (socket.user.role === "product_manager") {
        socket.emit(event, data);
      }
    });
  };

  // Check for inactive machines every second
  setInterval(() => {
    const now = Date.now();
    activeMachines.forEach((machine, machineId) => {
      const lastTime = lastPayloadTime.get(machineId);
      if (lastTime && now - lastTime > 10000) { // 10 seconds
        activeMachines.delete(machineId);
        lastPayloadTime.delete(machineId);
        logger.info("Machine", `${machineId} marked OFF (timeout)`);
        broadcastToPMs("machine_status", {
          machineId,
          status: "OFF",
          timestamp: new Date().toLocaleTimeString(),
          payload: {}
        });
      }
    });
  }, 1000);

  client.on("message", (topic, message) => {
    try {
      const [_, machineId, messageType] = topic.split("/");
      const payload = JSON.parse(message.toString());
      const timestamp = new Date(payload.timestamp).toLocaleTimeString();

      // Update last payload time
      lastPayloadTime.set(machineId, Date.now());

      // Status messages
      if (messageType === "status") {
        if (payload.status === "ON") {
          activeMachines.set(machineId, { machineId, startTime: new Date() });
          broadcastToPMs("machine_status", { machineId, status: "ON", timestamp, payload });
          logger.success("Machine", `${machineId} turned ON`);
        } else if (payload.status === "OFF") {
          activeMachines.delete(machineId);
          lastPayloadTime.delete(machineId);
          broadcastToPMs("machine_status", { machineId, status: "OFF", timestamp, payload });
          logger.info("Machine", `${machineId} turned OFF`);
        }
      }

      // Sensor messages
      else if (messageType === "sensors" && activeMachines.has(machineId)) {
        logSensorData(machineId, payload, timestamp);
        broadcastToPMs("machine_sensors", { machineId, timestamp, payload });
      }
    } catch (err) {
      logger.error("MQTT", `Message handling error: ${err.message}`);
    }
  });

  client.on("error", (err) => {
    logger.error("MQTT", `Connection error: ${err.message}`);
  });

  const cleanup = () => {
    logger.warn("MQTT", "Shutting down MQTT client...");
    activeMachines.clear();
    lastPayloadTime.clear();
    client.end();
    logger.info("MQTT", "Client disconnected");
  };

  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);

  // Expose active machines to server for new clients
  client.getActiveMachines = () => {
    const machines = [];
    activeMachines.forEach((value, key) => {
      machines.push({ machineId: key, status: "ON", timestamp: new Date().toLocaleTimeString() });
    });
    return machines;
  };

  return client;
};

function logSensorData(machineId, payload, timestamp) {
  if (payload.fillVolume !== undefined) {
    logger.info(
      "Sensors",
      `${machineId} [${timestamp}] FillVolume: ${payload.fillVolume}ml, ConveyorSpeed: ${payload.conveyorSpeed} m/min, CapTorque: ${payload.capTorque} Nm`
    );
  } else if (payload.barrelTemperature !== undefined) {
    logger.info(
      "Sensors",
      `${machineId} [${timestamp}] BarrelTemp: ${payload.barrelTemperature}°C, Pressure: ${payload.injectionPressure} bar, ClampForce: ${payload.clampingForce} kN`
    );
  } else {
    const fields = Object.keys(payload)
      .filter(key => key !== "machineId" && key !== "timestamp")
      .map(key => `${key}: ${payload[key]}`)
      .join(", ");
    logger.info("Sensors", `${machineId} [${timestamp}] ${fields}`);
  }
}

module.exports = initMQTT;
