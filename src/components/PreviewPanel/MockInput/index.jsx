/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { FilledButton } from '../../Buttons';
import CodePanel from '../../AFE/Editor/panels/Code';
import { unwrapExportFileSampleData, wrapExportFileSampleData } from '../../../utils/sampleData';
import Spinner from '../../Spinner';
import { safeParse } from '../../../utils/string';
import FieldMessage from '../../DynaForm/fields/FieldMessage';
import PanelTitle from '../../AFE/Editor/gridItems/PanelTitle';
import { drawerPaths } from '../../../utils/rightDrawer';
import { sampleDataStage } from '../../../utils/flowData';

const useStyles = makeStyles(theme => ({
  editMockContentWrapper: {
    paddingBottom: 0,
  },
  editMockPanelWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  editMockCodeWrapper: {
    overflow: 'auto',
    height: `calc(100vh - ${theme.spacing(32)}px)`,
  },
}));

function RouterWrappedContent(props) {
  const { handleClose, resourceId, flowId, resourceType} = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const resourceSampleDataStatus = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'preview').status,
  );
  const resourceMockData = useSelector(state => selectors.getResourceMockData(state, resourceId));
  const {status: sampleDataStatus, data: sampleData} = useSelector(state => selectors.getSampleDataContext(state, {
    flowId,
    resourceId,
    resourceType,
    stage: sampleDataStage.imports.processedFlowInput,
  }));

  const [value, setValue] = useState(resourceMockData ? wrapExportFileSampleData(resourceMockData) : '');

  useEffect(() => {
    if (sampleDataStatus === 'received' && !resourceMockData) {
      setValue(wrapExportFileSampleData(Array.isArray(sampleData) ? [sampleData] : sampleData));
    }
  }, [resourceMockData, resourceSampleDataStatus, sampleData, sampleDataStatus]);

  const handleChange = newValue => {
    setValue(newValue);
    const parsedMockData = safeParse(newValue);
    const unwrappedMockData = unwrapExportFileSampleData(parsedMockData);

    if (!parsedMockData || !unwrappedMockData) {
      // throw error for invalid json and data not being in the connonical format
      if (!parsedMockData) {
        setError('Mock input must be valid JSON');
      } else {
        setError('Mock input must contain page_of_records');
      }

      return;
    }
    setError(undefined);
  };

  const handleDone = useCallback(() => {
    const parsedMockData = safeParse(value);
    const unwrappedMockData = unwrapExportFileSampleData(parsedMockData);

    dispatch(actions.resourceFormSampleData.setMockData(resourceId, unwrappedMockData));
    handleClose();
  }, [dispatch, handleClose, resourceId, value]);

  return (
    <>
      <DrawerHeader title="Edit mock input" helpKey="import.editMockInput" hideBackButton />
      <DrawerContent className={classes.editMockContentWrapper} >
        {sampleDataStatus === 'requested' && (
        <Spinner centerAll />
        )}
        { resourceSampleDataStatus !== 'requested' && (
          <div className={classes.editMockPanelWrapper}>
            <PanelTitle title="Input" />
            <Paper elevation={0} className={classes.editMockCodeWrapper}>
              <CodePanel
                name="data"
                mode="json"
                value={value}
                onChange={handleChange} />
            </Paper>
          </div>
        )}
        <FieldMessage errorMessages={error} />
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="saveandcloseinputdata"
          onClick={handleDone}
          disabled={!!error}>
          Done
        </FilledButton>
      </DrawerFooter>
    </>
  );
}

export default function MockInput({formKey, resourceId, resourceType, flowId}) {
  const history = useHistory();
  const match = useRouteMatch();

  const handleClose = useCallback(() => {
    if (history.length > 2) {
      history.goBack();
    } else {
      history.replace(match.url);
    }
  }, [history, match.url]);

  return (
    <RightDrawer
      path={drawerPaths.PREVIEW_PANEL_MOCK_INPUT}
      height="tall"
      width="default"
      onClose={handleClose} >
      <RouterWrappedContent
        formKey={formKey}
        resourceId={resourceId}
        resourceType={resourceType}
        flowId={flowId}
        handleClose={handleClose}
      />
    </RightDrawer>
  );
}
