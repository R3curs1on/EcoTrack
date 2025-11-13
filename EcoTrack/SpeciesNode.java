package EcoTrack;
public class SpeciesNode {
String name;
int riskLevel;
int population;
        SpeciesNode left, right;

public SpeciesNode(String name, int riskLevel, int population) {
    this.name = name;
    this.riskLevel = riskLevel;
    this.population = population;
    this.left = this.right = null;
    }
}