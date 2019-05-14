import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyPhone, verifyPhoneVariables } from "src/types/api";
import { LOG_USER_IN } from "../../sharedQueries.local";
import VerifyPhonePresenter from "./VerifyPhonePresenter";
import { VERIFY_PHONE } from "./VerifyPhoneQueries";

interface IProps extends RouteComponentProps<any> {}

class VerifyMutation extends Mutation<verifyPhone, verifyPhoneVariables> {}

function VerifyPhoneContainer(props: IProps) {
  // tslint:disable-next-line: no-console
  console.log(props);
  if (!props.location.state) {
    props.history.push("/");
  }

  const [verificationKey, setVerificationKey] = useState("");
  const [phoneNumber] = useState(props.location.state.phone);
  console.log(verificationKey, phoneNumber);

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    if (name === "verificationKey") {
      setVerificationKey(value);
    }
  };

  return (
    <Mutation mutation={LOG_USER_IN}>
      {logUserIn => (
        <VerifyMutation
          mutation={VERIFY_PHONE}
          variables={{
            key: verificationKey,
            phoneNumber
          }}
          onCompleted={data => {
            const { CompletePhoneVerification } = data;
            if (CompletePhoneVerification.ok) {
              if (CompletePhoneVerification.token) {
                logUserIn({
                  variables: {
                    token: CompletePhoneVerification.token
                  }
                });
              }
              toast.success("You're verified, loggin in now");
            } else {
              toast.error(CompletePhoneVerification.error);
            }
          }}
        >
          {(mutation, { loading }) => (
            <VerifyPhonePresenter
              onSubmit={mutation}
              onChange={onInputChange}
              verificationKey={verificationKey}
              loading={loading}
            />
          )}
        </VerifyMutation>
      )}
    </Mutation>
  );
}

export default VerifyPhoneContainer;
