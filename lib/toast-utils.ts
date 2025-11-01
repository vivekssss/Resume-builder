import { toast } from 'sonner';

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showInfo = (message: string) => {
  toast.info(message);
};

export const showConfirm = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  toast(message, {
    action: {
      label: 'Confirm',
      onClick: onConfirm
    },
    cancel: {
      label: 'Cancel',
      onClick: onCancel || (() => {})
    },
    duration: 10000,
  });
};
