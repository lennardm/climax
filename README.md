# Climax

## Install
git clone git@github.com:mauricemooij/climax.git

cd climax

npm install

node loadStations.js --file=stationsData.csv

node loadDailyData.js (schedule in cron)

node app.js

## Use
Nearest station
curl http://localhost:3000/stations?latitude=53.2193835&longitude=6.5665018

All stations
curl http://localhost:3000/stations

Daily-data for a station
curl http://localhost:3000/daily-data?station=56b66314c4258c0b355c42b3

All daily-data
curl http://localhost:3000/daily-data

