import React, { useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../../actions';
import { getHttpConnector} from '../../../../constants/applications';
import { selectors } from '../../../../reducers';
import {useHFSetInitializeFormData} from '../httpFramework/DynaHFAssistantOptions';
import TextToggle from '../../../TextToggle';
import Help from '../../../Help';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    padding: 0,
  },
  connectorTextToggle: {
    flexGrow: 100,
    marginLeft: theme.spacing(-2),
  },
}));

const options = [
  { label: 'Simple', value: 'simple'},
  { label: 'HTTP', value: 'http' },
];

export default function DynaHTTPFrameworkBubbleFormView(props) {
  const classes = useStyles();
  const { resourceType, resourceId, formKey } = props;
  const dispatch = useDispatch();

  const isParentView = useSelector(state => selectors.isHttpConnectorParentFormView(state, resourceId));

  const newResourceId = useSelector(state => selectors.createdResourceId(state, resourceId));

  useEffect(() => {
    if (isParentView) {
      // Incase of resource creation user should still be in the same parent view once it is created
      dispatch(actions.httpConnectors.resourceForm.switchView(newResourceId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newResourceId]);

  const { _httpConnectorId, _httpConnectorVersionId, _httpConnectorApiId, publishedHttpConnectorId } = useSelector(state => {
    const resource = selectors.resourceData(state, resourceType, resourceId)?.merged || {};
    const connection = selectors.resource(state, 'connections', resource._connectionId) || {};

    const { _httpConnectorId, _httpConnectorVersionId, _httpConnectorApiId } = connection.http || {};

    return {
      _httpConnectorId,
      _httpConnectorVersionId,
      _httpConnectorApiId,
      publishedHttpConnectorId: getHttpConnector(_httpConnectorId)?._id,
    };
  }, shallowEqual);

  const hideBubbleFormView = useSelector(state => {
    const connectorMetadata = selectors.httpConnectorMetaData(state, _httpConnectorId, _httpConnectorVersionId, _httpConnectorApiId);

    const showHTTPFrameworkImport = resourceType === 'imports' && connectorMetadata?.import?.resources?.[0]?.operations?.length;
    const showHTTPFrameworkExport = resourceType === 'exports' && connectorMetadata?.export?.resources?.[0]?.endpoints?.length;
    const isHttpFramework = showHTTPFrameworkImport || showHTTPFrameworkExport;

    return !publishedHttpConnectorId || !isHttpFramework;
  });

  const onFieldChangeFn = useCallback(selectedView => {
    dispatch(actions.httpConnectors.resourceForm.switchView(resourceId));

    const additionalPatches = {
      '/useParentForm': selectedView === 'http',
      '/http/sessionFormType': selectedView === 'http' ? 'http' : 'assistant',
      '/isHttpConnector': true,
    };

    dispatch(actions.resourceForm.reInitialize(formKey, additionalPatches));
  }, [dispatch, formKey, resourceId]);

  useHFSetInitializeFormData({...props, isHTTPFramework: publishedHttpConnectorId});

  useEffect(() => () => dispatch(actions.httpConnectors.resourceForm.clear(resourceId)), [dispatch, resourceId]);

  if (hideBubbleFormView) {
    return null;
  }

  return (
    <div className={classes.connectorTextToggle}>
      <TextToggle
        value={isParentView ? 'http' : 'simple'}
        onChange={onFieldChangeFn}
        exclusive
        options={options}
      />
      <Help
        title="Formview"
        className={classes.helpTextButton}
        helpKey="connectionFormView"
      />
    </div>
  );
}
