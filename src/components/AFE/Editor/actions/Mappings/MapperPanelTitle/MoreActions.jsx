import React, { useCallback, useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import EllipsisIcon from '../../../../../icons/EllipsisHorizontalIcon';
import AddIcon from '../../../../../icons/AddIcon';
import TrashIcon from '../../../../../icons/TrashIcon';
import ArrowPopper from '../../../../../ArrowPopper';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import RawHtml from '../../../../../RawHtml';
import useConfirmDialog from '../../../../../ConfirmDialog';
import messageStore from '../../../../../../utils/messageStore';
import { hasV2MappingsInTreeData, isCsvOrXlsxResourceForMapper2 } from '../../../../../../utils/mapping';
import { useSelectorMemo } from '../../../../../../hooks';

const useStyles = makeStyles(theme => ({
  menuList: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest} !important`,
  },
}));

const getActions = importHasSampleData => [
  {
    action: 'autocreate',
    label: 'Auto-populate destination fields',
    optionDisabled: !importHasSampleData,
    Icon: <AddIcon />,
    toolTip: importHasSampleData ? 'Click <b>Learn about Mapper 2.0</b> above for more info on auto-population.'
      : 'Auto-populate is not available for this connector.<br><br>Click <b>Learn about Mapper 2.0</b> above for more info on auto-population.',
  },
  {
    action: 'deleteall',
    label: 'Remove all mappings',
    Icon: <TrashIcon />,
  }];

export default function MoreActions({importId, disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const actionsPopoverId = open ? 'row-actions' : undefined;
  const handleMenuClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const importSampleData = useSelector(state => selectors.mappingImportSampleData(state));
  const importResource = useSelectorMemo(selectors.makeResourceSelector, 'imports', importId);
  const isCSVOrXLSX = isCsvOrXlsxResourceForMapper2(importResource);

  const hasV2Mappings = useSelector(state => {
    const {v2TreeData = [], lookups} = selectors.mapping(state);

    return hasV2MappingsInTreeData(v2TreeData, lookups);
  });

  const actionsMenu = useMemo(() => getActions(!!importSampleData), [importSampleData]);
  const handleAction = useCallback(action => () => {
    handleMenuClose();

    if (action === 'autocreate') {
      if (hasV2Mappings) {
        confirmDialog({
          title: 'Confirm auto-populate',
          message: <RawHtml html={messageStore('MAPPER2_AUTO_CREATE_STRUCTURE')} />,
          buttons: [
            {
              label: 'Auto-populate',
              onClick: () => {
                dispatch(actions.mapping.v2.autoCreateStructure(importSampleData, isCSVOrXLSX));
              },
            },
            {
              label: 'Cancel',
              variant: 'text',
            },
          ],
        });
      } else {
        dispatch(actions.mapping.v2.autoCreateStructure(importSampleData, isCSVOrXLSX));
      }
    } else {
      dispatch(actions.mapping.v2.deleteAll(isCSVOrXLSX));
    }
  }, [confirmDialog, dispatch, handleMenuClose, hasV2Mappings, importSampleData, isCSVOrXLSX]);

  return (
    <>
      <IconButton
        data-test="openActionsMenu"
        aria-label="more"
        aria-controls={actionsPopoverId}
        aria-haspopup="true"
        size="small"
        onClick={handleMenuClick}>
        <EllipsisIcon />
      </IconButton>

      {open && (
        <ArrowPopper
          placement="bottom-end"
          restrictToParent={false}
          open={open}
          anchorEl={anchorEl}
          id={actionsPopoverId}
          onClose={handleMenuClose}>
          {actionsMenu.map(({action, label, Icon, toolTip, optionDisabled}) => (
            <Tooltip key={action} title={toolTip ? <RawHtml html={toolTip} /> : ''} placement="bottom" >
              <div>
                <MenuItem data-test={action} onClick={handleAction(action)} className={classes.menuList} disabled={disabled || optionDisabled}>
                  {Icon}
                  {label}
                </MenuItem>
              </div>
            </Tooltip>
          ))}
        </ArrowPopper>
      )}
    </>
  );
}

