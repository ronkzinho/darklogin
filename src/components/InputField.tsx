import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <p className="inputLabel">{label}</p>
      <input
        {...field}
        {...props}
        style={error ? { borderBottom: "red solid 2px" } : {}}
      ></input>
      {error && <p className="inputError">{error}</p>}
    </div>
  );
};
