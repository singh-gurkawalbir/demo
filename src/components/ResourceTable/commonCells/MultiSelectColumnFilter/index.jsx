import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import FilterIconWrapper from '../FilterIconWrapper';
import { selectors } from '../../../../reducers';
import MultiSelectFilter from '../../../MultiSelectFilter';
import actions from '../../../../actions';
import Help from '../../../Help';

const useStyles = makeStyles({
  wrapperSelectFilter: {
    display: 'flex',
    alignItems: 'flex-start',
    whiteSpace: 'nowrap',
  },
  helpIcon: {
    padding: 0,
  },
});
const emptyArr = [];

export default function MultiSelectColumnFilter({
  title = 'Source',
  filterKey,
  filterBy = 'sources',
  options = emptyArr,
  handleSave,
  helpKey,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filterOptions = useSelector(state => selectors.filter(state, filterKey));

  const handleSelect = useCallback((selectedIds, id) => {
    if (id === 'all') {
      if (selectedIds.includes(id)) return [];

      return [id];
    }
    const resource = options.find(o => o._id === id);
    const childIds = [];

    if (resource?.children) {
      resource.children.forEach(c => {
        childIds.push(c._id);
      });
    }
    if (selectedIds.includes(id)) {
      if (childIds?.length) {
        return selectedIds.filter(i => i !== id && !childIds.includes(i));
      }

      return selectedIds.filter(i => i !== id);
    }

    if (selectedIds.includes('all')) {
      if (childIds?.length) {
        return [id, ...childIds];
      }

      return [id];
    }
    if (childIds?.length) {
      return [...selectedIds, id, ...childIds];
    }

    return [...selectedIds, id];
  }, [options]);
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
      {helpKey && (
        <Help
          title={title}
          helpKey={helpKey}
          caption={helpKey}
          className={classes.helpIcon}
        />
      )}
    </div>
  );
}
