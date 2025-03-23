![Logo](frontend/src/assets/logo_dark_revised.png)
# ProConnect

The goal of this project is to design and develop a Web platform that connects companies
offering projects with potentially interested individuals who are willing to carry on project
work.

## Table of Contents

- [ProConnect](#proconnect)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Environment Variables](#environment-variables)
    - [Run with Docker Compose](#run-with-docker-compose)
  - [Configuration](#configuration)
  - [Usage](#usage)
   
## Introduction

Provide a brief introduction to your project, explaining its purpose and main features.

## Features

List key features or functionalities that your project offers.

- Connecting professionals and company to work on a project.
- Everyone is equal, everyone will have 1 boost for their project or profile.
- Certificate give to Professional users that finish the project
- You are able to work in a team as opposed to traditional freelancing applications.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Docker](https://www.docker.com/) installed on your machine.

## Getting Started

Follow these steps to set up and run the project using Docker Compose.

### Environment Variables

Create an `.env` file in the root of the project and add the following environment variables:

```dotenv
# Example MongoDB URI
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
```
Replace the placeholder values with your actual MongoDB connection details.

### Run with Docker Compose
1. Clone the repository: 
```bash
git clone https://github.com/unsw-cse-comp3900-9900-23T3/capstone-project-3900f13atothemoon.git
cd your-repo
```
2. Build and run the Docker containers:
```bash
docker-compose up --build
```
The backend server will be accessible at http://localhost:5001, and the frontend application will be accessible at http://localhost.

You can stop the containers with Ctrl+C and remove them with:

```bash
docker-compose down
```

## Configuration 
Configure the project by modifying the environment variables in the .env file as needed. It contains mainly to the database connection.

## Usage
Please refer to [API_DOC](API_doc) for more information.

