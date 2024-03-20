import { useMemo } from "react";
import * as d3 from "d3";
import { useDateRange } from "@/app/hooks/useUrl";
import { toHeatmapData } from "../../utils/transposeData";
import { toShortDateFormat } from "../../utils/utils";
import { useApolloClient } from "@apollo/client";
import { toProposals } from "@/app/utils/parsers";
import { colourCodes } from "../../../../constants";
import { useAppSelector } from "@/redux/hooks";
import { useTheme } from "next-themes";

const MARGIN = { top: 2, right: 2, bottom: 20, left: 2 };

interface HeatmapProps {
  width?: number;
  height?: number
};

export const Heatmap = ({ width = 500, height = 30 }: HeatmapProps ) => { // { width = 500, height = 100 }: HeatmapProps
  const nCol = 20
  const { d1, d2 } = useDateRange() 
  const { theme } = useTheme()
  const startDate = Math.min(d1, d2)
  const endDate = Math.max(d1, d2)
  const tilesColour = theme == 'light' ? "#f8fafc" : "#1e293b"
  const strokeColour = theme == 'light' ? "#f8fafc" : "#1e293b"
  const { cache }  = useApolloClient()
  const { modal: selectedSpace } = useAppSelector(state => state.userInput)
  
  const cachedProposals = toProposals({
    proposals: Object.values(cache.extract()).filter(item => item.__typename === "Proposal")
  })
  const selectedProposals = cachedProposals.filter((proposal: any) => {
    return selectedSpace?.includes( proposal.space.id )
  }) 
  
  const dataMap = toHeatmapData({proposals: selectedProposals, start: startDate, end: endDate, nCol}) 

  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  // groups
  const allYGroups = useMemo(() => [...new Set(dataMap.map((d) => d.y))], [dataMap]);
  const allXGroups = useMemo(() => [...new Set(dataMap.map((d) => d.x))], [dataMap]);


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
    return null;
  }

  // Build the rectangles
  const allRects = dataMap.map((d, i) => {

    const colorScale = d3
    .scaleSequential([tilesColour, colourCodes[selectedSpace.indexOf(d.y)]]) 
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
        stroke={strokeColour} 
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
            stroke={"#64748b"}
          >
            {toShortDateFormat(parseInt(timestamp))}
          </text>
        );
      }
  });

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
        {xLabels}
      </g>
    </svg>
  );
};
