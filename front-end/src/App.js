import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { GlobalStyles } from "./global/styles/GlobalStyles";

import LandingPage from "./pages/landing-page/LandingPage";
import PublicPage from "./pages/public-page/PublicPage";
import ProfileDashboard from "./pages/profile-dashboard/ProfileDashboard";
import PageNotAuthorized from "./pages/error-pages/not-authorized/PageNotAuthorized";
import PageNotFound from "./pages/error-pages/404/PageNotFound";
import PrivatePolicy from "./pages/misc-pages/private-policy/PrivatePolicy";
import Callback from "./auth/Callback";
import PrivateRoute from "./auth/PrivateRoute";
import MainHeader from "./components/header/MainHeader";

import auth0Client from "./auth/Auth";

class App extends React.Component {
  state = {
    checkingSession: true
  };

  async componentDidMount() {
    if (this.props.location.pathname === "/callback") {
      this.setState({ checkingSession: false });
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.setState({ checkingSession: false });
    } catch (err) {
      if (err.error === "login_required") {
        if (this.props.location.pathname.includes("dashboard")) {
          this.props.history.replace("/authorize");
        }
      } else {
        console.error("Silent Auth Failed", err.error);
      }
    }
  }

  render() {
    console.log("===APP RENDER===");
    return (
      <>
        <GlobalStyles />
        <MainHeader />
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/profiles">
            <PublicPage />
          </Route>
          <Route path="/profile-dashboard">
            <PrivateRoute checkingSession={this.state.checkingSession}>
              <ProfileDashboard />
            </PrivateRoute>
          </Route>
          <Route path="/private-policy">
            <PrivatePolicy />
          </Route>
          <Route path="/callback">
            <Callback />
          </Route>
          <Route path="/authorize">
            <PageNotAuthorized />
          </Route>
          <Route>
            <PageNotFound />
          </Route>
        </Switch>
      </>
    );
  }
}

export default withRouter(App);
