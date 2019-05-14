import React from "react";

interface IProps {
  submitFn: any;
  className?: string;
  children: any;
}

function Form({ submitFn, className, children }: IProps) {
  return (
    <form
      className={className}
      onSubmit={e => {
        e.preventDefault();
        submitFn();
      }}
    >
      {children}
    </form>
  );
}

export default Form;
