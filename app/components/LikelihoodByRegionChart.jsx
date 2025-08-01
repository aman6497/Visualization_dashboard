'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LikelihoodByRegionChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Group data by region and calculate average likelihood
    const regionData = d3.rollup(
      data,
      v => ({
        count: v.length,
        avgLikelihood: d3.mean(v, d => d.likelihood)
      }),
      d => d.region
    );

    // Convert Map to array and filter out empty regions
    const regionArray = Array.from(regionData, ([region, values]) => ({
      region,
      count: values.count,
      avgLikelihood: values.avgLikelihood
    }))
      .filter(d => d.region) // Filter out empty regions
      .sort((a, b) => b.count - a.count);

    // Set up dimensions
    const width = 500;
    const height = 400;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(regionArray.map(d => d.region))
      .range(d3.schemeCategory10);

    // Create pie chart layout
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    // Generate arc data
    const arc = d3.arc()
      .innerRadius(radius * 0.4) // Create a donut chart
      .outerRadius(radius);

    // Create outer arc for labels
    const outerArc = d3.arc()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1);

    // Add title
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -height / 2 + margin / 2)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Data Distribution by Region');

    // Create pie chart segments
    const segments = svg.selectAll('path')
      .data(pie(regionArray))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.region))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
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
          .html(`
            <strong>Region:</strong> ${d.data.region}<br>
            <strong>Count:</strong> ${d.data.count}<br>
            <strong>Avg. Likelihood:</strong> ${d.data.avgLikelihood.toFixed(2)}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .transition()
          .duration(200)
          .style('opacity', 0.9);

        // Highlight the segment
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('d', d3.arc()
            .innerRadius(radius * 0.4)
            .outerRadius(radius * 1.05));
      })
      .on('mouseout', function(event, d) {
        // Remove tooltip on mouseout
        d3.selectAll('.tooltip').remove();

        // Restore original segment
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.8)
          .attr('d', arc);
      });

    // Add labels
    const labelGroup = svg.selectAll('text.label')
      .data(pie(regionArray))
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('dy', '.35em')
      .text(d => {
        // Only show label if segment is large enough
        return d.data.count > data.length * 0.05 ? d.data.region : '';
      })
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      .style('font-size', '12px');

    // Add polylines between segments and labels
    svg.selectAll('polyline')
      .data(pie(regionArray))
      .enter()
      .append('polyline')
      .attr('points', d => {
        // Only add polyline if segment is large enough
        if (d.data.count <= data.length * 0.05) return '';
        
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', '1px');

  }, [data]);

  return (
    <div className="card">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LikelihoodByRegionChart;