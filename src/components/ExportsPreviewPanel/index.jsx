import { Typography, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';
import Panels from './Panels';
import { DEFAULT_RECORD_SIZE } from '../../utils/exportPanel';
import TextToggle from '../TextToggle';
import ActionGroup from '../ActionGroup';
import { TextButton } from '../Buttons';
import EditIcon from '../icons/EditIcon';
import CeligoDivider from '../CeligoDivider';
import FieldHelp from '../DynaForm/FieldHelp';
import MockInput from './MockInput';

const useStyles = makeStyles(theme => ({
  previewPanelWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  label: {
    marginBottom: 6,
    fontSize: 18,
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  container: {
    background: theme.palette.common.white,
    padding: theme.spacing(2),
    height: `calc(100vh - ${250}px)`,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  actionGroupWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(2),
  },
  previewDataHeading: {
    fontSize: 18,
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    background: theme.palette.background.paper,
  },
}));

function PreviewInfo({
  resourceId,
  formKey,
  resourceSampleData,
  previewStageDataList,
  showPreviewData,
  setShowPreviewData,
}) {
  const dispatch = useDispatch();

  const fetchExportPreviewData = useCallback(() => {
    dispatch(actions.resourceFormSampleData.request(formKey, { refreshCache: true }));
  }, [
    dispatch,
    formKey,
  ]);

  const handlePreview = useCallback(() => {
    fetchExportPreviewData();
    setShowPreviewData(true);
  }, [fetchExportPreviewData, setShowPreviewData]);

  // on close of the panel, updates record size to default
  // remove this action, if in future we need to retain record size
  useEffect(() =>
    () => {
      dispatch(actions.resourceFormSampleData.updateRecordSize(resourceId, DEFAULT_RECORD_SIZE));
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  return (
    <Panels.PreviewInfo
      fetchExportPreviewData={handlePreview}
      resourceSampleData={resourceSampleData}
      previewStageDataList={previewStageDataList}
      formKey={formKey}
      resourceId={resourceId}
      showPreviewData={showPreviewData}
  />
  );
}
const errorTypes = [
  { label: 'Preview', value: 'preview' },
  { label: 'Send', value: 'send' },
];

export default function ExportsPreviewPanel({resourceId, formKey, resourceType, flowId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const availablePreviewStages = useSelector(state =>
    selectors.getAvailableResourcePreviewStages(state, resourceId, resourceType, flowId),
  shallowEqual
  );
  const isLookup = useSelector(state => selectors.isLookUpExport(state, { flowId, resourceId, resourceType }));
  const dispatch = useDispatch();
  const toggleValue = useSelector(state =>
    selectors.typeOfSampleData(state, resourceId)
  );
  // TODO @Raghu: Refactor preview state as it is currently using sample data state
  // this local state controls view to show sample data only when user requests by clicking preview
  const [showPreviewData, setShowPreviewData] = useState(false);
  // get the map of all the stages with their respective sampleData for the stages
  const previewStages = useMemo(() => availablePreviewStages.map(({value}) => value), [availablePreviewStages]);

  const previewStageDataList = useSelectorMemo(selectors.mkPreviewStageDataList, resourceId, previewStages);

  // get the default raw stage sampleData to track the status of the request
  // As the status is same for all the stages
  // TODO @Raghu : what if later on there is a need of individual status for each stage?
  const resourceSampleData = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'raw'),
  shallowEqual
  );
  const onChange = useCallback(value => {
    dispatch(actions.resourceFormSampleData.updateSampleDataType(resourceId, value));
  }, [dispatch, resourceId]);

  const onEditorClick = useCallback(() => {
    history.push(`${match.url}/inputData`);
  }, [match.url, history]);

  return (
    <div>
      <MockInput
        formKey={formKey}
        resourceId={resourceId}
        resourceType={resourceType}
        flowId={flowId}
      />
      <div
        className={classes.previewPanelWrapper}>
        <Typography className={classes.previewDataHeading}>
          {resourceType === 'imports' ? (
            <div className={classes.labelWrapper}>
              <FormLabel className={classes.label}>Preview &amp; send</FormLabel>
              <FieldHelp
                id="previewandsend"
                helpKey="import.previewAndSend"
                label="Preview &amp; send" />
            </div>
          ) : 'Preview data'}
        </Typography>

        <div className={classes.container}>
          {resourceType === 'imports' || isLookup ? (
            <div className={classes.actionGroupWrapper}>
              <ActionGroup position="right">
                <TextButton onClick={onEditorClick} startIcon={<EditIcon />}>
                  Edit mock input
                </TextButton>
                {!isLookup && (
                <>
                  <CeligoDivider position="right" />
                  <TextToggle
                    value={toggleValue}
                    onChange={onChange}
                    exclusive
                    className={classes.errorDrawerActionToggle}
                    options={errorTypes}
                />
                </>
                )}
              </ActionGroup>
            </div>
          ) : ''}
          <PreviewInfo
            resourceSampleData={resourceSampleData}
            previewStageDataList={previewStageDataList}
            resourceId={resourceId}
            formKey={formKey}
            setShowPreviewData={setShowPreviewData}
            showPreviewData={showPreviewData}
          />

          <Panels.PreviewBody
            resourceSampleData={resourceSampleData}
            previewStageDataList={previewStageDataList}
            availablePreviewStages={availablePreviewStages}
            resourceId={resourceId}
            showDefaultPreviewBody={!showPreviewData}
            resourceType={resourceType}
          />
        </div>
      </div>
    </div>
  );
}
