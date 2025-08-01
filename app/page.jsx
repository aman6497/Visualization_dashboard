'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [showMore, setShowMore] = useState(false);
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-green-600">Data Visualization Dashboard</h1>
          <p className="text-xl text-gray-600">Explore and analyze data with interactive visualizations</p>
        </div>
        
        {/* Main Content */}
        <div className="card slide-in" style={{animationDelay: '0.2s'}}>
          <h2 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h2>
          
          <div className="prose max-w-none">
            <p className="mb-4">
              This dashboard provides interactive visualizations for exploring and analyzing data trends across various sectors, regions, and topics.
            </p>
            
            {showMore ? (
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Interactive Filtering:</strong> Filter data by year, sector, region, and more</li>
                  <li><strong>Multiple Visualizations:</strong> Explore data through various chart types</li>
                  <li><strong>Responsive Design:</strong> Works on desktop and mobile devices</li>
                  <li><strong>Real-time Updates:</strong> See changes instantly as you apply filters</li>
                </ul>
                
                {/* <h3 className="text-xl font-medium">Technologies Used</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Frontend:</strong> Next.js, React, Tailwind CSS</li>
                  <li><strong>Visualizations:</strong> D3.js</li>
                  <li><strong>Database:</strong> MongoDB</li>
                  <li><strong>API:</strong> Next.js API Routes</li>
                </ul> */}
                
                <h3 className="text-xl font-medium">How to Use</h3>
                <p>
                  Navigate to the Dashboard to explore the data. Use the filter panel to narrow down results by various criteria. 
                  Hover over chart elements to see detailed information. The dashboard updates in real-time as you apply filters.
                </p>
                
                <button 
                  onClick={() => setShowMore(false)}
                  className="text-primary hover:text-blue-700 font-medium mt-2"
                >
                  Show Less
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-4">
                  With this tool, you can analyze trends, compare metrics across different dimensions, and gain valuable insights from the data.
                </p>
                <button 
                  onClick={() => setShowMore(true)}
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Learn More
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="text-center slide-in" style={{animationDelay: '0.4s'}}>
          <Link 
            href="/dashboard" 
            className="btn btn-primary inline-block px-8 py-3 text-lg"
          >
            Enter Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}