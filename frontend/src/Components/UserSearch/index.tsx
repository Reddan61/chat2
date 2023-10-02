import { FC } from "react";
import { Field, Form, Formik } from "formik";
import { renderTextField } from "../Formik/Fields/Fields";

interface Props {
  onChangeInput: (text: string) => unknown;
}

const UserSearch: FC<Props> = ({ onChangeInput }) => {
  let timeOut: ReturnType<typeof setTimeout>;

  const submit = (values: { search: string }) => {
    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
      onChangeInput(values.search.trim());
    }, 1000);
  };

  return (
    <Formik initialValues={{ search: "" }} onSubmit={submit}>
      {({ handleChange, submitForm }) => (
        <Form>
          <Field
            fullWidth
            margin="dense"
            label="Поиск"
            type="text"
            name="search"
            component={renderTextField}
            onChange={(e: any) => {
              handleChange(e);
              submitForm();
            }}
          />
        </Form>
      )}
    </Formik>
  );
};

export default UserSearch;
