import React, { useCallback, useMemo, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import IconTextButton from '../../../IconTextButton';
import AddIcon from '../../../icons/AddIcon';
import CeligoTable from '../../../CeligoTable';
import metadata from './metadata';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { generateNewId } from '../../../../utils/resource';
import { SCOPES } from '../../../../sagas/resourceForm';

const useStyles = makeStyles(theme => ({
  actionChildLicense: {
    position: 'absolute',
    top: theme.spacing(1),
    right: 0,
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function DynaChildLicense({ connectorId, resourceId, id, formKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const sortFilterKey = 'connectorChildLicenses';

  const parentLicense = useSelectorMemo(selectors.makeResourceSelector, 'connectorLicenses', resourceId);
  const parentConnector = useSelectorMemo(selectors.makeResourceSelector, 'connectors', parentLicense?._connectorId);
  const integration = useSelectorMemo(selectors.makeResourceSelector, 'integrations', parentConnector?.twoDotZero?._integrationId);

  const filter = useSelector(state => selectors.filter(state, sortFilterKey));
  const connectorLicensesFilterConfig = useMemo(
    () => ({
      ignoreEnvironmentFilter: true,
      type: 'connectorLicenses',
      ...filter,
    }),
    [filter]
  );
  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectorLicensesFilterConfig
  );
  const childLicenses = useMemo(() => (
    list.resources.filter(license => license._parentId === parentLicense._id)
  ), [list, parentLicense]);

  useEffect(() => {
    if (!integration?.initChild?.function) {
      dispatch(actions.form.forceFieldState(formKey)(id, { visible: false}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(() => {
    const newId = generateNewId();
    const patchSet = [
      {
        op: 'add',
        path: '/_connectorId',
        value: connectorId,
      },
      {
        op: 'add',
        path: '/type',
        value: 'integrationAppChild',
      },
      {
        op: 'add',
        path: '/email',
        value: parentLicense.user.email,
      },
      {
        op: 'add',
        path: '/_parentId',
        value: parentLicense._id,
      },
    ];

    dispatch(actions.resource.patchStaged(newId, patchSet, SCOPES.VALUE));
    history.push(`${match.url}/add/connectorLicenses/${newId}`);
  }, [connectorId, history, match, parentLicense, dispatch]);

  return (
    <>
      <div className={classes.actionChildLicense}>
        <IconTextButton
          onClick={handleClick}
          variant="text"
          color="primary">
          <AddIcon /> Create child license
        </IconTextButton>
      </div>
      <div>
        <CeligoTable
          data={childLicenses}
          {...metadata}
          filterKey={sortFilterKey}
          actionProps={{
            resourceType: `connectors/${connectorId}/licenses`,
          }}
          />
      </div>
    </>
  );
}
