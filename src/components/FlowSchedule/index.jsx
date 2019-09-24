import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import moment from 'moment';
import actions from '../../actions';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import DynaSubmit from '../DynaForm/DynaSubmit';
import dateTimezones from '../../utils/dateTimezones';
import { getCronExpression } from '../../utils/schedule';

const useStyles = makeStyles(theme => ({
  modalContent: {
    width: '60vw',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function FlowSchedule(props) {
  const dispatch = useDispatch();
  const { title, onClose, resource } = props;
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  let scheduleStartMinute = 0;

  if (preferences && preferences.scheduleShiftForFlowsCreatedAfter) {
    const changeStartMinuteForFlowsCreatedAfter = moment(
      preferences.scheduleShiftForFlowsCreatedAfter
    );

    if (
      !resource.createdAt ||
      changeStartMinuteForFlowsCreatedAfter.diff(moment(resource.createdAt)) < 0
    ) {
      scheduleStartMinute = 10;
    }
  }

  const integration = useSelector(state =>
    selectors.userProfilePreferencesProps(
      state,
      'integration',
      resource._integrationId
    )
  );
  const PRESET_TAB = '0';
  const ADVANCED_TAB = '1';
  const MINUTES = 1;
  const HOURS = 2;
  const DATE = 3;
  const MONTH = 4;
  const WEEKDAY = 5;
  const handleSubmit = formVal => {
    let scheduleValue;

    if (formVal.activeTab === ADVANCED_TAB) {
      // Need to handle Cron Editor Changes
      scheduleValue = formVal.schedule;
    } else {
      if (
        formVal.startTime &&
        formVal.endTime &&
        !moment(formVal.startTime, 'LT').isBefore(moment(formVal.endTime, 'LT'))
      ) {
        // eslint-disable-next-line no-alert
        window.alert('End Time is invalid');

        return false;
      }

      scheduleValue =
        getCronExpression(formVal, scheduleStartMinute) === '? * * * * *'
          ? ''
          : getCronExpression(formVal, scheduleStartMinute);
    }

    const patchSet = [
      {
        op: 'replace',
        path: '/schedule',
        value: scheduleValue,
      },
    ];

    dispatch(actions.resource.patchStaged(resource._id, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', resource._id, 'value'));

    onClose();
  };

  const setValues = () => {
    const value = resource.schedule;
    const frequency = {
      '1': 'every_hour',
      '2': 'every_two_hours',
      '4': 'every_four_hours',
      '6': 'every_six_hours',
      '8': 'every_eight_hours',
      '12': 'twice_daily',
    };
    let hours;

    resource.frequency = undefined;
    resource.startTime = undefined;
    resource.endTime = undefined;
    // eslint-disable-next-line
    resource.endTimeOptions = Array.apply(null, {length: 24}).map(function (a, b) { return moment().startOf('day').add(b, 'h').add(resource.scheduleStartMinute, 'm').format('LT') }, Number)
    resource.daysToRunOn = ['1', '2', '3', '4', '5', '6', '0'];
    resource.dayToRunOn = undefined;

    if (!value) {
      resource.activeTab = PRESET_TAB;

      return false;
    }

    resource.activeTab = ADVANCED_TAB;
    const cronArr = value.split(' ');

    if (
      cronArr.length !== 6 ||
      cronArr[DATE] !== '?' ||
      cronArr[MONTH] !== '*'
    ) {
      return false;
    }

    if (
      cronArr.join(' ') === '? */15 * ? * *' ||
      cronArr.join(' ') === '? 10-59/15 * ? * *'
    ) {
      resource.activeTab = PRESET_TAB;
      resource.frequency = 'every_quarter';
      resource.daysToRunOn =
        cronArr[WEEKDAY] === '*'
          ? ['1', '2', '3', '4', '5', '6', '0']
          : cronArr[WEEKDAY].split(',');

      return;
    }

    if (
      cronArr.join(' ') === '? */30 * ? * *' ||
      cronArr.join(' ') === '? 10-59/30 * ? * *'
    ) {
      resource.activeTab = PRESET_TAB;
      resource.frequency = 'every_half_hour';
      resource.daysToRunOn =
        cronArr[WEEKDAY] === '*'
          ? ['1', '2', '3', '4', '5', '6', '0']
          : cronArr[WEEKDAY].split(',');

      return;
    }

    if (/\?\s0\s\*\/(1|2|4|6|8|12)\s\?\s\*\s\*/.test(cronArr.join(' '))) {
      // if cronExpression is one of
      // ? 0 */1 ? * *
      // ? 0 */2 ? * *
      // ? 0 */4 ? * *
      // ? 0 */6 ? * *
      // ? 0 */8 ? * *
      // ? 0 */12 ? * *
      resource.activeTab = PRESET_TAB;
      // get  frequency from hour value
      resource.frequency =
        frequency[value.match(/\?\s0\s\*\/(1|2|4|6|8|12)\s\?\s\*\s\*/)[1]];
      resource.daysToRunOn =
        cronArr[WEEKDAY] === '*'
          ? ['1', '2', '3', '4', '5', '6', '0']
          : cronArr[WEEKDAY].split(',');

      return false;
    }

    if (
      cronArr[MINUTES] === '0,30' ||
      cronArr[MINUTES] === '10,40' ||
      cronArr[MINUTES] === '0,15,30,45' ||
      cronArr[MINUTES] === '10,25,40,55'
    ) {
      resource.activeTab = PRESET_TAB;
      resource.frequency =
        cronArr[MINUTES] === '0,30' || cronArr[MINUTES] === '10,40'
          ? 'every_half_hour'
          : 'every_quarter';

      if (cronArr[HOURS] !== '*' && cronArr[HOURS] !== '?') {
        hours = cronArr[HOURS].split(',');
        resource.startTime = moment()
          .startOf('day')
          .add(hours[0], 'h')
          .add(resource.scheduleStartMinute, 'm')
          .format('LT');

        if (hours.length) {
          const minutes = resource.frequency === 'every_quarter' ? 45 : 30;

          // eslint-disable-next-line
          resource.endTimeOptions = Array.apply(null, { length: 24 }).map(
            (a, b) =>
              moment()
                .startOf('day')
                .add(b, 'h')
                .add(minutes, 'm')
                .add(resource.scheduleStartMinute, 'm')
                .format('LT'),
            Number
          );
          resource.endTime = moment(resource.startTime, 'LT')
            .add(hours.length - 1, 'h')
            .add(minutes, 'm')
            .format('LT');
        }
      }

      resource.daysToRunOn =
        cronArr[WEEKDAY] === '*'
          ? ['1', '2', '3', '4', '5', '6', '0']
          : cronArr[WEEKDAY].split(',');

      return false;
    }

    if (
      (cronArr[MINUTES] === '0' || cronArr[MINUTES] === '10') &&
      cronArr[HOURS].indexOf('*') === -1 &&
      cronArr[HOURS].indexOf('?') === -1
    ) {
      hours = cronArr[HOURS].split(',');
      let symDiff = true;

      if (hours.length > 1) {
        resource.activeTab = PRESET_TAB;
        const diff = hours[1] - hours[0];

        for (let i = 1; i < hours.length; i += 1) {
          if (hours[i] - hours[i - 1] !== diff) {
            symDiff = false;
          }
        }

        if (symDiff) {
          resource.frequency = frequency[diff.toString()];
          resource.startTime = moment()
            .startOf('day')
            .add(hours[0], 'h')
            .add(resource.scheduleStartMinute, 'm')
            .format('LT');
          resource.endTime = moment(resource.startTime, 'LT')
            .add(diff * (hours.length - 1), 'h')
            .format('LT');
        }

        resource.daysToRunOn =
          cronArr[WEEKDAY] === '*'
            ? ['1', '2', '3', '4', '5', '6', '0']
            : cronArr[WEEKDAY].split(',');

        return false;
      }
    }

    if (
      (cronArr[MINUTES] === '0' || cronArr[MINUTES] === '10') &&
      cronArr[HOURS] &&
      cronArr[HOURS].split(',').length === 1
    ) {
      if (
        cronArr[WEEKDAY] !== '*' &&
        cronArr[WEEKDAY].split(',').length === 1
      ) {
        resource.activeTab = PRESET_TAB;
        resource.frequency = 'once_weekly';
        resource.startTime = moment()
          .startOf('day')
          .add(cronArr[HOURS], 'h')
          .add(resource.scheduleStartMinute, 'm')
          .format('LT');
        resource.endTime = undefined;
        resource.dayToRunOn = cronArr[WEEKDAY];
      } else {
        resource.activeTab = PRESET_TAB;
        resource.frequency = 'once_daily';
        resource.startTime = moment()
          .startOf('day')
          .add(cronArr[HOURS], 'h')
          .add(resource.scheduleStartMinute, 'm')
          .format('LT');
        resource.endTime = undefined;
        resource.daysToRunOn =
          cronArr[WEEKDAY] === '*'
            ? ['1', '2', '3', '4', '5', '6', '0']
            : cronArr[WEEKDAY].split(',');
      }

      return false;
    }
  };

  const classes = useStyles();

  setValues();

  if (resource && !resource.frequency) {
    resource.frequency = '';
  }

  // eslint-disable-next-line
const startTimeData = Array.apply(null, { length: 24 }).map(
    (a, b) =>
      moment()
        .startOf('day')
        .add(b, 'h')
        .add(resource.scheduleStartMinute || 0, 'm')
        .format('LT'),
    Number
  );
  const startTimeOptions = [];
  const endTimeOptions = [];

  startTimeData.forEach(opt => {
    startTimeOptions.push({ label: opt, value: opt });
  });
  resource.endTimeOptions.forEach(opt => {
    endTimeOptions.push({ label: opt, value: opt });
  });
  const fieldMeta = {
    fieldMap: {
      timeZone: {
        id: 'timeZone',
        name: 'timeZone',
        type: 'select',
        label: 'Time Zone',
        defaultValue:
          (resource && resource.timeZone) ||
          (integration && integration.timeZone) ||
          (preferences && preferences.timezone),
        options: [
          {
            items:
              (dateTimezones &&
                dateTimezones.map(date => ({
                  label: date.value,
                  value: date.name,
                }))) ||
              [],
          },
        ],
      },
      activeTab: {
        id: 'activeTab',
        name: 'activeTab',
        type: 'radiogroup',
        label: '',
        showOptionsHorizontally: true,
        fullWidth: true,
        defaultValue: resource.activeTab,
        options: [
          {
            items: [
              { label: 'Use Preset', value: PRESET_TAB },
              { label: 'Use Cron Expression', value: ADVANCED_TAB },
            ],
          },
        ],
      },
      frequency: {
        id: 'frequency',
        name: 'frequency',
        type: 'select',
        label: 'Frequency:',
        defaultValue: resource.frequency,
        options: [
          {
            items: [
              { label: 'Once Weekly', value: 'once_weekly' },
              { label: 'Once Daily', value: 'once_daily' },
              { label: 'Twice Daily', value: 'twice_daily' },
              { label: 'Every Eight Hours', value: 'every_eight_hours' },
              { label: 'Every Six Hours', value: 'every_six_hours' },
              { label: 'Every Four Hours', value: 'every_four_hours' },
              { label: 'Every Two Hours', value: 'every_two_hours' },
              { label: 'Every Hour', value: 'every_hour' },
              { label: 'Every 30 Minutes', value: 'every_half_hour' },
              { label: 'Every 15 Minutes', value: 'every_quarter' },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
        ],
      },
      startTime: {
        id: 'startTime',
        name: 'startTime',
        type: 'select',
        label: 'Start Time:',
        defaultValue: resource && resource.startTime,
        options: [
          {
            items: startTimeOptions,
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
          {
            field: 'frequency',
            isNot: [''],
          },
        ],
        description:
          'Please note that start time represents when your flow will get placed in the queue for processing. The actual run time for your flow may vary based on the current message load in your queue, or other flows that are ahead of your flow in the global integrator.io scheduler. Please note also that the list of available start times is subject to change over time to help maintain balance regarding the total number of flows that are starting at any specific time.',
      },
      endTime: {
        id: 'endTime',
        name: 'endTime',
        type: 'select',
        label: 'End Time:',
        defaultValue: resource && resource.endTime,
        options: [
          {
            items: endTimeOptions,
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
          {
            field: 'frequency',
            isNot: ['once_weekly', 'once_daily', ''],
          },
        ],
      },
      daysToRunOn: {
        id: 'daysToRunOn',
        name: 'daysToRunOn',
        type: 'multiselect',
        label: 'Days To Run On:',
        defaultValue: resource.daysToRunOn || [
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
              { value: '1', label: 'Monday' },
              { value: '2', label: 'Tuesday' },
              { value: '3', label: 'Wednesday' },
              { value: '4', label: 'Thursday' },
              { value: '5', label: 'Friday' },
              { value: '6', label: 'Saturday' },
              { value: '0', label: 'Sunday' },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
          {
            field: 'frequency',
            isNot: ['once_weekly', ''],
          },
        ],
      },
      dayToRunOn: {
        id: 'dayToRunOn',
        name: 'dayToRunOn',
        type: 'select',
        label: 'Day To Run On:',
        defaultValue: resource.dayToRunOn,
        options: [
          {
            items: [
              { value: '1', label: 'Monday' },
              { value: '2', label: 'Tuesday' },
              { value: '3', label: 'Wednesday' },
              { value: '4', label: 'Thursday' },
              { value: '5', label: 'Friday' },
              { value: '6', label: 'Saturday' },
              { value: '0', label: 'Sunday' },
            ],
          },
        ],
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [PRESET_TAB],
          },
          {
            field: 'frequency',
            is: ['once_weekly'],
          },
        ],
      },
      schedule: {
        id: 'schedule',
        name: 'schedule',
        type: 'text',
        label: 'Schedule:',
        defaultValue: resource.schedule,
        visibleWhenAll: [
          {
            field: 'activeTab',
            is: [ADVANCED_TAB],
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
  };

  return (
    <Dialog open maxWidth={false}>
      <IconButton
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <Close />
      </IconButton>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.modalContent}>
        <DynaForm
          fieldMeta={fieldMeta}
          // optionsHandler={fieldMeta.optionsHandler}
        >
          <DynaSubmit onClick={handleSubmit}>Save</DynaSubmit>
        </DynaForm>
      </DialogContent>
    </Dialog>
  );
}
