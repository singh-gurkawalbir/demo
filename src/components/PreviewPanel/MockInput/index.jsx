/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Paper } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { FilledButton } from '../../Buttons';
import CodePanel from '../../AFE/Editor/panels/Code';
import { unwrapExportFileSampleData, wrapExportFileSampleData, wrapMockInputData } from '../../../utils/sampleData';
import { safeParse } from '../../../utils/string';
import FieldMessage from '../../DynaForm/fields/FieldMessage';
import PanelTitle from '../../AFE/Editor/gridItems/PanelTitle';
import { drawerPaths } from '../../../utils/rightDrawer';
import FetchLatestMockInputDataButton from './FetchLatestMockInputDataButton';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { MOCK_INPUT_STATUS } from '../../../constants';
import { message } from '../../../utils/messageStore';

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
    height: `calc(100vh - ${theme.spacing(32)})`,
  },
}));

function DrawerSpinner({visible}) {
  if (!visible) return null;

  return (<Spinner center="screen" />);
}

function RouterWrappedContent(props) {
  const { handleClose, resourceId, resourceType, flowId } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [error, setError] = useState();
  const [refreshMockInputData, setRefreshMockInputData] = useState(false);
  const userMockData = useSelector(state => selectors.userMockInput(state, resourceId));
  const {data: mockInput, status} = useSelector(state => selectors.mockInput(state, resourceId), shallowEqual);

  const [value, setValue] = useState(userMockData ? wrapExportFileSampleData(userMockData) : '');

  useEffect(() => {
    if ([MOCK_INPUT_STATUS.RECEIVED, MOCK_INPUT_STATUS.ERROR].includes(status) && !userMockData) {
      setValue(wrapMockInputData(mockInput));
    }
  }, [userMockData, status, mockInput]);

  const handleChange = newValue => {
    setValue(newValue);
    const parsedMockData = safeParse(newValue);
    const unwrappedMockData = unwrapExportFileSampleData(parsedMockData);

    if (!parsedMockData || !unwrappedMockData) {
      // throw error for invalid json and data not being in the connonical format
      if (!parsedMockData) {
        setError(message.MOCK_INPUT_REFRESH.INVALID_JSON);
      } else {
        setError(message.MOCK_INPUT_REFRESH.INVALID_FORMAT);
      }

      return;
    }
    setError(undefined);
  };

  const handleDone = useCallback(() => {
    const parsedMockData = safeParse(value);
    const unwrappedMockData = unwrapExportFileSampleData(parsedMockData);

    dispatch(actions.mockInput.updateUserMockInput(resourceId, unwrappedMockData));
    handleClose();
  }, [dispatch, handleClose, resourceId, value]);

  const fetchMockInputData = useCallback(refreshCache => {
    dispatch(actions.mockInput.request(resourceId, resourceType, flowId, { refreshCache }));
  }, [dispatch, flowId, resourceId, resourceType]);

  useEffect(() => {
    if (!status) {
      fetchMockInputData();
    }
  }, [fetchMockInputData, dispatch, resourceId, status]);

  useEffect(() => () => {
    dispatch(actions.mockInput.clear(resourceId));
  }, [dispatch, resourceId]);

  useEffect(() => {
    if (!refreshMockInputData) return;
    if (status === MOCK_INPUT_STATUS.RECEIVED) {
      dispatch(actions.mockInput.updateUserMockInput(resourceId));
      setValue(wrapMockInputData(mockInput));
      enquesnackbar({ message: message.MOCK_INPUT_REFRESH.SUCCESS});
      setRefreshMockInputData(false);
    } else if (status === MOCK_INPUT_STATUS.ERROR) {
      enquesnackbar({ message: message.MOCK_INPUT_REFRESH.FAILED, variant: 'error' });
      setRefreshMockInputData(false);
    }
  }, [dispatch, enquesnackbar, mockInput, refreshMockInputData, resourceId, status]);

  const handleMockDataRefresh = useCallback(() => {
    fetchMockInputData(true);
    setRefreshMockInputData(true);
  }, [fetchMockInputData]);

  return (
    <>
      <DrawerHeader title="Edit mock input" helpTitle="Edit mock input" helpKey="import.editMockInput" hideBackButton>
        <FetchLatestMockInputDataButton
          disabled={status === MOCK_INPUT_STATUS.REQUESTED}
          onClick={handleMockDataRefresh} />
      </DrawerHeader>
      <DrawerContent className={classes.editMockContentWrapper} >
        <DrawerSpinner visible={status === MOCK_INPUT_STATUS.REQUESTED} />
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
