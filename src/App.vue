<template>
  <div id="app">
    <b-navbar type="dark" variant="dark">
      <b-container>
        <b-navbar-brand to="/" exact exact-active-class="active">
          <img class="logo" src="./assets/obl-icon.png" alt="OBL" />
        </b-navbar-brand>
        <b-navbar-nav class="ms-auto" bg-long>
          <b-nav-item to="/" exact exact-active-class="active">Home</b-nav-item>
          <b-nav-item to="/Champions" exact exact-active-class="active">Champions</b-nav-item>
          <b-nav-item-dropdown text="Drafts">
            <b-dropdown-item href="#">1998</b-dropdown-item>
            <b-dropdown-item href="#">1999</b-dropdown-item>
            <b-dropdown-item href="#">2000</b-dropdown-item>
            <b-dropdown-item href="#">2001</b-dropdown-item>
            <b-dropdown-item href="#">2002</b-dropdown-item>
            <b-dropdown-item href="#">2003</b-dropdown-item>
            <b-dropdown-item href="#">2004</b-dropdown-item>
            <b-dropdown-item href="#">2005</b-dropdown-item>
            <b-dropdown-item href="#">2006</b-dropdown-item>
            <b-dropdown-item href="#">2007</b-dropdown-item>
            <b-dropdown-item href="#">2008</b-dropdown-item>
            <b-dropdown-item href="#">2009</b-dropdown-item>
            <b-dropdown-item href="#">2010</b-dropdown-item>
            <b-dropdown-item href="#">2011</b-dropdown-item>
            <b-dropdown-item href="#">2012</b-dropdown-item>
            <b-dropdown-item href="#">2013</b-dropdown-item>
            <b-dropdown-item href="#">2014</b-dropdown-item>
            <b-dropdown-item href="#">2015</b-dropdown-item>
            <b-dropdown-item href="#">2016</b-dropdown-item>
            <b-dropdown-item href="#">2017</b-dropdown-item>
            <b-dropdown-item href="#">2018</b-dropdown-item>
            <b-dropdown-item href="#">2019</b-dropdown-item>
            <b-dropdown-item href="#">2020</b-dropdown-item>
            <b-dropdown-item href="#">2021</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/About" exact exact-active-class="active">About</b-nav-item>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

.navbar-nav {
  padding-right: 30px;
}

.logo {
  width: 50%;
}
</style>
