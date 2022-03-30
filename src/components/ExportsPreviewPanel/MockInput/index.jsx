/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import actions from '../../../actions';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';
import { FilledButton } from '../../Buttons';
import CodePanel from '../../AFE/Editor/panels/Code';
import { unwrapExportFileSampleData, wrapExportFileSampleData } from '../../../utils/sampleData';
import Spinner from '../../Spinner';
import { safeParse } from '../../../utils/string';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    padding: 0,
  },
  appLogo: {
    paddingRight: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
  },
  titleHeader: {
    '& > h4': {
      marginRight: `${theme.spacing(-0.5)}px !important`,
    },
  },
}));

function RouterWrappedContent(props) {
  const { handleClose, formKey, resourceId, resourceType, flowId } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [mockData, setMockData] = useState();
  const [error, setError] = useState(false);
  const resourceSampleDataStatus = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'raw').status,
  );

  useEffect(() => {
    dispatch(actions.resourceFormSampleData.request(formKey, { refreshCache: true }));
  }, [dispatch, formKey]);

  const availablePreviewStages = useSelector(state =>
    selectors.getAvailableResourcePreviewStages(state, resourceId, resourceType, flowId), shallowEqual
  );
  const previewStages = useMemo(() => availablePreviewStages.map(({value}) => value), [availablePreviewStages]);

  const previewStageDataList = useSelectorMemo(selectors.mkPreviewStageDataList, resourceId, previewStages);

  const resourceMockData = useSelector(state => selectors.getResourceMockData(state, resourceId));

  const handleChange = newValue => {
    setMockData(newValue);
    const parsedMockData = unwrapExportFileSampleData(safeParse(newValue));

    if (!parsedMockData) {
      // throw some error for invalid json and data not being in the correct format
      setError(true);

      return;
    }
    setError(false);
    dispatch(actions.resourceFormSampleData.setMockData(resourceId, parsedMockData));
  };

  const value = mockData || resourceMockData || wrapExportFileSampleData(previewStageDataList?.preview?.data);

  return (
    <>
      <DrawerHeader title="Edit mock input" helpKey="import.editMockInput" hideBackButton className={classes.titleHeader} />
      <DrawerContent noPadding >
        {resourceSampleDataStatus === 'requested' && (
        <Spinner centerAll />
        )}
        {['received', 'error'].includes(resourceSampleDataStatus) && (
          <CodePanel
            name="data"
            mode="json"
            value={value}
            onChange={handleChange}
            hasError={error}
          />
        )}
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="saveandcloseinputdata"
          onClick={handleClose}>
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
      path="inputData"
      variant="permanent"
      height="tall"
      width="default"
      onClose={handleClose} >
      <RouterWrappedContent
        formKey={formKey} resourceId={resourceId} resourceType={resourceType} flowId={flowId}
        handleClose={handleClose} />
    </RightDrawer>
  );
}
