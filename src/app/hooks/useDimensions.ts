import React, { useState, useEffect, useLayoutEffect } from "react";
// Cloned from: https://github.com/holtzy/react-graph-gallery
// Hook:
// - check the dimension of a target ref
// - listen to window size change
// - return width and height

export const useDimensions = (targetRef: React.RefObject<HTMLDivElement>) => {

  const getDimensions = () => {

    return {
      height: targetRef.current ? targetRef.current.offsetHeight : 0,  // : 0, 
      width: targetRef.current ? targetRef.current.offsetWidth : 0
    };
  };

  const [dimensions, setDimensions] = useState(getDimensions);

  const handleResize = () => {
    setDimensions(getDimensions());
  };

  // useLayoutEffect(() => {
  //   handleResize();
  // }, [ ]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ ]);

  useEffect(() => {
    handleResize();
  }, [ ])




  return dimensions;
}

