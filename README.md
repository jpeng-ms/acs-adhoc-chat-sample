# acs-adhoc-calling-sample

Quick sample demoing acs adhoc calling to a Teams user

## Setup

Install dependencies

```sh
npm run setup
```

## Run Locally

1. Change add your connection string in server/appsettings.json
2. In one terminal window, start the server:

```sh

# Navigate to server dir
cd server

# Start server
npm start
```

In another, start the app:

```sh
cd app
npm run start
```

## Deploy to Azure Web Apps

```sh
cd server
npm run build
cd ../app
npm run build
npm run package
# Deploy the dist directory
```
