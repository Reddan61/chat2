import { FC } from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { ForgotPasswordForm } from "../ForgotPasswordForm";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
}

export const ForgotDialog: FC<Props> = ({ isOpen, closeDialog }) => {
  const onCancel = () => {
    closeDialog();
  };

  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>Восстановаление пароля</DialogTitle>
      <DialogContent>
        <ForgotPasswordForm onCancel={onCancel} />
      </DialogContent>
    </Dialog>
  );
};
