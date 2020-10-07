import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { getFormattedPreviewData } from '../../../utils/exportPanel';
import ClipBoardPanel from './clipBoardPanel';
import JsonContent from '../../JsonContent';

const useStyles = makeStyles(theme => ({
  sampleDataWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  sampleDataWrapperAlign: {
    marginTop: -18,
  },
  sampleDataContainer: {
    minHeight: theme.spacing(20),
    position: 'relative',
    backgroundColor: 'white',
    maxHeight: 400,
    overflow: 'auto',
    maxWidth: 680,
    color: theme.palette.text.primary,
  },
  sampleDataContainerAlign: {
    marginTop: theme.spacing(2),
  },
}));

export default function DefaultPanel(props) {
  const { previewStageDataList, panelType } = props;
  const classes = useStyles();
  const panelContent = useMemo(() => getFormattedPreviewData(
    previewStageDataList[panelType]
  ), [panelType, previewStageDataList]);

  return (
    <div
      className={clsx(
        classes.sampleDataWrapper,
        classes.sampleDataWrapperAlign
      )}>
      <div
        className={clsx(
          classes.sampleDataContainer,
          classes.sampleDataContainerAlign
        )}>
        <JsonContent json={panelContent} />
      </div>
      <ClipBoardPanel content={panelContent} />
    </div>
  );
}
