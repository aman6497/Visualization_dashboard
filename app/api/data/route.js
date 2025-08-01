import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/db';
import Insight from '@/app/lib/models/insightModel';

export async function GET(request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get the URL search parameters
    const { searchParams } = new URL(request.url);
    
    // Build the filter object based on the provided query parameters
    const filters = {};
    
    // Add filters for each field if they exist in the query parameters
    if (searchParams.has('end_year') && searchParams.get('end_year')) {
      filters.end_year = searchParams.get('end_year');
    }
    
    if (searchParams.has('topic') && searchParams.get('topic')) {
      filters.topic = searchParams.get('topic');
    }
    
    if (searchParams.has('sector') && searchParams.get('sector')) {
      filters.sector = searchParams.get('sector');
    }
    
    if (searchParams.has('region') && searchParams.get('region')) {
      filters.region = searchParams.get('region');
    }
    
    if (searchParams.has('pestle') && searchParams.get('pestle')) {
      filters.pestle = searchParams.get('pestle');
    }
    
    if (searchParams.has('source') && searchParams.get('source')) {
      filters.source = searchParams.get('source');
    }
    
    if (searchParams.has('swot') && searchParams.get('swot')) {
      filters.swot = searchParams.get('swot');
    }
    
    if (searchParams.has('country') && searchParams.get('country')) {
      filters.country = searchParams.get('country');
    }
    
    if (searchParams.has('city') && searchParams.get('city')) {
      filters.city = searchParams.get('city');
    }
    
    // Query the database with the filters
    const data = await Insight.find(filters).lean();
    
    // Return the filtered data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}