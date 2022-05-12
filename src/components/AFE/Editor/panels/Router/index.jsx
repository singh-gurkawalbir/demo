import produce from 'immer';
import { useSelector } from 'react-redux';
import React, { useMemo, useState } from 'react';
import { makeStyles, Divider, Typography } from '@material-ui/core';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import DynaForm from '../../../../DynaForm';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import BranchItem from './BranchItem';
import fieldMetadata from './fieldMeta';
import Help from '../../../../Help';
import { selectors } from '../../../../../reducers';
import { emptyList } from '../../../../../constants';
import { TextButton } from '../../../../Buttons';
import AddIcon from '../../../../icons/AddIcon';

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

export const routerAfeFormKey = 'routerAfe';

export default function RouterPanel({ editorId }) {
  const classes = useStyles();
  const fieldMeta = useMemo(() => (fieldMetadata), []);

  useFormInitWithPermissions({ formKey: routerAfeFormKey, fieldMeta });
  const branches = useSelector(state => selectors.editorRule(state, editorId)?.branches || emptyList);
  const [branchData, setBranchData] = useState(branches);
  const activeProcessor = useSelector(state =>
    selectors.editor(state, editorId).activeProcessor);

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
    setBranchData(
      produce(branchData, draft => {
        draft[position].name = title;
      }));
  };

  const handleToggleExpand = (expanded, position) => {
    setBranchData(
      produce(branchData, draft => {
        draft[position].expanded = expanded;
      }));
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
    setBranchData(items => (moveArrayItem(items, oldIndex, newIndex)));
  };

  const handleAddBranch = () => {
    // dispatch(actions.flow.addBranch({flowId}));
    // eslint-disable-next-line no-console
    console.log('TODO: add new Branch');
  };

  return (
    <div className={classes.panelContent}>
      <BranchHeading helpText="Missing branch type help!">Branching type</BranchHeading>

      <DynaForm formKey={routerAfeFormKey} />

      <BranchHeading helpText="Missing branches help text">Branches</BranchHeading>

      <Divider orientation="horizontal" className={classes.divider} />

      <SortableContainer
        lockAxis="y"
        onSortStart={handleSortStart}
        onSortEnd={handleSortEnd}
        useDragHandle>
        { branchData.map((b, i) => (
          <SortableItem
            expandable={activeProcessor === 'filter'}
            expanded={b.expanded}
            onToggleExpand={handleToggleExpand}
            key={b.name}
            index={i} // The HOC does not proxy index to child, so we need `position` as well.
            position={i}
            branchName={b.name}
            description={b.description}
            onNameChange={handleNameChange} />
        ))}
      </SortableContainer>

      <TextButton onClick={handleAddBranch}><AddIcon />Add branch</TextButton>
    </div>
  );
}
