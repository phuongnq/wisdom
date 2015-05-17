## Requirements
- For development: 
    - Meteor 1.1.0
- For production: 
    - Meteor 1.1.0
    - NodeJS 0.10.36
    - MongoDB 3.0.3

## Run admin tool in development mode
```
cd app_admin
meteor
```

## Run main app in development mode
```
cd app_main
meteor
```

## Run main app or admin tool in production
```
cd app_admin (app_main)
meteor build .
```
file app_admin.tar.gz (app_main.tar.gz) is created, ready to be deployed (run with nodejs):
```
tar -xzf app_admin.tar.gz (app_main.tar.gz)
cd bundle/programs/server
npm install
cd ../../
node main.js
```

## Build iOS app
```
meteor add-platform ios
meteor run ios
```

## Build Android app
```
meteor install-sdk android
meteor add-platform android
meteor run android
```