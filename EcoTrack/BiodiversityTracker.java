package EcoTrack;

import java.util.*;

public class BiodiversityTracker {

    private SpeciesNode root;
    private Queue<String> relocationQueue;
    private HashMap<String, SpeciesData> speciesMap;
    private Graph foodChainGraph;
    private Map<String, Integer> initialPopulations;

    public BiodiversityTracker() {
        this.root = null;
        this.relocationQueue = new LinkedList<>();
        this.speciesMap = new HashMap<>();
        this.foodChainGraph = new Graph();
        this.initialPopulations = new HashMap<>();
    }

    public void insertSpecies(String name, int riskLevel, int population, boolean isFauna, double biomass) {
        if (speciesMap.containsKey(name.toLowerCase())){
            SpeciesData updted = new SpeciesData(riskLevel,population,isFauna,biomass);
            speciesMap.put(name.toLowerCase(),updted);
            updateBST(name,riskLevel,population,isFauna,biomass);
            return;
        }
        speciesMap.put(name, new SpeciesData(riskLevel, population, isFauna, biomass));
        if (isFauna) {
            initialPopulations.put(name, population);
        }
        foodChainGraph.addSpeciesPopulation(name, population);
        root = insertBST(root, name, riskLevel, population);
        if (riskLevel <= 2) {
            relocationQueue.add(name);
        }
        checkForAlert(name, population, riskLevel);
    }

    private void updateBST(String name, int riskLevel, int population, boolean isFauna, double biomass) {
        root = updateBSTNode(root, name, riskLevel, population, isFauna, biomass);
    }

    private SpeciesNode updateBSTNode(SpeciesNode node, String name, int riskLevel, int population, boolean isFauna, double biomass) {
        if (node == null) {
            return null;
        }

        if (name.compareTo(node.name) < 0) {
            node.left = updateBSTNode(node.left, name, riskLevel, population, isFauna, biomass);
        } else if (name.compareTo(node.name) > 0) {
            node.right = updateBSTNode(node.right, name, riskLevel, population, isFauna, biomass);
        } else {
            node.riskLevel = riskLevel;
            node.population = population;
        }

        return node;
    }

    private SpeciesNode insertBST(SpeciesNode node, String name, int riskLevel, int population) {
        if (node == null) {
            return new SpeciesNode(name, riskLevel, population);
        }
        if (riskLevel < node.riskLevel) {
            node.left = insertBST(node.left, name, riskLevel, population);
        } else {
            node.right = insertBST(node.right, name, riskLevel, population);
        }
        return node;
    }

    public void addFoodChainRelation(String predator, String prey) {
        foodChainGraph.addEdge(predator, prey);
    }

    public void simulateScenario(Scanner scanner) {
        System.out.println("\n--- Biodiversity Impact Simulation ---");
        System.out.print("Enter species to analyze impact: ");
        String species = scanner.nextLine();
        foodChainGraph.simulateImpact(species);
    }

    public void simulateRecovery(String name, int recoveredPop) {
        if (!speciesMap.containsKey(name)) {
            System.out.println("Species not found.");
            return;
        }
        SpeciesData data = speciesMap.get(name);
        data.population += recoveredPop;
        System.out.println("✅ " + name + " recovered by " + recoveredPop + " individuals. New population: " + data.population);
        if (data.population >= 50 && relocationQueue.contains(name)) {
            relocationQueue.remove(name);
            System.out.println("🎉 " + name + " has been removed from the relocation priority queue!");
        }
        foodChainGraph.addSpeciesPopulation(name, data.population);
        updateBSTPopulation(root, name, data.population);
    }

    public void recordDeath(String name, int deaths) {
        if (!speciesMap.containsKey(name)) {
            System.out.println("Species not found.");
            return;
        }
        SpeciesData data = speciesMap.get(name);
        data.population -= deaths;
        if (data.population <= 0) {
            System.out.println("⚠ ALERT: " + name + " has gone extinct!");
            data.population = 0;
        } else {
            System.out.println("Updated population of " + name + ": " +  ( (data.isFauna)? ( data.population ) : (data.biomass) ) );
        }
        foodChainGraph.addSpeciesPopulation(name, data.population);
        updateBSTPopulation(root, name, data.population);
        checkForAlert(name, data.population, data.riskLevel);
    }

    private void checkForAlert(String name, int population, int riskLevel) {
        if (population <= 0) {
            System.out.println("⚠ ALERT: " + name + " has gone extinct!");
        } else if (population < 50) {
            System.out.println("⚠ ALERT: " + name + " population is critically low!");
        } else if (riskLevel == 1) {
            System.out.println("⚠ ALERT: " + name + " is highly endangered!");
        }
    }

    private void updateBSTPopulation(SpeciesNode node, String name, int newPopulation) {
        if (node == null) return;
        if (node.name.equals(name)) {
            node.population = newPopulation;
        } else {
            updateBSTPopulation(node.left, name, newPopulation);
            updateBSTPopulation(node.right, name, newPopulation);
        }
    }

    public void displayRiskOrder() {
        System.out.println("\n--- Species by Risk Level (In-Order Traversal) ---");
        inorderTraversal(root);
    }

    private void inorderTraversal(SpeciesNode node) {
        if (node != null) {
            inorderTraversal(node.left);
            int initial = initialPopulations.getOrDefault(node.name, node.population);
            int change = node.population - initial;
            System.out.println("Species: " + node.name + " | Risk Level: " + node.riskLevel + " | Population: " + node.population + " | Change Since Start: " + change);
            inorderTraversal(node.right);
        }
    }

    public void viewRelocationQueue() {
        System.out.println("\n--- Relocation Priority Queue ---");
        for (String species : relocationQueue) {
            System.out.println(species);
        }
    }

    public void speciesImpactReport() {
        System.out.println("\n--- Current Species Impact Report ---");
        for (Map.Entry<String , SpeciesData> entry : speciesMap.entrySet() ) {
            SpeciesData data = entry.getValue();
            String alert = data.population < 50 && data.isFauna ? "⚠ CRITICAL" : "";
            String measure = data.isFauna ? "Population: " + data.population : "Biomass: " + data.biomass;
            System.out.println("Species: " + entry.getKey() + " | Risk Level: " + data.riskLevel + " | " + measure + " " + alert);
        }
    }
}