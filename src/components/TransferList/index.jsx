import React, { Fragment, useCallback, useMemo} from 'react';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import { ListSubheader } from '@mui/material';
import OutlinedButton from '../Buttons/OutlinedButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '1fr 100px 1fr',
  },
  paper: {
    height: 300,
    wordBreak: 'break-word',
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(1),
  },
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
}));

function not(a, b) {
  return a.filter(value => !b.includes(value));
}

function intersection(a, b) {
  return a.filter(value => b.includes(value));
}

const SubHeader = ({subHeaderMap, scope, scopes, index}) => {
  if (subHeaderMap && subHeaderMap[scope] && subHeaderMap[scopes[index - 1]] !== subHeaderMap[scopes[index]]) {
    return (

      <ListSubheader disableSticky>{subHeaderMap[scope]}</ListSubheader>

    );
  }

  return null;
};
// this is necessary to preserve the order of scopes
const sortPerOriginalScopesList = scopesOrig => scopes => scopesOrig?.filter(scope => scopes.includes(scope));

export default function TransferList(props) {
  const { left = [], setLeft, right = [], setRight, subHeaderMap, scopesOrig } = props;

  const classes = useStyles();

  const [checked, setChecked] = React.useState([]);
  const leftChecked = useMemo(() => intersection(checked, left), [checked, left]);
  const rightChecked = useMemo(() => intersection(checked, right), [checked, right]);
  const handleToggle = useCallback(value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  }, [checked]);

  const handleAllRight = useCallback(() => {
    setRight(sortPerOriginalScopesList(scopesOrig)([...right, ...left]));
    setLeft([]);
  }, [left, right, scopesOrig, setLeft, setRight]);

  const handleCheckedRight = useCallback(() => {
    setRight(sortPerOriginalScopesList(scopesOrig)([...right, ...leftChecked]));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  }, [checked, left, leftChecked, right, scopesOrig, setLeft, setRight]);

  const handleCheckedLeft = useCallback(() => {
    setLeft(sortPerOriginalScopesList(scopesOrig)([...left, ...rightChecked]));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  }, [checked, left, right, rightChecked, scopesOrig, setLeft, setRight]);

  const handleAllLeft = useCallback(() => {
    setLeft(sortPerOriginalScopesList(scopesOrig)([...left, ...right]));
    setRight([]);
  }, [left, right, scopesOrig, setLeft, setRight]);

  const customList = items => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items &&
          items.map((value, index) => {
            const labelId = `transfer-list-item-${value}-label`;

            return (
              <Fragment key={value}>
                <SubHeader
                  subHeaderMap={subHeaderMap}
                  scope={value}
                  scopes={items}
                  index={index}
              />
                <ListItem
                  role="listitem"
                  button
                  data-test="selectListItem"
                  onClick={handleToggle(value)}>
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      color="primary"
                      inputProps={{ 'aria-labelledby': labelId }}
                  />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value} />
                </ListItem>
              </Fragment>
            );
          })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <div className={classes.root}>
      <div>{customList(left)}</div>
      <div className={classes.actions}>
        <OutlinedButton
          color="secondary"
          size="small"
          className={classes.button}
          onClick={handleAllRight}
          data-test="movaAllRight"
          disabled={left.length === 0}
          aria-label="move all right">
          ≫
        </OutlinedButton>
        <OutlinedButton
          size="small"
          color="secondary"
          className={classes.button}
          data-test="moveSelectedRight"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right">
          &gt;
        </OutlinedButton>
        <OutlinedButton
          size="small"
          color="secondary"
          data-test="moveSelectedLeft"
          className={classes.button}
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left">
          &lt;
        </OutlinedButton>
        <OutlinedButton
          color="secondary"
          size="small"
          data-test="moveAllLeft"
          className={classes.button}
          onClick={handleAllLeft}
          disabled={right.length === 0}
          aria-label="move all left">
          ≪
        </OutlinedButton>
      </div>
      <div>{customList(right)}</div>
    </div>
  );
}
