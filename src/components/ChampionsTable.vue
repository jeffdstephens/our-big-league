..<template>
  <div>
    <v-container>
      <h1>OBL Champions</h1>
      <v-data-table
        :headers="headers"
        :items="TeamDetails"
        :items-per-page="14"
        :sort-by.sync="sortBy"
        :sort-desc="[true,true]"
        hide-default-footer
        class="elevation-1"
      ></v-data-table>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ChampionsTable",
  data() {
    return {
      headers: [
        {
          text: "Team Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Appearances", value: "appearances", sortable: false },
        { text: "Championships", value: "championshipYears", sortable: false },
      ],
      sortBy: ["championships", "appearances"],
    };
  },
  computed: {
    ...mapState(["TeamDetails"]),
  },
};
</script>

<style>
</style>