using System;
using System.Text.Json;
using System.Threading.Tasks;
using HiveMQtt.Client;
using HiveMQtt.Client.Options;

class Program
{
    static async Task Main(string[] args)
    {
        string machineId = "MACHINE003";
        Console.WriteLine($"Starting {machineId} Bottling Line Sensor Simulator...");

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
                    // Simulated sensor values for Bottling Line machine
                    double fillVolume = 500 + random.NextDouble() * 10;          // 500–510 ml
                    double conveyorSpeed = 120 + random.NextDouble() * 30;       // 120–150 m/min
                    double capTorque = 0.8 + random.NextDouble() * 0.3;          // 0.8–1.1 Nm

                    var payload = JsonSerializer.Serialize(new
                    {
                        machineId,
                        fillVolume = Math.Round(fillVolume, 2),
                        conveyorSpeed = Math.Round(conveyorSpeed, 2),
                        capTorque = Math.Round(capTorque, 2),
                        timestamp = DateTime.UtcNow
                    });

                    await client.PublishAsync($"machines/{machineId}/sensors", payload);

                    Console.WriteLine(
                        $"[{machineId}] FillVolume: {fillVolume:F2}ml | " +
                        $"ConveyorSpeed: {conveyorSpeed:F2} m/min | " +
                        $"CapTorque: {capTorque:F2} Nm"
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