// Based on clone from https://github.com/holtzy/react-graph-gallery

import { useMemo } from "react";
import * as d3 from "d3";
import { useDateRange, useSpaces } from "@/app/hooks/useUrl";
import { toHeatmapData } from "../../utils/transposeData";
import { toDateFormat } from "../../utils/utils";
import { Proposal } from "../../../types"
import { useApolloClient } from "@apollo/client";

const MARGIN = { top: 10, right: 10, bottom: 30, left: 10 };

interface HeatmapProps {
  width: number;
  height: number;
};

const nCol = 60

export const Heatmap = ({ width = 500, height = (width / nCol) }: HeatmapProps) => {
  const { dateA, dateB } = useDateRange()
  const { selectedSpaces } = useSpaces()

  const { cache }  = useApolloClient()
  const cachedProposals = Object.values(cache.extract())
  .filter(item => item.__typename === "Proposal") 

  const votes=  cachedProposals.map(proposal => proposal.votes)
  console.log("cachedProposals votes: ", votes)

  const startDate = Math.min(dateA, dateB)
  const endDate = Math.max(dateA, dateB)

  const selectedProposals = cachedProposals.filter((proposal: any) => {
    return selectedSpaces.includes(
      proposal.space.__ref.replace("Space:", "")
      )
  }) 

  console.log({
    selectedProposals: selectedProposals, 
    startDate: startDate, 
    endDate: endDate
  })

  const dataMap = toHeatmapData({proposals: selectedProposals, start: startDate, end: endDate, nCol}) 
  
  // console.log("dataMap: ", dataMap )

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

  // Color scale
  const colorScale = d3
    .scaleSequentialSqrt()
    .interpolator(d3.interpolateOranges)
    .domain([min, max]);

  // Build the rectangles
  const allRects = dataMap.map((d, i) => {
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
        stroke={"white"}
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
            {toDateFormat(parseInt(timestamp))}
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
        fontSize={10}
      >
        {""}
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
