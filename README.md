# acs-adhoc-chat-sample

Quick sample demoing acs adhoc chat to one or several Teams users

## Setup

Install node.js (13 or newer): https://nodejs.org/en/download/

Install dependencies

```sh
npm run setup
```

## Run Locally

1. Add your connection string in server/appsettings.json
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

If the app doesn't start up, you may need to fix the package versions and re-start the app:

```sh
npm audit fix --force
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
