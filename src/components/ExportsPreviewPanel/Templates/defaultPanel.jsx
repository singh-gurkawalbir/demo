import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { getFormattedPreviewData } from '../../../utils/exportPanel';
import ClipBoardPanel from './clipBoardPanel';
import CodeEditor from '../../CodeEditor';
// import JsonContent from '../../JsonContent';

const useStyles = makeStyles(theme => ({
  sampleDataWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: -18,
  },
  sampleDataContainer: {
    marginTop: theme.spacing(2),
    minHeight: theme.spacing(20),
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    // height: 345,
    overflow: 'auto',
    // maxWidth: 680,
    color: theme.palette.text.primary,
    '& > div': {
      wordBreak: 'break-word',
    },
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
      className={classes.sampleDataWrapper}>
      <div
        className={classes.sampleDataContainer}>
        {/* <JsonContent json={panelContent} /> */}
        <CodeEditor
          value={panelContent}
          mode="json"
          readOnly
          showGutter={false}
            />
      </div>
      <ClipBoardPanel content={panelContent} />
    </div>
  );
}
