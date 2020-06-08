import { withRouter, useRouteMatch } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { Typography, Link } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import clsx from 'clsx';
import CeligoPageBar from '../../../components/CeligoPageBar';
import EditableText from '../../../components/EditableText';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DateTimeDisplay from '../../../components/DateTimeDisplay';
import PageGenerator from './PageGenerator';
import PageProcessor from './PageProcessor';
import ResourceDrawer from '../../../components/SuiteScript/drawer/Resource';
import BottomDrawer from './drawers/BottomDrawer';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    alignItems: 'center',
    margin: [[-7, 0]],
  },
  canvasContainer: {
    // border: 'solid 1px black',
    overflow: 'hidden',
    width: `calc(100vw - ${theme.drawerWidthMinimized}px)`,
    transition: theme.transitions.create(['width', 'height'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  canvasShift: {
    width: `calc(100vw - ${theme.drawerWidth}px)`,
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflow: 'auto',
  },
  generatorContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  processorContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    paddingRight: theme.spacing(3),
  },
  fabContainer: {
    position: 'absolute',
    right: theme.spacing(3),
    transition: theme.transitions.create(['bottom', 'width', 'height'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    display: 'flex',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceTitle: {
    marginBottom: theme.spacing(3),
  },
  destinationTitle: {
    width: 320,
    marginLeft: 100,
    marginBottom: theme.spacing(3),
  },
  generatorRoot: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: theme.spacing(0, 0, 3, 3),
    minWidth: 429,
  },
  processorRoot: {
    padding: theme.spacing(0, 3, 3, 0),
  },
  newPP: {
    marginLeft: 100,
  },
  newPG: {
    marginRight: 50,
  },
  dataLoaderHelp: {
    margin: theme.spacing(5, 0, 0, 5),
    maxWidth: 450,
  },
  // NOTE: 52px is collapsed left side bar. 410px is right page header action buttons + padding
  // we use these to force the input to be as large as possible in the pageBar
  // without causing any weird wrapping.
  editableTextInput: {
    width: `calc(100vw - ${52 + 410}px)`,
  },
  editableTextInputShift: {
    width: `calc(100vw - ${theme.drawerWidth + 410}px)`,
  },
}));
const bottomDrawerMin = 41;

function FlowBuilder() {
  const classes = useStyles();
  const theme = useTheme();
  const match = useRouteMatch();
  const { ssLinkedConnectionId, integrationId, flowId } = match.params;
  const isNewFlow = false;
  // Bottom drawer is shown for existing flows and docked for new flow
  const [bottomDrawerSize, setBottomDrawerSize] = useState(isNewFlow ? 0 : 1);
  const [tabValue, setTabValue] = useState(0);
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const flow = useSelector(
    state =>
      selectors.suiteScriptResourceData(state, {
        resourceType: 'flows',
        id: flowId,
        ssLinkedConnectionId,
        integrationId,
      }).merged,
    shallowEqual
  );
  // const { export: exportDoc, import: importDoc } = flow;
  // const flowDetails = flow;
  const isViewMode = false;
  // const patchFlow = useCallback(
  //   (path, value) => {
  //     const patchSet = [{ op: 'replace', path, value }];

  //     dispatch(
  //       actions.suiteScript.resource.patchStaged(
  //         flowId,
  //         patchSet,
  //         'value',
  //         ssLinkedConnectionId,
  //         integrationId,
  //         'flows',
  //         flowType
  //       )
  //     );
  //     // dispatch(actions.resource.commitStaged('flows', flowId, 'value'));

  //     // if (!isNewFlow) {
  //     //   dispatch(actions.flowData.updateFlow(flowId));
  //     // }
  //   },
  //   [flowId, flowType, integrationId, ssLinkedConnectionId]
  // );

  return (
    <Fragment>
      {JSON.stringify({
        ssLinkedConnectionId,
        integrationId,
        flowId,
      })}
      <ResourceDrawer
        flowId={flowId}
        disabled={isViewMode}
        integrationId={integrationId}
        ssLinkedConnectionId={ssLinkedConnectionId}
      />
      <CeligoPageBar
        title={
          <EditableText
            disabled={isViewMode || !flow.editable}
            text={flow.name}
            // multiline
            defaultText={`Unnamed (id:${flowId})`}
            // onChange={handleTitleChange}
            inputClassName={
              drawerOpened
                ? classes.editableTextInputShift
                : classes.editableTextInput
            }
          />
        }
        subtitle={
          <Fragment>
            {flow.lastModified &&
              `Last saved: ${<DateTimeDisplay dateTime={flow.lastModified} />}`}
          </Fragment>
        }
      />
      {flow && !flow.editable && (
        <Fragment>
          <Typography>
            The ability to change settings for the data flow you have selected
            is not currently supported. Please{' '}
            <Link href="https://celigo.com/support" target="_blank">
              contact Celigo Support
            </Link>{' '}
            to request changes.
          </Typography>
        </Fragment>
      )}
      {flow && flow.editable && (
        <div
          className={clsx(classes.canvasContainer, {
            [classes.canvasShift]: drawerOpened,
          })}
          style={{
            height: `calc(${(4 - bottomDrawerSize) *
              25}vh - ${theme.appBarHeight +
              theme.pageBarHeight +
              (bottomDrawerSize ? 0 : bottomDrawerMin)}px)`,
          }}>
          <div className={classes.canvas}>
            {/* CANVAS START */}
            <div
              className={classes.generatorRoot}
              style={{
                minHeight: 240 * 1 + 70,
              }}>
              <Typography
                component="div"
                className={clsx(classes.title, classes.sourceTitle)}
                variant="overline">
                SOURCE APPLICATION
              </Typography>

              <div className={classes.generatorContainer}>
                <PageGenerator isViewMode={isViewMode} />
              </div>
            </div>
            <div className={classes.processorRoot}>
              <Typography
                component="div"
                className={clsx(classes.title, classes.destinationTitle)}
                variant="overline">
                DESTINATION APPLICATION
              </Typography>
              <div className={classes.processorContainer}>
                <PageProcessor
                  isViewMode={isViewMode}
                  isMonitorLevelAccess={false}
                />
              </div>
            </div>
            {bottomDrawerSize < 3 && (
              <div
                className={classes.fabContainer}
                style={{
                  bottom: bottomDrawerSize
                    ? `calc(${bottomDrawerSize * 25}vh + ${theme.spacing(3)}px)`
                    : bottomDrawerMin + theme.spacing(3),
                }}
              />
            )}
            {/* CANVAS END */}
            <BottomDrawer
              ssLinkedConnectionId={ssLinkedConnectionId}
              flow={flow}
              size={bottomDrawerSize}
              setSize={setBottomDrawerSize}
              tabValue={tabValue}
              setTabValue={setTabValue}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default withRouter(FlowBuilder);
