# bus-ticket-app
#bus-ticket-app is the backend system of a bus ticketing app, where users can book and cancel their tickets. And admin can add new buses and reset tickets in their buses.

## Table of Contents
-[Usage](#usage)
-[FolderStructure](#folderstructure)
-[Features](#features)

## Usage
Before starting the server, add .env file to the server folder. with your credentials for PORT, MONGO_URI and SECRET_KEY. The src folder does not have relevant use, only the server side of the application is created.

## Features
The project contains the following features:
1. User and Admin registration and log in.
2. Users can book tickets, by providing their contact, name and email.
3. Users can also cancel the tickets that they have booked.
4. Admin can add new bus to the DB.
5. Admin can access the details of the bus including the ticket details to view who has booked the tickets.
6. Admin can reset the tickets back to being available.

## FolderStructure
src folder is not relevant since, for this project only the backend is worked on.
All workable files are present in server folder. 
MODELS- contains the mongoose models of the bus and users.
CONTROLLERS- contains the functions for the routes to perform
ROUTES- contains the relative path for admin, users and authentication.
MIDDLEWARES- contain all the middleware for the project
UTILS- contains the utility functions.



