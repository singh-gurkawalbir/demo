import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `1fr 100px 1fr`,
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
});

function not(a, b) {
  return a.filter(value => !b.includes(value));
}

function intersection(a, b) {
  return a.filter(value => b.includes(value));
}

function TransferList(props) {
  const { left = [], setLeft, right = [], setRight, classes } = props;
  const [checked, setChecked] = React.useState([]);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);
  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight([...right, ...left]);
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight([...right, ...leftChecked]);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft([...left, ...rightChecked]);
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft([...left, ...right]);
    setRight([]);
  };

  const customList = items => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map &&
          items.map(value => {
            const labelId = `transfer-list-item-${value}-label`;

            return (
              <ListItem
                key={value}
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
            );
          })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <div container className={classes.root}>
      <div>{customList(left)}</div>
      <div className={classes.actions}>
        <Button
          variant="outlined"
          size="small"
          className={classes.button}
          onClick={handleAllRight}
          data-test="movaAllRight"
          disabled={left.length === 0}
          aria-label="move all right">
          ≫
        </Button>
        <Button
          variant="outlined"
          size="small"
          className={classes.button}
          data-test="moveSelectedRight"
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right">
          &gt;
        </Button>
        <Button
          variant="outlined"
          size="small"
          data-test="moveSelectedLeft"
          className={classes.button}
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left">
          &lt;
        </Button>
        <Button
          variant="outlined"
          size="small"
          data-test="moveAllLeft"
          className={classes.button}
          onClick={handleAllLeft}
          disabled={right.length === 0}
          aria-label="move all left">
          ≪
        </Button>
      </div>
      <div>{customList(right)}</div>
    </div>
  );
}

export default withStyles(styles)(TransferList);
