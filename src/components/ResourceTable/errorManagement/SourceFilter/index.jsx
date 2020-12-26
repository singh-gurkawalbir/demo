import React, { useCallback, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import FilterIcon from '../../../icons/FilterIcon';
// import actions from '../../../../actions';
// import { selectors } from '../../../../reducers';
// import ActionButton from '../../../ActionButton';
import MultiSelectFilter from '../../../MultiSelectFilter';
import { getSourceOptions } from '../../../../utils/errorManagement';

export default function SourceFilter(props) {
  const { onSave } = props;

  const values = useMemo(() => getSourceOptions(), []);

  const handleSelect = useCallback((selectedIds, id) => {
    if (id === 'all') {
      if (selectedIds.includes(id)) return [];

      return [id];
    }
    if (selectedIds.includes(id)) {
      return selectedIds.filter(i => i !== id);
    }

    if (selectedIds.includes('all')) return selectedIds;

    return [...selectedIds, id];
  }, []);
  const selected = ['all'];

  return (
    <MultiSelectFilter
      Icon={FilterIcon}
      items={values}
      selected={selected}
      onSave={onSave}
      onSelect={handleSelect}
    />
  );
}
