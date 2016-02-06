var config = {};
config.db = 'mongodb://localhost/climax';
config.port= 3000;
config.dailyData = {
    vars: 'TEMP:SUNR',
    beginYear: 2016,
    beginMonth: 1,
    beginDay: 1
}
module.exports = config;