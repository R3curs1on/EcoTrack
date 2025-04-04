package EcoTrack;

public class SpeciesData {
    int riskLevel;
    int population;
    boolean isFauna;
    double biomass;

    public SpeciesData(int riskLevel, int population, boolean isFauna, double biomass) {
        this.riskLevel = riskLevel;
        this.population = population;
        this.isFauna = isFauna;
        this.biomass = biomass;
    }
}