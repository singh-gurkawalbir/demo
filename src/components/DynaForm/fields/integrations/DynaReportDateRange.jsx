
import { Typography } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { selectors } from '../../../../reducers';
import { getSelectedRange } from '../../../../utils/flowMetrics';
import DateRangeSelector from '../../../DateRangeSelector';
import DynaDateTime from '../dateTime/DynaDateTime';

const defaultPresets = [
  {id: 'lastmin', label: 'Last minute'},
  {id: 'last5min', label: 'Last 5 minutes'},
  {id: 'last15minutes', label: 'Last 15 minutes'},
  {id: 'last30minutes', label: 'Last 30 minutes'},
  {id: 'last1hour', label: 'Last hour'},
  {id: 'last6hours', label: 'Last 6 hours'},
  {id: 'last12hours', label: 'Last 12 hours '},
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'custom', label: 'Custom'},
];

function CustomTextFields({selectedRange, setSelectedRange}) {
  const {startDate, preset, endDate} = selectedRange;

  if (preset !== 'custom') { return null; }
  const onFieldChange = key => (id, value) => {
    setSelectedRange(state => {
      const stateCopy = {...state};

      stateCopy[key] = moment(value);

      return stateCopy;
    });
  };

  return (
    <>
      <div>
        <DynaDateTime
          onFieldChange={onFieldChange('startDate')}
          value={startDate} skipTimezoneConversion label="Start date" />
      </div>
      <div>
        <DynaDateTime
          onFieldChange={onFieldChange('endDate')}
          value={endDate} skipTimezoneConversion label="End date" />
      </div>
      <Typography> You can generate a Report for upto 3 days of Data</Typography>
    </>

  );
}

export default function DynaReportDateRange(props) {
  const {id, onFieldChange, value} = props;
  const ranges = defaultPresets.map(({id, ...rest}) => ({...rest, id, ...getSelectedRange({preset: id})}));
  const timezone = useSelector(state => selectors.userTimezone(state));

  const onSave = useCallback(selectedRange => {
    const {startDate, endDate, preset } = selectedRange;

    if (preset !== 'custom') {
      onFieldChange(id, {
        startDate: startDate.toISOString(),
        preset,
        timezone,
        endDate: endDate.toISOString() });
    }
    const {startDate: presetStartDate, endDate: presetEndDate} = getSelectedRange(preset);

    return onFieldChange(id, {startDate: presetStartDate.toISOString(),
      timezone,
      preset,
      endDate: presetEndDate.toISOString()});
  }, [id, onFieldChange, timezone]);

  const selectedRangeConstrain = (startDate, endDate) => {
    if (!endDate || !startDate) return true;
    const diffDays = moment(endDate).diff(moment(startDate), 'days');

    return diffDays <= 3;
  };

  return (
    <DateRangeSelector
      {...props}
      customPresets={ranges}
      editableDateInputs={false}
      defaultPreset={value || {preset: 'last24hours'}}
      selectedRangeConstrain={selectedRangeConstrain}
      onSave={onSave}
      // CustomTextFields={CustomTextFields}

      />
  );
}

