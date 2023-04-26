import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import DynaPreviewComponentsTable from '../../../DynaForm/fields/DynaPreviewComponentsTable';
import { emptyObject } from '../../../../constants';

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
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
  },
  flowGroupTitle: {
    paddingTop: theme.spacing(1),
  },
  emptyMessageContent: {
    whiteSpace: 'nowrap',
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

      return clsx({[classes.flowInFlowGroupName]: !isLastFlowInFlowGroup, [classes.flowInFlowGroupNameHover]: groupName});
    },
    Value: ({rowData: r}) => {
      const classes = useStyles();

      if (r.groupName || r.emptyMessage) {
        return (
          <Typography
            variant={r?.groupName ? 'overline' : 'body2'}
            component="div"
            color="textSecondary"
            className={clsx({
              [classes.flowGroupTitle]: r?.groupName,
              [classes.emptyMessageContent]: r?.emptyMessage})}>
            {r?.groupName || r?.emptyMessage}
          </Typography>
        );
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

      return clsx({[classes.flowInFlowGroupName]: !isLastFlowInFlowGroup, [classes.flowInFlowGroupNameHover]: groupName});
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
        <Spinner center="screen" />
      </div>
    );
  }

  return <DynaPreviewComponentsTable data={data} useColumns={useColumns} />;
}

