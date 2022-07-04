import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    TeamDetails: [
      {
        id: 1,
        name: "AMW",
        appearances: "3",
        championships: 2,
        championshipYears: [2010, 2014],
      },
      {
        id: 2,
        name: "Blank",
        appearances: "3",
        championships: 2,
        championshipYears: [2007, 2021],
      },
      {
        id: 3,
        name: "Birrrrdy",
        appearances: "7",
        championships: 4,
        championshipYears: [1999, 2005, 2006, 2016],
      },
      {
        id: 4,
        name: "Burghman",
        appearances: "1",
        championships: 0,
        championshipYears: [],
      },
      {
        id: 5,
        name: "Gunslingers",
        appearances: "2",
        championships: 0,
        championshipYears: [],
      },
      {
        id: 6,
        name: "Hampton Ballers",
        appearances: "7",
        championships: 5,
        championshipYears: [2001, 2003, 2008, 2019, 2020],
      },
      {
        id: 7,
        name: "Jamaica's Finest",
        appearances: "3",
        championships: 0,
        championshipYears: [],
      },
      {
        id: 8,
        name: "Junkyard Dawgs",
        appearances: "0",
        championships: 0,
        championshipYears: [],
      },
      {
        id: 9,
        name: "Makaveli",
        appearances: "2",
        championships: 1,
        championshipYears: [2000],
      },
      {
        id: 10,
        name: "Menace",
        appearances: "4",
        championships: 2,
        championshipYears: [2011, 2015],
      },
      {
        id: 11,
        name: "Outta Control",
        appearances: "2",
        championships: 1,
        championshipYears: [2012],
      },
      {
        id: 12,
        name: "Showtime",
        appearances: "3",
        championships: 1,
        championshipYears: [2017],
      },
      {
        id: 13,
        name: "Skindeep Ballaz",
        appearances: "6",
        championships: 4,
        championshipYears: [2002, 2004, 2009, 2018],
      },
      {
        id: 14,
        name: "Stout",
        appearances: "3",
        championships: 2,
        championshipYears: [1998, 2013],
      },
    ],
  }, 
})
