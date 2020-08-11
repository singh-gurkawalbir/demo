import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import CeligoTable from '../../../CeligoTable';
import InfoIconButton from '../../../InfoIconButton';
import Spinner from '../../../Spinner';
import SpinnerWrapper from '../../../SpinnerWrapper';

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
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>

    );
  }


  return <CeligoTable data={data} columns={columns} />;
}
