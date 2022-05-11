import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { makeStyles, Divider, Typography } from '@material-ui/core';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import BranchItem from './BranchItem';
import Help from '../../../../Help';
import { selectors } from '../../../../../reducers';
import { emptyList } from '../../../../../constants';
import { TextButton } from '../../../../Buttons';
import AddIcon from '../../../../icons/AddIcon';
import actions from '../../../../../actions';
import DynaRadioGroup from '../../../../DynaForm/fields/radiogroup/DynaRadioGroup';

const moveArrayItem = (arr, oldIndex, newIndex) => {
  const newArr = [...arr];
  const element = newArr.splice(oldIndex, 1)[0];

  newArr.splice(newIndex, 0, element);

  return newArr;
};

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
  helpButton: {
    padding: 0,
  },
  grabbing: {
    cursor: 'grabbing',
  },
}));
const branchHashFn = branches => (branches || []).reduce((hashString, branch) => `${hashString}-${branch.name}|${branch.description}|${branch.expanded}`, '');
export default function RouterPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const branches = useSelector(state => selectors.editorRule(state, editorId)?.branches || emptyList,
    (left, right) => branchHashFn(left) === branchHashFn(right)
  );
  const routeRecordsTo = useSelector(state => selectors.editorRule(state, editorId)?.routeRecordsTo || 'first_matching_branch');
  const routerIndex = useSelector(state => selectors.editor(state, editorId)?.routerIndex || 0);

  useEffect(() => {
    let noNameBranchFound = false;

    branches.forEach((branch, index) => {
      if (!branch.name) {
        // eslint-disable-next-line no-param-reassign
        branch.name = `Branch ${routerIndex + 1}.${index}`;
        noNameBranchFound = true;
      }
    });
    if (noNameBranchFound) {
      dispatch(actions.editor.patchRule(editorId, branches, {rulePath: 'branches'}));
    }
  }, [branches, editorId, routerIndex, dispatch]);

  const activeProcessor = useSelector(state => selectors.editor(state, editorId).activeProcessor);

  const SortableContainer = sortableContainer(({children}) => (
    <ul className={classes.branchList}>
      {children}
    </ul>
  ));

  const SortableItem = sortableElement(props => <BranchItem {...props} editorId={editorId} />);

  const BranchHeading = ({helpText, children}) => (
    <div className={classes.heading}>
      <Typography variant="h5">{children}</Typography>
      <Help
        title={children}
        className={classes.helpButton}
        helpText={helpText}
    />
    </div>
  );

  const handleNameChange = (title, position) => {
    dispatch(actions.editor.patchRule(editorId, title, {rulePath: `branches[${position}].name`}));
  };

  const handleToggleExpand = (expanded, position) => {
    dispatch(actions.editor.patchRule(editorId, expanded, {rulePath: `branches[${position}].expanded`}));
  };

  const handleSortStart = (_, event) => {
    // we only want mouse events (not keyboard navigation) to trigger
    // mouse cursor changes...
    if (event instanceof MouseEvent) {
      document.body.classList.add(classes.grabbing);
    }
  };

  const handleSortEnd = ({oldIndex, newIndex}) => {
    document.body.classList.remove(classes.grabbing);
    dispatch(actions.editor.patchRule(editorId, (moveArrayItem(branches, oldIndex, newIndex)), {rulePath: 'branches'}));
  };

  const handleAddBranch = () => {
    dispatch(actions.editor.patchRule(editorId, [...branches, {name: `Branch ${routerIndex + 1}.${branches.length}`, pageProcessors: []}], {rulePath: 'branches'}));
  };

  const updatedOnFieldChange = (id, val) => {
    dispatch(actions.editor.patchRule(editorId, val, {rulePath: 'routeRecordsTo'}));
  };

  return (
    <div className={classes.panelContent}>
      <BranchHeading helpText="Missing branch type help!">Branching type</BranchHeading>

      <DynaRadioGroup
        id="branchType"
        name="branchType"
        type="radiogroup"
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

      <BranchHeading helpText="Missing branches help text">Branches</BranchHeading>

      <Divider orientation="horizontal" className={classes.divider} />

      <SortableContainer
        lockAxis="y"
        onSortStart={handleSortStart}
        onSortEnd={handleSortEnd}
        useDragHandle>
        {branches.map((b, i) => (
          <SortableItem
            expandable={activeProcessor === 'filter'}
            expanded={b.expanded}
            onToggleExpand={handleToggleExpand}
            key={b.name}
            index={i} // The HOC does not proxy index to child, so we need `position` as well.
            position={i}
            branchName={b.name}
            pageProcessors={b.pageProcessors}
            description={b.description}
            onNameChange={handleNameChange} />
        ))}
      </SortableContainer>

      <TextButton onClick={handleAddBranch}><AddIcon />Add branch</TextButton>
    </div>
  );
}
