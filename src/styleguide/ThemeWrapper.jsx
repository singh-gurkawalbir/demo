import { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ErrorPanel from '../components/ErrorPanel';
import themeProvider from '../theme/themeProvider';

export default class ThemeWrapper extends Component {
  state = {
    error: null,
  };

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    const { themeName = 'light' } = this.props;
    const theme = themeProvider(themeName);

    return (
      <MuiThemeProvider theme={theme}>
        {this.state.error ? (
          <ErrorPanel error={this.state.error} />
        ) : (
          this.props.children
        )}
      </MuiThemeProvider>
    );
  }
}
