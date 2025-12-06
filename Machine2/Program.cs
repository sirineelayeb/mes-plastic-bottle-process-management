using System;
using System.Text.Json;
using System.Threading.Tasks;
using HiveMQtt.Client;
using HiveMQtt.Client.Options;

class Program
{
    static async Task Main(string[] args)
    {
        string machineId = "MACHINE002";
        Console.WriteLine($"Starting {machineId} Injection Molding Sensor Simulator...");

        var options = new HiveMQClientOptions
        {
            Host = "broker.hivemq.com",
            Port = 1883,
            UseTLS = false,
            ClientId = $"{machineId}_sim"
        };

        var client = new HiveMQClient(options);
        var random = new Random();
        bool machineRunning = false;

        Console.WriteLine($"{machineId} SIMULATOR - Press ENTER to START/STOP");

        var connectResult = await client.ConnectAsync();
        if (connectResult.ReasonCode == HiveMQtt.MQTT5.ReasonCodes.ConnAckReasonCode.Success)
            Console.WriteLine("Connected to HiveMQ Broker");
        else
        {
            Console.WriteLine("Failed to connect");
            return;
        }

        while (true)
        {
            Console.WriteLine($"\n[{machineId}] Waiting for ENTER...");
            Console.ReadLine();

            if (!machineRunning)
            {
                machineRunning = true;
                await SendMachineStatus(client, machineId, "ON");
                Console.WriteLine($"[{machineId}] TURNED ON - Sensor streaming...");
            }
            else
            {
                machineRunning = false;
                await SendMachineStatus(client, machineId, "OFF");
                Console.WriteLine($"[{machineId}] TURNED OFF");
                break;
            }

            while (machineRunning)
            {
                try
                {
                    // Simulated sensor values for Injection Molding machine
                    double barrelTemperature = 200 + random.NextDouble() * 40;    // 200–240 °C
                    double injectionPressure = 50 + random.NextDouble() * 20;     // 50–70 bar
                    double clampingForce = 100 + random.NextDouble() * 50;        // 100–150 kN

                    var payload = JsonSerializer.Serialize(new
                    {
                        machineId,
                        barrelTemperature = Math.Round(barrelTemperature, 2),
                        injectionPressure = Math.Round(injectionPressure, 2),
                        clampingForce = Math.Round(clampingForce, 2),
                        timestamp = DateTime.UtcNow
                    });

                    await client.PublishAsync($"machines/{machineId}/sensors", payload);

                    Console.WriteLine(
                        $"[{machineId}] BarrelTemp: {barrelTemperature:F2}°C | " +
                        $"Pressure: {injectionPressure:F2} bar | " +
                        $"ClampForce: {clampingForce:F2} kN"
                    );

                    await Task.Delay(500);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Sensor Error: {ex.Message}");
                    await Task.Delay(5000);
                }
            }
        }

        await client.DisconnectAsync();
    }

    static async Task SendMachineStatus(HiveMQClient client, string machineId, string status)
    {
        var alertPayload = JsonSerializer.Serialize(new
        {
            machineId,
            status,
            timestamp = DateTime.UtcNow,
            type = "MACHINE_STATUS"
        });

        await client.PublishAsync($"machines/{machineId}/status", alertPayload);
        Console.WriteLine($"[{machineId}] Status: {status}");
    }
}