import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "../components/common";
import { firebaseAuth, provider, db } from "../db";

class SignInPage extends React.Component {
  async componentDidMount() {
    firebaseAuth.onAuthStateChanged(googleAuth => {
      if (googleAuth !== null) {
        // 이미 가입된 정보를 찾는다.
        db.ref("users")
          .orderByChild("email")
          .equalTo(googleAuth.email)
          .once("value", data => {
            let user = null;
            // 있으면 그걸로 로그인
            if (data.exists()) {
              user = Object.values(data.val())[0];
            } else {
              // 없으면 유저 문서 추가
              user = {
                id: googleAuth.uid,
                email: googleAuth.email,
                username: googleAuth.displayName,
                signedUpAt: Date.now(),
                projects: {}
              };

              db.ref("users")
                .child(googleAuth.uid)
                .set(user)
                .catch(error => console.error("error adding user: " + error));
            }
            // 스토어에 인증 정보 저장
            this.props.auth.setAuth(user);
            this.props.history.push(`/projects`);
          });
      }
    });
  }

  componentWillUnmount() {
    firebaseAuth.onAuthStateChanged(() => { })
  }

  _handleSignIn = async () => {
    await firebaseAuth.signInWithRedirect(provider);
  };
  render() {
    console.log(this.props.auth)
    return (
      <div>
        <Button onClick={this._handleSignIn}>Sign in with Google</Button>
      </div>
    );
  }
}

export default withRouter(SignInPage);
