import { Toast, ToastContainer } from 'react-bootstrap';
import { useState } from 'react';

let idCounter = 0;
export const useNotifications = () => {
  const [toasts, setToasts] = useState([]);
  const notify = (msg, variant = 'success') => {
    const id = idCounter++;
    setToasts(ts => [...ts, { id, msg, variant }]);
    setTimeout(() => {
      setToasts(ts => ts.filter(t => t.id !== id));
    }, 3000);
  };
  const RenderNotifications = () => (
    <ToastContainer position="top-end" className="p-3">
      {toasts.map(t => (
        <Toast key={t.id} bg={t.variant} onClose={() => setToasts(ts => ts.filter(x => x.id !== t.id))}>
          <Toast.Body className="text-white">{t.msg}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
  return { notify, RenderNotifications };
};
