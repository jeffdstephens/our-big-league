<template>
  <div>
    <h1>OBL Champions</h1>
    <b-container>
      <b-table-simple hover small caption-top responsive>
        <b-thead head-variant="dark">
          <b-tr>
            <b-th>Team</b-th>
            <b-th>Appearances</b-th>
            <b-th>Championships</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr class="align-middle" v-for="team in $route.query.teamdetails" :key="team.id">
            <b-td>{{team.name}}</b-td>
            <b-td>{{team.appearances}}</b-td>
            <b-td>
              <span v-for="championshipYear in team.championships" :key="championshipYear">
                <figure>
                  <img src="../assets/trophy.png" width="65%" />
                  <figcaption>{{ championshipYear }}</figcaption>
                </figure>
              </span>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-container>
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
  padding-top: 20px;
}
</style>