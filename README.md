# 🌿 EcoTrack - Biodiversity Tracker

EcoTrack is a comprehensive biodiversity monitoring system that uses advanced data structures (Binary Search Tree, Graph, Queue) to track species populations, food chain relationships, and conservation priorities.

## 🚀 Features

- **Species Management**: Add and track species with risk levels, populations, and biomass
- **Food Chain Tracking**: Model predator-prey relationships using graph structures
- **Risk Assessment**: Automatically prioritize endangered species for relocation
- **Population Monitoring**: Track population changes and simulate recovery scenarios
- **Impact Analysis**: Simulate ecosystem impacts when species populations change
- **Dual Interface**: Both console-based (Java) and web-based (Next.js) interfaces

## 📊 Data Structures Used

- **Binary Search Tree (BST)**: Organizes species by risk level for efficient retrieval
- **Graph**: Models food chain relationships and dependencies
- **Queue**: Maintains priority queue for species relocation
- **HashMap**: Fast lookup of species data

## 🖥️ Console Application (Java)

### Prerequisites
- Java JDK 17 or higher
- `javac` compiler

### Running the Console Application

1. Compile the Java files:
```bash
javac -d . EcoTrack/*.java Main.java
```

2. Run the application:
```bash
java Main
```

### Console Features
1. Add a species
2. Record species death
3. Display species in risk order
4. View relocation priority queue
5. View species impact report
6. Add a food chain relationship
7. Simulate biodiversity impact
8. Exit
9. Simulate species recovery

## 🌐 Web Dashboard (Next.js)

### Prerequisites
- Node.js 18+ and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

### Dashboard Features

- **Add Species**: Input species name, risk level (1-5), type (fauna/flora), and population/biomass
- **Food Chain Relations**: Define predator-prey relationships
- **Record Deaths**: Update population counts when deaths occur
- **Simulate Recovery**: Model population recovery scenarios
- **Visual Monitoring**: 
  - Species sorted by risk level with color-coded alerts
  - Relocation priority queue for endangered species
  - Real-time population change tracking
  - Critical status alerts for low populations

## 📁 Project Structure

```
EcoTrack/
├── EcoTrack/                    # Java package directory
│   ├── BiodiversityTracker.java # Main tracker class with BST
│   ├── Graph.java               # Food chain graph implementation
│   ├── SpeciesNode.java         # BST node structure
│   └── SpeciesData.java         # Species data model
├── Main.java                    # Console application entry point
├── app/                         # Next.js app directory
│   ├── layout.tsx              # Root layout component
│   ├── page.tsx                # Main dashboard page
│   └── globals.css             # Global styles
├── package.json                # Node.js dependencies
└── tsconfig.json              # TypeScript configuration
```

## 🎨 Tech Stack

### Backend (Console)
- Java 17+
- Custom data structures (BST, Graph, Queue)

### Frontend (Web Dashboard)
- Next.js 13.5.1
- React 18.2.0
- TypeScript 5.2.2
- Tailwind CSS 3.3.3
- Zustand 4.4.1 (state management)

## 🔧 Development

### Linting
```bash
npm run lint
```

### Type Checking
TypeScript is configured for strict type checking.

## 📝 Usage Examples

### Console Application Example
```
Enter your choice: 1
Species Name: Tiger
Risk Level (1=High, 5=Low): 1
Is it Fauna? (true/false): true
Population: 50
```

### Web Dashboard Example
1. Navigate to http://localhost:3000
2. Fill in the "Add Species" form
3. Adjust the risk level slider (1 = High Risk, 5 = Low Risk)
4. Click "Add Species"
5. View the species in the "Species by Risk Level" section
6. High-risk species appear in the "Relocation Priority Queue"

## 🛡️ Risk Levels

- **Level 1**: Critically Endangered (Red) - Automatic relocation priority
- **Level 2**: Endangered (Orange) - Automatic relocation priority
- **Level 3**: Vulnerable (Yellow)
- **Level 4**: Near Threatened (Blue)
- **Level 5**: Least Concern (Green)

## 🚨 Alerts

- **EXTINCT**: Population reaches 0
- **CRITICAL**: Fauna population < 50
- **HIGHLY ENDANGERED**: Risk Level 1

## 📄 License

This project is part of an educational biodiversity tracking system.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📞 Support

For questions or issues, please open an issue on the GitHub repository.
