import React, { useCallback, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import PanelHeader from '../../../PanelHeader';
import IconTextButton from '../../../IconTextButton';
import AddIcon from '../../../icons/AddIcon';
import CeligoTable from '../../../CeligoTable';
import metadata from './metadata';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { generateNewId } from '../../../../utils/resource';
import { SCOPES } from '../../../../sagas/resourceForm';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
};

export default function DynaChildLicense({ connectorId, resourceId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const sortFilterKey = 'connectorChildLicenses';

  const parentLicense = useSelectorMemo(selectors.makeResourceSelector, 'connectorLicenses', resourceId);

  const filter =
  useSelector(state => selectors.filter(state, sortFilterKey)) ||
  defaultFilter;
  const connectorLicensesFilterConfig = useMemo(
    () => ({
      ignoreEnvironmentFilter: true,
      type: 'connectorLicenses',
      ...defaultFilter,
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
      <PanelHeader>
        <div className={classes.actions}>
          <IconTextButton
            onClick={handleClick}
            variant="text"
            color="primary">
            <AddIcon /> Create child license
          </IconTextButton>
        </div>
      </PanelHeader>
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
