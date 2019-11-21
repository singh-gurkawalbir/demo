import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../../reducers';
import { ActionsFactory as DynaFormWithDynamicActions } from '../../../../../components/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../../../../forms/utils';
import PanelHeader from '../../../common/PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
  },
}));

export default function GeneralPanel({ integrationId, storeId }) {
  const classes = useStyles();
  // TODO: rethink our data-layer just as we would an API. Currently we
  // have selectors that do too much and as such, they are wasteful and
  // hard to understand and reuse. In this example, this component doesn't
  // need the flows returned by the selector.
  const { flows, ...rest } = useSelector(state =>
    selectors.integrationAppGeneralSettings(state, integrationId, storeId)
  );
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    rest,
    integrationId,
    true
  );

  return (
    <div className={classes.root}>
      <PanelHeader title="General" />

      <DynaFormWithDynamicActions
        fieldMeta={translatedMeta}
        integrationId={integrationId}
        storeId={storeId}
      />
    </div>
  );
}
