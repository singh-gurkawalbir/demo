import React, { useMemo, useState } from 'react';
// import { useDispatch } from 'react-redux';
import { makeStyles,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@material-ui/core';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';

import DynaForm from '../../../../DynaForm';
import ArrowDownIcon from '../../../../icons/ArrowDownIcon';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import EllipsisHorizontalIcon from '../../../../icons/EllipsisHorizontalIcon';
import GripperIcon from '../../../../icons/GripperIcon';
import EditableText from '../../../../EditableText';

// import actions from '../../../../../actions';
// import { selectors } from '../../../../../reducers';
// import CodePanel from '../Code';

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
  // const dispatch = useDispatch();
  //  const rule = useSelector(state => selectors.editorRule(state, editorId));
  //  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  //  const { errorLine, error} = useSelector(state => selectors.editorPreviewError(state, editorId));
  // const handleChange = newRule => {
  //   dispatch(actions.editor.patchRule(editorId, newRule));
  // };

  const fieldMeta = useMemo(() => ({
    fieldMap: {
      branchType: {
        id: 'branchType',
        name: 'branchType',
        helpText: 'We need help text!',
        type: 'radiogroup',
        label: 'Branching type',
        description: 'Records will flow through',
        // showOptionsHorizontally: true,
        // fullWidth: true,
        options: [
          {
            items: [
              { value: 'first', label: 'First matching branch' },
              { value: 'all', label: 'All matching branches' },
            ],
          },
        ],
        defaultValue: 'first',
      },
      branches: {
        id: 'branches',
        label: 'Branches',
        type: 'labeltitle',
        helpText: 'We need help text!',
      },
    },
  }), []);

  const formKey = useFormInitWithPermissions({ fieldMeta });
  // eslint-disable-next-line no-alert
  const handleTitleChange = e => alert(e);

  const DragHandle = sortableHandle(() => <GripperIcon />);

  const SortableContainer = sortableContainer(({children}) => (
    <ul className={classes.branchList}>
      {children}
    </ul>
  ));

  const SortableItem = sortableElement(({branch, position}) => (
    <li className={classes.listItem}>
      <Typography component="div" variant="overline" className={classes.index}>
        {position}
      </Typography>

      <div className={classes.accordionContainer}>
        <Accordion
          elevation={0}
          square
          className={classes.accordion}>
          <AccordionSummary
            classes={{expandIcon: classes.expandIcon}}
            className={classes.accordionSummary}
            expandIcon={<ArrowDownIcon />}
          >
            <div className={classes.summaryContainer}>
              <DragHandle />
              {/* <ArrowDownIcon /> */}

              <div className={classes.branchName}>
                <EditableText
                  text={branch.name}
                  // disabled={!canEdit}
                  defaultText="Unnamed branch: Click to add name"
                  onChange={handleTitleChange}
                  inputClassName={classes.editableTextInput}
                />
              </div>

              <IconButton size="small">
                <EllipsisHorizontalIcon />
              </IconButton>
            </div>
          </AccordionSummary>

          <AccordionDetails className={classes.accordionDetails}>
            Filter!
          </AccordionDetails>
        </Accordion>
      </div>
    </li>
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
          <SortableItem key={b.name} index={i} position={i} branch={b} />
        ))}
      </SortableContainer>
    </div>
  );
}
