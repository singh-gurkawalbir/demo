import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import CeligoTable from '../../../CeligoTable';
import Spinner from '../../../Spinner';
import InfoIconButton from '../../../InfoIconButton';
const columns = [
  {
    heading: 'Name',
    value: function NameWithInfoicon(r) {
      return (
        <>
          {r && r.doc.name}
          <InfoIconButton info={r.doc.description} size="xs" />
        </>
      );
    },
    orderBy: 'name',
  },
  { heading: 'Type', value: r => r.model },
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
