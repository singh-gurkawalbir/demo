import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import FilterIconWrapper from '../FilterIconWrapper';
import { selectors } from '../../../../reducers';
import MultiSelectFilter from '../../../MultiSelectFilter';
import actions from '../../../../actions';
import Help from '../../../Help';

const useStyles = makeStyles({
  wrapperSelectFilter: {
    display: 'flex',
    alignItems: 'center',
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
  helpKey,
  SelectedLabelImp,
  ButtonLabel,
  className,
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

      const optionsIncludeAll = options.some(o => o._id === 'all');

      const filteredIds = selectedIds.filter(i => i !== id);

      return (filteredIds.length || !optionsIncludeAll) ? filteredIds : ['all'];
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
    <div className={clsx(className, classes.wrapperSelectFilter)} > {title}
      <MultiSelectFilter
        Icon={FilterIcon}
        ButtonLabel={ButtonLabel}
        items={options}
        selected={selected}
        onSave={onSaveHandler}
        onSelect={handleSelect}
        SelectedLabelImp={SelectedLabelImp}
        />
      {helpKey && (
        <Help
          title={title}
          helpKey={helpKey}
          fieldPath={helpKey}
          disablePortal={false}
          placement="left-end" />
      )}
    </div>
  );
}
