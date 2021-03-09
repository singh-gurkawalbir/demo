import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import ErrorFilterIcon from '../ErrorFilterIcon';
import { selectors } from '../../../../reducers';
import MultiSelectFilter from '../../../MultiSelectFilter';

export default function SourceFilter(props) {
  const { onSave, selectedSources = [], resourceId } = props;
  const sourceOptions = useSelector(state =>
    selectors.sourceOptions(state, resourceId)
  );

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

  const selected = selectedSources?.length ? selectedSources : ['all'];

  const FilterIcon = () => <ErrorFilterIcon selected={!selected.includes('all')} />;

  return (
    <MultiSelectFilter
      Icon={FilterIcon}
      items={sourceOptions}
      selected={selected}
      onSave={onSave}
      onSelect={handleSelect}
    />
  );
}
