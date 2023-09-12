// Based on clone from https://github.com/holtzy/react-graph-gallery

import { useMemo } from "react";
import * as d3 from "d3";
// import { data } from "../../data/dummyHeatmapData";   // data: { x: string; y: string; value: number }[];
import { useAppSelector } from "../../../redux/hooks";
import { toHeatmapData } from "../../utils/transposeData";
import { toDateFormat } from "../../utils/utils";
import { parseUrlInput } from "../../utils/parsers";
import { useParams } from 'next/navigation'
// import { useParams } from "react-router-dom";
import { Proposal } from "../../../../types"


const MARGIN = { top: 10, right: 10, bottom: 30, left: 10 };

type HeatmapProps = {
  width: number;
  height: number;
};

export const Heatmap = ({ width = 500, height = 400}: HeatmapProps) => {
  // const { selectedSpaces, startDate, endDate } = useAppSelector(state => state.userInput)
  const dataUrl = useParams(); 
  const { selectedSpaces, startDate, endDate  }  = parseUrlInput(dataUrl)

  const { proposals } = useAppSelector(state => state.loadedProposals) 
  
  const selectedProposals = proposals.filter((proposal: Proposal) => {
    return selectedSpaces.includes(proposal.space.id)
  })
  const nCol =  Math.floor((width / height) * selectedSpaces.length)

  const data = toHeatmapData({proposals: selectedProposals, start: startDate, end: endDate, nCol}) 
  
  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // groups
  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

  // console.log("data inside Heatmap: ", data)

  // x and y scales
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);
  }, [data, height]);

  const [min, max] = d3.extent(data.map((d) => d.value));

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
  const allRects = data.map((d, i) => {
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
