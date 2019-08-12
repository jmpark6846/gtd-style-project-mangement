import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "../components/common";
import { auth, provider, db } from "../db";
import { generateId } from "../utils";
import { Subscribe } from "unstated";
import AuthContainer from '../containers/AuthContainer'

class SignInPage extends React.Component {
  async componentDidMount() {
    let googleAuth = null;
    try {
      let res = await auth.getRedirectResult();
      googleAuth = res.user;
    } catch (error) {
      console.error("error get redirect authentication: " + error);
    }

    if (googleAuth !== null) {
      // 이미 가입된 정보를 찾는다.
      db.ref("users")
        .orderByChild("email")
        .equalTo(googleAuth.email)
        .on("value", data => {
          let user = null;
          const userId = generateId();
          // 있으면 그걸로 로그인
          if (data.exists()) {
            user = Object.values(data.val())[0];
          } else {
            // 없으면 유저 문서 추가
            user = {
              id: userId,
              email: user.email,
              username: user.displayName,
              signedUpAt: Date.now(),
            };

            db.ref("users")
              .child(userId)
              .set(user)
              .catch(error => console.error("error adding user: " + error));
          }
          // 스토어에 인증 정보 저장
          this.props.auth.setAuth(user)
          this.props.history.push(`/projects`);
        });
    }
  }
  _handleSignIn = async () => {
    await auth.signInWithRedirect(provider);
  };
  render() {
    console.log(this.props.auth)
    return (
      
      <div>
        <Subscribe to={[AuthContainer]}>
        { authContainer => <Button onClick={()=>this._handleSignIn(AuthContainer.setAuth)}>Sign in with Google</Button>}
      </Subscribe>
        
      </div>
    );
  }
}

export default withRouter(SignInPage);
