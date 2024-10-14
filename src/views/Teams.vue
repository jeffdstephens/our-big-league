<template>
  <div>
    <h1>Teams</h1>

    <l-map
      ref="map"
      style="height: 800px; width: 100%;"
      :zoom.sync="zoom"
      :center.sync="center"
      :min-zoom="2"
      :max-zoom="19"
      @update:center="onMapReady"
    >
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer } from "vue2-leaflet";
import { mapState } from "vuex";
import L from "leaflet"; // Import Leaflet for creating custom icons

// Import Leaflet MarkerCluster
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export default {
  name: "Teams",
  components: {
    LMap,
    LTileLayer,
  },
  computed: {
    ...mapState(["TeamDetails"]),
  },
  data() {
    return {
      // Center the map on the United States
      //center: [39.8283, -98.5795], // Center of the US (approximate)
      center: [37.8283, -98.5795],
      zoom: 5, // Zoom level
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      markerClusterGroup: null,
    };
  },
  methods: {
    // Method to create a custom icon for each team using their image
    createCustomIcon(iconUrl) {
      return L.icon({
        iconUrl: iconUrl, // Use the team icon from Vuex store
        iconSize: [40, 40], // Size of the icon (adjust as needed)
        iconAnchor: [20, 40], // Anchor the icon so it aligns properly on the map
        popupAnchor: [0, -40], // Position the popup above the icon
        className: "team-icon", // Optionally add a class for styling purposes
      });
    },
    // Initialize marker clusters and add markers to the cluster
    initializeMarkerClusters(map) {
      console.log("Initializing marker clusters", map);

      // Create a marker cluster group
      this.markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 0, // Adjust this value to control how far apart markers can be to cluster
      });

      // Loop through the teams and create markers
      this.TeamDetails.forEach((team) => {
        const marker = L.marker([team.lat, team.lng], {
          icon: this.createCustomIcon(team.icon),
        }).bindPopup(<strong>${team.name}</strong>);

        // Add each marker to the cluster group
        this.markerClusterGroup.addLayer(marker);
      });

      // Add the cluster group to the map
      map.addLayer(this.markerClusterGroup);

      console.log("Cluster group added to the map");
    },
    // Ensure the map is fully loaded before adding the markers
    onMapReady() {
      const map = this.$refs.map.mapObject;
      if (map) {
        this.initializeMarkerClusters(map);
      }
    },
  },
  mounted() {
    console.log("Map component mounted");
    const map = this.$refs.map.mapObject;
    if (map) {
      this.initializeMarkerClusters(map);
    }
  },
};
</script>

<style scoped>
/* Optional custom styles for the icons */
.team-icon {
  border-radius: 50%; /* Make the icon circular */
  border: 2px solid #fff; /* Add a white border to the icon */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Add a slight shadow */
}

.sidebar-nav {
  z-index: 1000;
  position: relative;
}

.leaflet-container {
  z-index: 0;
}
</style>