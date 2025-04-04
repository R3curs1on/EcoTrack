import java.util.Scanner;
import EcoTrack.BiodiversityTracker;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        BiodiversityTracker tracker = new BiodiversityTracker();
//
//        tracker.addFoodChainRelation("Tiger", "Deer");
//        tracker.addFoodChainRelation("Deer", "Grass");
//        tracker.addFoodChainRelation("Eagle", "Snake");
//        tracker.addFoodChainRelation("Snake", "Frog");

        while (true) {
            System.out.println("\n========== Biodiversity Tracker ==========");
            System.out.println("1. Add a species");
            System.out.println("2. Record species death");
            System.out.println("3. Display species in risk order");
            System.out.println("4. View relocation priority queue");
            System.out.println("5. View species impact report");
            System.out.println("6. Add a food chain relationship");
            System.out.println("7. Simulate biodiversity impact ");
            System.out.println("8. Exit");
            System.out.println("9. Simulate species recovery");
            System.out.print("Enter your choice: ");

            int choice = scanner.nextInt();
            scanner.nextLine();

            switch (choice) {
                case 1:
                    System.out.print("Species Name: ");
                    String name = scanner.nextLine();
                    System.out.print("Risk Level (1=High, 5=Low): ");
                    int risk = scanner.nextInt();
                    System.out.print("Is it Fauna? (true/false): ");
                    boolean isFauna = scanner.nextBoolean();
                    System.out.print(isFauna ? "Population: " : "Biomass (in tons): ");
                    double measure = scanner.nextDouble();
                    tracker.insertSpecies(name, risk, isFauna ? (int) measure : 0, isFauna, isFauna ? 0 : measure);
                    break;
                case 2:
                    System.out.print("Enter species name: ");
                    String deadName = scanner.nextLine();
                    System.out.print("Enter number of deaths: ");
                    int deaths = scanner.nextInt();
                    tracker.recordDeath(deadName, deaths);
                    break;
                case 3:
                    tracker.displayRiskOrder();
                    break;
                case 4:
                    tracker.viewRelocationQueue();
                    break;
                case 5:
                    tracker.speciesImpactReport();
                    break;
                case 6:
                    System.out.print("Enter Predator Name: ");
                    String predator = scanner.nextLine();
                    System.out.print("Enter Prey Name: ");
                    String prey = scanner.nextLine();
                    tracker.addFoodChainRelation(predator, prey);
                    break;
                case 7:
                    tracker.simulateScenario(scanner);
                    break;
                case 8:
                    System.out.println("Exiting... Stay green!");
                    scanner.close();
                    return;
                case 9:
                    System.out.print("Enter species name to simulate recovery: ");
                    String recoverName = scanner.nextLine();
                    System.out.print("Enter number of individuals to add: ");
                    int recoverAmount = scanner.nextInt();
                    tracker.simulateRecovery(recoverName, recoverAmount);
                    break;
                default:
                    System.out.println("Invalid choice. Try again.");
            }
        }
    }
}