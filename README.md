# IoT Manager

A full-stack web application for monitoring, managing, and controlling 
IoT devices across multiple sites — from sensors to smart devices, 
all in one dashboard.

![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![Kafka](https://img.shields.io/badge/Kafka-enabled-black)

## Overview

IoT Manager provides a centralised platform to register, monitor, 
and control IoT devices spread across different physical sites. 
It handles real-time data flow via Kafka, exposes a RESTful API 
for all device operations, and presents everything through an 
interactive dashboard with live telemetry and remote control.

## Features

- **Device Registry** — register and manage multiple device types 
  (sensors, smart devices) across different sites
- **Real-time Data Flow** — Kafka-based message streaming for 
  live telemetry ingestion
- **Interactive Dashboard** — monitor device status, view location 
  maps with all connected devices, and control devices remotely
- **Mock Server** — generates synthetic Kafka messages for demo 
  and development sessions
- **RESTful API** — full CRUD operations for all device and 
  site management functions

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, TypeScript, RESTful API
- **Database**: MongoDB
- **Messaging**: Apache Kafka
- **Infrastructure**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- MongoDB

### Installation

```bash
# Clone the repository
git clone https://github.com/MihneaCatana/IoT-Manager.git
cd IoT-Manager

# Start infrastructure (MongoDB + Kafka)
docker-compose up -d

# Install and run backend
cd back-end
npm install
npm run dev

# Install and run frontend
cd ../front-end
npm install
npm run dev
```

### Access

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000

## Project Structure

├── back-end/        # Node.js + TypeScript REST API
├── front-end/       # React + TypeScript dashboard
└── docker-compose.yml

## License

MIT
