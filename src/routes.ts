import React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import withPageTitle from "./components/PageTitle";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Transaction from "./pages/Transaction";

type RouteType = Dapp.RouteType & { title: string };

export const routeNames = {
  home: "/unlocker/",
  dashboard: "/unlocker/dashboard",
  transaction: "/unlocker/transaction",
  unlock: "/unlocker/unlock",
  ledger: "/unlocker/ledger",
  walletconnect: "/unlocker/walletconnect",
};

const routes: RouteType[] = [
  {
    path: "/unlocker/",
    title: "Home",
    component: Home,
  },
  {
    path: "/unlocker/dashboard",
    title: "Dashboard",
    component: Dashboard,
    authenticatedRoute: true,
  },
  {
    path: "/unlocker/transaction",
    title: "Transaction",
    component: Transaction,
  },
];

const wrappedRoutes = () =>
  routes.map((route) => {
    const title = route.title
      ? `${route.title} • Elrond `
      : `Elrond`;
    return {
      path: route.path,
      authenticatedRoute: Boolean(route.authenticatedRoute),
      component: withPageTitle(
        title,
        route.component,
      ) as any as React.ComponentClass<any, any>,
    };
  });

export default wrappedRoutes();
