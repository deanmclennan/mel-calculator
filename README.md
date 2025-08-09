# MEL Category Calculator

Application for calculating Minimum Equipment List (MEL) categories for aircraft equipment.

## Features

- ⚡ Lightning fast development with Vite
- 🔧 Interactive MEL category calculator (A, B, C, D)
- 📅 Repair deadline calculations with UTC time handling
- 📊 Calculation history tracking
- 📱 Responsive design with Tailwind CSS
- 🐳 Docker deployment ready
- 🚀 Optimized production builds

## Getting Started

### Development

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

### Docker Deployment

1. Build and run with Docker Compose:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. Or build and run manually:
   \`\`\`bash
   docker build -t mel-calculator .
   docker run -p 3000:80 mel-calculator
   \`\`\`

## MEL Categories

- **Category A**: Items required for safe operation (Per MEL Specification)
- **Category B**: Operational/maintenance relief (3 consecutive calendar days)
- **Category C**: Operational relief (10 consecutive calendar days)  
- **Category D**: Extended operational relief (120 consecutive calendar days)

## Technology Stack

- ⚡ Vite 5
- ⚛️ React 18
- 🎨 Tailwind CSS
- 🐳 Docker with Nginx
- 📦 Optimized production builds

## Project Structure

\`\`\`
src/
├── App.jsx          # Main application component
├── main.jsx         # React entry point
└── index.css        # Global styles with Tailwind

public/              # Static assets
dist/                # Production build output (generated)
\`\`\`

## Build Performance

- **Development**: ~200ms hot reload
- **Production build**: ~2-5 seconds
- **Bundle size**: ~150KB gzipped
- **Docker image**: ~25MB (nginx:alpine)`,


