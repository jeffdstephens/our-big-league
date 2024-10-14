<template>
  <div>
    <v-container>
      <!-- Tabs for switching views -->
      <v-tabs v-model="activeTab" background-color="blue darken-1" dark>
        <v-tab>Team View</v-tab>
        <v-tab>Chronological View</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
        <!-- Team View Tab -->
        <v-tab-item>
          <v-data-table
            :headers="headers"
            :items="teamDetailsWithLastChampionship"
            :items-per-page="14"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            hide-default-footer
          >
            <template v-slot:item.championshipYears="{ item }">
              <span v-if="item.championshipYears.length">{{ item.championshipYears.join(", ") }}</span>
              <span v-else>None</span>
            </template>

            <!-- Add the new column for "Years Since Last Championship" with background color -->
            <template v-slot:item.yearsSinceLastChampionship="{ item }">
              <span
                :style="{ backgroundColor: getBackgroundColor(item.yearsSinceLastChampionship), color: 'white', padding: '5px', borderRadius: '4px' }"
              >{{ item.yearsSinceLastChampionship }}</span>
            </template>
          </v-data-table>
        </v-tab-item>

        <!-- Chronological View Tab -->
        <v-tab-item>
          <v-data-table
            :headers="chronologicalHeaders"
            :items="chronologicalChampions"
            hide-default-footer
            :items-per-page="-1"
            class="elevation-1"
          >
            <template v-slot:item.year="{ item }">
              <span>{{ item.year }}</span>
            </template>

            <template v-slot:item.teams="{ item }">
              <span>{{ item.teams }}</span>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ChampionsTable",
  data() {
    return {
      // Track active tab (initialize it to 0)
      activeTab: 0,

      // Headers for the Main Table (Team View)
      headers: [
        { text: "Team Name", align: "start", sortable: true, value: "name" },

        {
          text: "Championships",
          align: "center",
          sortable: true,
          value: "championships",
        },
        {
          text: "Appearances",
          align: "center",
          sortable: true,
          value: "appearances",
        },
        {
          text: "Years Since Last Championship",
          align: "center",
          sortable: true,
          value: "yearsSinceLastChampionship",
        },
        {
          text: "Championship Years",
          align: "center",
          sortable: false,
          value: "championshipYears",
        },
      ],
      sortBy: ["championships"], // Default sorting by championships
      sortDesc: [true], // Sort in descending order by default

      // Headers for the Chronological Table
      chronologicalHeaders: [
        { text: "Year", align: "center", value: "year" },
        { text: "Champion(s)", align: "center", value: "teams" },
      ],
    };
  },
  computed: {
    ...mapState(["TeamDetails"]),

    teamDetailsWithLastChampionship() {
      const currentYear = new Date().getFullYear();

      return this.TeamDetails.map((team) => {
        const lastChampionshipYear = team.championshipYears.length
          ? Math.max(...team.championshipYears)
          : null;

        const yearsSinceLastChampionship = lastChampionshipYear
          ? currentYear - lastChampionshipYear
          : "N/A"; // If no championship, return 'N/A'

        return {
          ...team,
          yearsSinceLastChampionship, // Add this field to each team
        };
      });
    },

    chronologicalChampions() {
      let championsMap = {};

      this.TeamDetails.forEach((team) => {
        team.championshipYears.forEach((year) => {
          if (!championsMap[year]) {
            championsMap[year] = [];
          }
          championsMap[year].push(team.name);
        });
      });

      return Object.keys(championsMap)
        .map((year) => ({
          year: parseInt(year),
          teams: championsMap[year].join(", "),
        }))
        .sort((a, b) => b.year - a.year); // Sort by year descending
    },
  },
  methods: {
    // Method to return a background color based on the number of years since last championship
    getBackgroundColor(years) {
      if (years === "N/A") {
        return "white"; // No championship, keep white background
      }

      const minYears = 0;
      const maxYears = 20; // Assume maximum years for gradient purposes
      const normalizedYears = Math.min(Math.max(years, minYears), maxYears); // Clamp value between min and max

      const percent = (normalizedYears - minYears) / (maxYears - minYears);

      let r, g, b;

      if (percent <= 0.33) {
        // From bright green to golden yellow (0% to 33%)
        r = Math.floor(255 * (percent / 0.33)); // Increase red component (from 0 to 255)
        g = Math.floor(150 + 65 * (percent / 0.33)); // Increase green component (from 150 to 215)
        b = 0; // Blue remains 0
      } else if (percent > 0.33 && percent <= 0.66) {
        // From golden yellow to orange (33% to 66%)
        r = 255; // Red remains full
        g = Math.floor(215 - 50 * ((percent - 0.33) / 0.33)); // Decrease green from 215 to 165
        b = 0; // No blue
      } else {
        // From orange to red (66% to 100%)
        r = 255; // Red remains full
        g = Math.floor(165 * (1 - (percent - 0.66) / 0.34)); // Decrease green from 165 to 0
        b = 0; // No blue
      }

      return `rgb(${r}, ${g}, ${b})`; // Return the computed RGB value
    },
  },
};
</script>

<style scoped>
/* Optional custom styling */
</style>
