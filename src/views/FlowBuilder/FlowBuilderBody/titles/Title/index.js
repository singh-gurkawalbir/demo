import clsx from 'clsx';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import TitleTypography from '../../../TitleTypography';
import AddButton from '../AddButton';
import { selectors } from '../../../../../reducers';
import { useFlowContext } from '../../Context';

const useStyles = makeStyles(theme => ({
  titlePosition: {
    position: 'absolute',
    zIndex: 5,
    padding: theme.spacing(4, 2, 3),
  },
  content: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));

export default function Title({onClick, children, className, type, sx}) {
  const classes = useStyles();
  const { flow, flowId } = useFlowContext();
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, flow._integrationId, flowId));
  const showAddPageProcessor = useSelector(state => selectors.shouldShowAddPageProcessor(state, flowId));
  const isDataLoaderFlow = useSelector(state => selectors.isDataLoaderFlow(state, flowId));
  const isReadOnly = !!flow._connectorId || isViewMode;

  const showAddIcon = type === 'generator' ? (!isReadOnly && !isDataLoaderFlow) : (!isReadOnly && showAddPageProcessor);

  return (
    <TitleTypography className={clsx(classes.titlePosition, className)} sx={sx}>
      <div className={classes.content}>
        {children}
        {showAddIcon && <AddButton onClick={onClick} type={type} />}
      </div>
    </TitleTypography>
  );
}
