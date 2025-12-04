const mqtt = require("mqtt");
const logger = require("../utils/logger");
const brokerConfig = require("../config/mqtt-config");

const initMQTT = () => {
  // Connect to MQTT broker
  const brokerUrl = brokerConfig.host;
  const options = {
    clientId: brokerConfig.options.clientId,
    clean: brokerConfig.options.clean,
  };

  logger.info("MQTT", "Connecting to broker...");
  const client = mqtt.connect(brokerUrl, options);

  // Track active machines
  const activeMachines = new Map();

  // ---------------- MQTT CONNECTION EVENTS ----------------
  client.on("connect", () => {
    logger.success("MQTT", "Connected to broker");

    // Subscribe to machine status topic
    client.subscribe("machines/+/status", { qos: 1 }, (err) => {
      if (err) logger.error("MQTT", `Subscription error (status): ${err.message}`);
      else logger.success("MQTT", "Subscribed to topic: machines/+/status");
    });

    // Subscribe to machine temperature topic
    client.subscribe("machines/+/temperature", { qos: 1 }, (err) => {
      if (err) logger.error("MQTT", `Subscription error (temperature): ${err.message}`);
      else logger.success("MQTT", "Subscribed to topic: machines/+/temperature");
    });
  });

  // ---------------- MESSAGE HANDLING ----------------
  client.on("message", async (topic, message) => {
    try {
      const [_, machineId, messageType] = topic.split("/");
      const payload = JSON.parse(message.toString());
      const timestamp = new Date(payload.timestamp).toLocaleTimeString();

      // ---------- Machine Status ----------
      if (messageType === "status") {
        if (payload.status === "ON") {
          activeMachines.set(machineId, {
            startTime: new Date(),
          });

          logger.success("Machine", `${machineId} turned ON`);
          console.log("📦 Status Data:", JSON.stringify(payload, null, 2));
        } else if (payload.status === "OFF") {
          activeMachines.delete(machineId);
          logger.info("Machine", `${machineId} turned OFF`);
          console.log("📦 Status Data:", JSON.stringify(payload, null, 2));
        }
      }

      // ---------- Temperature Data ----------
      else if (messageType === "temperature" && activeMachines.has(machineId)) {
        logger.info(
          "Temperature",
          `${machineId} [${timestamp}] Temp: ${payload.temperature}°C, Humidity: ${payload.humidity}%, Pressure: ${payload.pressure} hPa`
        );
        
        console.log("🌡️  Temperature Data:", JSON.stringify(payload, null, 2));
      }
    } catch (err) {
      logger.error("MQTT", `Message handling error: ${err.message}`);
    }
  });

  // ---------------- CONNECTION ERROR ----------------
  client.on("error", (err) => {
    logger.error("MQTT", `Connection error: ${err.message}`);
  });

  // ---------------- SHUTDOWN HANDLER ----------------
  const cleanup = () => {
    logger.warn("MQTT", "Shutting down MQTT client...");
    activeMachines.clear();
    client.end();
    logger.info("MQTT", "Client disconnected");
  };

  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);

  return client;
};

module.exports = initMQTT;