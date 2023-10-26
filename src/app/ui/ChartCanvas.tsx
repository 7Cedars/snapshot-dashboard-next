// Based on clone from https://github.com/holtzy/react-graph-gallery
"use client";

import { ReactNode, useRef } from "react";
import { useDimensions } from "../hooks/useDimensions";

type ChartCanvasProps = {
  VizComponent: (props: {
    width: number;
    height: number;
  }) => JSX.Element | null; // A component that calls the viz component (e.g. heatmap) with everything needed except width and height
  vizName: string;
  height?: number;
  maxWidth?: number;
  caption?: string | ReactNode;
};

export const ChartCanvas = ({
  VizComponent,
  height = 300,
  maxWidth = 3000,
}: ChartCanvasProps) => {

  // the chart / sandbox will fill the available space until maxWidth is reached
  const chartRef = useRef<HTMLDivElement>(null);
  const chartSize = useDimensions(chartRef);
  // console.log("chartSize @ChartCanvas: ", chartSize )

  return (
    // Add a full screen width wrapper with grey background around everything.
    // It has to be "relative". Note that it goes out of the article container if necessary!

      <div  className="flex flex-col items-center justify-center"  >
        <div className="w-full flex justify-center pointer-events-none">
          <div ref={chartRef}
            style={{ height: height, width: "100%", maxWidth }}
            className="pointer-events-auto"
          >
            <VizComponent height={height} width={chartSize.width} />
          </div>
        </div>
      </div>
  )};
