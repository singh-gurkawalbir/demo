import { Fragment, useEffect, useState } from 'react';
import { Typography, Divider, IconButton } from '@material-ui/core';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIcon from '../../components/icons/ArrowLeftIcon';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';

export default function CategoryMapping() {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const { integrationId, flowId } = match.params;
  const [requestedMetadata, setRequestedMetadata] = useState(false);
  const integrationName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    return integration ? integration.name : null;
  });
  const handleBackClick = () => {
    history.goBack();
  };

  const metadata = useSelector(state =>
    selectors.categoryMapping(state, integrationId, flowId)
  );

  useEffect(() => {
    if (!metadata && !requestedMetadata) {
      dispatch(
        actions.integrationApp.settings.requestCategoryMappingMetadata(
          integrationId,
          flowId
        )
      );
      setRequestedMetadata(true);
    }
  }, [dispatch, flowId, integrationId, metadata, requestedMetadata]);

  if (!integrationName) {
    return <LoadResources required resources="integrations" />;
  }

  return (
    <Fragment>
      <Typography variant="h3">{integrationName}</Typography>
      <Divider />
      <div>
        <IconButton data-test="back" onClick={handleBackClick} size="medium">
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        Go Back to Settings
      </div>
    </Fragment>
  );
}
