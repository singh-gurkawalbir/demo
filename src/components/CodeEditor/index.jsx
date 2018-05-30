import { Component } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Controlled } from 'react-codemirror2';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

@withStyles({
  root: {
    fontSize: 16,
  },
})
export default class CodeEditor extends Component {
  static propTypes = {
    value: string.isRequired,
    onChange: func,
    options: shape({
      mode: string,
      theme: string,
      lineNumbers: bool,
    }),
  };

  static defaultProps = {
    onChange: null,
    options: {
      theme: 'material',
      lineNumbers: true,
    },
  };

  handleTextUpdate = (editor, data, value) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    const { value, options, classes } = this.props;

    return (
      <Controlled
        className={classes.root}
        value={value}
        options={options}
        onBeforeChange={this.handleTextUpdate}
      />
    );
  }
}
