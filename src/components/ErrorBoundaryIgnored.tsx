import React from "react";

export class ErrorBoundaryIgnored extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        // TODO: log errors
        // You can also log the error to an error reporting service
        //logErrorToMyService(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return null
          }

          return this.props.children;
    }
}