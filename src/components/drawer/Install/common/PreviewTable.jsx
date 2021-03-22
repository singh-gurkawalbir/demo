import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import DynaPreviewComponentsTable from '../../../DynaForm/fields/DynaPreviewComponentsTable';
import Spinner from '../../../Spinner';

const columns = [
  {
    heading: 'Name',
    value: r => r?.doc?.name || r?.doc?._id,
  },
  { heading: 'Description', value: r => r.doc?.description },
];

export default function PreviewTable({ templateId }) {
  const {components, status} = useSelector(state =>
    selectors.previewTemplate(state, templateId)
  ) || {};
  const data = useMemo(() => {
    const { objects } = components || {};

    if (!objects || !objects.length) return [];

    return objects.map((obj, index) => ({
      ...obj,
      _id: index,
    }));
  }, [components]);

  if (status === 'failure') {
    return null;
  }
  if (status === 'requested') {
    return (
      <Spinner centerAll />
    );
  }

  return <DynaPreviewComponentsTable data={data} columns={columns} />;
}
