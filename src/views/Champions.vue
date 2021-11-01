<template>
  <div>
    <h1>OBL Champions</h1>
    <h1 v-for="team in $route.query.teamdetails" :key="team.id">{{team.name}}</h1>
    <!-- <b-container>
      <b-table-simple hover small caption-top responsive>
        <b-thead head-variant="dark">
          <b-tr>
            <b-th>Team</b-th>
            <b-th>Appearances</b-th>
            <b-th>Championships</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr class="align-middle">
            <b-td>Hampton Ballers</b-td>
            <b-td>7</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2001</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2003</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2008</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2019</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2020</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Birrrrdy</b-td>
            <b-td>7</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>1999</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2005</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2006</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2016</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Skindeep Ballaz</b-td>
            <b-td>6</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2002</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2004</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2009</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2018</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>AMW</b-td>
            <b-td>3</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2010</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2014</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Menace</b-td>
            <b-td>3</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2011</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2015</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Stout</b-td>
            <b-td>3</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>1998</figcaption>
              </figure>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2013</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Blank</b-td>
            <b-td>2</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2007</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Makaveli</b-td>
            <b-td>2</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2000</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Outta Control</b-td>
            <b-td>2</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2012</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Showtime</b-td>
            <b-td>3</b-td>
            <b-td>
              <figure>
                <img src="../assets/trophy.png" />
                <figcaption>2017</figcaption>
              </figure>
            </b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Burghman</b-td>
            <b-td>1</b-td>
            <b-td></b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Gunslingers</b-td>
            <b-td>2</b-td>
            <b-td></b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Jamaica's Finest</b-td>
            <b-td>3</b-td>
            <b-td></b-td>
          </b-tr>
          <b-tr class="align-middle">
            <b-td>Junkyard Dawgs</b-td>
            <b-td>0</b-td>
            <b-td></b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-container>-->
  </div>
</template>

<script>
export default {
  name: "Champions",
};
</script>

<style>
figure {
  display: inline-block;
  margin: 0;
  text-align: center;
  padding: 0;
}
</style>