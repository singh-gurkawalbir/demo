/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import MyAccount from '.';
import { getCreatedStore } from '../../store';

let initialStore;

function store(accounts) {
  initialStore.getState().user.org.accounts = accounts;
  initialStore.getState().user.profile = {
    _id: '5d4010e14cd24a7c773122ef',
    name: 'Chaitanya Reddy Mula',
    email: 'chaitanyareddy.mule@celigo.com',
    role: '',
    company: 'Celigo',
    phone: '8309441737',
    auth_type_google: {},
    timezone: 'Asia/Calcutta',
    developer: true,
    agreeTOSAndPP: true,
    createdAt: '2019-07-30T09:41:54.435Z',
    useErrMgtTwoDotZero: false,
    authTypeSSO: null,
    emailHash: '8a859a6cc8996b65d364a1ce1e7a3820',
  };
  initialStore.getState().user.preferences = {
    environment: 'production',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm:ss a',
    drawerOpened: true,
    expand: 'Resources',
    scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
    showReactSneakPeekFromDate: '2019-11-05',
    showReactBetaFromDate: '2019-12-26',
    defaultAShareId: accounts[0].defaultAShareId,
    fbBottomDrawerHeight: 114,
    lastLoginAt: '2022-01-25T07:36:20.829Z',
    dashboard: {
      tilesOrder: [
        '5fc5e0e66cfe5b44bb95de70',
      ],
      view: 'tile',
    },
    recentActivity: {
      production: {
        integration: '60c1b4aea4004f2e4cfcb84f',
        flow: '60cf3ec4a4004f2e4cff3af7',
      },
    },
  };
  initialStore.getState().session.form = {
    'new-Xf_gJO98f': {
      parentContext: {
        skipMonitorLevelAccessCheck: true,
      },
      disabled: false,
      showValidationBeforeTouched: false,
      conditionalUpdate: false,
      fieldMeta: {
        fieldMap: {
          name: {
            id: 'name',
            name: 'name',
            type: 'text',
            label: 'Name',
            required: true,
            helpKey: 'myaccount.name',
            noApi: true,
            defaultValue: 'Chaitanya Reddy Mula',
            isLoggable: false,
          },
          email: {
            id: 'email',
            name: 'email',
            type: 'useremail',
            label: 'Email',
            helpKey: 'myaccount.email',
            noApi: true,
            readOnly: false,
            value: 'chaitanyareddy.mule@celigo.com',
            isLoggable: false,
          },
          password: {
            id: 'password',
            name: 'password',
            label: 'Password',
            helpKey: 'myaccount.password',
            noApi: true,
            type: 'userpassword',
            visible: true,
            isLoggable: false,
          },
          company: {
            id: 'company',
            name: 'company',
            type: 'text',
            label: 'Company',
            helpKey: 'myaccount.company',
            noApi: true,
            defaultValue: 'Celigo',
            isLoggable: false,
          },
          phone: {
            id: 'phone',
            name: 'phone',
            type: 'text',
            label: 'Phone',
            helpKey: 'myaccount.phone',
            noApi: true,
            defaultValue: '8309441737',
            isLoggable: false,
          },
          role: {
            id: 'role',
            name: 'role',
            type: 'text',
            helpKey: 'myaccount.role',
            noApi: true,
            label: 'Role',
            defaultValue: '',
            isLoggable: false,
          },
          timezone: {
            id: 'timezone',
            name: 'timezone',
            type: 'select',
            label: 'Time zone',
            required: true,
            helpKey: 'myaccount.timezone',
            noApi: true,
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
                    label: '(GMT+13:00) Nuku\'alofa',
                    value: 'Pacific/Tongatapu',
                  },
                ],
              },
            ],
            isLoggable: false,
          },
          dateFormat: {
            id: 'dateFormat',
            name: 'dateFormat',
            type: 'select',
            required: true,
            helpKey: 'myaccount.dateFormat',
            noApi: true,
            label: 'Date format',
            defaultValue: 'MM/DD/YYYY',
            options: [
              {
                items: [
                  {
                    label: '12/31/1900',
                    value: 'MM/DD/YYYY',
                  },
                  {
                    label: '31/12/1900',
                    value: 'DD/MM/YYYY',
                  },
                  {
                    label: '31-Dec-1900',
                    value: 'DD-MMM-YYYY',
                  },
                  {
                    label: '31.12.1900',
                    value: 'DD.MM.YYYY',
                  },
                  {
                    label: '31-December-1900',
                    value: 'DD-MMMM-YYYY',
                  },
                  {
                    label: '31 December, 1900',
                    value: 'DD MMMM, YYYY',
                  },
                  {
                    label: '1900/12/31',
                    value: 'YYYY/MM/DD',
                  },
                  {
                    label: '1900-12-31',
                    value: 'YYYY-MM-DD',
                  },
                ],
              },
            ],
            isLoggable: true,
          },
          timeFormat: {
            id: 'timeFormat',
            name: 'timeFormat',
            type: 'select',
            helpKey: 'myaccount.timeFormat',
            noApi: true,
            required: true,
            label: 'Time format',
            defaultValue: 'h:mm:ss a',
            options: [
              {
                items: [
                  {
                    label: '2:34:25 pm',
                    value: 'h:mm:ss a',
                  },
                  {
                    label: '14:34:25',
                    value: 'H:mm:ss',
                  },
                ],
              },
            ],
            isLoggable: true,
          },
          showRelativeDateTime: {
            id: 'showRelativeDateTime',
            name: 'showRelativeDateTime',
            type: 'checkbox',
            helpKey: 'myaccount.showRelativeDateTime',
            noApi: true,
            label: 'Show timestamps as relative',
            isLoggable: true,
          },
          developer: {
            id: 'developer',
            name: 'developer',
            type: 'checkbox',
            helpKey: 'myaccount.developer',
            noApi: true,
            label: 'Developer mode',
            defaultValue: true,
            isLoggable: true,
          },
        },
        layout: {
          fields: [
            'name',
            'email',
            'password',
            'company',
            'role',
            'phone',
            'timezone',
            'dateFormat',
            'timeFormat',
            'showRelativeDateTime',
            'developer',
          ],
        },
      },
      remountKey: 1,
      formIsDisabled: false,
      resetTouchedState: false,
      fields: {
        name: {
          id: 'name',
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
          helpKey: 'myaccount.name',
          noApi: true,
          defaultValue: 'Chaitanya Reddy Mula',
          isLoggable: false,
          defaultRequired: true,
          value: 'Chaitanya Reddy Mula',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        email: {
          id: 'email',
          name: 'email',
          type: 'useremail',
          label: 'Email',
          helpKey: 'myaccount.email',
          noApi: true,
          readOnly: false,
          value: 'chaitanyareddy.mule@celigo.com',
          isLoggable: false,
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        password: {
          id: 'password',
          name: 'password',
          label: 'Password',
          helpKey: 'myaccount.password',
          noApi: true,
          type: 'userpassword',
          visible: true,
          isLoggable: false,
          defaultVisible: true,
          touched: false,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        company: {
          id: 'company',
          name: 'company',
          type: 'text',
          label: 'Company',
          helpKey: 'myaccount.company',
          noApi: true,
          defaultValue: 'Celigo',
          isLoggable: false,
          value: 'Celigo',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        phone: {
          id: 'phone',
          name: 'phone',
          type: 'text',
          label: 'Phone',
          helpKey: 'myaccount.phone',
          noApi: true,
          defaultValue: '8309441737',
          isLoggable: false,
          value: '8309441737',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        role: {
          id: 'role',
          name: 'role',
          type: 'text',
          helpKey: 'myaccount.role',
          noApi: true,
          label: 'Role',
          defaultValue: '',
          isLoggable: false,
          value: '',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        timezone: {
          id: 'timezone',
          name: 'timezone',
          type: 'select',
          label: 'Time zone',
          required: true,
          helpKey: 'myaccount.timezone',
          noApi: true,
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
                  label: '(GMT+13:00) Nuku\'alofa',
                  value: 'Pacific/Tongatapu',
                },
              ],
            },
          ],
          isLoggable: false,
          defaultRequired: true,
          value: 'Asia/Calcutta',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        dateFormat: {
          id: 'dateFormat',
          name: 'dateFormat',
          type: 'select',
          required: true,
          helpKey: 'myaccount.dateFormat',
          noApi: true,
          label: 'Date format',
          defaultValue: 'MM/DD/YYYY',
          options: [
            {
              items: [
                {
                  label: '12/31/1900',
                  value: 'MM/DD/YYYY',
                },
                {
                  label: '31/12/1900',
                  value: 'DD/MM/YYYY',
                },
                {
                  label: '31-Dec-1900',
                  value: 'DD-MMM-YYYY',
                },
                {
                  label: '31.12.1900',
                  value: 'DD.MM.YYYY',
                },
                {
                  label: '31-December-1900',
                  value: 'DD-MMMM-YYYY',
                },
                {
                  label: '31 December, 1900',
                  value: 'DD MMMM, YYYY',
                },
                {
                  label: '1900/12/31',
                  value: 'YYYY/MM/DD',
                },
                {
                  label: '1900-12-31',
                  value: 'YYYY-MM-DD',
                },
              ],
            },
          ],
          isLoggable: true,
          defaultRequired: true,
          value: 'MM/DD/YYYY',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        timeFormat: {
          id: 'timeFormat',
          name: 'timeFormat',
          type: 'select',
          helpKey: 'myaccount.timeFormat',
          noApi: true,
          required: true,
          label: 'Time format',
          defaultValue: 'h:mm:ss a',
          options: [
            {
              items: [
                {
                  label: '2:34:25 pm',
                  value: 'h:mm:ss a',
                },
                {
                  label: '14:34:25',
                  value: 'H:mm:ss',
                },
              ],
            },
          ],
          isLoggable: true,
          defaultRequired: true,
          value: 'h:mm:ss a',
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        showRelativeDateTime: {
          id: 'showRelativeDateTime',
          name: 'showRelativeDateTime',
          type: 'checkbox',
          helpKey: 'myaccount.showRelativeDateTime',
          noApi: true,
          label: 'Show timestamps as relative',
          isLoggable: true,
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
        developer: {
          id: 'developer',
          name: 'developer',
          type: 'checkbox',
          helpKey: 'myaccount.developer',
          noApi: true,
          label: 'Developer mode',
          defaultValue: true,
          isLoggable: true,
          value: true,
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
      },
      value: {
        name: 'Chaitanya Reddy Mula',
        email: 'chaitanyareddy.mule@celigo.com',
        company: 'Celigo',
        phone: '8309441737',
        role: '',
        timezone: 'Asia/Calcutta',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'h:mm:ss a',
        developer: true,
      },
      isValid: true,
    },
    'new-2XKB4Dov0u': {
      parentContext: {},
      disabled: false,
      showValidationBeforeTouched: false,
      conditionalUpdate: false,
      fieldMeta: {
        fieldMap: {
          newEmail: {
            id: 'newEmail',
            name: 'newEmail',
            type: 'text',
            label: 'New email',
            required: true,
            isLoggable: false,
          },
          password: {
            id: 'password',
            name: 'password',
            type: 'text',
            inputType: 'password',
            label: 'Password',
            required: true,
            isLoggable: false,
          },
          label: {
            id: 'label',
            name: 'label',
            type: 'labeltitle',
            label: 'Note: we require your current password again to help safeguard your integrator.io account.',
          },
        },
        layout: {
          fields: [
            'newEmail',
            'password',
            'label',
          ],
        },
      },
      remountKey: false,
      formIsDisabled: false,
      resetTouchedState: false,
      fields: {
        newEmail: {
          id: 'newEmail',
          name: 'newEmail',
          type: 'text',
          label: 'New email',
          required: true,
          isLoggable: false,
          defaultRequired: true,
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: true,
          errorMessages: '',
        },
        password: {
          id: 'password',
          name: 'password',
          type: 'text',
          inputType: 'password',
          label: 'Password',
          required: true,
          isLoggable: false,
          defaultRequired: true,
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: true,
          errorMessages: '',
        },
        label: {
          id: 'label',
          name: 'label',
          type: 'labeltitle',
          label: 'Note: we require your current password again to help safeguard your integrator.io account.',
          touched: false,
          visible: true,
          required: false,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: false,
          errorMessages: '',
        },
      },
      value: {},
      isValid: false,
    },
    'new-0mK4wMtr7w': {
      parentContext: {},
      disabled: false,
      showValidationBeforeTouched: false,
      conditionalUpdate: false,
      fieldMeta: {
        fieldMap: {
          currentPassword: {
            id: 'currentPassword',
            name: 'currentPassword',
            type: 'text',
            inputType: 'password',
            label: 'Current password',
            required: true,
          },
          newPassword: {
            id: 'newPassword',
            name: 'newPassword',
            type: 'text',
            inputType: 'password',
            label: 'New password',
            required: true,
          },
        },
        layout: {
          fields: [
            'currentPassword',
            'newPassword',
          ],
        },
      },
      remountKey: false,
      formIsDisabled: false,
      resetTouchedState: false,
      fields: {
        currentPassword: {
          id: 'currentPassword',
          name: 'currentPassword',
          type: 'text',
          inputType: 'password',
          label: 'Current password',
          required: true,
          defaultRequired: true,
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: true,
          errorMessages: '',
        },
        newPassword: {
          id: 'newPassword',
          name: 'newPassword',
          type: 'text',
          inputType: 'password',
          label: 'New password',
          required: true,
          defaultRequired: true,
          touched: false,
          visible: true,
          disabled: false,
          isValid: true,
          isDiscretelyInvalid: true,
          errorMessages: '',
        },
      },
      value: {},
      isValid: false,
    },
  };
  initialStore.getState().session.resource.numEnabledFlows = {
    numEnabledSandboxFlows: 0,
    numEnabledFreeFlows: 0,
    numEnabledPaidFlows: 91,
  };
}

async function initMyAccount(match, tab) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: match.url}]}
    >
      <Route
        path="/myAccount/:tab"
        params={{tab: {tab}}}
        >
        <MyAccount match={match} />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('MyAccount', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    cleanup();
  });
  test('Should able to acess the profile tab with owner access', async () => {
    const accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        defaultAShareId: 'own',
      },
    ];

    store(accounts);
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/profile',
      isExact: true,
      params: {
        tab: 'profile',
      },
    };

    await initMyAccount(match, match.params.tab);
    const myAccountText = screen.getByText('My account');

    expect(myAccountText).toBeInTheDocument();
    const profileText = screen.getByText('Profile');

    expect(profileText).toBeInTheDocument();
    userEvent.click(profileText);
    const usersText = screen.getByText('Users');

    expect(usersText).toBeInTheDocument();
    userEvent.click(usersText);
    expect(profileText).toBeInTheDocument();
    userEvent.click(profileText);
    const subscriptionText = screen.getByText('Subscription');

    expect(subscriptionText).toBeInTheDocument();
    userEvent.click(subscriptionText);
    const auditlogText = screen.getByText('Audit log');

    expect(auditlogText).toBeInTheDocument();
    userEvent.click(auditlogText);
    const transferText = screen.getByText('Transfers');

    expect(transferText).toBeInTheDocument();
    userEvent.click(transferText);
    const securityText = screen.getByText('Security');

    expect(securityText).toBeInTheDocument();
    userEvent.click(securityText);
  });
  test('Should able to acess the subscription tab', async () => {
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/subscription',
      isExact: true,
      params: {
        tab: 'subscription',
      },
    };

    const accounts = [
      {
        _id: 'own',
        accessLevel: 'owner',
        defaultAShareId: 'own',
      },
    ];

    store(accounts);
    await initMyAccount(match, match.params.tab);

    const subscriptionText = screen.getByRole('tab', {name: 'Subscription'});

    expect(subscriptionText).toBeInTheDocument();
    userEvent.click(subscriptionText);
  });
  test('Should able to access the Myaccount tab with the account which has manage access', async () => {
    const accounts = [
      {
        _id: '12345',
        accessLevel: 'manage',
        defaultAShareId: '6040b99a7671bb3ddf6a3abc',
      },
    ];

    store(accounts);
    const match = {
      path: '/myAccount/:tab',
      url: '/myAccount/profile',
      isExact: true,
      params: {
        tab: 'profile',
      },
    };

    await initMyAccount(match, match.params.tab);
    const profileTabNode = screen.getByRole('tab', {name: 'Profile'});

    expect(profileTabNode).toBeInTheDocument();
    const securityTabNode = screen.getByRole('tab', {name: 'Security'});

    expect(securityTabNode).toBeInTheDocument();
    const tabCount = screen.getAllByRole('tab');

    expect(tabCount).toHaveLength(2);
  });
});
