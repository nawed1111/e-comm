# Ticketing

Ticketing is an micro-services based e-commerce application developed using MERN stack. It uses Kubernetes and docker images to build the application. It is hosted in Digital Ocean and uses Github actions for CI/CD.

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

Create below kubectl secrets used in services using from command line.
JWT_KEY
JWT_LIFE
REFRESH_KEY
REFRESH_LIFE
JWT_ISSUER
STRIPE_KEY

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=*******************
```

Run below commands to download all the dependencies.

```bash
cd auth && npm install && cd ..
cd client && npm install && cd ..
cd expiration && npm install && cd ..
cd orders && npm install && cd ..
cd payments && npm install && cd ..
cd tickets && npm install && cd ..
cd common && npm install && cd ..
```

Start all services by running

```bash
cd auth && npm start && cd ..
cd client && npm run dev && cd ..
cd expiration && npm start && cd ..
cd orders && npm start && cd ..
cd payments && npm start && cd ..
cd tickets && npm start && cd ..
```

After successfully running locally, you should be able to access the client [localhost:3000](http://127.0.0.1:3000/).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
