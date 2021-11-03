<template>
  <div id="app">
    <b-navbar type="dark" variant="dark">
      <b-container>
        <b-navbar-brand to="/" exact exact-active-class="active">
          <img class="logo" src="./assets/obl-icon.png" alt="OBL" />
        </b-navbar-brand>
        <b-navbar-nav class="ms-auto" bg-long>
          <b-nav-item to="/" exact exact-active-class="active">Home</b-nav-item>
          <!-- <b-nav-item to="/Champions" exact exact-active-class="active">Champions</b-nav-item> -->
          <b-nav-item :to="{ path: 'Champions', query: { teamdetails: TeamDetails } }">Champions</b-nav-item>
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

<script>
export default {
  data: function () {
    return {
      TeamDetails: [
        {
          id: 1,
          name: "AMW",
          appearances: "3",
          championships: [2010, 2014],
        },
        {
          id: 2,
          name: "Blank",
          appearances: "2",
          championships: [2007],
        },
        {
          id: 3,
          name: "Birrrrdy",
          appearances: "7",
          championships: [1999, 2005, 2006, 2016],
        },
        {
          id: 4,
          name: "Burghman",
          appearances: "1",
          championships: [],
        },
        {
          id: 5,
          name: "Gunslingers",
          appearances: "2",
          championships: [],
        },
        {
          id: 6,
          name: "Hampton Ballers",
          appearances: "7",
          championships: [2001, 2003, 2008, 2019, 2020],
        },
        {
          id: 7,
          name: "Jamaica's Finest",
          appearances: "3",
          championships: [],
        },
        {
          id: 8,
          name: "Junkyard Dawgs",
          appearances: "0",
          championships: [],
        },
        {
          id: 9,
          name: "Makaveli",
          appearances: "2",
          championships: [2000],
        },
        {
          id: 10,
          name: "Menace",
          appearances: "3",
          championships: [2011, 2015],
        },
        {
          id: 11,
          name: "Outta Control",
          appearances: "2",
          championships: [2012],
        },
        {
          id: 12,
          name: "Showtime",
          appearances: "3",
          championships: [2017],
        },
        {
          id: 13,
          name: "Skindeep Ballaz",
          appearances: "6",
          championships: [2002, 2004, 2009, 2018],
        },
        {
          id: 14,
          name: "Stout",
          appearances: "3",
          championships: [1998, 2013],
        },
      ],
    };
  },
};
</script>


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
