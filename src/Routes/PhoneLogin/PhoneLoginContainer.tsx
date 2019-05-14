import React, { useState } from "react";
import { Mutation, MutationFn } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import {
  startPhoneVerification,
  startPhoneVerificationVariables
} from "src/types/api";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneLoginQueries";

interface IState extends RouteComponentProps {
  countryCode: string;
  phoneNumber: string;
}

class PhoneSignInMutation extends Mutation<
  startPhoneVerification,
  startPhoneVerificationVariables
> {}

function PhoneLoginContainer(props: IState) {
  let phoneMutation: MutationFn;
  const [countryCode, setCountryCode] = useState("+82");
  const [phoneNumber, setPhoneNumber] = useState("");

  const onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = event => {
    const {
      target: { name, value }
    } = event;

    if (name === "countryCode") {
      setCountryCode(value);
    }
    if (name === "phoneNumber") {
      setPhoneNumber(value);
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const isValid = /^\+[1-9]{1,2}[0-9]{7,11}$/.test(phone);
    if (isValid) {
      phoneMutation();
    } else {
      toast.error("Please write a valid phone number");
    }
  };

  const { history } = props;
  const phone = `${countryCode}${phoneNumber}`;

  return (
    <PhoneSignInMutation
      mutation={PHONE_SIGN_IN}
      variables={{
        phoneNumber: phone
      }}
      onCompleted={data => {
        const { StartPhoneVerification } = data;
        if (StartPhoneVerification.ok) {
          toast.success("SMS Sent! Redirecting you...");
          setTimeout(() => {
            history.push({
              pathname: "/verify-phone",
              state: {
                phone
              }
            });
          }, 2000);
        } else {
          toast.error(StartPhoneVerification.error);
        }
      }}
    >
      {(mutation, { loading }) => {
        phoneMutation = mutation;
        return (
          <PhoneLoginPresenter
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
            loading={loading}
          />
        );
      }}
    </PhoneSignInMutation>
  );
}

export default PhoneLoginContainer;
