package EcoTrack;

import java.util.*;

public class Graph {
    private Map<String, List<String>> adjacencyList;
    private Map<String, Integer> populationData;

    public Graph() {
        adjacencyList = new HashMap<>();
        populationData = new HashMap<>();
    }

    public void addEdge(String predator, String prey) {
        adjacencyList.putIfAbsent(predator, new ArrayList<>());
        adjacencyList.get(predator).add(prey);
    }

    public void addSpeciesPopulation(String species, int population) {
        populationData.put(species, population);
    }

//    public void simulateImpact(String species) {
//        if (!adjacencyList.containsKey(species)) {
//            System.out.println("No direct dependency found for " + species);
//            return;
//        }
//        System.out.println("If " + species + " goes extinct, it will impact:");
//        for (String dependent : adjacencyList.get(species)) {
//            int predatorPop = populationData.getOrDefault(species, 0);
//            int preyPop = populationData.getOrDefault(dependent, 0);
//            double dependencyFactor = preyPop == 0 ? 0 : (double) predatorPop / preyPop;
//            System.out.printf("- %s (Dependency Factor: %.2f)%n", dependent, dependencyFactor);
//        }
//    }



    /*
    public void simulateImpact(String species) {
        if (!adjacencyList.containsKey(species)) {
            System.out.println("No direct dependency found for " + species);
            return;
        }
        Set<String> impactedSpecies = new HashSet<>();
        findAllDependencies(species, impactedSpecies);
        System.out.println("If " + species + " goes extinct, it will impact:");
        for (String dependent : impactedSpecies) {
            int predatorPop = populationData.getOrDefault(species, 0);
            int preyPop = populationData.getOrDefault(dependent, 0);
            double dependencyFactor = preyPop == 0 ? 0 : (double) predatorPop / preyPop;
            System.out.printf("- %s (Dependency Factor: %.2f)%n", dependent, dependencyFactor);
        }
    }

    private void findAllDependencies(String species, Set<String> impactedSpecies) {
        if (!adjacencyList.containsKey(species)) {
            return;
        }
        for (String dependent : adjacencyList.get(species)) {
            if (impactedSpecies.add(dependent)) {
                findAllDependencies(dependent, impactedSpecies);
            }
        }
    }

    */

    public void simulateImpact(String species) {
        if (!adjacencyList.containsKey(species)) {
            System.out.println("No direct dependency found for " + species);
            return;
        }
        Set<String> impactedSpecies = new HashSet<>();
        findAllDependencies(species, impactedSpecies);
        System.out.println("If " + species + " goes extinct, it will impact:");
        for (String dependent : impactedSpecies) {
            int predatorPop = populationData.getOrDefault(species, 0);
            int preyPop = populationData.getOrDefault(dependent, 0);
            double dependencyFactor = preyPop == 0 ? 0 : (double) predatorPop / preyPop;
            System.out.printf("- %s (Dependency Factor: %.2f)%n", dependent, dependencyFactor);
        }
    }

    private void findAllDependencies(String species, Set<String> impactedSpecies) {
        if (!adjacencyList.containsKey(species)) {
            return;
        }
        for (String dependent : adjacencyList.get(species)) {
            if (impactedSpecies.add(dependent)) {
                findAllDependencies(dependent, impactedSpecies);
            }
        }
        for (Map.Entry<String, List<String>> entry : adjacencyList.entrySet()) {
            if (entry.getValue().contains(species) && impactedSpecies.add(entry.getKey())) {
                findAllDependencies(entry.getKey(), impactedSpecies);
            }
        }
    }


}