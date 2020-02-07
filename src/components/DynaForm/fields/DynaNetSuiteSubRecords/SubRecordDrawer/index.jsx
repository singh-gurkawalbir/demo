import { useCallback, Fragment } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch, NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, Button } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import DrawerTitleBar from '../../../../drawer/TitleBar';
import LoadResources from '../../../../LoadResources';
import ResourceForm from '../../../../ResourceFormFactory';
import DynaForm from '../../../../DynaForm';
import DynaSubmit from '../../../../DynaForm/DynaSubmit';

const useStyles = makeStyles(theme => ({
  subNavOpen: {
    width: 824,
  },
  subNavClosed: {
    width: 624,
  },
  drawerPaper: {
    marginTop: theme.appBarHeight,
    border: 'solid 1px',
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  root: {
    padding: theme.spacing(0),
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.common.white,
  },
  container: {
    display: 'flex',
  },
  subNav: {
    minWidth: 200,
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(2),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 3, 3, 0),
    overflowX: 'scroll',
  },
  listItem: {
    color: theme.palette.text.primary,
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));

function SubRecordDrawer(props) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  //   const { integrationId, connectionId } = match.params;
  //   const tile = useSelector(state =>
  //     selectors.resource(state, 'tiles', integrationId)
  //   );
  //   const showSubNav =
  //     tile && tile.offlineConnections && tile.offlineConnections.length > 1;
  //   const integrationConnections = useSelector(
  //     state => {
  //       const connections = selectors.integrationConnectionList(
  //         state,
  //         integrationId
  //       );

  //       return tile.offlineConnections.map(connId =>
  //         connections.find(conn => conn._id === connId)
  //       );
  //     },
  //     (left, right) => left.length === right.length
  //   );
  //   const handleClose = useCallback(() => {
  //     history.goBack();
  //   }, [history]);
  //   const handleSubmitComplete = useCallback(() => {
  //     const currentConnectionIndex = tile.offlineConnections.indexOf(
  //       connectionId
  //     );

  //     if (tile.offlineConnections[currentConnectionIndex + 1]) {
  //       history.replace(`${tile.offlineConnections[currentConnectionIndex + 1]}`);
  //     } else {
  //       handleClose();
  //     }
  //   }, [connectionId, handleClose, history, tile.offlineConnections]);
  const fieldMeta = {
    fieldMap: {
      dataType: {
        id: 'dataType',
        name: 'dataType',
        type: 'select',
        label: 'Data Type',
        options: [
          {
            items: [
              { label: 'Boolean', value: 'boolean' },
              { label: 'Date Time', value: 'epochtime' },
              { label: 'Number', value: 'number' },
              { label: 'String', value: 'string' },
            ],
          },
        ],
        // defaultValue: ruleData.dataType || 'string',
      },
    },
    layout: {
      fields: ['dataType'],
    },
  };

  return (
    <Drawer
      anchor="right"
      open={!!match}
      classes={{
        paper: clsx(
          classes.drawerPaper
          // ,showSubNav ? classes.subNavOpen : classes.subNavClosed
        ),
      }}
      // onClose={handleClose}
    >
      <DrawerTitleBar title="Add subrecord import" />

      <Fragment>params ${JSON.stringify(match.params)}</Fragment>
      <br />
      <Fragment>props ${JSON.stringify(props)}</Fragment>

      <LoadResources required="true" resources="connections">
        <div className={classes.container}>
          <div className={classes.content}>
            <DynaForm
              // disabled={disabled}
              fieldMeta={fieldMeta}
              // optionsHandler={fieldMeta.optionsHandler}
            >
              <Button
                data-test="cancelOperandSettings"
                onClick={() => {
                  // onClose();
                }}>
                Cancel
              </Button>
              <DynaSubmit
                data-test="saveOperandSettings"
                // onClick={handleSubmit}
              >
                Save
              </DynaSubmit>
            </DynaForm>
          </div>
        </div>
      </LoadResources>
    </Drawer>
  );
}

export default function SubRecordDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route
      exact
      path={[`${match.url}/subrecords/`, `${match.url}/subrecords/:fieldId`]}>
      <SubRecordDrawer {...props} />
    </Route>
  );
}
