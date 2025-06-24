# aivestie Frontend

A modern React-based investment portfolio management application that helps users create personalized investment portfolios through an interactive questionnaire and provides real-time portfolio tracking and analytics.

## 🚀 Features

- **Interactive Investment Questionnaire** - Personalized portfolio recommendations based on user preferences
- **Real-time Portfolio Dashboard** - Live tracking of portfolio performance with interactive charts
- **User Authentication** - Secure login and session management
- **Portfolio Analytics** - Detailed portfolio breakdown with asset allocation visualization
- **Responsive Design** - Modern Material Design 3 UI with Tailwind CSS
- **Real-time Updates** - Live portfolio balance updates and performance tracking

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **State Management**: Zustand 4.4.7
- **Styling**: Tailwind CSS 3.4.1 with Material Design 3
- **Charts & Visualization**: Recharts 2.9.3
- **Icons**: Lucide React 0.344.0
- **Development**: ESLint, TypeScript, PostCSS

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aivestie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (default Vite port)
   - The application should load with the authentication page

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Builds the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code quality issues |

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AuthPage.tsx    # User authentication
│   ├── Dashboard.tsx   # Main portfolio dashboard
│   ├── Header.tsx      # Navigation header
│   ├── PortfolioChart.tsx     # Chart visualizations
│   ├── PortfolioDetails.tsx   # Detailed portfolio view
│   ├── PortfolioResults.tsx   # Portfolio recommendations
│   ├── ProgressIndicator.tsx  # UI progress indicator
│   └── Questionnaire.tsx      # Investment questionnaire
├── services/           # API and external services
│   └── authService.ts  # Authentication service
├── store/              # State management (Zustand)
│   ├── authStore.ts    # Authentication state
│   └── investmentStore.ts     # Investment data state
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Design System

The application uses **Material Design 3** principles with a custom color palette:

- **Primary Colors**: Blue-based palette for main actions
- **Surface Colors**: Neutral grays for backgrounds and containers
- **Semantic Colors**: Green (positive), Red (negative), Orange (warning)
- **Typography**: Inter font family with Material Design 3 type scale
- **Spacing**: 8px grid system for consistent layouts

## 🔐 Authentication

The application includes a built-in authentication system:
- Users must authenticate before accessing the main application
- Session state is managed through Zustand store
- Authentication status is checked on app initialization

## 📊 Portfolio Features

### Investment Questionnaire
- Multi-step questionnaire to assess investment preferences
- Risk tolerance assessment
- Investment goals and timeline
- Personalized portfolio recommendations

### Dashboard
- Real-time portfolio balance tracking
- Interactive charts showing portfolio performance
- Asset allocation breakdown
- Historical performance data

### Portfolio Management
- Detailed view of individual holdings
- Performance analytics and metrics
- Rebalancing recommendations
- Portfolio optimization suggestions

## 🚦 Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in the `src/` directory
   - Changes will hot-reload automatically

3. **Code Quality**
   ```bash
   npm run lint  # Check for linting issues
   ```

4. **Build for Production**
   ```bash
   npm run build  # Creates optimized production build
   npm run preview  # Preview production build locally
   ```

## 🔧 Configuration

### Vite Configuration
- React plugin for JSX support
- Optimized for Lucide React icons
- Development server with hot module replacement

### Tailwind CSS
- Custom Material Design 3 color system
- Extended typography scale
- Custom spacing and border radius utilities
- Elevation shadows for depth

### TypeScript
- Strict type checking enabled
- Separate configurations for app and Node.js code
- Modern ES modules support

## 🌐 Deployment

The application is built using Vite and can be deployed to any static hosting service:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 Notes

- The application simulates real-time portfolio updates for demonstration purposes
- Portfolio data is managed locally through Zustand state management
- Authentication is handled client-side for development purposes
- Charts and visualizations are powered by Recharts library

## 🆘 Troubleshooting

**Port already in use?**
- Vite will automatically try the next available port (5174, 5175, etc.)
- Or specify a custom port: `npm run dev -- --port 3000`

**Dependencies issues?**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**Build errors?**
- Check TypeScript errors: `npx tsc --noEmit`
- Run linting: `npm run lint`