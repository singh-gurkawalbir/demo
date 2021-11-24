import React, { useMemo } from 'react';
import { selectors } from '../../../../reducers';
import DynaSelect from '../DynaSelect';
import { useSelectorMemo } from '../../../../hooks';
import useFormContext from '../../../Form/FormContext';
import { emptyObject, UNASSIGNED_SECTION_ID, UNASSIGNED_SECTION_NAME } from '../../../../utils/constants';

export default function DynaFlowGroupsTiedToIntegrations(props) {
  const { formKey } = props;
  const integrationId = useFormContext(formKey).value?.integration;
  const { flowGroupings } = useSelectorMemo(selectors.makeResourceSelector, 'integrations', integrationId) || emptyObject;

  const options = useMemo(() => {
    const items = flowGroupings?.map(({name, _id}) => ({
      label: name,
      value: _id,
    })) || [];

    if (items.length) {
      items.push({
        label: UNASSIGNED_SECTION_NAME,
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
