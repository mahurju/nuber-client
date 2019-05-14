import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import { RouteComponentProps } from "react-router";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "src/sharedQueries.local";
import { facebookConnect, facebookConnectVariables } from "src/types/api";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries";

class LoginMutation extends Mutation<
  facebookConnect,
  facebookConnectVariables
> {}

interface IProps extends RouteComponentProps<any> {}

function SocialLoginContainer(props: IProps) {
  let facebookMutation: MutationFn;

  const loginCallback = response => {
    const { name, first_name, last_name, email, id, accessToken } = response;
    if (accessToken) {
      toast.success(`Welcome ${name}!`);
      facebookMutation({
        variables: {
          email,
          fbId: id,
          firstName: first_name,
          lastName: last_name
        }
      });
    } else {
      toast.error("Could not log you in 😔");
    }
  };

  return (
    <Mutation mutation={LOG_USER_IN}>
      {logUserIn => (
        <LoginMutation
          mutation={FACEBOOK_CONNECT}
          onCompleted={data => {
            const { FacebookConnect } = data;
            if (FacebookConnect.ok) {
              logUserIn({
                variables: {
                  token: FacebookConnect.token
                }
              });
            } else {
              toast.error(FacebookConnect.error);
            }
          }}
        >
          {(facebookMutationFn, { loading }) => {
            facebookMutation = facebookMutationFn;
            return <SocialLoginPresenter loginCallback={loginCallback} />;
          }}
        </LoginMutation>
      )}
    </Mutation>
  );
}

export default SocialLoginContainer;
