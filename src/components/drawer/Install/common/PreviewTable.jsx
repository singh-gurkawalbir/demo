import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import DynaPreviewComponentsTable from '../../../DynaForm/fields/DynaPreviewComponentsTable';
import Spinner from '../../../Spinner';

const useStyles = makeStyles({
  spinnerPreview: {
    position: 'relative',
    height: '100%',
  },
});
const useColumns = () => [
  {
    key: 'name',
    heading: 'Name',
    Value: ({rowData: r}) => r?.doc?.name || r?.doc?._id,
    width: '50%',
  },
  {
    key: 'description',
    heading: 'Description',
    Value: ({rowData: r}) => r.doc?.description },
];

export default function PreviewTable({ templateId }) {
  const classes = useStyles();
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
      <div className={classes.spinnerPreview}>
        <Spinner centerAll />
      </div>
    );
  }

  return <DynaPreviewComponentsTable data={data} useColumns={useColumns} />;
}
