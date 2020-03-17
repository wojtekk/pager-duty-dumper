# Pager Duty Schedule Dumper

Small script to dump Pager Duty Schedule to CSV format.

## How to install

To install script run command:

```bash
npm install -g pager-duty-dumper
```

Generate [Personal Pager Duty API Key](https://support.pagerduty.com/docs/generating-api-keys#section-generating-a-personal-rest-api-key).

## Usage

To dump Schedule for previous month:

```bash
> pdd

Fetching Pager Duty Schedule
Configuration:
- Schedule ID: XXXX
- Month: 2
- API Token: -YY...

Schedule:

Sławomir Słowikowski,02/01/2020,00:00,02/03/2020,14:00
Zygmunt Pracowity,02/03/2020,14:00,02/10/2020,14:00
```

Optional command line parameters:

- `token`, `t` - Pager Duty API Token
- `schedule`, `s` - Schedule ID
- `month`, `m` - Month (1-12), default: previous month

## Configuration

You can store configuration in the file: `~/.pager-duty-dumper.json`

Example content:

```json
{
  "schedule": "yyyy",
  "token": "xxxx"
}
```
