import React, { useMemo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { selectors } from '../../../../reducers';
import DynaPreviewComponentsTable from '../../../DynaForm/fields/DynaPreviewComponentsTable';
import Spinner from '../../../Spinner';
import { emptyObject } from '../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  spinnerPreview: {
    position: 'relative',
    height: '100%',
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
    borderTop: `1px solid ${theme.palette.secondary.lightest} !important`,
  },
}));
const useColumns = () => [
  {
    key: 'name',
    heading: 'Name',
    width: '40%',
    isLoggable: true,
    useGetCellStyling: ({rowData: r}) => {
      const classes = useStyles();
      const { groupName, isLastFlowInFlowGroup } = r || emptyObject;
      const classFlowInFlowGroupName = !isLastFlowInFlowGroup ? classes.flowInFlowGroupName : '';
      const classFlowInFlowGroupNameHover = groupName ? classes.flowInFlowGroupNameHover : '';

      return clsx(classFlowInFlowGroupName, classFlowInFlowGroupNameHover);
    },
    Value: ({rowData: r}) => {
      if (r?.groupName) {
        return <Typography variant="overline" component="div" color="textSecondary">{r?.groupName}</Typography>;
      }

      return r?.doc?.name || r?.doc?._id;
    },
  },
  {
    key: 'description',
    heading: 'Description',
    width: '60%',
    isLoggable: true,
    useGetCellStyling: ({rowData: r}) => {
      const classes = useStyles();
      const { groupName, isLastFlowInFlowGroup } = r || emptyObject;
      const classFlowInFlowGroupName = !isLastFlowInFlowGroup ? classes.flowInFlowGroupName : '';
      const classFlowInFlowGroupNameHover = groupName ? classes.flowInFlowGroupNameHover : '';

      return clsx(classFlowInFlowGroupName, classFlowInFlowGroupNameHover);
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

