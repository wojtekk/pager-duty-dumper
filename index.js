#!/usr/bin/env node

const moment = require('moment');
const fs = require('fs');
const userHome = require('user-home');
const yargs = require('yargs');
const pdClientFactory = require('node-pagerduty');

let config = {};
const configFile = `${userHome}/pager-duty-dumper.json`;
if (fs.existsSync(configFile)) {
  config = require(configFile);
}

function formatDate(date) {
  return moment(date).format("MM/DD/YYYY");
}

function formatTime(date) {
  return moment(date).format("HH:mm");
}

const args = yargs
    .option('schedule', {
      alias: 's',
      type: 'string',
      describe: 'Schedule ID',
    })
    .option('month', {
      alias: 'm',
      type: 'number',
      describe: 'Month',
      default: moment().subtract({month: 1}).month() + 1,
    })
    .option('token', {
      alias: 't',
      type: 'string',
      describe: 'Pager Duty API Token',
    })
    .parse();

const token = args.token || config.token;
if (token.trim() === '') {
  console.error('Missing API Token');
  console.info('Usage: pager-duty-dumper [--token|-t] [--schedule|-s] [--month|-m]');
  process.exit(1);
}

const schedule = args.schedule || config.schedule;
if (schedule.trim() === '') {
  console.error('Missing Schedule ID');
  console.info('Usage: pager-duty-dumper [--token|-t] [--schedule|-s] [--month|-m]');
  process.exit(2);
}

const month = args.month - 1;
if (month < 0 || month > 11) {
  console.error('Incorrect Month. Allowed values: 1-12');
  process.exit(3);
}

console.info('Fetching Pager Duty Schedule');
console.info('Configuration:');
console.info(`- Schedule ID: ${schedule}`);
console.info(`- Month: ${month + 1}`);
console.info(`- API Token: ${token.substr(0, 3)}...`);

const pdClient = new pdClientFactory(token);

const params = {
  time_zone: 'Europe/Warsaw',
  since: moment().set({month, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).toString(),
  until: moment().set({month: month + 1, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0}).toString(),
};

pdClient.schedules.getSchedule(schedule, params)
    .then(data => {
      const body = JSON.parse(data.body);
      const list = body.schedule.final_schedule.rendered_schedule_entries;
      console.info('\nSchedule:\n');
      for (let k in list) {
        if (list.hasOwnProperty(k)) {
          const event = list[k];
          event.start = moment(event.start);
          event.end = moment(event.end);
          console.log(`${event.user.summary},${formatDate(event.start)},${formatTime(event.start)},${formatDate(event.end)},${formatTime(event.end)}`);
        }
      }
    });
