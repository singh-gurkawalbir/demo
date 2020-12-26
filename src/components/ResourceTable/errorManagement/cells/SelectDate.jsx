import React, { useCallback, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { addDays, startOfDay } from 'date-fns';
import FilterIcon from '../../../icons/FilterIcon';
// import actions from '../../../../actions';
// import { selectors } from '../../../../reducers';
// import ActionButton from '../../../ActionButton';
// import { getSelectedRange } from '../../../../utils/flowMetrics';
import DateRangeSelector from '../../../DateRangeSelector';

const defaultRange = {
  startDate: startOfDay(addDays(new Date(), -29)).toISOString(),
  endDate: new Date().toISOString(),
  preset: 'last30days',
};

const useStyles = makeStyles(theme => ({
  filterSelected: {
    color: theme.palette.primary.main,
  },
}));
// eslint-disable-next-line no-empty-pattern
export default function SelectAllErrors({
  // flowId,
  // resourceId,
  // isResolved,
  // filterKey,
  // defaultFilter,
  // actionInProgress,
  title = 'Timestamp',
}) {
  // const dispatch = useDispatch();
  const classes = useStyles();
  const [selected, setSelected] = useState(false);
  const handleDateFilter = useCallback(
    () => {
      // console.log(dateFilter);
      setSelected(true);
    },
    [],
  );

  const Filter = () => <FilterIcon className={clsx({[classes.filterSelected]: selected})} />;

  return (
    <div> {title}
      <DateRangeSelector
        onSave={handleDateFilter}
        Icon={Filter}
        value={{
          startDate: new Date(defaultRange.startDate),
          endDate: new Date(defaultRange.endDate),
          preset: defaultRange.preset,
        }} />
    </div>
  );
}
