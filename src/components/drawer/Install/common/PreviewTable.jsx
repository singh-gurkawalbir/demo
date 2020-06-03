import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import CeligoTable from '../../../CeligoTable';
import Spinner from '../../../Spinner';

const columns = [
  {
    heading: 'Name',
    value: r => r.doc.name,
    orderBy: 'name',
  },
  { heading: 'Type', value: r => r.model },
  { heading: 'Description', value: r => r.doc.description },
];

export default function PreviewTable({ templateId }) {
  const components = useSelector(state =>
    selectors.previewTemplate(state, templateId)
  );
  const data = useMemo(() => {
    const { objects } = components;

    if (!objects || !objects.length) return [];

    return objects.map((obj, index) => ({
      ...obj,
      _id: index,
    }));
  }, [components]);

  if (!data.length) {
    return (
      <div>
        <Typography variant="h4">Loading preview...</Typography>
        <Spinner />
      </div>
    );
  }

  return <CeligoTable data={data} columns={columns} />;
}
