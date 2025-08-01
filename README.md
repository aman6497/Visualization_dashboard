# Data Visualization Dashboard

A full-stack data visualization dashboard built with Next.js, MongoDB, Tailwind CSS, and D3.js. This dashboard allows you to explore and analyze insights with interactive visualizations.

## Features

- **Interactive Visualizations**: Explore data through bar charts, pie charts, scatter plots, and more
- **Filtering Capabilities**: Filter data by various fields including sector, region, topic, etc.
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data Updates**: Visualizations update instantly when filters are applied

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Data Visualization**: D3.js
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Language**: JavaScript

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd visualization-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB Atlas

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient)
3. Set up database access:
   - Create a database user with read and write permissions
   - Remember the username and password
4. Set up network access:
   - Add your IP address to the IP Access List
   - Or set it to allow access from anywhere (0.0.0.0/0) for development
5. Get your connection string:
   - Click on "Connect" for your cluster
   - Select "Connect your application"
   - Copy the connection string

### 4. Import Data to MongoDB

1. Make sure you have the MongoDB Database Tools installed
   - Download from [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools)
   - Add the bin directory to your PATH

2. Run the following command to import your data:

```bash
mongoimport --uri "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/blackcoffer_dashboard" --collection insights --file jsondata.json --jsonArray
```

Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials.

### 5. Configure Environment Variables

1. Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/blackcoffer_dashboard?retryWrites=true&w=majority
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   │   └── data/         # Data API endpoint
│   ├── components/       # React Components
│   │   ├── FilterPanel.jsx
│   │   ├── IntensityChart.jsx
│   │   ├── LikelihoodByRegionChart.jsx
│   │   ├── RelevanceLikelihoodScatterPlot.jsx
│   │   └── TopicsDistributionChart.jsx
│   ├── dashboard/        # Dashboard Page
│   │   └── page.jsx
│   ├── lib/              # Utilities
│   │   ├── db.js         # Database connection
│   │   └── models/       # Mongoose Models
│   │       └── insightModel.js
│   ├── globals.css       # Global styles
│   ├── layout.jsx        # Root layout
│   └── page.jsx          # Home page (redirects to dashboard)
├── public/               # Static assets
├── .env.local.example    # Environment variables example
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## License

MIT