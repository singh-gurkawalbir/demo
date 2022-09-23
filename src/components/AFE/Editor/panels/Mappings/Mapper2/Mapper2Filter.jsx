import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import MultiSelectFilter from '../../../../../MultiSelectFilter';
import FilterIconWrapper from '../../../../../ResourceTable/commonCells/FilterIconWrapper';

const useStyles = makeStyles(theme => ({
  wrapperSelectFilter: {
    display: 'flex',
    alignItems: 'flex-start',
    whiteSpace: 'nowrap',
  },
  circle: {
    position: 'relative',
    '& .MuiButtonBase-root': {
      '&:before': {
        content: '""',
        height: theme.spacing(1),
        width: theme.spacing(1),
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'block',
        zIndex: 1,
      },
    },
  },
}));

const emptyArr = [];

export default function Mapper2Filter({
  options = emptyArr,
  handleSave,
  className,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterOptions = useSelector(selectors.mapper2Filter);

  const handleSelect = useCallback((selectedIds, id) => {
    if (id === 'all') {
      if (selectedIds.includes(id)) return [];

      return [id];
    }

    if (selectedIds.includes(id)) {
      const filteredIds = selectedIds.filter(i => i !== id);

      return filteredIds.length ? filteredIds : ['all'];
    }
    if (selectedIds.includes('all')) return [id];

    return [...selectedIds, id];
  }, []);
  const onSaveHandler = useCallback(
    values => {
      dispatch(actions.mapping.v2.updateFilter(values));
      handleSave?.();
    },
    [dispatch, handleSave],
  );
  const selected = filterOptions?.length ? filterOptions : ['all'];

  const FilterIcon = () => <FilterIconWrapper />;

  return (
    <div className={clsx(classes.wrapperSelectFilter, className, !selected.includes('all') && classes.circle)} >
      <MultiSelectFilter
        Icon={FilterIcon}
        items={options}
        selected={selected}
        onSave={onSaveHandler}
        onSelect={handleSelect}
        />
    </div>
  );
}
