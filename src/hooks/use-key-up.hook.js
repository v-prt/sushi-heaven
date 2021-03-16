import { useEffect } from "react";

const useKeyUp = (code, callback) => {
  useEffect(() => {
    const handleKeyUp = (ev) => {
      if (ev.code === code) {
        callback();
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  });
};

export default useKeyUp;
