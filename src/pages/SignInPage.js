import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "../components/common";
import { firebaseAuth, provider, db } from "../db";

class SignInPage extends React.Component {
  usersRef = db.collection("users");

  async componentDidMount() {
    let googleAuth = null;
    let user = null;

    try {
      let result = await firebaseAuth.getRedirectResult();
      googleAuth = result.user;
    } catch (error) {
      console.log("error getting authentication redirection result: " + error);
    }

    if (googleAuth) {
      this.usersRef
        .where("email", "==", googleAuth.email)
        .get()
        .then(userSnapshot => {
          if (userSnapshot.empty) {
            user = {
              id: googleAuth.uid,
              email: googleAuth.email,
              username: googleAuth.displayName,
              signedUpAt: Date.now()
            };

            this.usersRef
              .doc(googleAuth.uid)
              .set(user)
              .catch(error => console.error("error adding user: " + error));
          } else {
            userSnapshot.forEach(userDoc => {
              user = userDoc.data();
            });
          }
          this.props.authCon.setAuth(user);
          this.props.history.push(`/projects`);
        });
    }
  }

  _handleSignIn = async () => {
    await firebaseAuth.signInWithRedirect(provider);
  };

  render() {
    return (
      <div>
        <Button onClick={this._handleSignIn}>Sign in with Google</Button>
      </div>
    );
  }
}

export default withRouter(SignInPage);
