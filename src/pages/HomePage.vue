<script setup>
import { RouterLink } from 'vue-router'
import houstonImage from '../assets/houston.jpeg'
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">Welcome to Our Big League</h1>
    <p class="text-lg text-gray-700 mb-4">
      What started as a group of friends talking trash and picking players back in 1998 has turned
      into nearly three decades of brotherhood, competition, and memories that just keep getting better.
      Welcome to Our Big League — the greatest fantasy football league known to man.
    </p>
    <p class="text-gray-600 mb-4">
      This site is our digital home, a place to relive the glory days and keep track of who's really
      the best (and who needs to stop bragging about that one championship from 15 years ago). Dive into
      our <RouterLink to="/champions" class="text-blue-600 hover:underline">championship history</RouterLink>,
      check out every <RouterLink to="/drafts" class="text-blue-600 hover:underline">draft location</RouterLink>
      we've invaded over the years, and see where all our
      <RouterLink to="/teams" class="text-blue-600 hover:underline">teams</RouterLink> call home.
    </p>
    <p class="text-gray-600 mb-8">
      Every Labor Day weekend, we pack our bags and take the draft on the road. From Vegas to Miami,
      New York to Nashville, the OBL traveling draft has become a tradition that keeps us connected and
      gives us an excuse to explore a new city together. Speaking of which...
    </p>

    <!-- 2026 Houston Draft Announcement -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <div class="md:flex">
        <!-- Image Section -->
        <div class="md:w-2/5">
          <img
            :src="houstonImage"
            alt="Houston, Texas skyline"
            class="w-full h-64 md:h-full object-cover"
          />
        </div>

        <!-- Content Section -->
        <div class="p-6 md:w-3/5">
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
              Announcement
            </span>
            <span class="text-gray-500 text-sm">Season 29</span>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            2026 OBL Draft Heads to Houston!
          </h2>

          <p class="text-gray-700 mb-2">
            <span class="font-semibold">Labor Day Weekend: September 4-7, 2026</span>
          </p>

          <p class="text-gray-700 mb-4">
            The Our Big League family is heading to Space City for the 2026 draft! Houston brings
            a rich football heritage to our gathering, home to the NFL's Texans and legendary
            moments like Super Bowl LI's historic comeback at NRG Stadium.
          </p>

          <p class="text-gray-700 mb-4">
            Beyond football, Houston offers world-class dining with its diverse culinary scene,
            from Tex-Mex and BBQ to Vietnamese cuisine along Bellaire Boulevard. The city boasts
            NASA's Johnson Space Center, a thriving arts district, and the legendary nightlife
            that has made it one of America's most dynamic cities.
          </p>

          <p class="text-gray-600 italic mb-4">
            More details to come as we finalize venues and activities for what promises to be
            an unforgettable draft weekend!
          </p>

          <RouterLink
            to="/drafts/2026"
            class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View Draft Details
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
