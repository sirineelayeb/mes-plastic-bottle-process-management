import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true,
},
unit: {
type: String,
required: true,
trim: true,
},
quantity: {
type: Number,
required: true,
default: 0,
min: 0,
},
description: {
type: String,
trim: true,
},
},
{ timestamps: true } 
);

module.exports = mongoose.model("Material", MaterialSchema);