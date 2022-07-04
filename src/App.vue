<template>
  <v-app>
    <v-app-bar app color="black" dark>
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
      <v-btn to="/">Home</v-btn>
      <v-btn to="/Champions">Champions</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
