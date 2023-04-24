import clsx from 'clsx';
import React from 'react';
import {
  makeStyles,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { sortableHandle } from 'react-sortable-hoc';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import EditableText from '../../../../../EditableText';
import GripperIcon from '../../../../../icons/GripperIcon';
import MoreActionsButton from '../MoreActionsButton';
import BranchFilter from '../BranchFilter';
import { selectors } from '../../../../../../reducers';
import InfoIconButton from '../../../../../InfoIconButton';
import InfoIcon from '../../../../../icons/InfoIcon';
import { message } from '../../../../../../utils/messageStore';
import actions from '../../../../../../actions';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';

const useStyles = makeStyles(theme => ({
  summaryContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  accordion: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    padding: 0,
  },
  accordionSummary: {
    width: '100%',
  },
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'block',
    padding: 0,
    '& > div > div': {
      margin: 0,
      border: 'none',
    },
  },
  branchName: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
  },
  description: {
    flexGrow: 1,
    marginTop: 3,
  },
  expandable: {
    marginLeft: theme.spacing(4),
  },
  expandIcon: {
    position: 'absolute',
    left: allowSorting => theme.spacing(allowSorting ? 5 : 2),
  },
  listItem: {
    display: 'flex',
    // must be higher than the drawer z-index, otherwise when dragging
    // the list item "disappears" under the drawer.
    zIndex: 1301,
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
    color: theme.palette.background.paper,
  },
  accordionContainer: {
    flexGrow: 1,
  },
  expanded: {
    marginBottom: '16px !important',
  },
  focused: {
    backgroundColor: `${theme.palette.background.paper} !important`,
  },
  headerContainer: {
    display: 'flex',
    backgroundColor: 'rgba(236, 236, 236, 0.5)',
    padding: theme.spacing(1, 0, 0, 2),
  },
  infoMsgContainer: {
    display: 'flex',
    padding: theme.spacing(0, 1, 2, 4),
    backgroundColor: 'rgba(236, 236, 236, 0.5)',
    '& > *': {
      color: `${theme.palette.secondary.light} !important`,
    },
    '& > svg': {
      marginRight: theme.spacing(1),
    },
  },
}));

const DragHandle = sortableHandle(() => (
  <GripperIcon style={{ cursor: 'grab' }} />
));

function getBranchName(position, branches, routerNameIndex) {
  let index = 0;
  const branchNames = branches.map(branch => branch.name);

  for (let i = position; i < position + branches.length + 1; i += 1) {
    const tempName = `Branch ${routerNameIndex}.${i}`;

    if (!branchNames.includes(tempName) || branches[position].name === tempName) {
      index = i;
      break;
    }
  }

  return `Branch ${routerNameIndex}.${index}`;
}

export default function BranchItem({
  expandable,
  position,
  isViewMode,
  editorId,
  allowDeleting,
  allowSorting,
}) {
  const [enquesnackbar] = useEnqueueSnackbar();
  const classes = useStyles(allowSorting);
  const dispatch = useDispatch();
  const { rules, branches = [] } = useSelector(state => {
    const editorRule = selectors.editorRule(state, editorId);

    return {
      rules: editorRule?.branches?.[position]?.inputFilter?.rules,
      branches: editorRule?.branches,
    };
  }, shallowEqual);

  const branchNamingIndex = useSelector(state => selectors.editor(state, editorId)?.branchNamingIndex);
  const hasRules = !!rules?.length;
  const branchType = useSelector(state => {
    const editorRule = selectors.editorRule(state, editorId);

    return editorRule?.routeRecordsTo;
  });
  const {name: branchName, description, collapsed, pageProcessors} = useSelector(state => {
    const editorRule = selectors.editorRule(state, editorId);

    return editorRule.branches[position];
  }, shallowEqual);
  let infoMessage;

  if (!hasRules) {
    if (
      branchType === 'all_matching_branches' ||
      (branchType === 'first_matching_branch' && position === 0)
    ) {
      infoMessage = message.AFE_EDITOR_PANELS_INFO.BRANCH_EMPTY_FILTER_RECORD_PASS;
    } else {
      infoMessage = message.AFE_EDITOR_PANELS_INFO.BRANCH_EMPTY_FILTER;
    }
  }

  const handleNameChange = (title, position) => {
    let newTitle = title?.trim();

    if (!newTitle) {
      enquesnackbar({message: 'A branch name is required.', variant: 'error'});
      newTitle = getBranchName(position, branches, branchNamingIndex);
    }
    dispatch(actions.editor.patchRule(editorId, newTitle, {rulePath: `branches[${position}].name`}));
  };

  const handleToggleExpand = (collapsed, position) => {
    dispatch(actions.editor.patchRule(editorId, collapsed, {rulePath: `branches[${position}].collapsed`}));
  };

  return (
    <li className={classes.listItem}>
      <Typography component="div" variant="overline" className={classes.index}>
        {position}
      </Typography>

      <div className={classes.accordionContainer}>
        <Accordion
          elevation={0}
          onChange={(event, expanded) => handleToggleExpand(!expanded, position)}
          expanded={!collapsed}
          square
          classes={{ expanded: classes.expanded }}
          className={classes.accordion}
        >
          <AccordionSummary
            classes={{
              expandIcon: classes.expandIcon,
              focused: classes.focused,
            }}
            className={classes.accordionSummary}
            expandIcon={expandable && <ArrowDownIcon />}
          >
            <div className={classes.summaryContainer}>
              {allowSorting && <DragHandle />}
              <div
                className={clsx(classes.branchName, {
                  [classes.expandable]: expandable,
                })}
              >
                <EditableText
                  allowOverflow
                  disabled={isViewMode}
                  text={branchName}
                  defaultText="Unnamed branch: Click to add name"
                  onChange={title => handleNameChange(title, position)}
                  inputClassName={classes.editableTextInput}
                />
              </div>

              <div className={classes.description}>
                {description && <InfoIconButton size="xs" info={description} title={branchName} />}
              </div>

              {!isViewMode && (
              <MoreActionsButton
                position={position}
                pageProcessors={pageProcessors}
                allowDeleting={allowDeleting}
                editorId={editorId}
              />
              )}
            </div>
          </AccordionSummary>

          {expandable && (
            <AccordionDetails className={classes.accordionDetails}>
              <div className={classes.headerContainer}>
                <Typography variant="subtitle2">Record flow conditions:</Typography>
              </div>
              <BranchFilter
                editorId={editorId} position={position}
                key={rules} // to force remount when rules change as querybuilder is not being updated in render phase
               />
              {infoMessage && (
                <div className={classes.infoMsgContainer}>
                  <InfoIcon />
                  <Typography variant="body2">{infoMessage}</Typography>
                </div>
              )}
            </AccordionDetails>
          )}
        </Accordion>
      </div>
    </li>
  );
}
