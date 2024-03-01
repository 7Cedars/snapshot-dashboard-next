// Based on clone from https://github.com/holtzy/react-graph-gallery

import { useMemo } from "react";
import * as d3 from "d3";
import { useDateRange, useSpaces } from "@/app/hooks/useUrl";
import { toHeatmapData } from "../../utils/transposeData";
import { toShortDateFormat } from "../../utils/utils";
import { useApolloClient } from "@apollo/client";
import { toProposals } from "@/app/utils/parsers";
import { colourCodes } from "../../../../constants";

const MARGIN = { top: 10, right: 10, bottom: 20, left: 120 };

interface HeatmapProps {
  width: number;
  height: number;
};

export const Heatmap = ({ width = 500, height = 1 }: HeatmapProps) => {
  const nCol = 50

  const { d1, d2 } = useDateRange()
  const startDate = Math.min(d1, d2)
  const endDate = Math.max(d1, d2)
  
  const { cache }  = useApolloClient()
  const cachedProposals = toProposals({
    proposals: Object.values(cache.extract()).filter(item => item.__typename === "Proposal")
  })
  console.log("cachedProposals @Heatmap: ", cachedProposals)

  const { selectedSpaces } = useSpaces()
  const selectedProposals = cachedProposals.filter((proposal: any) => {
    return selectedSpaces.includes( proposal.space.id )
  }) 
  
  const dataMap = toHeatmapData({proposals: selectedProposals, start: startDate, end: endDate, nCol}) 

  // console.log("dataMap: ", dataMap)
  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // groups
  const allYGroups = useMemo(() => [...new Set(dataMap.map((d) => d.y))], [dataMap]);
  const allXGroups = useMemo(() => [...new Set(dataMap.map((d) => d.x))], [dataMap]);

  // console.log("data inside Heatmap: ", data)

  // x and y scales
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [dataMap, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);
  }, [dataMap, height]);

  const [min, max] = d3.extent(dataMap.map((d) => d.value));

  if (min === undefined || max === undefined) {
    // throw new Error(`Incorrect data at Heatmap`);
    return null;
  }

  // Build the rectangles
  const allRects = dataMap.map((d, i) => {

    const colorScale = d3
    .scaleSequential(["#f3f4f6", colourCodes[selectedSpaces.indexOf(d.y)]]) 
    .domain([min, max / 10]);

    return (
      <rect
        key={i}
        r={4}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={colorScale(d.value)}
        rx={3}
        stroke={"#f3f4f6"}
      />
    );
  });

  const xLabels = allXGroups.map((timestamp, i) => {
    const xPos = xScale(timestamp) ?? 0;
      if (!((i+3)%5)) { 
        return (
          <text
            key={i}
            x={xPos + xScale.bandwidth() / 2}
            y={boundsHeight + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
          >
            {toShortDateFormat(parseInt(timestamp))}
          </text>
        );
      }
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name) ?? 0;
    return (
      <text
        key={i}
        x={-5}
        y={yPos + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={12}
      >
        {`${name.slice(0,10)}...`}
      </text>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allRects}
          {xLabels}
          {yLabels}
        </g>
      </svg>
    </div>
  );
};
