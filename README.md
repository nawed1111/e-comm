# Ticketing 

Ticketing is an micro-services based e-commerce website developed using MERN stack. It uses Kubernetes and docker images to build the application. It is hosted in Digital Ocean.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

Clone the project to local machine.
```bash
git clone https://github.com/nawed1111/e-comm.git
```

Use the node package manager [npm](https://nodejs.org/en/download/) to install Ticketing.

Install Dependencies

[Docker](https://www.docker.com/get-started)

[Kubectl](https://kubernetes.io/releases/download/)

Alternatively one can do remote development using Google Cloud Platform and [Skaffold](https://skaffold.dev/).

Run below commands to download all the dependencies.
```bash
cd auth npm install
cd client npm install
cd expiration npm install
cd orders npm install
cd payments npm install
cd tickets npm install
cd common npm install
```
Start all service by running
```bash
cd auth npm start
cd client npm run dev
cd expiration npm start
cd orders npm start
cd payments npm start
cd tickets npm start
```
After successfully running locally, you should be able to access the client [localhost:8000](http://127.0.0.1:3000/).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
