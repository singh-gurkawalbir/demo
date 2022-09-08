import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { makeStyles, Divider, Typography, Tooltip } from '@material-ui/core';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import Help from '../../../../Help';
import { selectors } from '../../../../../reducers';
import { TextButton } from '../../../../Buttons';
import AddIcon from '../../../../icons/AddIcon';
import actions from '../../../../../actions';
import DynaRadioGroup from '../../../../DynaForm/fields/radiogroup/DynaRadioGroup';
import BranchDrawer from './BranchDrawer';
import BranchItem from './BranchItem';
import messageStore from '../../../../../utils/messageStore';
import Spinner from '../../../../Spinner';
import { shortId } from '../../../../../utils/string';

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
    display: 'flex',
  },
  branchingType: {
    marginBottom: theme.spacing(1),
  },
  helpButton: {
    padding: 0,
  },
  grabbing: {
    cursor: 'grabbing',
  },
}));

const SortableItem = sortableElement(props => <BranchItem {...props} />);

const SortableContainer = sortableContainer(({children, className}) => (
  <ul className={className}>
    {children}
  </ul>
));

export default function RouterPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const branchesLength = useSelector(state => selectors.editorRule(state, editorId).branches?.length);
  const branches = useMemo(() => Array(branchesLength).fill().map(() => ({id: shortId()})), [branchesLength]);
  const isLoading = useSelector(state => selectors.editor(state, editorId).sampleDataStatus === 'requested');
  const maxBranchesLimitReached = branches.length >= 25;
  const routeRecordsTo = useSelector(state => selectors.editorRule(state, editorId)?.routeRecordsTo || 'first_matching_branch');
  const { flowId } = useSelector(state => selectors.editor(state, editorId), shallowEqual);
  const flow = useSelector(state => selectors.fbFlow(state, flowId));
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, flow?._integrationId, flowId));
  const allowSorting = routeRecordsTo === 'first_matching_branch' && !isViewMode;
  const activeProcessor = useSelector(state => selectors.editorActiveProcessor(state, editorId));

  const BranchHeading = ({ helpKey, children }) => (
    <div className={classes.heading}>
      <Typography variant="h5">{children}</Typography>
      <Help
        title={children}
        className={classes.helpButton}
        helpKey={helpKey}
    />
    </div>
  );

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

      <BranchHeading helpKey="flow.router.branchType">Branching type</BranchHeading>

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

      <BranchHeading helpKey="flow.routers.branches">Branches</BranchHeading>

      <Divider orientation="horizontal" className={classes.divider} />

      {isLoading ? (
        <Spinner centerAll />
      ) : (
        <SortableContainer
          className={classes.branchList}
          lockAxis="y"
          onSortStart={handleSortStart}
          onSortEnd={handleSortEnd}
          useDragHandle>
          {branches.map((b, i) => (
            <SortableItem
              expandable={activeProcessor === 'filter'}
              key={b.id}
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
      <Tooltip key="key" title={maxBranchesLimitReached ? messageStore('MAX_BRANCHES_LIMIT_REACHED') : ''} placement="bottom">
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
