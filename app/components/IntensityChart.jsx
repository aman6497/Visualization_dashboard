'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const IntensityChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Group data by sector and calculate average intensity
    const sectorData = d3.rollup(
      data,
      v => d3.mean(v, d => d.intensity),
      d => d.sector
    );

    // Convert Map to array and sort by intensity
    const sectorArray = Array.from(sectorData, ([sector, intensity]) => ({ sector, intensity }))
      .filter(d => d.sector) // Filter out empty sectors
      .sort((a, b) => b.intensity - a.intensity);

    // Set up dimensions and margins
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(sectorArray.map(d => d.sector))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sectorArray, d => d.intensity) * 1.1])
      .range([height, 0]);

    // Create and add x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    // Create and add y-axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Average Intensity by Sector');

    // Add x-axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('Sector');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .text('Average Intensity');

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(sectorArray.map(d => d.sector))
      .range(d3.schemeCategory10);

    // Create and add bars
    svg.selectAll('.bar')
      .data(sectorArray)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.sector))
      .attr('y', d => y(d.intensity))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.intensity))
      .attr('fill', d => color(d.sector))
      .on('mouseover', function(event, d) {
        // Show tooltip on hover
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('border', '1px solid #ddd')
          .style('border-radius', '4px')
          .style('padding', '10px')
          .style('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.1)')
          .style('pointer-events', 'none')
          .style('opacity', 0);

        tooltip
          .html(`<strong>Sector:</strong> ${d.sector}<br><strong>Avg. Intensity:</strong> ${d.intensity.toFixed(2)}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .transition()
          .duration(200)
          .style('opacity', 0.9);

        // Highlight the bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', d3.rgb(color(d.sector)).brighter(0.5));
      })
      .on('mouseout', function(event, d) {
        // Remove tooltip on mouseout
        d3.selectAll('.tooltip').remove();

        // Restore original bar color
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', color(d.sector));
      });

  }, [data]);

  return (
    <div className="card">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default IntensityChart;