import React from "react";
import * as Yup from "yup";
import { Button, DialogActions } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { renderTextField } from "../../Components/Formik/Fields/Fields";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  onCancel: () => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ onCancel }) => {
  const { forgot } = useAuth();

  const submit = async (values: { email: string }, actions: any) => {
    const forgotten = await forgot(values.email);

    if (forgotten) {
      actions.resetForm();
    }
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={submit}
      validationSchema={forgotPasswordSchema}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Field
            name="email"
            component={renderTextField}
            label="Email"
            margin="dense"
            type="text"
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email ? errors.email : null}
            fullWidth
          />
          <DialogActions>
            <Button onClick={onCancel} color="primary">
              Отмена
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Отправить
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Неправильный формат").required("Необходимое поле"),
});
