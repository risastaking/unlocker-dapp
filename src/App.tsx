import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { Link, Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";
import PageNotFoud from "./components/PageNotFoud";
import * as config from "./config";
import { ContextProvider } from "./context";
import routes, { routeNames } from "./routes";
import "./assets/sass/theme.scss"
import { ErrorBoundary } from "./components/ErrorBoundary";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

export default function App() {

  Sentry.init({
    dsn: "https://dcadc22622894abe97caaa120e024187@o1093646.ingest.sentry.io/6112994",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    beforeSend(event, hint) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) {
        Sentry.showReportDialog({ eventId: event.event_id });
      }
      return event;
    },
  });

  return (
    <Dapp.Context config={config}>
      <ErrorBoundary>
        <ContextProvider>
          <Layout>
            <Switch>
              <Route
                path={routeNames.unlock}
                component={() => (
                  <Dapp.Pages.Unlock
                    callbackRoute={routeNames.dashboard}
                    title={config.dAppName}
                    lead="Please select your login method:"
                    ledgerRoute={routeNames.ledger}
                    walletConnectRoute={routeNames.walletconnect}

                  />
                )}
                exact={true}
              />
              <Route
                path={routeNames.ledger}
                component={() => (
                  <Dapp.Pages.Ledger callbackRoute={routeNames.dashboard} />
                )}
                exact={true}
              />
              <Route
                path={routeNames.walletconnect}
                component={() => (
                  <Dapp.Pages.WalletConnect
                    callbackRoute={routeNames.dashboard}
                    logoutRoute={routeNames.home}
                    title="Maiar Login"
                    lead="Scan the QR code using Maiar"
                  />
                )}
                exact={true}
              />

              {routes.map((route, i) => (
                <Route
                  path={route.path}
                  key={route.path + i}
                  component={route.component}
                  exact={true}
                />
              ))}
              <Route component={PageNotFoud} />
            </Switch>
          </Layout>
        </ContextProvider>
      </ErrorBoundary>
    </Dapp.Context>
  );
}
