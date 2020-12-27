import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ErrorFilterIcon from '../ErrorFilterIcon';
// import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import MultiSelectFilter from '../../../MultiSelectFilter';
import { getSourceOptions } from '../../../../utils/errorManagement';

export default function SourceFilter(props) {
  const { onSave, selectedSources = [] } = props;
  const sourceList = useSelector(state =>
    selectors.getSourceMetadata(state)
  );
  const values = useMemo(() => getSourceOptions(sourceList), [sourceList]);

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

  const selected = selectedSources?.length ? selectedSources : ['all'];

  const FilterIcon = () => <ErrorFilterIcon selected={!selected.includes('all')} />;

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
