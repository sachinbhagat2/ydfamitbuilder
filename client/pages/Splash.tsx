import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Splash = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      navigate("/student-dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-ydf-deep-blue flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-ydf-golden-yellow rounded-full"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-ydf-teal-green rounded-full"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-ydf-golden-yellow rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-8 h-8 bg-ydf-teal-green rounded-full"></div>
      </div>

      {/* Logo container */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isLoaded ? 1 : 0, opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="w-32 h-32 bg-ydf-golden-yellow rounded-full flex items-center justify-center shadow-2xl"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            <div className="text-ydf-deep-blue text-4xl font-bold">YDF</div>
          </div>
        </motion.div>

        {/* Organization name */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center"
        >
          <h1 className="text-white text-2xl font-bold tracking-wide">
            Youth Dreamers Foundation
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-ydf-golden-yellow text-sm mt-2 font-medium"
          >
            Empowering Dreams Through Education
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="absolute bottom-16 flex flex-col items-center space-y-4"
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-ydf-golden-yellow rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-white text-xs opacity-70">Loading...</p>
      </motion.div>
    </div>
  );
};

export default Splash;
