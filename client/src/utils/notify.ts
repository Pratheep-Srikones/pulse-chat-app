import toast from "react-hot-toast";

export const toastError = (message: string) => {
  toast(message, {
    icon: "❌",
    style: {
      border: "1px solid #ff4d4f",
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};

export const toastSuccess = (message: string) => {
  toast(message, {
    icon: "✅",
    style: {
      border: "1px solid #00c48c",
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  });
};
