import "./Toast.css";

type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="ui-toast" role="status">
      {message}
    </div>
  );
}
