import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // TODO: log errors
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div style={{padding: '20px'}}>
        <h5>☹ We're sorry, but something went wrong.</h5>
        <p>
          If you continue to have issues, please reach out
          to us on twitter <a href="https://twitter.com/risasoftstaking">@risasoftstaking</a>
        </p>
      </div>
    }

    return this.props.children;
  }
}