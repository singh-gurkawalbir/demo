import makeStyles from '@mui/styles/makeStyles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import React, { useEffect, useMemo, useReducer } from 'react';
import components from './Components';
import cronBuilderReducer, { isActiveSubTabId, cronExpr} from './stateReducer';
import meta from './meta';
import actionTypes from './actionTypes';

const isEveryNUnit = val => val?.includes('*') || val?.includes('/');

const isEveryUnit = val => val?.includes('*') && !(val?.includes('/'));
const updateOffset = (options, scheduleStartMinuteOffset) => options[0].items.reduce((acc, curr) => {
  const intVal = parseInt(curr.value, 10) + scheduleStartMinuteOffset;
  const offSettedVal = intVal.toString();
  const updatedOption = {
    label: offSettedVal,
    value: offSettedVal,
  };

  acc[0].items.push(updatedOption);

  return acc;
}, [{items: []}]);
const SelectedField = props => {
  const {field, value, setCronBuilderState, scheduleStartMinuteOffset} = props;

  if (!field) return null;
  const metaProps = meta.fieldMap[field];

  const {type, options} = metaProps;

  const Component = components[type];
  const onFieldChange = value => {
    setCronBuilderState({type: actionTypes.SET_VALUE, value});
  };

  let updatedOptions = options;

  if (field === 'everySelectedMinute') {
    updatedOptions = updateOffset(options, scheduleStartMinuteOffset);
  }

  return (
    <Component
      onFieldChange={onFieldChange}
      value={value}
      {...metaProps}
      options={updatedOptions} />
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '305px',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const tabProps = {
  variant: 'scrollable',
  indicatorColor: 'primary',
  textColor: 'primary',
  scrollButtons: 'auto',
};
export default function CronBuilder(props) {
  const classes = useStyles();
  const parentTabs = meta.layout.containers;

  const {value, onChange, scheduleStartMinuteOffset} = props;
  const splitVal = useMemo(() => value && value.split(' '), [value]);

  const [cronBuilderState, setCronBuilderState] = useReducer(cronBuilderReducer, {
    activeTab: 'Minute',
    touched: false,
    childTabState: {
      Minute: {
        everyNMinutes: {
          value: splitVal[1] || '*/5',
          active: !value || isEveryNUnit(splitVal[1]),
        },
        everySelectedMinute: {
          value: splitVal[1],
          active: !isEveryNUnit(splitVal[1]),
        },
      },
      Hour: {
        everyHour: {
          value: splitVal[2],
          active: isEveryUnit(splitVal[2]),
        },
        everyNHours: {
          value: splitVal[2],
          active: !isEveryUnit(splitVal[2]) && isEveryNUnit(splitVal[2]),
        },
        eachSelectedHour: {
          value: splitVal[2],
          active: !isEveryUnit(splitVal[2]) && !isEveryNUnit(splitVal[2]),
        },
      },
      'Day of month': {
        everyDay: {
          value: splitVal[3],
          active: isEveryUnit(splitVal[3]),
        },
        eachDay: {
          value: splitVal[3],
          active: !isEveryUnit(splitVal[3]),
        },
      },
      Month: {
        everyMonth: {
          value: splitVal[4],
          active: isEveryUnit(splitVal[4]),
        },
        eachMonth: {
          value: splitVal[4],
          active: !isEveryUnit(splitVal[4]),
        },
      },
      'Day of week': {
        everyWeek: {
          value: splitVal[5],
          active: isEveryUnit(splitVal[5]),
        },
        eachWeek: {
          value: splitVal[5],
          active: !isEveryUnit(splitVal[5]),
        },
      },
    },
  });
  const {activeTab, touched, childTabState} = cronBuilderState;
  const subTabContainers = parentTabs.find(({label}) => label === activeTab).containers;
  const activeSubTabIndex = isActiveSubTabId(childTabState[activeTab]);
  const activeFieldValue = childTabState[activeTab][activeSubTabIndex]?.value;

  const finalRes = cronExpr(childTabState);

  useEffect(() => {
    if (touched) { onChange(finalRes); }
  }, [finalRes, onChange, touched]);

  return (
    <div className={classes.root}>
      <Tabs
        value={activeTab}
        {...tabProps}
        onChange={(evt, value) => {
          setCronBuilderState({type: actionTypes.SET_PARENT_TAB, value});
        }}
    >

        {parentTabs.map(({label}) => (
          <Tab
            key={label}
            value={label}
            label={label} />
        ))}
      </Tabs>

      <Tabs
        {...tabProps}
        value={activeSubTabIndex}
        onChange={(evt, value) => {
          setCronBuilderState({type: actionTypes.SET_CHILD_TAB, value});
        }}
      >
        {subTabContainers.map(({label, fields}) => (
          <Tab
            key={label}
            value={fields[0]}
            label={label} />
        ))}
      </Tabs>

      <SelectedField
        setCronBuilderState={setCronBuilderState}
        value={activeFieldValue}
        field={activeSubTabIndex}
        scheduleStartMinuteOffset={scheduleStartMinuteOffset}
      />
    </div>
  );
}

