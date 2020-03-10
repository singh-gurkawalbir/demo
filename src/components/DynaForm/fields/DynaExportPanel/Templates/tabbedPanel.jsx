import { useState, useMemo } from 'react';
import clsx from 'clsx';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import ClipBoardPanel from './clipBoardPanel';
import { getBodyHeaderFieldsForPreviewData } from '../../../../../utils/exportPanel';

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
    color: theme.palette.text.hint,
  },
  sampleDataContainerAlign: {
    marginTop: theme.spacing(2),
  },
}));

export default function TabbedPanel(props) {
  const { previewStageDataList, panelType } = props;
  const classes = useStyles();
  const [tabValue, setTabValue] = useState('body');

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  const { body, header } = getBodyHeaderFieldsForPreviewData(
    previewStageDataList[panelType],
    panelType
  );
  const tabContent = useMemo(() => (tabValue === 'body' ? body : header), [
    body,
    header,
    tabValue,
  ]);

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
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            label="Body"
            value="body"
            id="tab-body"
            aria-controls="tab-body"
          />
          <Tab
            label="Header"
            value="header"
            id="tab-header"
            aria-controls="tab-header"
          />
          )
        </Tabs>
        <div>
          <pre>{tabContent}</pre>
        </div>
      </div>
      <ClipBoardPanel text={tabValue === 'body' ? body : header} />
    </div>
  );
}
