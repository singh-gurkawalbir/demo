import React, { useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import FilterIconWrapper from '../FilterIconWrapper';
import { selectors } from '../../../../reducers';
import MultiSelectFilter from '../../../MultiSelectFilter';
import actions from '../../../../actions';

const useStyles = makeStyles({
  wrapperSelectFilter: {
    display: 'flex',
    alignItems: 'flex-start',
    whiteSpace: 'nowrap',
  },
});
const emptyArr = [];

export default function MultiSelectColumnFilter({
  title = 'Source',
  filterKey,
  filterBy = 'sources',
  options = emptyArr,
  handleSave,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterOptions = useSelector(state => selectors.filter(state, filterKey), shallowEqual);

  const handleSelect = useCallback((selectedIds, id) => {
    if (id === 'all') {
      if (selectedIds.includes(id)) return [];

      return [id];
    }
    if (selectedIds.includes(id)) {
      return selectedIds.filter(i => i !== id);
    }

    if (selectedIds.includes('all')) return [id];

    return [...selectedIds, id];
  }, []);
  const onSaveHandler = useCallback(
    values => {
      dispatch(actions.patchFilter(filterKey, {
        [filterBy]: values,
        paging: {
          ...filterOptions.paging,
          currPage: 0,
        },
      }));
      handleSave?.();
    },
    [dispatch, filterBy, filterKey, filterOptions.paging, handleSave],
  );
  const selected = filterOptions[filterBy]?.length ? filterOptions[filterBy] : ['all'];

  const FilterIcon = () => <FilterIconWrapper selected={!selected.includes('all')} />;

  return (
    // TODO:(Azhar) try to use the container wrapper component where same CSS needed
    <div className={classes.wrapperSelectFilter}> {title}
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
