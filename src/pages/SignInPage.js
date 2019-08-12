import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "../components/common";
import { auth, provider } from "../db";

class SignInPage extends React.Component {
  state = {};
  
  async componentDidMount() {
    
    try {
      await auth.getRedirectResult();
      this.props.history.push(`/projects`);
    } catch (error) {
      console.error('error get redirect authentication: '+error)
    }
    
  }
  _handleSignIn = async () => {
    await auth.signInWithRedirect(provider);
  };
  render() {
    return (
      <div>
        <Button onClick={this._handleSignIn}>Sign in with Google</Button>
      </div>
    );
  }
}

export default SignInPage;
