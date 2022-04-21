import produce from 'immer';
import React, { useMemo, useState } from 'react';
import { makeStyles, Divider } from '@material-ui/core';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import DynaForm from '../../../../DynaForm';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import BranchItem from './BranchItem';
import fieldMetadata from './fieldMeta';

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
  summaryContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  accordion: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(2),
  },
  accordionSummary: {
    width: '100%',
  },
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'block',
  },
  branchName: {
    marginLeft: theme.spacing(4),
    flexGrow: 1,
  },
  expandIcon: {
    position: 'absolute',
    left: theme.spacing(5),
  },
  branchList: {
    listStyle: 'none',
    marginLeft: 0,
    paddingLeft: 0,
  },
  listItem: {
    display: 'flex',
  },
  index: {
    flex: 'none',
    textAlign: 'center',
    marginRight: theme.spacing(1.5),
    paddingTop: 2,
    width: 22,
    height: 22,
    borderRadius: 16,
    backgroundColor: theme.palette.text.hint,
    color: theme.palette.common.white,
  },
  accordionContainer: {
    flexGrow: 1,
  },
}));

// This is a mock and should match branch schema of the data-layer.
const mockBranchData = [
  { id: '1', name: 'Branch 1.0', description: 'sample description'},
  { id: '2', name: 'Branch 1.1', description: 'sample description that is really really long, to see how things render when the text wraps to another line.'},
  { id: '3', name: 'Branch 1.2' },
];

export default function RouterPanel(/* { editorId } */) {
  const classes = useStyles();
  const [branchData, setBranchData] = useState(mockBranchData);
  const fieldMeta = useMemo(() => (fieldMetadata), []);
  const formKey = useFormInitWithPermissions({ fieldMeta });

  const handleNameChange = (title, position) => {
    setBranchData(
      produce(branchData, draft => {
        draft[position].name = title;
      }));
  };

  const SortableContainer = sortableContainer(({children}) => (
    <ul className={classes.branchList}>
      {children}
    </ul>
  ));

  const SortableItem = sortableElement(props => (
    <BranchItem {...props} />
  ));

  const handleSortEnd = ({oldIndex, newIndex}) => {
    setBranchData(items => (moveArrayItem(items, oldIndex, newIndex)));
  };

  return (
    <div className={classes.panelContent}>
      <DynaForm formKey={formKey} />

      <Divider orientation="horizontal" className={classes.divider} />

      <SortableContainer onSortEnd={handleSortEnd} useDragHandle>
        { branchData.map((b, i) => (
          <SortableItem
            key={b.name}
            index={i} // The HOC does not proxy index to child, so we need `position` as well.
            position={i}
            branchName={b.name}
            onNameChange={handleNameChange} />
        ))}
      </SortableContainer>
    </div>
  );
}
