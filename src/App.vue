<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="black" dark>
      <!-- Hamburger Menu Icon -->
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <!-- Logo and Title -->
      <div class="d-flex align-center">
        <v-img
          alt="OBL Logo"
          class="shrink mr-2"
          contain
          src="./assets/obl-icon.png"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title>Our Big League</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Navigation Drawer (Hamburger Menu) -->
    <v-navigation-drawer v-model="drawer" app temporary color="black" dark>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Our Big League</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/Champions">
          <v-list-item-title>Champions</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false, // Control the state of the navigation drawer
    };
  },
};
</script>

<style scoped>
/* Optional: Style to adjust the appearance */
</style>
