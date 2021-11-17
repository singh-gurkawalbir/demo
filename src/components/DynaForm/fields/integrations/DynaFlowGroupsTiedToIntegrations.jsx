import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import DynaSelect from '../DynaSelect';
import { useSelectorMemo } from '../../../../hooks';
import { emptyObject, UNASSIGNED_SECTION_ID } from '../../../../utils/constants';

export default function DynaFlowGroupsTiedToIntegrations(props) {
  const { formKey } = props;
  const integrationId = useSelector(state => selectors.formState(state, formKey)?.value?.integration);
  const { flowGroupings } = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId) || emptyObject;

  const options = useMemo(() => {
    const items = flowGroupings?.map(({name, _id}) => ({
      label: name,
      value: _id,
    })) || [];

    if (items.length > 0) {
      items.push({
        label: 'Unassigned',
        value: UNASSIGNED_SECTION_ID,
      });
    }

    return [{ items }];
  }, [flowGroupings]);

  if (!flowGroupings?.length) return null;

  return (
    <DynaSelect {...props} options={options} />
  );
}
