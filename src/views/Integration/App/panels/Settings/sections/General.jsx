import React, { useMemo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../../../reducers';
import { integrationSettingsToDynaFormMetadata } from '../../../../../../forms/utils';
import PanelHeader from '../../../../../../components/PanelHeader';
import { IAFormStateManager } from '../../Flows';

const useStyles = makeStyles(theme => ({
  configureform: {
    padding: theme.spacing(2, 3),
    '& + div': {
      padding: theme.spacing(2, 0),
      margin: theme.spacing(0, 3),
    },
    '& > * div.MuiTabs-horizontal': {
      marginTop: theme.spacing(-2),
      marginLeft: theme.spacing(-3),
    },
    '& > div[class*= "fieldsContainer"]': {
      height: '100%',
      '& > div[class*= "makeStyles-root"]': {
        paddingTop: theme.spacing(5),
        height: '100%',
        '& > div[class*= "panelContainer"]': {
          paddingBottom: theme.spacing(5),
        },
      },
    },
  }
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
  const translatedMeta = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        generalSectionMetadata,
        integrationId,
        true
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [integrationId, storeId]
  );
  const formState = useSelector(
    state => selectors.integrationAppSettingsFormState(state, integrationId),
    shallowEqual
  );

  return (
    <div>
      <PanelHeader title="General" />
      {hasGeneralSettings && (
      <IAFormStateManager
        key={storeId}
        fieldMeta={translatedMeta}
        integrationId={integrationId}
        isIAForm
        className={classes.configureform}
        storeId={storeId}
        formState={formState}
        orientation="horizontal"
          />
      )}
    </div>
  );
}
