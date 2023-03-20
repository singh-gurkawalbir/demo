import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
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

const options = [{_id: 'all', name: 'All fields'}, {_id: 'required', name: 'Required fields'}, {_id: 'mapped', name: 'Mapped fields'}];

export default function Mapper2Filter() {
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
    values => dispatch(actions.mapping.v2.updateFilter(values)),
    [dispatch],
  );
  const selected = filterOptions?.length ? filterOptions : ['all'];

  return (
    <div className={clsx(classes.wrapperSelectFilter, !selected.includes('all') && classes.circle)} >
      <MultiSelectFilter
        Icon={FilterIconWrapper}
        items={options}
        selected={selected}
        onSave={onSaveHandler}
        onSelect={handleSelect}
        />
    </div>
  );
}
