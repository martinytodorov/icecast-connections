# Icecast Connections

The app allows you to collect and show statistics from an IceCast server that reports it's data in a CSV format.
It uses:
  - Google Charts
  - Pure css framework
  - Some node_modules
  
Use the following command to install the app:
```sh
$ npm install
```

Setup a cron job to run every hour -> with the following command:
```sh
0 * * * * root node /<YOUR PATH TO THE APP>/icecast-connections/update.js
```

And then to run the app you can use **forever** with the following command into the root folder of the app:
```sh
forever start -o out.log -e err.log app/app.js
```

**!!! Please have in mind that the app shows data for the last 24 hours by default so you'd have to wait at least 24 hours for some data to be collected**

If for some reason there's an error with the cron "update.js", here's the format of the CSV I'm getting from Icecast, so you can check if there's some differences in yours:

```sh
/stream.aac, 2817, RADIO NAME, 74, RADIO TITLE, , http://stream.*****:80/stream.aac
/stream.ogg, 442, RADIO NAME, 330, RADIO TITLE, , http://stream.*****:80/stream.ogg
```