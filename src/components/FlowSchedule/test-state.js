export const session = {
  asyncTask: {
    'flow-schedule': {
      status: 'complete',
    },
  },
  form: {
    'flow-schedule': {
      parentContext: {
        integrationId: '626bda66987bb423914b486f',
        resourceType: 'flows',
        resourceId: '626bdab2987bb423914b487d',
      },
      disabled: false,
      showValidationBeforeTouched: false,
      conditionalUpdate: false,
      fieldMeta: {
        fieldMap: {
          timeZone: {
            id: 'timeZone',
            name: 'timeZone',
            type: 'select',
            label: 'Time zone',
            helpKey: 'flow.timezone',
            defaultValue: 'Asia/Calcutta',
            options: [
              {
                items: [
                  {
                    label: '(GMT-12:00) International Date Line West',
                    value: 'Etc/GMT+12',
                  },
                  {
                    label: '(GMT-11:00) Midway Island, Samoa',
                    value: 'Pacific/Samoa',
                  },
                  {
                    label: '(GMT-10:00) Hawaii',
                    value: 'Pacific/Honolulu',
                  },
                  {
                    label: '(GMT-09:00) Alaska',
                    value: 'America/Anchorage',
                  },
                  {
                    label: '(GMT-08:00) Pacific Time (US & Canada)',
                    value: 'America/Los_Angeles',
                  },
                  {
                    label: '(GMT-08:00) Tijuana, Baja California',
                    value: 'America/Tijuana',
                  },
                  {
                    label: '(GMT-07:00) Mountain Time (US & Canada)',
                    value: 'America/Denver',
                  },
                  {
                    label: '(GMT-07:00) Arizona',
                    value: 'America/Phoenix',
                  },
                  {
                    label: '(GMT-07:00) Chihuahua, La Paz, Mazatlan - New',
                    value: 'America/Chihuahua',
                  },
                  {
                    label: '(GMT-06:00) Central Time (US & Canada)',
                    value: 'America/Chicago',
                  },
                  {
                    label: '(GMT-06:00) Saskatchewan',
                    value: 'America/Regina',
                  },
                  {
                    label: '(GMT-06:00) Central America',
                    value: 'America/Guatemala',
                  },
                  {
                    label: '(GMT-06:00) Guadalajara, Mexico City, Monterrey - Old',
                    value: 'America/Mexico_City',
                  },
                  {
                    label: '(GMT-05:00) Eastern Time (US & Canada)',
                    value: 'America/New_York',
                  },
                  {
                    label: '(GMT-05:00) Indiana (East)',
                    value: 'US/East-Indiana',
                  },
                  {
                    label: '(GMT-05:00) Bogota, Lima, Quito',
                    value: 'America/Bogota',
                  },
                  {
                    label: '(GMT-04:30) Caracas',
                    value: 'America/Caracas',
                  },
                  {
                    label: '(GMT-04:00) Atlantic Time (Canada)',
                    value: 'America/Halifax',
                  },
                  {
                    label: '(GMT-04:00) Georgetown, La Paz, San Juan',
                    value: 'America/La_Paz',
                  },
                  {
                    label: '(GMT-04:00) Manaus',
                    value: 'America/Manaus',
                  },
                  {
                    label: '(GMT-04:00) Santiago',
                    value: 'America/Santiago',
                  },
                  {
                    label: '(GMT-03:30) Newfoundland',
                    value: 'America/St_Johns',
                  },
                  {
                    label: '(GMT-03:00) Brasilia',
                    value: 'America/Sao_Paulo',
                  },
                  {
                    label: '(GMT-03:00) Buenos Aires',
                    value: 'America/Buenos_Aires',
                  },
                  {
                    label: '(GMT-03:00) Cayenne',
                    value: 'Etc/GMT+3',
                  },
                  {
                    label: '(GMT-03:00) Greenland',
                    value: 'America/Godthab',
                  },
                  {
                    label: '(GMT-03:00) Montevideo',
                    value: 'America/Montevideo',
                  },
                  {
                    label: '(GMT-02:00) Mid-Atlantic',
                    value: 'America/Noronha',
                  },
                  {
                    label: '(GMT-01:00) Cape Verde Is.',
                    value: 'Etc/GMT+1',
                  },
                  {
                    label: '(GMT-01:00) Azores',
                    value: 'Atlantic/Azores',
                  },
                  {
                    label: '(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
                    value: 'Europe/London',
                  },
                  {
                    label: '(GMT) Casablanca',
                    value: 'GMT',
                  },
                  {
                    label: '(GMT) Monrovia, Reykjavik',
                    value: 'Atlantic/Reykjavik',
                  },
                  {
                    label: '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
                    value: 'Europe/Warsaw',
                  },
                  {
                    label: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
                    value: 'Europe/Paris',
                  },
                  {
                    label: '(GMT+01:00) West Central Africa',
                    value: 'Etc/GMT-1',
                  },
                  {
                    label: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
                    value: 'Europe/Amsterdam',
                  },
                  {
                    label: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
                    value: 'Europe/Budapest',
                  },
                  {
                    label: '(GMT+02:00) Cairo',
                    value: 'Africa/Cairo',
                  },
                  {
                    label: '(GMT+02:00) Athens, Bucharest, Istanbul',
                    value: 'Europe/Istanbul',
                  },
                  {
                    label: '(GMT+02:00) Jerusalem',
                    value: 'Asia/Jerusalem',
                  },
                  {
                    label: '(GMT+02:00) Amman',
                    value: 'Asia/Amman',
                  },
                  {
                    label: '(GMT+02:00) Beirut',
                    value: 'Asia/Beirut',
                  },
                  {
                    label: '(GMT+02:00) Harare, Pretoria',
                    value: 'Africa/Johannesburg',
                  },
                  {
                    label: '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
                    value: 'Europe/Kiev',
                  },
                  {
                    label: '(GMT+02:00) Minsk',
                    value: 'Europe/Minsk',
                  },
                  {
                    label: '(GMT+02:00) Windhoek',
                    value: 'Africa/Windhoek',
                  },
                  {
                    label: '(GMT+03:00) Kuwait, Riyadh',
                    value: 'Asia/Riyadh',
                  },
                  {
                    label: '(GMT+03:00) Moscow, St. Petersburg, Volgograd',
                    value: 'Europe/Moscow',
                  },
                  {
                    label: '(GMT+03:00) Baghdad',
                    value: 'Asia/Baghdad',
                  },
                  {
                    label: '(GMT+03:00) Nairobi',
                    value: 'Africa/Nairobi',
                  },
                  {
                    label: '(GMT+03:30) Tehran',
                    value: 'Asia/Tehran',
                  },
                  {
                    label: '(GMT+04:00) Abu Dhabi, Muscat',
                    value: 'Asia/Muscat',
                  },
                  {
                    label: '(GMT+04:00) Baku',
                    value: 'Asia/Baku',
                  },
                  {
                    label: '(GMT+04:00) Caucasus Standard Time',
                    value: 'Asia/Yerevan',
                  },
                  {
                    label: '(GMT+04:00) Tbilisi',
                    value: 'Etc/GMT-3',
                  },
                  {
                    label: '(GMT+04:30) Kabul',
                    value: 'Asia/Kabul',
                  },
                  {
                    label: '(GMT+05:00) Islamabad, Karachi',
                    value: 'Asia/Karachi',
                  },
                  {
                    label: '(GMT+05:00) Ekaterinburg',
                    value: 'Asia/Yekaterinburg',
                  },
                  {
                    label: '(GMT+05:00) Tashkent',
                    value: 'Asia/Tashkent',
                  },
                  {
                    label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                    value: 'Asia/Calcutta',
                  },
                  {
                    label: '(GMT+05:45) Kathmandu',
                    value: 'Asia/Katmandu',
                  },
                  {
                    label: '(GMT+06:00) Novosibirsk',
                    value: 'Asia/Almaty',
                  },
                  {
                    label: '(GMT+06:00) Astana, Dhaka',
                    value: 'Asia/Dacca',
                  },
                  {
                    label: '(GMT+06:30) Yangon (Rangoon)',
                    value: 'Asia/Rangoon',
                  },
                  {
                    label: '(GMT+07:00) Bangkok, Hanoi, Jakarta',
                    value: 'Asia/Bangkok',
                  },
                  {
                    label: '(GMT+07:00) Krasnoyarsk',
                    value: 'Asia/Krasnoyarsk',
                  },
                  {
                    label: '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
                    value: 'Asia/Hong_Kong',
                  },
                  {
                    label: '(GMT+08:00) Kuala Lumpur, Singapore',
                    value: 'Asia/Kuala_Lumpur',
                  },
                  {
                    label: '(GMT+08:00) Taipei',
                    value: 'Asia/Taipei',
                  },
                  {
                    label: '(GMT+08:00) Perth',
                    value: 'Australia/Perth',
                  },
                  {
                    label: '(GMT+08:00) Irkutsk',
                    value: 'Asia/Irkutsk',
                  },
                  {
                    label: '(GMT+08:00) Manila',
                    value: 'Asia/Manila',
                  },
                  {
                    label: '(GMT+09:00) Seoul',
                    value: 'Asia/Seoul',
                  },
                  {
                    label: '(GMT+09:00) Osaka, Sapporo, Tokyo',
                    value: 'Asia/Tokyo',
                  },
                  {
                    label: '(GMT+09:00) Yakutsk',
                    value: 'Asia/Yakutsk',
                  },
                  {
                    label: '(GMT+09:30) Darwin',
                    value: 'Australia/Darwin',
                  },
                  {
                    label: '(GMT+09:30) Adelaide',
                    value: 'Australia/Adelaide',
                  },
                  {
                    label: '(GMT+10:00) Canberra, Melbourne, Sydney',
                    value: 'Australia/Sydney',
                  },
                  {
                    label: '(GMT+10:00) Brisbane',
                    value: 'Australia/Brisbane',
                  },
                  {
                    label: '(GMT+10:00) Hobart',
                    value: 'Australia/Hobart',
                  },
                  {
                    label: '(GMT+10:00) Guam, Port Moresby',
                    value: 'Pacific/Guam',
                  },
                  {
                    label: '(GMT+10:00) Vladivostok',
                    value: 'Asia/Vladivostok',
                  },
                  {
                    label: '(GMT+11:00) Magadan, Solomon Is., New Caledonia',
                    value: 'Asia/Magadan',
                  },
                  {
                    label: '(GMT+12:00) Fiji, Marshall Is.',
                    value: 'Pacific/Kwajalein',
                  },
                  {
                    label: '(GMT+12:00) Auckland, Wellington',
                    value: 'Pacific/Auckland',
                  },
                  {
                    label: "(GMT+13:00) Nuku'alofa",
                    value: 'Pacific/Tongatapu',
                  },
                ],
              },
            ],
            visible: true,
          },
          activeTab: {
            id: 'activeTab',
            name: 'activeTab',
            type: 'radiogroup',
            helpKey: 'flow.type',
            label: 'Type',
            fullWidth: true,
            defaultValue: 'preset',
            options: [
              {
                items: [
                  {
                    label: 'Use preset',
                    value: 'preset',
                  },
                  {
                    label: 'Use cron expression',
                    value: 'advanced',
                  },
                ],
              },
            ],
          },
          frequency: {
            id: 'frequency',
            name: 'frequency',
            type: 'select',
            label: 'Frequency',
            helpKey: 'flow.frequency',
            skipSort: true,
            defaultValue: 'every_eight_hours',
            options: [
              {
                items: [
                  {
                    label: 'Once weekly',
                    value: 'once_weekly',
                  },
                  {
                    label: 'Once daily',
                    value: 'once_daily',
                  },
                  {
                    label: 'Twice daily',
                    value: 'twice_daily',
                  },
                  {
                    label: 'Every eight hours',
                    value: 'every_eight_hours',
                  },
                  {
                    label: 'Every six hours',
                    value: 'every_six_hours',
                  },
                  {
                    label: 'Every four hours',
                    value: 'every_four_hours',
                  },
                  {
                    label: 'Every two hours',
                    value: 'every_two_hours',
                  },
                  {
                    label: 'Every hour',
                    value: 'every_hour',
                  },
                  {
                    label: 'Every 30 minutes',
                    value: 'every_half_hour',
                  },
                  {
                    label: 'Every 15 minutes',
                    value: 'every_quarter',
                  },
                ],
              },
            ],
            visibleWhenAll: [
              {
                field: 'activeTab',
                is: [
                  'preset',
                ],
              },
            ],
          },
          startTime: {
            id: 'startTime',
            name: 'startTime',
            type: 'select',
            label: 'Start time',
            helpKey: 'flow.startTime',
            skipSort: true,
            missingValueMessage: 'Please select both a start time and an end time for your flow.',
            defaultValue: '12:00 AM',
            options: [
              {
                items: [
                  {
                    label: '12:00 AM',
                    value: '12:00 AM',
                  },
                  {
                    label: '1:00 AM',
                    value: '1:00 AM',
                  },
                  {
                    label: '2:00 AM',
                    value: '2:00 AM',
                  },
                  {
                    label: '3:00 AM',
                    value: '3:00 AM',
                  },
                  {
                    label: '4:00 AM',
                    value: '4:00 AM',
                  },
                  {
                    label: '5:00 AM',
                    value: '5:00 AM',
                  },
                  {
                    label: '6:00 AM',
                    value: '6:00 AM',
                  },
                  {
                    label: '7:00 AM',
                    value: '7:00 AM',
                  },
                  {
                    label: '8:00 AM',
                    value: '8:00 AM',
                  },
                  {
                    label: '9:00 AM',
                    value: '9:00 AM',
                  },
                  {
                    label: '10:00 AM',
                    value: '10:00 AM',
                  },
                  {
                    label: '11:00 AM',
                    value: '11:00 AM',
                  },
                  {
                    label: '12:00 PM',
                    value: '12:00 PM',
                  },
                  {
                    label: '1:00 PM',
                    value: '1:00 PM',
                  },
                  {
                    label: '2:00 PM',
                    value: '2:00 PM',
                  },
                  {
                    label: '3:00 PM',
                    value: '3:00 PM',
                  },
                  {
                    label: '4:00 PM',
                    value: '4:00 PM',
                  },
                  {
                    label: '5:00 PM',
                    value: '5:00 PM',
                  },
                  {
                    label: '6:00 PM',
                    value: '6:00 PM',
                  },
                  {
                    label: '7:00 PM',
                    value: '7:00 PM',
                  },
                  {
                    label: '8:00 PM',
                    value: '8:00 PM',
                  },
                  {
                    label: '9:00 PM',
                    value: '9:00 PM',
                  },
                  {
                    label: '10:00 PM',
                    value: '10:00 PM',
                  },
                  {
                    label: '11:00 PM',
                    value: '11:00 PM',
                  },
                ],
              },
            ],
            requiredWhen: [
              {
                field: 'frequency',
                is: [
                  'twice_daily',
                ],
              },
            ],
            visibleWhenAll: [
              {
                field: 'activeTab',
                is: [
                  'preset',
                ],
              },
              {
                field: 'frequency',
                isNot: [
                  '',
                ],
              },
            ],
          },
          endTime: {
            id: 'endTime',
            name: 'endTime',
            type: 'select',
            label: 'End time',
            helpKey: 'flow.endTime',
            skipSort: true,
            missingValueMessage: 'Please select both a start time and an end time for your flow.',
            defaultValue: '4:00 PM',
            omitWhenHidden: true,
            options: [
              {
                items: [
                  {
                    label: '12:00 AM',
                    value: '12:00 AM',
                  },
                  {
                    label: '1:00 AM',
                    value: '1:00 AM',
                  },
                  {
                    label: '2:00 AM',
                    value: '2:00 AM',
                  },
                  {
                    label: '3:00 AM',
                    value: '3:00 AM',
                  },
                  {
                    label: '4:00 AM',
                    value: '4:00 AM',
                  },
                  {
                    label: '5:00 AM',
                    value: '5:00 AM',
                  },
                  {
                    label: '6:00 AM',
                    value: '6:00 AM',
                  },
                  {
                    label: '7:00 AM',
                    value: '7:00 AM',
                  },
                  {
                    label: '8:00 AM',
                    value: '8:00 AM',
                  },
                  {
                    label: '9:00 AM',
                    value: '9:00 AM',
                  },
                  {
                    label: '10:00 AM',
                    value: '10:00 AM',
                  },
                  {
                    label: '11:00 AM',
                    value: '11:00 AM',
                  },
                  {
                    label: '12:00 PM',
                    value: '12:00 PM',
                  },
                  {
                    label: '1:00 PM',
                    value: '1:00 PM',
                  },
                  {
                    label: '2:00 PM',
                    value: '2:00 PM',
                  },
                  {
                    label: '3:00 PM',
                    value: '3:00 PM',
                  },
                  {
                    label: '4:00 PM',
                    value: '4:00 PM',
                  },
                  {
                    label: '5:00 PM',
                    value: '5:00 PM',
                  },
                  {
                    label: '6:00 PM',
                    value: '6:00 PM',
                  },
                  {
                    label: '7:00 PM',
                    value: '7:00 PM',
                  },
                  {
                    label: '8:00 PM',
                    value: '8:00 PM',
                  },
                  {
                    label: '9:00 PM',
                    value: '9:00 PM',
                  },
                  {
                    label: '10:00 PM',
                    value: '10:00 PM',
                  },
                  {
                    label: '11:00 PM',
                    value: '11:00 PM',
                  },
                ],
              },
            ],
            refreshOptionsOnChangesTo: [
              'frequency',
            ],
            requiredWhen: [
              {
                field: 'frequency',
                is: [
                  'twice_daily',
                ],
              },
            ],
            visibleWhenAll: [
              {
                field: 'activeTab',
                is: [
                  'preset',
                ],
              },
              {
                field: 'frequency',
                isNot: [
                  'once_weekly',
                  'once_daily',
                  '',
                ],
              },
            ],
          },
          daysToRunOn: {
            id: 'daysToRunOn',
            name: 'daysToRunOn',
            type: 'multiselect',
            helpKey: 'flow.daysToRunOn',
            label: 'Run on these days',
            skipSort: true,
            defaultValue: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '0',
            ],
            options: [
              {
                items: [
                  {
                    value: '1',
                    label: 'Monday',
                  },
                  {
                    value: '2',
                    label: 'Tuesday',
                  },
                  {
                    value: '3',
                    label: 'Wednesday',
                  },
                  {
                    value: '4',
                    label: 'Thursday',
                  },
                  {
                    value: '5',
                    label: 'Friday',
                  },
                  {
                    value: '6',
                    label: 'Saturday',
                  },
                  {
                    value: '0',
                    label: 'Sunday',
                  },
                ],
              },
            ],
            visibleWhenAll: [
              {
                field: 'activeTab',
                is: [
                  'preset',
                ],
              },
              {
                field: 'frequency',
                isNot: [
                  'once_weekly',
                  '',
                ],
              },
            ],
          },
          dayToRunOn: {
            id: 'dayToRunOn',
            name: 'dayToRunOn',
            helpKey: 'flow.daysToRunOn',
            type: 'select',
            label: 'Run on this day',
            skipSort: true,
            options: [
              {
                items: [
                  {
                    value: '1',
                    label: 'Monday',
                  },
                  {
                    value: '2',
                    label: 'Tuesday',
                  },
                  {
                    value: '3',
                    label: 'Wednesday',
                  },
                  {
                    value: '4',
                    label: 'Thursday',
                  },
                  {
                    value: '5',
                    label: 'Friday',
                  },
                  {
                    value: '6',
                    label: 'Saturday',
                  },
                  {
                    value: '0',
                    label: 'Sunday',
                  },
                ],
              },
            ],
            visibleWhenAll: [
              {
                field: 'activeTab',
                is: [
                  'preset',
                ],
              },
              {
                field: 'frequency',
                is: [
                  'once_weekly',
                ],
              },
            ],
          },
          schedule: {
            id: 'schedule',
            name: 'schedule',
            helpKey: 'flow.schedule',
            type: 'crongenerator',
            scheduleStartMinuteOffset: 0,
            label: 'Schedule',
            defaultValue: '? 5 0,8,16 ? * *',
            validWhen: {
              matchesRegEx: {
                pattern: '^(?!\\? \\* )',
                message: 'Please select minutes',
              },
            },
            required: true,
            visibleWhenAll: [
              {
                field: 'activeTab',
                is: [
                  'advanced',
                ],
              },
            ],
          },
        },
        layout: {
          fields: [
            'timeZone',
            'activeTab',
            'frequency',
            'startTime',
            'endTime',
            'daysToRunOn',
            'dayToRunOn',
            'schedule',
          ],
        },
      },
      remountKey: 3,
      formIsDisabled: false,
      resetTouchedState: false,
      fields: {
        timeZone: {
          id: 'timeZone',
          name: 'timeZone',
          type: 'select',
          label: 'Time zone',
          helpKey: 'flow.timezone',
          defaultValue: 'Asia/Calcutta',
          options: [
            {
              items: [
                {
                  label: '(GMT-12:00) International Date Line West',
                  value: 'Etc/GMT+12',
                },
                {
                  label: '(GMT-11:00) Midway Island, Samoa',
                  value: 'Pacific/Samoa',
                },
                {
                  label: '(GMT-10:00) Hawaii',
                  value: 'Pacific/Honolulu',
                },
                {
                  label: '(GMT-09:00) Alaska',
                  value: 'America/Anchorage',
                },
                {
                  label: '(GMT-08:00) Pacific Time (US & Canada)',
                  value: 'America/Los_Angeles',
                },
                {
                  label: '(GMT-08:00) Tijuana, Baja California',
                  value: 'America/Tijuana',
                },
                {
                  label: '(GMT-07:00) Mountain Time (US & Canada)',
                  value: 'America/Denver',
                },
                {
                  label: '(GMT-07:00) Arizona',
                  value: 'America/Phoenix',
                },
                {
                  label: '(GMT-07:00) Chihuahua, La Paz, Mazatlan - New',
                  value: 'America/Chihuahua',
                },
                {
                  label: '(GMT-06:00) Central Time (US & Canada)',
                  value: 'America/Chicago',
                },
                {
                  label: '(GMT-06:00) Saskatchewan',
                  value: 'America/Regina',
                },
                {
                  label: '(GMT-06:00) Central America',
                  value: 'America/Guatemala',
                },
                {
                  label: '(GMT-06:00) Guadalajara, Mexico City, Monterrey - Old',
                  value: 'America/Mexico_City',
                },
                {
                  label: '(GMT-05:00) Eastern Time (US & Canada)',
                  value: 'America/New_York',
                },
                {
                  label: '(GMT-05:00) Indiana (East)',
                  value: 'US/East-Indiana',
                },
                {
                  label: '(GMT-05:00) Bogota, Lima, Quito',
                  value: 'America/Bogota',
                },
                {
                  label: '(GMT-04:30) Caracas',
                  value: 'America/Caracas',
                },
                {
                  label: '(GMT-04:00) Atlantic Time (Canada)',
                  value: 'America/Halifax',
                },
                {
                  label: '(GMT-04:00) Georgetown, La Paz, San Juan',
                  value: 'America/La_Paz',
                },
                {
                  label: '(GMT-04:00) Manaus',
                  value: 'America/Manaus',
                },
                {
                  label: '(GMT-04:00) Santiago',
                  value: 'America/Santiago',
                },
                {
                  label: '(GMT-03:30) Newfoundland',
                  value: 'America/St_Johns',
                },
                {
                  label: '(GMT-03:00) Brasilia',
                  value: 'America/Sao_Paulo',
                },
                {
                  label: '(GMT-03:00) Buenos Aires',
                  value: 'America/Buenos_Aires',
                },
                {
                  label: '(GMT-03:00) Cayenne',
                  value: 'Etc/GMT+3',
                },
                {
                  label: '(GMT-03:00) Greenland',
                  value: 'America/Godthab',
                },
                {
                  label: '(GMT-03:00) Montevideo',
                  value: 'America/Montevideo',
                },
                {
                  label: '(GMT-02:00) Mid-Atlantic',
                  value: 'America/Noronha',
                },
                {
                  label: '(GMT-01:00) Cape Verde Is.',
                  value: 'Etc/GMT+1',
                },
                {
                  label: '(GMT-01:00) Azores',
                  value: 'Atlantic/Azores',
                },
                {
                  label: '(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
                  value: 'Europe/London',
                },
                {
                  label: '(GMT) Casablanca',
                  value: 'GMT',
                },
                {
                  label: '(GMT) Monrovia, Reykjavik',
                  value: 'Atlantic/Reykjavik',
                },
                {
                  label: '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
                  value: 'Europe/Warsaw',
                },
                {
                  label: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
                  value: 'Europe/Paris',
                },
                {
                  label: '(GMT+01:00) West Central Africa',
                  value: 'Etc/GMT-1',
                },
                {
                  label: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
                  value: 'Europe/Amsterdam',
                },
                {
                  label: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
                  value: 'Europe/Budapest',
                },
                {
                  label: '(GMT+02:00) Cairo',
                  value: 'Africa/Cairo',
                },
                {
                  label: '(GMT+02:00) Athens, Bucharest, Istanbul',
                  value: 'Europe/Istanbul',
                },
                {
                  label: '(GMT+02:00) Jerusalem',
                  value: 'Asia/Jerusalem',
                },
                {
                  label: '(GMT+02:00) Amman',
                  value: 'Asia/Amman',
                },
                {
                  label: '(GMT+02:00) Beirut',
                  value: 'Asia/Beirut',
                },
                {
                  label: '(GMT+02:00) Harare, Pretoria',
                  value: 'Africa/Johannesburg',
                },
                {
                  label: '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
                  value: 'Europe/Kiev',
                },
                {
                  label: '(GMT+02:00) Minsk',
                  value: 'Europe/Minsk',
                },
                {
                  label: '(GMT+02:00) Windhoek',
                  value: 'Africa/Windhoek',
                },
                {
                  label: '(GMT+03:00) Kuwait, Riyadh',
                  value: 'Asia/Riyadh',
                },
                {
                  label: '(GMT+03:00) Moscow, St. Petersburg, Volgograd',
                  value: 'Europe/Moscow',
                },
                {
                  label: '(GMT+03:00) Baghdad',
                  value: 'Asia/Baghdad',
                },
                {
                  label: '(GMT+03:00) Nairobi',
                  value: 'Africa/Nairobi',
                },
                {
                  label: '(GMT+03:30) Tehran',
                  value: 'Asia/Tehran',
                },
                {
                  label: '(GMT+04:00) Abu Dhabi, Muscat',
                  value: 'Asia/Muscat',
                },
                {
                  label: '(GMT+04:00) Baku',
                  value: 'Asia/Baku',
                },
                {
                  label: '(GMT+04:00) Caucasus Standard Time',
                  value: 'Asia/Yerevan',
                },
                {
                  label: '(GMT+04:00) Tbilisi',
                  value: 'Etc/GMT-3',
                },
                {
                  label: '(GMT+04:30) Kabul',
                  value: 'Asia/Kabul',
                },
                {
                  label: '(GMT+05:00) Islamabad, Karachi',
                  value: 'Asia/Karachi',
                },
                {
                  label: '(GMT+05:00) Ekaterinburg',
                  value: 'Asia/Yekaterinburg',
                },
                {
                  label: '(GMT+05:00) Tashkent',
                  value: 'Asia/Tashkent',
                },
                {
                  label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                  value: 'Asia/Calcutta',
                },
                {
                  label: '(GMT+05:45) Kathmandu',
                  value: 'Asia/Katmandu',
                },
                {
                  label: '(GMT+06:00) Novosibirsk',
                  value: 'Asia/Almaty',
                },
                {
                  label: '(GMT+06:00) Astana, Dhaka',
                  value: 'Asia/Dacca',
                },
                {
                  label: '(GMT+06:30) Yangon (Rangoon)',
                  value: 'Asia/Rangoon',
                },
                {
                  label: '(GMT+07:00) Bangkok, Hanoi, Jakarta',
                  value: 'Asia/Bangkok',
                },
                {
                  label: '(GMT+07:00) Krasnoyarsk',
                  value: 'Asia/Krasnoyarsk',
                },
                {
                  label: '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
                  value: 'Asia/Hong_Kong',
                },
                {
                  label: '(GMT+08:00) Kuala Lumpur, Singapore',
                  value: 'Asia/Kuala_Lumpur',
                },
                {
                  label: '(GMT+08:00) Taipei',
                  value: 'Asia/Taipei',
                },
                {
                  label: '(GMT+08:00) Perth',
                  value: 'Australia/Perth',
                },
                {
                  label: '(GMT+08:00) Irkutsk',
                  value: 'Asia/Irkutsk',
                },
                {
                  label: '(GMT+08:00) Manila',
                  value: 'Asia/Manila',
                },
                {
                  label: '(GMT+09:00) Seoul',
                  value: 'Asia/Seoul',
                },
                {
                  label: '(GMT+09:00) Osaka, Sapporo, Tokyo',
                  value: 'Asia/Tokyo',
                },
                {
                  label: '(GMT+09:00) Yakutsk',
                  value: 'Asia/Yakutsk',
                },
                {
                  label: '(GMT+09:30) Darwin',
                  value: 'Australia/Darwin',
                },
                {
                  label: '(GMT+09:30) Adelaide',
                  value: 'Australia/Adelaide',
                },
                {
                  label: '(GMT+10:00) Canberra, Melbourne, Sydney',
                  value: 'Australia/Sydney',
                },
                {
                  label: '(GMT+10:00) Brisbane',
                  value: 'Australia/Brisbane',
                },
                {
                  label: '(GMT+10:00) Hobart',
                  value: 'Australia/Hobart',
                },
                {
                  label: '(GMT+10:00) Guam, Port Moresby',
                  value: 'Pacific/Guam',
                },
                {
                  label: '(GMT+10:00) Vladivostok',
                  value: 'Asia/Vladivostok',
                },
                {
                  label: '(GMT+11:00) Magadan, Solomon Is., New Caledonia',
                  value: 'Asia/Magadan',
                },
                {
                  label: '(GMT+12:00) Fiji, Marshall Is.',
                  value: 'Pacific/Kwajalein',
                },
                {
                  label: '(GMT+12:00) Auckland, Wellington',
                  value: 'Pacific/Auckland',
                },
                {
                  label: "(GMT+13:00) Nuku'alofa",
                  value: 'Pacific/Tongatapu',
                },
              ],
            },
          ],
          visible: true,
          defaultVisible: true,
          value: 'Asia/Calcutta',
          touched: false,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        activeTab: {
          id: 'activeTab',
          name: 'activeTab',
          type: 'radiogroup',
          helpKey: 'flow.type',
          label: 'Type',
          fullWidth: true,
          defaultValue: 'preset',
          options: [
            {
              items: [
                {
                  label: 'Use preset',
                  value: 'preset',
                },
                {
                  label: 'Use cron expression',
                  value: 'advanced',
                },
              ],
            },
          ],
          value: 'preset',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        frequency: {
          id: 'frequency',
          name: 'frequency',
          type: 'select',
          label: 'Frequency',
          helpKey: 'flow.frequency',
          skipSort: true,
          defaultValue: 'every_eight_hours',
          options: [
            {
              items: [
                {
                  label: 'Once weekly',
                  value: 'once_weekly',
                },
                {
                  label: 'Once daily',
                  value: 'once_daily',
                },
                {
                  label: 'Twice daily',
                  value: 'twice_daily',
                },
                {
                  label: 'Every eight hours',
                  value: 'every_eight_hours',
                },
                {
                  label: 'Every six hours',
                  value: 'every_six_hours',
                },
                {
                  label: 'Every four hours',
                  value: 'every_four_hours',
                },
                {
                  label: 'Every two hours',
                  value: 'every_two_hours',
                },
                {
                  label: 'Every hour',
                  value: 'every_hour',
                },
                {
                  label: 'Every 30 minutes',
                  value: 'every_half_hour',
                },
                {
                  label: 'Every 15 minutes',
                  value: 'every_quarter',
                },
              ],
            },
          ],
          visibleWhenAll: [
            {
              field: 'activeTab',
              is: [
                'preset',
              ],
            },
          ],
          value: 'every_eight_hours',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        startTime: {
          id: 'startTime',
          name: 'startTime',
          type: 'select',
          label: 'Start time',
          helpKey: 'flow.startTime',
          skipSort: true,
          missingValueMessage: 'Please select both a start time and an end time for your flow.',
          defaultValue: '12:00 AM',
          options: [
            {
              items: [
                {
                  label: '12:00 AM',
                  value: '12:00 AM',
                },
                {
                  label: '1:00 AM',
                  value: '1:00 AM',
                },
                {
                  label: '2:00 AM',
                  value: '2:00 AM',
                },
                {
                  label: '3:00 AM',
                  value: '3:00 AM',
                },
                {
                  label: '4:00 AM',
                  value: '4:00 AM',
                },
                {
                  label: '5:00 AM',
                  value: '5:00 AM',
                },
                {
                  label: '6:00 AM',
                  value: '6:00 AM',
                },
                {
                  label: '7:00 AM',
                  value: '7:00 AM',
                },
                {
                  label: '8:00 AM',
                  value: '8:00 AM',
                },
                {
                  label: '9:00 AM',
                  value: '9:00 AM',
                },
                {
                  label: '10:00 AM',
                  value: '10:00 AM',
                },
                {
                  label: '11:00 AM',
                  value: '11:00 AM',
                },
                {
                  label: '12:00 PM',
                  value: '12:00 PM',
                },
                {
                  label: '1:00 PM',
                  value: '1:00 PM',
                },
                {
                  label: '2:00 PM',
                  value: '2:00 PM',
                },
                {
                  label: '3:00 PM',
                  value: '3:00 PM',
                },
                {
                  label: '4:00 PM',
                  value: '4:00 PM',
                },
                {
                  label: '5:00 PM',
                  value: '5:00 PM',
                },
                {
                  label: '6:00 PM',
                  value: '6:00 PM',
                },
                {
                  label: '7:00 PM',
                  value: '7:00 PM',
                },
                {
                  label: '8:00 PM',
                  value: '8:00 PM',
                },
                {
                  label: '9:00 PM',
                  value: '9:00 PM',
                },
                {
                  label: '10:00 PM',
                  value: '10:00 PM',
                },
                {
                  label: '11:00 PM',
                  value: '11:00 PM',
                },
              ],
            },
          ],
          requiredWhen: [
            {
              field: 'frequency',
              is: [
                'twice_daily',
              ],
            },
          ],
          visibleWhenAll: [
            {
              field: 'activeTab',
              is: [
                'preset',
              ],
            },
            {
              field: 'frequency',
              isNot: [
                '',
              ],
            },
          ],
          value: '12:00 AM',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        endTime: {
          id: 'endTime',
          name: 'endTime',
          type: 'select',
          label: 'End time',
          helpKey: 'flow.endTime',
          skipSort: true,
          missingValueMessage: 'Please select both a start time and an end time for your flow.',
          defaultValue: '4:00 PM',
          omitWhenHidden: true,
          options: [
            {
              items: [
                {
                  label: '12:00 AM',
                  value: '12:00 AM',
                },
                {
                  label: '1:00 AM',
                  value: '1:00 AM',
                },
                {
                  label: '2:00 AM',
                  value: '2:00 AM',
                },
                {
                  label: '3:00 AM',
                  value: '3:00 AM',
                },
                {
                  label: '4:00 AM',
                  value: '4:00 AM',
                },
                {
                  label: '5:00 AM',
                  value: '5:00 AM',
                },
                {
                  label: '6:00 AM',
                  value: '6:00 AM',
                },
                {
                  label: '7:00 AM',
                  value: '7:00 AM',
                },
                {
                  label: '8:00 AM',
                  value: '8:00 AM',
                },
                {
                  label: '9:00 AM',
                  value: '9:00 AM',
                },
                {
                  label: '10:00 AM',
                  value: '10:00 AM',
                },
                {
                  label: '11:00 AM',
                  value: '11:00 AM',
                },
                {
                  label: '12:00 PM',
                  value: '12:00 PM',
                },
                {
                  label: '1:00 PM',
                  value: '1:00 PM',
                },
                {
                  label: '2:00 PM',
                  value: '2:00 PM',
                },
                {
                  label: '3:00 PM',
                  value: '3:00 PM',
                },
                {
                  label: '4:00 PM',
                  value: '4:00 PM',
                },
                {
                  label: '5:00 PM',
                  value: '5:00 PM',
                },
                {
                  label: '6:00 PM',
                  value: '6:00 PM',
                },
                {
                  label: '7:00 PM',
                  value: '7:00 PM',
                },
                {
                  label: '8:00 PM',
                  value: '8:00 PM',
                },
                {
                  label: '9:00 PM',
                  value: '9:00 PM',
                },
                {
                  label: '10:00 PM',
                  value: '10:00 PM',
                },
                {
                  label: '11:00 PM',
                  value: '11:00 PM',
                },
              ],
            },
          ],
          refreshOptionsOnChangesTo: [
            'frequency',
          ],
          requiredWhen: [
            {
              field: 'frequency',
              is: [
                'twice_daily',
              ],
            },
          ],
          visibleWhenAll: [
            {
              field: 'activeTab',
              is: [
                'preset',
              ],
            },
            {
              field: 'frequency',
              isNot: [
                'once_weekly',
                'once_daily',
                '',
              ],
            },
          ],
          value: '4:00 PM',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        daysToRunOn: {
          id: 'daysToRunOn',
          name: 'daysToRunOn',
          type: 'multiselect',
          helpKey: 'flow.daysToRunOn',
          label: 'Run on these days',
          skipSort: true,
          defaultValue: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '0',
          ],
          options: [
            {
              items: [
                {
                  value: '1',
                  label: 'Monday',
                },
                {
                  value: '2',
                  label: 'Tuesday',
                },
                {
                  value: '3',
                  label: 'Wednesday',
                },
                {
                  value: '4',
                  label: 'Thursday',
                },
                {
                  value: '5',
                  label: 'Friday',
                },
                {
                  value: '6',
                  label: 'Saturday',
                },
                {
                  value: '0',
                  label: 'Sunday',
                },
              ],
            },
          ],
          visibleWhenAll: [
            {
              field: 'activeTab',
              is: [
                'preset',
              ],
            },
            {
              field: 'frequency',
              isNot: [
                'once_weekly',
                '',
              ],
            },
          ],
          value: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '0',
          ],
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        dayToRunOn: {
          id: 'dayToRunOn',
          name: 'dayToRunOn',
          helpKey: 'flow.daysToRunOn',
          type: 'select',
          label: 'Run on this day',
          skipSort: true,
          options: [
            {
              items: [
                {
                  value: '1',
                  label: 'Monday',
                },
                {
                  value: '2',
                  label: 'Tuesday',
                },
                {
                  value: '3',
                  label: 'Wednesday',
                },
                {
                  value: '4',
                  label: 'Thursday',
                },
                {
                  value: '5',
                  label: 'Friday',
                },
                {
                  value: '6',
                  label: 'Saturday',
                },
                {
                  value: '0',
                  label: 'Sunday',
                },
              ],
            },
          ],
          visibleWhenAll: [
            {
              field: 'activeTab',
              is: [
                'preset',
              ],
            },
            {
              field: 'frequency',
              is: [
                'once_weekly',
              ],
            },
          ],
          touched: false,
          visible: false,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        schedule: {
          id: 'schedule',
          name: 'schedule',
          helpKey: 'flow.schedule',
          type: 'crongenerator',
          scheduleStartMinuteOffset: 0,
          label: 'Schedule',
          defaultValue: '? 5 0,8,16 ? * *',
          validWhen: {
            matchesRegEx: {
              pattern: '^(?!\\? \\* )',
              message: 'Please select minutes',
            },
          },
          required: true,
          visibleWhenAll: [
            {
              field: 'activeTab',
              is: [
                'advanced',
              ],
            },
          ],
          defaultRequired: true,
          value: '? 5 0,8,16 ? * *',
          touched: false,
          visible: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
      },
      value: {
        timeZone: 'Asia/Calcutta',
        activeTab: 'preset',
        frequency: 'every_eight_hours',
        startTime: '12:00 AM',
        endTime: '4:00 PM',
        daysToRunOn: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '0',
        ],
        schedule: '? 5 0,8,16 ? * *',
      },
      isValid: true,
    },
  },
  recycleBin: {},
  stage: {
    '626bdab2987bb423914b487d': {
      patch: [],
    },
  },
  filters: {
    latestJobs: {
      sort: {
        order: 'desc',
        orderBy: 'lastModified',
      },
      selected: {},
      isAllSelected: false,
    },
  },
  editors: {},
  metadata: {
    application: {},
    preview: {},
    assistants: {
      rest: {},
      http: {},
    },
  },
  connectors: {},
  connections: {},
  connectionToken: {},
  resourceForm: {},
  agentAccessTokens: [],
  stackSystemTokens: [],
  apiAccessTokens: [],
  resource: {},
  netsuiteUserRole: {},
  importSampleData: {},
  flowData: {},
  flowMetrics: {},
  integrationApps: {
    installer: {},
    uninstaller: {},
    uninstaller2: {},
    settings: {},
    addChild: {},
    addon: {},
    clone: {},
    utility: {},
  },
  integrations: {},
  templates: {},
  oAuthAuthorize: {},
  mapping: {},
  searchCriteriaReducer: {},
  flows: {},
  transfers: {},
  responseMapping: {},
  fileUpload: {},
  suiteScript: {
    mapping: {},
    resourceForm: {},
    iaForm: {},
    flows: {},
    featureCheck: {},
    account: {},
    installer: {},
    importSampleData: {},
    flowSampleData: {},
  },
  jobErrorsPreview: {},
  errorManagement: {
    openErrors: {
      '626bdab2987bb423914b487d': {
        status: 'received',
        data: {},
      },
    },
    errorDetails: {},
    latestIntegrationJobDetails: {
      '626bda66987bb423914b486f': {
        status: 'received',
        data: [],
      },
    },
    latestFlowJobs: {
      '626bdab2987bb423914b487d': {
        status: 'received',
        data: [],
      },
    },
    runHistory: {},
    retryData: {
      retryStatus: {},
      retryObjects: {},
    },
    metadata: {},
    errorHttpDoc: {},
  },
  customSettings: {},
  exportData: {},
  logs: {
    connections: {},
    scripts: {},
    flowStep: {},
  },
  sso: {},
  bottomDrawer: {
    bottomDrawer: {
      tabs: [
        {
          label: 'Run console',
          tabType: 'dashboard',
        },
        {
          label: 'Run history',
          tabType: 'runHistory',
        },
        {
          label: 'Connections',
          tabType: 'connections',
        },
        {
          label: 'Audit Log',
          tabType: 'auditLogs',
        },
      ],
      activeTabIndex: 0,
    },
  },
  resourceFormSampleData: {
    '626bdab2987bb423914b4879': {
      preview: {},
    },
    '626bdab2987bb423914b487b': {
      preview: {},
    },
    '626bdab2987bb423914b487d': {
      preview: {},
    },
  },
  lifeCycleManagement: {
    cloneFamily: {},
    revision: {},
    compare: {},
    installStep: {},
  },
  loadResources: {
    integrations: 'received',
    transfers: 'received',
    ssoclients: 'received',
    ashares: 'received',
    'shared/ashares': 'received',
    'ui/assistants': 'received',
    '626bda66987bb423914b486f': {
      imports: 'received',
      exports: 'received',
      flows: 'received',
      connections: 'received',
    },
    licenses: 'received',
    'shared/sshares': 'received',
    scripts: 'received',
  },
  aliases: {},
};

export const form = {
  parentContext: {
    integrationId: '626bda66987bb423914b486f',
    resourceType: 'flows',
    resourceId: '626bdab2987bb423914b487d',
  },
  disabled: false,
  showValidationBeforeTouched: false,
  conditionalUpdate: false,
  fieldMeta: {
    fieldMap: {
      timeZone: {
        id: 'timeZone',
        name: 'timeZone',
        type: 'select',
        label: 'Time zone',
        helpKey: 'flow.timezone',
        defaultValue: 'Asia/Calcutta',
        options: [
          {
            items: [
              {
                label: '(GMT-12:00) International Date Line West',
                value: 'Etc/GMT+12',
              },
              {
                label: '(GMT-11:00) Midway Island, Samoa',
                value: 'Pacific/Samoa',
              },
              {
                label: '(GMT-10:00) Hawaii',
                value: 'Pacific/Honolulu',
              },
              {
                label: '(GMT-09:00) Alaska',
                value: 'America/Anchorage',
              },
              {
                label: '(GMT-08:00) Pacific Time (US & Canada)',
                value: 'America/Los_Angeles',
              },
              {
                label: '(GMT-08:00) Tijuana, Baja California',
                value: 'America/Tijuana',
              },
              {
                label: '(GMT-07:00) Mountain Time (US & Canada)',
                value: 'America/Denver',
              },
              {
                label: '(GMT-07:00) Arizona',
                value: 'America/Phoenix',
              },
              {
                label: '(GMT-07:00) Chihuahua, La Paz, Mazatlan - New',
                value: 'America/Chihuahua',
              },
              {
                label: '(GMT-06:00) Central Time (US & Canada)',
                value: 'America/Chicago',
              },
              {
                label: '(GMT-06:00) Saskatchewan',
                value: 'America/Regina',
              },
              {
                label: '(GMT-06:00) Central America',
                value: 'America/Guatemala',
              },
              {
                label: '(GMT-06:00) Guadalajara, Mexico City, Monterrey - Old',
                value: 'America/Mexico_City',
              },
              {
                label: '(GMT-05:00) Eastern Time (US & Canada)',
                value: 'America/New_York',
              },
              {
                label: '(GMT-05:00) Indiana (East)',
                value: 'US/East-Indiana',
              },
              {
                label: '(GMT-05:00) Bogota, Lima, Quito',
                value: 'America/Bogota',
              },
              {
                label: '(GMT-04:30) Caracas',
                value: 'America/Caracas',
              },
              {
                label: '(GMT-04:00) Atlantic Time (Canada)',
                value: 'America/Halifax',
              },
              {
                label: '(GMT-04:00) Georgetown, La Paz, San Juan',
                value: 'America/La_Paz',
              },
              {
                label: '(GMT-04:00) Manaus',
                value: 'America/Manaus',
              },
              {
                label: '(GMT-04:00) Santiago',
                value: 'America/Santiago',
              },
              {
                label: '(GMT-03:30) Newfoundland',
                value: 'America/St_Johns',
              },
              {
                label: '(GMT-03:00) Brasilia',
                value: 'America/Sao_Paulo',
              },
              {
                label: '(GMT-03:00) Buenos Aires',
                value: 'America/Buenos_Aires',
              },
              {
                label: '(GMT-03:00) Cayenne',
                value: 'Etc/GMT+3',
              },
              {
                label: '(GMT-03:00) Greenland',
                value: 'America/Godthab',
              },
              {
                label: '(GMT-03:00) Montevideo',
                value: 'America/Montevideo',
              },
              {
                label: '(GMT-02:00) Mid-Atlantic',
                value: 'America/Noronha',
              },
              {
                label: '(GMT-01:00) Cape Verde Is.',
                value: 'Etc/GMT+1',
              },
              {
                label: '(GMT-01:00) Azores',
                value: 'Atlantic/Azores',
              },
              {
                label: '(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
                value: 'Europe/London',
              },
              {
                label: '(GMT) Casablanca',
                value: 'GMT',
              },
              {
                label: '(GMT) Monrovia, Reykjavik',
                value: 'Atlantic/Reykjavik',
              },
              {
                label: '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
                value: 'Europe/Warsaw',
              },
              {
                label: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
                value: 'Europe/Paris',
              },
              {
                label: '(GMT+01:00) West Central Africa',
                value: 'Etc/GMT-1',
              },
              {
                label: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
                value: 'Europe/Amsterdam',
              },
              {
                label: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
                value: 'Europe/Budapest',
              },
              {
                label: '(GMT+02:00) Cairo',
                value: 'Africa/Cairo',
              },
              {
                label: '(GMT+02:00) Athens, Bucharest, Istanbul',
                value: 'Europe/Istanbul',
              },
              {
                label: '(GMT+02:00) Jerusalem',
                value: 'Asia/Jerusalem',
              },
              {
                label: '(GMT+02:00) Amman',
                value: 'Asia/Amman',
              },
              {
                label: '(GMT+02:00) Beirut',
                value: 'Asia/Beirut',
              },
              {
                label: '(GMT+02:00) Harare, Pretoria',
                value: 'Africa/Johannesburg',
              },
              {
                label: '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
                value: 'Europe/Kiev',
              },
              {
                label: '(GMT+02:00) Minsk',
                value: 'Europe/Minsk',
              },
              {
                label: '(GMT+02:00) Windhoek',
                value: 'Africa/Windhoek',
              },
              {
                label: '(GMT+03:00) Kuwait, Riyadh',
                value: 'Asia/Riyadh',
              },
              {
                label: '(GMT+03:00) Moscow, St. Petersburg, Volgograd',
                value: 'Europe/Moscow',
              },
              {
                label: '(GMT+03:00) Baghdad',
                value: 'Asia/Baghdad',
              },
              {
                label: '(GMT+03:00) Nairobi',
                value: 'Africa/Nairobi',
              },
              {
                label: '(GMT+03:30) Tehran',
                value: 'Asia/Tehran',
              },
              {
                label: '(GMT+04:00) Abu Dhabi, Muscat',
                value: 'Asia/Muscat',
              },
              {
                label: '(GMT+04:00) Baku',
                value: 'Asia/Baku',
              },
              {
                label: '(GMT+04:00) Caucasus Standard Time',
                value: 'Asia/Yerevan',
              },
              {
                label: '(GMT+04:00) Tbilisi',
                value: 'Etc/GMT-3',
              },
              {
                label: '(GMT+04:30) Kabul',
                value: 'Asia/Kabul',
              },
              {
                label: '(GMT+05:00) Islamabad, Karachi',
                value: 'Asia/Karachi',
              },
              {
                label: '(GMT+05:00) Ekaterinburg',
                value: 'Asia/Yekaterinburg',
              },
              {
                label: '(GMT+05:00) Tashkent',
                value: 'Asia/Tashkent',
              },
              {
                label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
                value: 'Asia/Calcutta',
              },
              {
                label: '(GMT+05:45) Kathmandu',
                value: 'Asia/Katmandu',
              },
              {
                label: '(GMT+06:00) Novosibirsk',
                value: 'Asia/Almaty',
              },
              {
                label: '(GMT+06:00) Astana, Dhaka',
                value: 'Asia/Dacca',
              },
              {
                label: '(GMT+06:30) Yangon (Rangoon)',
                value: 'Asia/Rangoon',
              },
              {
                label: '(GMT+07:00) Bangkok, Hanoi, Jakarta',
                value: 'Asia/Bangkok',
              },
              {
                label: '(GMT+07:00) Krasnoyarsk',
                value: 'Asia/Krasnoyarsk',
              },
              {
                label: '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
                value: 'Asia/Hong_Kong',
              },
              {
                label: '(GMT+08:00) Kuala Lumpur, Singapore',
                value: 'Asia/Kuala_Lumpur',
              },
              {
                label: '(GMT+08:00) Taipei',
                value: 'Asia/Taipei',
              },
              {
                label: '(GMT+08:00) Perth',
                value: 'Australia/Perth',
              },
              {
                label: '(GMT+08:00) Irkutsk',
                value: 'Asia/Irkutsk',
              },
              {
                label: '(GMT+08:00) Manila',
                value: 'Asia/Manila',
              },
              {
                label: '(GMT+09:00) Seoul',
                value: 'Asia/Seoul',
              },
              {
                label: '(GMT+09:00) Osaka, Sapporo, Tokyo',
                value: 'Asia/Tokyo',
              },
              {
                label: '(GMT+09:00) Yakutsk',
                value: 'Asia/Yakutsk',
              },
              {
                label: '(GMT+09:30) Darwin',
                value: 'Australia/Darwin',
              },
              {
                label: '(GMT+09:30) Adelaide',
                value: 'Australia/Adelaide',
              },
              {
                label: '(GMT+10:00) Canberra, Melbourne, Sydney',
                value: 'Australia/Sydney',
              },
              {
                label: '(GMT+10:00) Brisbane',
                value: 'Australia/Brisbane',
              },
              {
                label: '(GMT+10:00) Hobart',
                value: 'Australia/Hobart',
              },
              {
                label: '(GMT+10:00) Guam, Port Moresby',
                value: 'Pacific/Guam',
              },
              {
                label: '(GMT+10:00) Vladivostok',
                value: 'Asia/Vladivostok',
              },
              {
                label: '(GMT+11:00) Magadan, Solomon Is., New Caledonia',
                value: 'Asia/Magadan',
              },
              {
                label: '(GMT+12:00) Fiji, Marshall Is.',
                value: 'Pacific/Kwajalein',
              },
              {
                label: '(GMT+12:00) Auckland, Wellington',
                value: 'Pacific/Auckland',
              },
              {
                label: "(GMT+13:00) Nuku'alofa",
                value: 'Pacific/Tongatapu',
              },
            ],
          },
        ],
        visible: true,
      },
      activeTab: {
        id: 'activeTab',
        name: 'activeTab',
        type: 'radiogroup',
        helpKey: 'flow.type',
        label: 'Type',
        fullWidth: true,
        defaultValue: 'preset',
        options: [
          {
            items: [
              {
                label: 'Use preset',
                value: 'preset',
              },
              {
                label: 'Use cron expression',
                value: 'advanced',
              },
            ],
          },
        ],
      },
      frequency: {
        id: 'frequency',
        name: 'frequency',
        type: 'select',
        label: 'Frequency',
        helpKey: 'flow.frequency',
        skipSort: true,
        defaultValue: 'once_weekly',
        options: [
          {
            items: [
              {
                label: 'Once weekly',
                value: 'once_weekly',
              },
              {
                label: 'Once daily',
                value: 'once_daily',
              },
              {
                label: 'Twice daily',
                value: 'twice_daily',
              },
              {
                label: 'Every eight hours',
                value: 'every_eight_hours',
              },
              {
                label: 'Every six hours',
                value: 'every_six_hours',
              },
              {
                label: 'Every four hours',
                value: 'every_four_hours',
              },
              {
                label: 'Every two hours',
                value: 'every_two_hours',
              },
              {
                label: 'Every hour',
                value: 'every_hour',
              },
              {
                label: 'Every 30 minutes',
                value: 'every_half_hour',
              },
              {
                label: 'Every 15 minutes',
                value: 'every_quarter',
              },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [
              'preset',
            ],
          },
        ],
      },
      startTime: {
        id: 'startTime',
        name: 'startTime',
        type: 'select',
        label: 'Start time',
        helpKey: 'flow.startTime',
        skipSort: true,
        missingValueMessage: 'Please select both a start time and an end time for your flow.',
        defaultValue: '12:00 AM',
        options: [
          {
            items: [
              {
                label: '12:00 AM',
                value: '12:00 AM',
              },
              {
                label: '1:00 AM',
                value: '1:00 AM',
              },
              {
                label: '2:00 AM',
                value: '2:00 AM',
              },
              {
                label: '3:00 AM',
                value: '3:00 AM',
              },
              {
                label: '4:00 AM',
                value: '4:00 AM',
              },
              {
                label: '5:00 AM',
                value: '5:00 AM',
              },
              {
                label: '6:00 AM',
                value: '6:00 AM',
              },
              {
                label: '7:00 AM',
                value: '7:00 AM',
              },
              {
                label: '8:00 AM',
                value: '8:00 AM',
              },
              {
                label: '9:00 AM',
                value: '9:00 AM',
              },
              {
                label: '10:00 AM',
                value: '10:00 AM',
              },
              {
                label: '11:00 AM',
                value: '11:00 AM',
              },
              {
                label: '12:00 PM',
                value: '12:00 PM',
              },
              {
                label: '1:00 PM',
                value: '1:00 PM',
              },
              {
                label: '2:00 PM',
                value: '2:00 PM',
              },
              {
                label: '3:00 PM',
                value: '3:00 PM',
              },
              {
                label: '4:00 PM',
                value: '4:00 PM',
              },
              {
                label: '5:00 PM',
                value: '5:00 PM',
              },
              {
                label: '6:00 PM',
                value: '6:00 PM',
              },
              {
                label: '7:00 PM',
                value: '7:00 PM',
              },
              {
                label: '8:00 PM',
                value: '8:00 PM',
              },
              {
                label: '9:00 PM',
                value: '9:00 PM',
              },
              {
                label: '10:00 PM',
                value: '10:00 PM',
              },
              {
                label: '11:00 PM',
                value: '11:00 PM',
              },
            ],
          },
        ],
        requiredWhen: [
          {
            field: 'frequency',
            is: [
              'twice_daily',
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [
              'preset',
            ],
          },
          {
            field: 'frequency',
            isNot: [
              '',
            ],
          },
        ],
      },
      endTime: {
        id: 'endTime',
        name: 'endTime',
        type: 'select',
        label: 'End time',
        helpKey: 'flow.endTime',
        skipSort: true,
        missingValueMessage: 'Please select both a start time and an end time for your flow.',
        omitWhenHidden: true,
        options: [
          {
            items: [
              {
                label: '12:00 AM',
                value: '12:00 AM',
              },
              {
                label: '1:00 AM',
                value: '1:00 AM',
              },
              {
                label: '2:00 AM',
                value: '2:00 AM',
              },
              {
                label: '3:00 AM',
                value: '3:00 AM',
              },
              {
                label: '4:00 AM',
                value: '4:00 AM',
              },
              {
                label: '5:00 AM',
                value: '5:00 AM',
              },
              {
                label: '6:00 AM',
                value: '6:00 AM',
              },
              {
                label: '7:00 AM',
                value: '7:00 AM',
              },
              {
                label: '8:00 AM',
                value: '8:00 AM',
              },
              {
                label: '9:00 AM',
                value: '9:00 AM',
              },
              {
                label: '10:00 AM',
                value: '10:00 AM',
              },
              {
                label: '11:00 AM',
                value: '11:00 AM',
              },
              {
                label: '12:00 PM',
                value: '12:00 PM',
              },
              {
                label: '1:00 PM',
                value: '1:00 PM',
              },
              {
                label: '2:00 PM',
                value: '2:00 PM',
              },
              {
                label: '3:00 PM',
                value: '3:00 PM',
              },
              {
                label: '4:00 PM',
                value: '4:00 PM',
              },
              {
                label: '5:00 PM',
                value: '5:00 PM',
              },
              {
                label: '6:00 PM',
                value: '6:00 PM',
              },
              {
                label: '7:00 PM',
                value: '7:00 PM',
              },
              {
                label: '8:00 PM',
                value: '8:00 PM',
              },
              {
                label: '9:00 PM',
                value: '9:00 PM',
              },
              {
                label: '10:00 PM',
                value: '10:00 PM',
              },
              {
                label: '11:00 PM',
                value: '11:00 PM',
              },
            ],
          },
        ],
        refreshOptionsOnChangesTo: [
          'frequency',
        ],
        requiredWhen: [
          {
            field: 'frequency',
            is: [
              'twice_daily',
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [
              'preset',
            ],
          },
          {
            field: 'frequency',
            isNot: [
              'once_weekly',
              'once_daily',
              '',
            ],
          },
        ],
      },
      daysToRunOn: {
        id: 'daysToRunOn',
        name: 'daysToRunOn',
        type: 'multiselect',
        helpKey: 'flow.daysToRunOn',
        label: 'Run on these days',
        skipSort: true,
        defaultValue: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '0',
        ],
        options: [
          {
            items: [
              {
                value: '1',
                label: 'Monday',
              },
              {
                value: '2',
                label: 'Tuesday',
              },
              {
                value: '3',
                label: 'Wednesday',
              },
              {
                value: '4',
                label: 'Thursday',
              },
              {
                value: '5',
                label: 'Friday',
              },
              {
                value: '6',
                label: 'Saturday',
              },
              {
                value: '0',
                label: 'Sunday',
              },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [
              'preset',
            ],
          },
          {
            field: 'frequency',
            isNot: [
              'once_weekly',
              '',
            ],
          },
        ],
      },
      dayToRunOn: {
        id: 'dayToRunOn',
        name: 'dayToRunOn',
        helpKey: 'flow.daysToRunOn',
        type: 'select',
        label: 'Run on this day',
        skipSort: true,
        defaultValue: '1',
        options: [
          {
            items: [
              {
                value: '1',
                label: 'Monday',
              },
              {
                value: '2',
                label: 'Tuesday',
              },
              {
                value: '3',
                label: 'Wednesday',
              },
              {
                value: '4',
                label: 'Thursday',
              },
              {
                value: '5',
                label: 'Friday',
              },
              {
                value: '6',
                label: 'Saturday',
              },
              {
                value: '0',
                label: 'Sunday',
              },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [
              'preset',
            ],
          },
          {
            field: 'frequency',
            is: [
              'once_weekly',
            ],
          },
        ],
      },
      schedule: {
        id: 'schedule',
        name: 'schedule',
        helpKey: 'flow.schedule',
        type: 'crongenerator',
        scheduleStartMinuteOffset: 0,
        label: 'Schedule',
        defaultValue: '? 5 0 ? * 1',
        validWhen: {
          matchesRegEx: {
            pattern: '^(?!\\? \\* )',
            message: 'Please select minutes',
          },
        },
        required: true,
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [
              'advanced',
            ],
          },
        ],
      },
    },
    layout: {
      fields: [
        'timeZone',
        'activeTab',
        'frequency',
        'startTime',
        'endTime',
        'daysToRunOn',
        'dayToRunOn',
        'schedule',
      ],
    },
  },
  remountKey: 0,
  formIsDisabled: false,
  resetTouchedState: false,
  fields: {
    timeZone: {
      id: 'timeZone',
      name: 'timeZone',
      type: 'select',
      label: 'Time zone',
      helpKey: 'flow.timezone',
      defaultValue: 'Asia/Calcutta',
      options: [
        {
          items: [
            {
              label: '(GMT-12:00) International Date Line West',
              value: 'Etc/GMT+12',
            },
            {
              label: '(GMT-11:00) Midway Island, Samoa',
              value: 'Pacific/Samoa',
            },
            {
              label: '(GMT-10:00) Hawaii',
              value: 'Pacific/Honolulu',
            },
            {
              label: '(GMT-09:00) Alaska',
              value: 'America/Anchorage',
            },
            {
              label: '(GMT-08:00) Pacific Time (US & Canada)',
              value: 'America/Los_Angeles',
            },
            {
              label: '(GMT-08:00) Tijuana, Baja California',
              value: 'America/Tijuana',
            },
            {
              label: '(GMT-07:00) Mountain Time (US & Canada)',
              value: 'America/Denver',
            },
            {
              label: '(GMT-07:00) Arizona',
              value: 'America/Phoenix',
            },
            {
              label: '(GMT-07:00) Chihuahua, La Paz, Mazatlan - New',
              value: 'America/Chihuahua',
            },
            {
              label: '(GMT-06:00) Central Time (US & Canada)',
              value: 'America/Chicago',
            },
            {
              label: '(GMT-06:00) Saskatchewan',
              value: 'America/Regina',
            },
            {
              label: '(GMT-06:00) Central America',
              value: 'America/Guatemala',
            },
            {
              label: '(GMT-06:00) Guadalajara, Mexico City, Monterrey - Old',
              value: 'America/Mexico_City',
            },
            {
              label: '(GMT-05:00) Eastern Time (US & Canada)',
              value: 'America/New_York',
            },
            {
              label: '(GMT-05:00) Indiana (East)',
              value: 'US/East-Indiana',
            },
            {
              label: '(GMT-05:00) Bogota, Lima, Quito',
              value: 'America/Bogota',
            },
            {
              label: '(GMT-04:30) Caracas',
              value: 'America/Caracas',
            },
            {
              label: '(GMT-04:00) Atlantic Time (Canada)',
              value: 'America/Halifax',
            },
            {
              label: '(GMT-04:00) Georgetown, La Paz, San Juan',
              value: 'America/La_Paz',
            },
            {
              label: '(GMT-04:00) Manaus',
              value: 'America/Manaus',
            },
            {
              label: '(GMT-04:00) Santiago',
              value: 'America/Santiago',
            },
            {
              label: '(GMT-03:30) Newfoundland',
              value: 'America/St_Johns',
            },
            {
              label: '(GMT-03:00) Brasilia',
              value: 'America/Sao_Paulo',
            },
            {
              label: '(GMT-03:00) Buenos Aires',
              value: 'America/Buenos_Aires',
            },
            {
              label: '(GMT-03:00) Cayenne',
              value: 'Etc/GMT+3',
            },
            {
              label: '(GMT-03:00) Greenland',
              value: 'America/Godthab',
            },
            {
              label: '(GMT-03:00) Montevideo',
              value: 'America/Montevideo',
            },
            {
              label: '(GMT-02:00) Mid-Atlantic',
              value: 'America/Noronha',
            },
            {
              label: '(GMT-01:00) Cape Verde Is.',
              value: 'Etc/GMT+1',
            },
            {
              label: '(GMT-01:00) Azores',
              value: 'Atlantic/Azores',
            },
            {
              label: '(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
              value: 'Europe/London',
            },
            {
              label: '(GMT) Casablanca',
              value: 'GMT',
            },
            {
              label: '(GMT) Monrovia, Reykjavik',
              value: 'Atlantic/Reykjavik',
            },
            {
              label: '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
              value: 'Europe/Warsaw',
            },
            {
              label: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris',
              value: 'Europe/Paris',
            },
            {
              label: '(GMT+01:00) West Central Africa',
              value: 'Etc/GMT-1',
            },
            {
              label: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
              value: 'Europe/Amsterdam',
            },
            {
              label: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
              value: 'Europe/Budapest',
            },
            {
              label: '(GMT+02:00) Cairo',
              value: 'Africa/Cairo',
            },
            {
              label: '(GMT+02:00) Athens, Bucharest, Istanbul',
              value: 'Europe/Istanbul',
            },
            {
              label: '(GMT+02:00) Jerusalem',
              value: 'Asia/Jerusalem',
            },
            {
              label: '(GMT+02:00) Amman',
              value: 'Asia/Amman',
            },
            {
              label: '(GMT+02:00) Beirut',
              value: 'Asia/Beirut',
            },
            {
              label: '(GMT+02:00) Harare, Pretoria',
              value: 'Africa/Johannesburg',
            },
            {
              label: '(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
              value: 'Europe/Kiev',
            },
            {
              label: '(GMT+02:00) Minsk',
              value: 'Europe/Minsk',
            },
            {
              label: '(GMT+02:00) Windhoek',
              value: 'Africa/Windhoek',
            },
            {
              label: '(GMT+03:00) Kuwait, Riyadh',
              value: 'Asia/Riyadh',
            },
            {
              label: '(GMT+03:00) Moscow, St. Petersburg, Volgograd',
              value: 'Europe/Moscow',
            },
            {
              label: '(GMT+03:00) Baghdad',
              value: 'Asia/Baghdad',
            },
            {
              label: '(GMT+03:00) Nairobi',
              value: 'Africa/Nairobi',
            },
            {
              label: '(GMT+03:30) Tehran',
              value: 'Asia/Tehran',
            },
            {
              label: '(GMT+04:00) Abu Dhabi, Muscat',
              value: 'Asia/Muscat',
            },
            {
              label: '(GMT+04:00) Baku',
              value: 'Asia/Baku',
            },
            {
              label: '(GMT+04:00) Caucasus Standard Time',
              value: 'Asia/Yerevan',
            },
            {
              label: '(GMT+04:00) Tbilisi',
              value: 'Etc/GMT-3',
            },
            {
              label: '(GMT+04:30) Kabul',
              value: 'Asia/Kabul',
            },
            {
              label: '(GMT+05:00) Islamabad, Karachi',
              value: 'Asia/Karachi',
            },
            {
              label: '(GMT+05:00) Ekaterinburg',
              value: 'Asia/Yekaterinburg',
            },
            {
              label: '(GMT+05:00) Tashkent',
              value: 'Asia/Tashkent',
            },
            {
              label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
              value: 'Asia/Calcutta',
            },
            {
              label: '(GMT+05:45) Kathmandu',
              value: 'Asia/Katmandu',
            },
            {
              label: '(GMT+06:00) Novosibirsk',
              value: 'Asia/Almaty',
            },
            {
              label: '(GMT+06:00) Astana, Dhaka',
              value: 'Asia/Dacca',
            },
            {
              label: '(GMT+06:30) Yangon (Rangoon)',
              value: 'Asia/Rangoon',
            },
            {
              label: '(GMT+07:00) Bangkok, Hanoi, Jakarta',
              value: 'Asia/Bangkok',
            },
            {
              label: '(GMT+07:00) Krasnoyarsk',
              value: 'Asia/Krasnoyarsk',
            },
            {
              label: '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
              value: 'Asia/Hong_Kong',
            },
            {
              label: '(GMT+08:00) Kuala Lumpur, Singapore',
              value: 'Asia/Kuala_Lumpur',
            },
            {
              label: '(GMT+08:00) Taipei',
              value: 'Asia/Taipei',
            },
            {
              label: '(GMT+08:00) Perth',
              value: 'Australia/Perth',
            },
            {
              label: '(GMT+08:00) Irkutsk',
              value: 'Asia/Irkutsk',
            },
            {
              label: '(GMT+08:00) Manila',
              value: 'Asia/Manila',
            },
            {
              label: '(GMT+09:00) Seoul',
              value: 'Asia/Seoul',
            },
            {
              label: '(GMT+09:00) Osaka, Sapporo, Tokyo',
              value: 'Asia/Tokyo',
            },
            {
              label: '(GMT+09:00) Yakutsk',
              value: 'Asia/Yakutsk',
            },
            {
              label: '(GMT+09:30) Darwin',
              value: 'Australia/Darwin',
            },
            {
              label: '(GMT+09:30) Adelaide',
              value: 'Australia/Adelaide',
            },
            {
              label: '(GMT+10:00) Canberra, Melbourne, Sydney',
              value: 'Australia/Sydney',
            },
            {
              label: '(GMT+10:00) Brisbane',
              value: 'Australia/Brisbane',
            },
            {
              label: '(GMT+10:00) Hobart',
              value: 'Australia/Hobart',
            },
            {
              label: '(GMT+10:00) Guam, Port Moresby',
              value: 'Pacific/Guam',
            },
            {
              label: '(GMT+10:00) Vladivostok',
              value: 'Asia/Vladivostok',
            },
            {
              label: '(GMT+11:00) Magadan, Solomon Is., New Caledonia',
              value: 'Asia/Magadan',
            },
            {
              label: '(GMT+12:00) Fiji, Marshall Is.',
              value: 'Pacific/Kwajalein',
            },
            {
              label: '(GMT+12:00) Auckland, Wellington',
              value: 'Pacific/Auckland',
            },
            {
              label: "(GMT+13:00) Nuku'alofa",
              value: 'Pacific/Tongatapu',
            },
          ],
        },
      ],
      visible: true,
      defaultVisible: true,
      value: 'Asia/Calcutta',
      touched: false,
      required: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
    activeTab: {
      id: 'activeTab',
      name: 'activeTab',
      type: 'radiogroup',
      helpKey: 'flow.type',
      label: 'Type',
      fullWidth: true,
      defaultValue: 'preset',
      options: [
        {
          items: [
            {
              label: 'Use preset',
              value: 'preset',
            },
            {
              label: 'Use cron expression',
              value: 'advanced',
            },
          ],
        },
      ],
      value: 'preset',
      touched: false,
      visible: true,
      required: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
    frequency: {
      id: 'frequency',
      name: 'frequency',
      type: 'select',
      label: 'Frequency',
      helpKey: 'flow.frequency',
      skipSort: true,
      defaultValue: 'once_weekly',
      options: [
        {
          items: [
            {
              label: 'Once weekly',
              value: 'once_weekly',
            },
            {
              label: 'Once daily',
              value: 'once_daily',
            },
            {
              label: 'Twice daily',
              value: 'twice_daily',
            },
            {
              label: 'Every eight hours',
              value: 'every_eight_hours',
            },
            {
              label: 'Every six hours',
              value: 'every_six_hours',
            },
            {
              label: 'Every four hours',
              value: 'every_four_hours',
            },
            {
              label: 'Every two hours',
              value: 'every_two_hours',
            },
            {
              label: 'Every hour',
              value: 'every_hour',
            },
            {
              label: 'Every 30 minutes',
              value: 'every_half_hour',
            },
            {
              label: 'Every 15 minutes',
              value: 'every_quarter',
            },
          ],
        },
      ],
      visibleWhenAll: [
        {
          field: 'activeTab',
          is: [
            'preset',
          ],
        },
      ],
      value: 'once_weekly',
      touched: false,
      visible: true,
      required: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
    startTime: {
      id: 'startTime',
      name: 'startTime',
      type: 'select',
      label: 'Start time',
      helpKey: 'flow.startTime',
      skipSort: true,
      missingValueMessage: 'Please select both a start time and an end time for your flow.',
      defaultValue: '12:00 AM',
      options: [
        {
          items: [
            {
              label: '12:00 AM',
              value: '12:00 AM',
            },
            {
              label: '1:00 AM',
              value: '1:00 AM',
            },
            {
              label: '2:00 AM',
              value: '2:00 AM',
            },
            {
              label: '3:00 AM',
              value: '3:00 AM',
            },
            {
              label: '4:00 AM',
              value: '4:00 AM',
            },
            {
              label: '5:00 AM',
              value: '5:00 AM',
            },
            {
              label: '6:00 AM',
              value: '6:00 AM',
            },
            {
              label: '7:00 AM',
              value: '7:00 AM',
            },
            {
              label: '8:00 AM',
              value: '8:00 AM',
            },
            {
              label: '9:00 AM',
              value: '9:00 AM',
            },
            {
              label: '10:00 AM',
              value: '10:00 AM',
            },
            {
              label: '11:00 AM',
              value: '11:00 AM',
            },
            {
              label: '12:00 PM',
              value: '12:00 PM',
            },
            {
              label: '1:00 PM',
              value: '1:00 PM',
            },
            {
              label: '2:00 PM',
              value: '2:00 PM',
            },
            {
              label: '3:00 PM',
              value: '3:00 PM',
            },
            {
              label: '4:00 PM',
              value: '4:00 PM',
            },
            {
              label: '5:00 PM',
              value: '5:00 PM',
            },
            {
              label: '6:00 PM',
              value: '6:00 PM',
            },
            {
              label: '7:00 PM',
              value: '7:00 PM',
            },
            {
              label: '8:00 PM',
              value: '8:00 PM',
            },
            {
              label: '9:00 PM',
              value: '9:00 PM',
            },
            {
              label: '10:00 PM',
              value: '10:00 PM',
            },
            {
              label: '11:00 PM',
              value: '11:00 PM',
            },
          ],
        },
      ],
      requiredWhen: [
        {
          field: 'frequency',
          is: [
            'twice_daily',
          ],
        },
      ],
      visibleWhenAll: [
        {
          field: 'activeTab',
          is: [
            'preset',
          ],
        },
        {
          field: 'frequency',
          isNot: [
            '',
          ],
        },
      ],
      value: '1:00 AM',
      touched: false,
      visible: true,
      required: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
    endTime: {
      id: 'endTime',
      name: 'endTime',
      type: 'select',
      label: 'End time',
      helpKey: 'flow.endTime',
      skipSort: true,
      missingValueMessage: 'Please select both a start time and an end time for your flow.',
      omitWhenHidden: true,
      options: [
        {
          items: [
            {
              label: '12:00 AM',
              value: '12:00 AM',
            },
            {
              label: '1:00 AM',
              value: '1:00 AM',
            },
            {
              label: '2:00 AM',
              value: '2:00 AM',
            },
            {
              label: '3:00 AM',
              value: '3:00 AM',
            },
            {
              label: '4:00 AM',
              value: '4:00 AM',
            },
            {
              label: '5:00 AM',
              value: '5:00 AM',
            },
            {
              label: '6:00 AM',
              value: '6:00 AM',
            },
            {
              label: '7:00 AM',
              value: '7:00 AM',
            },
            {
              label: '8:00 AM',
              value: '8:00 AM',
            },
            {
              label: '9:00 AM',
              value: '9:00 AM',
            },
            {
              label: '10:00 AM',
              value: '10:00 AM',
            },
            {
              label: '11:00 AM',
              value: '11:00 AM',
            },
            {
              label: '12:00 PM',
              value: '12:00 PM',
            },
            {
              label: '1:00 PM',
              value: '1:00 PM',
            },
            {
              label: '2:00 PM',
              value: '2:00 PM',
            },
            {
              label: '3:00 PM',
              value: '3:00 PM',
            },
            {
              label: '4:00 PM',
              value: '4:00 PM',
            },
            {
              label: '5:00 PM',
              value: '5:00 PM',
            },
            {
              label: '6:00 PM',
              value: '6:00 PM',
            },
            {
              label: '7:00 PM',
              value: '7:00 PM',
            },
            {
              label: '8:00 PM',
              value: '8:00 PM',
            },
            {
              label: '9:00 PM',
              value: '9:00 PM',
            },
            {
              label: '10:00 PM',
              value: '10:00 PM',
            },
            {
              label: '11:00 PM',
              value: '11:00 PM',
            },
          ],
        },
      ],
      refreshOptionsOnChangesTo: [
        'frequency',
      ],
      requiredWhen: [
        {
          field: 'frequency',
          is: [
            'twice_daily',
          ],
        },
      ],
      visibleWhenAll: [
        {
          field: 'activeTab',
          is: [
            'preset',
          ],
        },
        {
          field: 'frequency',
          isNot: [
            'once_weekly',
            'once_daily',
            '',
          ],
        },
      ],
      touched: false,
      visible: false,
      required: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
    daysToRunOn: {
      id: 'daysToRunOn',
      name: 'daysToRunOn',
      type: 'multiselect',
      helpKey: 'flow.daysToRunOn',
      label: 'Run on these days',
      skipSort: true,
      defaultValue: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '0',
      ],
      options: [
        {
          items: [
            {
              value: '1',
              label: 'Monday',
            },
            {
              value: '2',
              label: 'Tuesday',
            },
            {
              value: '3',
              label: 'Wednesday',
            },
            {
              value: '4',
              label: 'Thursday',
            },
            {
              value: '5',
              label: 'Friday',
            },
            {
              value: '6',
              label: 'Saturday',
            },
            {
              value: '0',
              label: 'Sunday',
            },
          ],
        },
      ],
      visibleWhenAll: [
        {
          field: 'activeTab',
          is: [
            'preset',
          ],
        },
        {
          field: 'frequency',
          isNot: [
            'once_weekly',
            '',
          ],
        },
      ],
      value: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '0',
      ],
      touched: false,
      visible: false,
      required: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
    dayToRunOn: {
      id: 'dayToRunOn',
      name: 'dayToRunOn',
      helpKey: 'flow.daysToRunOn',
      type: 'select',
      label: 'Run on this day',
      skipSort: true,
      defaultValue: '1',
      options: [
        {
          items: [
            {
              value: '1',
              label: 'Monday',
            },
            {
              value: '2',
              label: 'Tuesday',
            },
            {
              value: '3',
              label: 'Wednesday',
            },
            {
              value: '4',
              label: 'Thursday',
            },
            {
              value: '5',
              label: 'Friday',
            },
            {
              value: '6',
              label: 'Saturday',
            },
            {
              value: '0',
              label: 'Sunday',
            },
          ],
        },
      ],
      visibleWhenAll: [
        {
          field: 'activeTab',
          is: [
            'preset',
          ],
        },
        {
          field: 'frequency',
          is: [
            'once_weekly',
          ],
        },
      ],
      value: '1',
      touched: false,
      visible: true,
      required: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
    schedule: {
      id: 'schedule',
      name: 'schedule',
      helpKey: 'flow.schedule',
      type: 'crongenerator',
      scheduleStartMinuteOffset: 0,
      label: 'Schedule',
      defaultValue: '? 5 0 ? * 1',
      validWhen: {
        matchesRegEx: {
          pattern: '^(?!\\? \\* )',
          message: 'Please select minutes',
        },
      },
      required: true,
      visibleWhenAll: [
        {
          field: 'activeTab',
          is: [
            'advanced',
          ],
        },
      ],
      defaultRequired: true,
      value: '? 5 0 ? * 1',
      touched: false,
      visible: false,
      disabled: false,
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
    },
  },
  value: {
    timeZone: 'Asia/Calcutta',
    activeTab: 'preset',
    frequency: 'once_weekly',
    startTime: '1:00 AM',
    daysToRunOn: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '0',
    ],
    dayToRunOn: '1',
    schedule: '? 5 0 ? * 1',
  },
  isValid: true,
  lastFieldUpdated: 'startTime',
};
