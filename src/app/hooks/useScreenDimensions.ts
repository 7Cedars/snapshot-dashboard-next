import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
// £ack Cloned from: https://github.com/holtzy/react-graph-gallery

export const useScreenDimensions = () => {

  const [dimensions, setDimensions] = useState({height: 1, width: 1});

  const handleResize = () => {
    setDimensions({
      height: window.innerHeight, 
      width: window.innerWidth
    })
  };

  useEffect(() => {
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return dimensions;
}

