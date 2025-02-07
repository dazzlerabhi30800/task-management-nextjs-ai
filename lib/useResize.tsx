import { useActionStore } from "@/public/store/ActionSlice";
import { useEffect, useState } from "react";

const useResize = () => {
  const [resize, setRezise] = useState(window.innerWidth);
  const { setShowComp } = useActionStore((state) => state);
  const handleResize = () => {
    setRezise(window.innerWidth);
    setShowComp(window.innerWidth < 768 ? false : true);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { resize };
};

export default useResize;
