import axios from "axios";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { setAccessToken } from "../auth";
import { InputField } from "../components/InputField";
import { mapFormErrors } from "../util/mapFormErrors";

export default function Register() {
  const router = useRouter();

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      onSubmit={async (values, { setErrors }) => {
        const data = await (
          await axios.post("/api/register", values, {
            headers: {
              "Content-Type": "application/json",
            },
          })
        ).data;

        if (data.errors.length > 0) {
          const errors = mapFormErrors(data.errors);
          setErrors(errors);
          return;
        }

        setAccessToken(data["accessToken"]);

        router.push("/dashboard");
      }}
    >
      {({ isSubmitting, isValid }) => (
        <>
          <button
            type="button"
            className="backButton"
            onClick={() => router.back()}
          >
            {"<"}
          </button>
          <Form className="registerContainer">
            <InputField
              label="Username"
              name="username"
              placeholder="insert text here"
              type="text"
            ></InputField>
            <InputField
              label="Email"
              name="email"
              placeholder="insert text here"
              type="email"
            ></InputField>
            <InputField
              label="Password"
              name="password"
              placeholder="insert text here"
              type="password"
            ></InputField>
            <button disabled={!isValid} type="submit">
              {isSubmitting ? <div className="loader"></div> : "Register"}
            </button>
          </Form>
        </>
      )}
    </Formik>
  );
}
