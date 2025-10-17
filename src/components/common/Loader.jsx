import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WebSiteLogo from "../../assets/icons/logo.png";

function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={WebSiteLogo}
            alt="BoroBazar"
            className="w-40 md:w-56 object-contain"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;