import { FC } from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { SignUpForm } from "../SignUpForm";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
}

export const SignUpDialog: FC<Props> = ({ isOpen, closeDialog }) => {
  const onCancel = () => {
    closeDialog();
  };

  const close = () => {
    closeDialog();
  };

  return (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>Регистрация</DialogTitle>
      <DialogContent>
        <SignUpForm onCancel={onCancel} close={close} />
      </DialogContent>
    </Dialog>
  );
};
