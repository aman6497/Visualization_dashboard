'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopicsDistributionChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Count topics frequency
    const topicCounts = {};
    data.forEach(d => {
      if (d.topic) {
        topicCounts[d.topic] = (topicCounts[d.topic] || 0) + 1;
      }
    });

    // Convert to array and sort by count
    const topicArray = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get top 10 topics

    // Set up dimensions and margins
    const margin = { top: 40, right: 30, bottom: 90, left: 60 };
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
      .domain(topicArray.map(d => d.topic))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(topicArray, d => d.count) * 1.1])
      .range([height, 0]);

    // Create color scale
    const color = d3.scaleOrdinal()
      .domain(topicArray.map(d => d.topic))
      .range(d3.schemeCategory10);

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
      .text('Top 10 Topics Distribution');

    // Add x-axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('Topic');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .text('Count');

    // Create and add bars
    svg.selectAll('.bar')
      .data(topicArray)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.topic))
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.count))
      .attr('fill', d => color(d.topic))
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
          .html(`<strong>Topic:</strong> ${d.topic}<br><strong>Count:</strong> ${d.count}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px')
          .transition()
          .duration(200)
          .style('opacity', 0.9);

        // Highlight the bar
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', d3.rgb(color(d.topic)).brighter(0.5));
      })
      .on('mouseout', function(event, d) {
        // Remove tooltip on mouseout
        d3.selectAll('.tooltip').remove();

        // Restore original bar color
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', color(d.topic));
      });

    // Add count labels on top of bars
    svg.selectAll('.label')
      .data(topicArray)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.topic) + x.bandwidth() / 2)
      .attr('y', d => y(d.count) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.count);

  }, [data]);

  return (
    <div className="card">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TopicsDistributionChart;