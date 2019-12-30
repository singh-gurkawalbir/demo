import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../../reducers';
import { ActionsFactory as DynaFormWithDynamicActions } from '../../../../../components/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../../../forms/utils';
import PanelHeader from '../../../common/PanelHeader';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    paddingBottom: theme.spacing(1),
  },
}));

export default function GeneralPanel({ integrationId, storeId }) {
  const classes = useStyles();
  // TODO: rethink our data-layer just as we would an API. Currently we
  // have selectors that do too much and as such, they are wasteful and
  // hard to understand and reuse. In this example, this component doesn't
  // need the flows returned by the selector.
  const generalSectionMetadata = useSelector(state =>
    selectors.integrationAppGeneralSettings(state, integrationId, storeId)
  );
  const hasGeneralSettings = useSelector(state =>
    selectors.hasGeneralSettings(state, integrationId, storeId)
  );
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    generalSectionMetadata,
    integrationId,
    true
  );
  const dispatch = useDispatch();

  // perform cleanup
  useEffect(
    () => () => dispatch(actions.integrationApp.settings.clear(integrationId)),
    [dispatch, integrationId]
  );

  return (
    <div className={classes.root}>
      <PanelHeader title="General" />

      {hasGeneralSettings && (
        <DynaFormWithDynamicActions
          key={storeId}
          fieldMeta={translatedMeta}
          integrationId={integrationId}
          storeId={storeId}
        />
      )}
    </div>
  );
}
