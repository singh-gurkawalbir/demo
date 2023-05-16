import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { Divider, Typography, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import clsx from 'clsx';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import Help from '../../../../Help';
import { selectors } from '../../../../../reducers';
import AddIcon from '../../../../icons/AddIcon';
import actions from '../../../../../actions';
import DynaRadioGroup from '../../../../DynaForm/fields/radiogroup/DynaRadioGroup';
import BranchDrawer from './BranchDrawer';
import BranchItem from './BranchItem';
import { message } from '../../../../../utils/messageStore';
import DynaText from '../../../../DynaForm/fields/DynaText';
import NotificationToaster from '../../../../NotificationToaster';

const useStyles = makeStyles(theme => ({
  panelContent: {
    padding: theme.spacing(1),
    height: '100%',
    overflow: 'auto',
  },
  branchList: {
    listStyle: 'none',
    marginLeft: 0,
    paddingLeft: 0,
    marginBottom: 0,
  },
  heading: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1.5),
    display: 'flex',
  },
  branchingType: {
    marginBottom: theme.spacing(1),
  },
  grabbing: {
    cursor: 'grabbing',
  },
  nameContainer: {
    marginBottom: theme.spacing(1.5),
  },
  nameContainerWOInfo: {
    marginBottom: theme.spacing(2),
  },
  name: {
    marginBottom: theme.spacing(1),
  },
  info: {
    paddingLeft: 0,
    '& svg': {
      color: theme.palette.primary.main,
    },
  },
}));

const SortableItem = sortableElement(props => <BranchItem {...props} />);

const SortableContainer = sortableContainer(({children, className}) => (
  <ul className={className}>
    {children}
  </ul>
));

const BranchHeading = ({ helpKey, children, classes }) => (
  <div className={classes.heading}>
    <Typography variant="h5">{children}</Typography>
    <Help
      title={children}
      helpKey={helpKey}
    />
  </div>
);
const BranchName = ({ editorId, isViewMode, name, classes }) => {
  const dispatch = useDispatch();
  const [info, setInfo] = useState(null);
  const updatedOnNameChange = (id, val) => {
    if (val?.length <= 150) {
      setInfo(null);
      dispatch(actions.editor.patchRule(editorId, val, {rulePath: 'name'}));
    } else {
      setInfo([message.AFE_EDITOR_PANELS_INFO.BRANCH_NAME_LENGTH_INFO]);
    }
  };

  return (
    <div className={clsx(classes.nameContainer, !info && classes.nameContainerWOInfo)}>
      <DynaText
        id="name"
        name="name"
        disabled={isViewMode}
        className={classes.name}
        multiline
        rowsMax={4}
        label="Branching name"
        helpKey="flow.router.name"
        value={name}
        onFieldChange={updatedOnNameChange}
      />
      {
        info && (
          <NotificationToaster
            variant="info"
            transparent
            noBorder
            className={classes.info}
          >{info}
          </NotificationToaster>
        )
      }
    </div>
  );
};

export default function RouterPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {branches} = useSelector(state => selectors.editorRule(state, editorId), shallowEqual);

  const isLoading = useSelector(state => selectors.editor(state, editorId).sampleDataStatus === 'requested');
  const maxBranchesLimitReached = branches.length >= 25;
  const {
    routeRecordsTo = 'first_matching_branch',
    name = '',
  } = useSelector(state => selectors.editorRule(state, editorId), shallowEqual);
  const { flowId } = useSelector(state => selectors.editor(state, editorId), shallowEqual);
  const flow = useSelector(state => selectors.fbFlow(state, flowId));
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, flow?._integrationId, flowId));
  const allowSorting = routeRecordsTo === 'first_matching_branch' && !isViewMode;
  const activeProcessor = useSelector(state => selectors.editorActiveProcessor(state, editorId));

  const handleSortStart = (_, event) => {
    // we only want mouse events (not keyboard navigation) to trigger
    // mouse cursor changes...
    if (event instanceof MouseEvent) {
      document.body.classList.add(classes.grabbing);
    }
  };

  const handleSortEnd = ({oldIndex, newIndex}) => {
    document.body.classList.remove(classes.grabbing);
    dispatch(actions.editor.patchRule(editorId, undefined, {actionType: 'reorder', oldIndex, newIndex}));
  };

  const handleAddBranch = () => {
    dispatch(actions.editor.patchRule(editorId, undefined, {actionType: 'addBranch'}));
  };

  const updatedOnFieldChange = (id, val) => {
    dispatch(actions.editor.patchRule(editorId, val, {rulePath: 'routeRecordsTo'}));
  };

  return (
    <div className={classes.panelContent}>
      <BranchDrawer editorId={editorId} />

      <BranchName editorId={editorId} name={name} isViewMode={isViewMode} classes={classes} />

      <Divider orientation="horizontal" className={classes.divider} />

      <BranchHeading helpKey="flow.router.branchType" classes={classes}>Branching type</BranchHeading>

      <div className={classes.branchingType}>
        <DynaRadioGroup
          id="branchType"
          name="branchType"
          isValid // there are no validations on this field, hence always valid
          type="radiogroup"
          disabled={isViewMode}
          label="Records will flow through:"
          options={[
            {
              items: [
                { value: 'first_matching_branch', label: 'First matching branch' },
                { value: 'all_matching_branches', label: 'All matching branches' },
              ],
            },
          ]}
          defaultValue={routeRecordsTo}
          onFieldChange={updatedOnFieldChange}
      />
      </div>

      <BranchHeading helpKey="flow.routers.branches" classes={classes}>Branches</BranchHeading>

      <Divider orientation="horizontal" className={classes.divider} />

      {isLoading ? (
        <Spinner center="screen" />
      ) : (
        <SortableContainer
          className={classes.branchList}
          lockAxis="y"
          onSortStart={handleSortStart}
          onSortEnd={handleSortEnd}
          useDragHandle>
          {branches.map(({id}, i) => (
            <SortableItem
              expandable={activeProcessor === 'filter'}
              key={id}
              index={i} // The HOC does not proxy index to child, so we need `position` as well.
              position={i}
              isViewMode={isViewMode}
              editorId={editorId}
              allowSorting={allowSorting}
              allowDeleting={branches.length > 1} />
          ))}
        </SortableContainer>
      )}
      {!isViewMode && !isLoading && (
      <Tooltip key="key" title={maxBranchesLimitReached ? message.AFE_EDITOR_PANELS_INFO.MAX_BRANCHES_LIMIT_REACHED : ''} placement="bottom">
        <span>
          <TextButton data-test="addBranch" disabled={maxBranchesLimitReached} onClick={handleAddBranch}>
            <AddIcon />Add branch
          </TextButton>
        </span>
      </Tooltip>
      )}
    </div>
  );
}
