// src/pages/supervisor/ManageTasks.tsx
import React from "react";
import { Plus, ArrowLeft, Package, Users, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function ManageTasks() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/tasks/all">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Plus className="w-9 h-9 text-primary" />
              Create New Production Task
            </h1>
            <p className="text-muted-foreground">Schedule a new batch production</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="batch">Batch Name</Label>
                <Input id="batch" placeholder="e.g., Batch A-101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Product Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500ml">500ml Water Bottle</SelectItem>
                    <SelectItem value="1l">1L Juice Bottle</SelectItem>
                    <SelectItem value="2l">2L Soda Bottle</SelectItem>
                    <SelectItem value="1.5l">1.5L Water Bottle</SelectItem>
                    <SelectItem value="750ml">750ml Sports Bottle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="operator">Assign Operator</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahmed">Ahmed Ben Ali</SelectItem>
                    <SelectItem value="fatima">Fatima Mansour</SelectItem>
                    <SelectItem value="mohamed">Mohamed Trabelsi</SelectItem>
                    <SelectItem value="amira">Amira Zaidi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes / Instructions</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions for this batch..."
                className="min-h-32"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" asChild>
                <Link to="/tasks/all">Cancel</Link>
              </Button>
              <Button className="bg-primary">
                <Package className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}