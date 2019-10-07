import { Fragment, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligoPageBar from '../../../components/CeligoPageBar';
import * as selectors from '../../../reducers';
import CeligoTable from '../../../components/CeligoTable';
import ResourceDrawer from '../../../components/drawer/Resource';
import IconTextButton from '../../../components/IconTextButton';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import KeywordSearch from '../../../components/KeywordSearch';
import actions from '../../../actions';
import metadata from './metadata';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function InstallBase(props) {
  const { match } = props;
  const defaultFilter = useMemo(() => ({ take: 5 }), []);
  const { connectorId } = match.params;
  const classes = useStyles();
  const list = useSelector(state =>
    selectors.connectorInstallBase(state, {
      connectorId,
      ...defaultFilter,
    })
  );
  const resources = list.resources.map(r => ({ ...r, _id: r._integrationId }));
  const [selected, setSelected] = useState({});
  const dispatch = useDispatch();
  const handleSelectChange = installBaseItems => {
    setSelected(installBaseItems);
  };

  const handleUpdateClick = () => {
    const _integrationIds = Object.keys(selected).filter(
      key => selected[key] === true
    );

    dispatch(
      actions.connectors.installBase.update({
        _integrationIds,
        connectorId,
      })
    );
  };

  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(
        `connectors/${connectorId}/installBase`
      )
    );
  }, [connectorId, dispatch]);

  return (
    <Fragment>
      <ResourceDrawer {...props} />
      <CeligoPageBar title="View / Update Install Base">
        <div className={classes.actions}>
          <KeywordSearch
            filterKey="connectorInstallBase"
            defaultFilter={defaultFilter}
          />
          <IconTextButton onClick={handleUpdateClick} variant="text">
            Update
          </IconTextButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <CeligoTable
          data={resources}
          onSelectChange={handleSelectChange}
          {...metadata}
          selectableRows
        />
      </div>
      <ShowMoreDrawer
        filterKey="connectorInstallBase"
        count={list.count}
        maxCount={list.filtered}
      />
    </Fragment>
  );
}
