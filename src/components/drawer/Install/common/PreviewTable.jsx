import React, { useMemo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { selectors } from '../../../../reducers';
import DynaPreviewComponentsTable from '../../../DynaForm/fields/DynaPreviewComponentsTable';
import Spinner from '../../../Spinner';

const useStyles = makeStyles(theme => ({
  spinnerPreview: {
    position: 'relative',
    height: '100%',
  },
  flowGroupTitle: {
    textTransform: 'uppercase',
    paddingTop: theme.spacing(1),
  },
  firstFlowName: {
    marginTop: theme.spacing(1),
  },
  flowGroupDescription: {
    marginTop: theme.spacing(3),
  },
  flowInFlowGroupName: {
    border: 'none',
  },
  flowInFlowGroupNameHover: {
    backgroundColor: theme.palette.background.paper,
  },
}));
const useColumns = () => [
  {
    key: 'name',
    heading: 'Name',
    width: '40%',
    GetClassName: ({rowData: r}) => {
      const classes = useStyles();

      return clsx(!r?.isLastFlowInFlowGroup ? classes.flowInFlowGroupName : '', r?.groupName ? classes.flowInFlowGroupNameHover : '');
    },
    Value: ({rowData: r}) => {
      const classes = useStyles();

      if (r?.groupName) {
        return <Typography variant="overline" component="div" color="textSecondary" className={classes.flowGroupTitle}>{r?.groupName}</Typography>;
      }

      return r?.doc?.name || r?.doc?._id;
    },
  },
  {
    key: 'description',
    heading: 'Description',
    width: '60%',
    GetClassName: ({rowData: r}) => {
      const classes = useStyles();

      return clsx(!r?.isLastFlowInFlowGroup ? classes.flowInFlowGroupName : '', r?.groupName ? classes.flowInFlowGroupNameHover : '');
    },
    Value: ({rowData: r}) => r?.doc?.description,
  },
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
