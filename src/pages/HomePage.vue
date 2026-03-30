<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import houstonImage from '../assets/houston.jpeg'
import venueExterior from '../assets/little-woodrows-eado.jpg'
import venueInterior from '../assets/Eado-Inside.jpg'
import draftLocation from '../assets/our-draft-location.png'

const lightboxImage = ref(null)

function openLightbox(src) {
  lightboxImage.value = src
}

function closeLightbox() {
  lightboxImage.value = null
}
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

    <!-- 2026 Draft Venue Announcement -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div class="md:flex">
        <!-- Three-image grid -->
        <div class="md:w-2/5 flex flex-col" style="min-height: 360px;">
          <!-- Top row: two images side by side -->
          <div class="flex" style="height: 50%;">
            <div class="relative w-1/2 cursor-pointer group" @click="openLightbox(venueExterior)">
              <img
                :src="venueExterior"
                alt="Little Woodrow's EaDo exterior"
                class="w-full h-full object-cover transition-opacity group-hover:opacity-90"
              />
              <span class="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                Little Woodrow's EaDo
              </span>
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-8 h-8 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </span>
            </div>
            <div class="relative w-1/2 cursor-pointer group" @click="openLightbox(venueInterior)">
              <img
                :src="venueInterior"
                alt="Little Woodrow's EaDo interior"
                class="w-full h-full object-cover transition-opacity group-hover:opacity-90"
              />
              <span class="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                Inside
              </span>
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-8 h-8 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </span>
            </div>
          </div>
          <!-- Bottom: full-width image -->
          <div class="relative cursor-pointer group" style="height: 50%;" @click="openLightbox(draftLocation)">
            <img
              :src="draftLocation"
              alt="Our draft location"
              class="w-full h-full object-cover transition-opacity group-hover:opacity-90"
            />
            <span class="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              Our Draft Location
            </span>
            <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-8 h-8 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </span>
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-6 md:w-3/5">
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
              Venue Confirmed
            </span>
            <span class="text-gray-500 text-sm">Season 29</span>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            We've Got Our Spot: Little Woodrow's EaDo
          </h2>

          <p class="text-gray-700 mb-2">
            <span class="font-semibold">Saturday, September 5, 2026 · 11 AM – 5 PM CT</span>
          </p>

          <p class="text-gray-700 mb-4">
            We locked in the venue for this year's draft — Little Woodrow's EaDo at
            <a
              href="https://littlewoodrows.com/locations/eado/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline"
            >801 St Emanuel St, Houston, TX 77003</a>.
            EaDo (East Downtown) is one of Houston's most energetic neighborhoods, right
            on the edge of downtown near the stadiums and packed with bars and restaurants.
            Little Woodrow's fits right in. They've got us a private space reserved and
            we'll each have our own tab, and there's no minimum spend.
          </p>

          <p class="text-gray-700 mb-4">
            There's a 3D tour of the space on their website if you want to get a feel for the
            layout before we show up. One thing to keep in mind: there's an Astros game not
            too far from the venue that afternoon, so expect the place to pick up later in the
            day as people filter in to pre-game. Since we're starting the draft at 11, we
            should be well through our picks before any of that becomes our problem.
          </p>

          <p class="text-gray-600 italic mb-4">
            They'll keep us posted as we get closer. They often run fantasy football specials, so more to come on that.
          </p>

          <p class="text-gray-400 text-xs mb-4">Posted March 30, 2026</p>

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

    <!-- 2026 Houston Draft Announcement -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <div class="md:flex">
        <!-- Image Section -->
        <div class="md:w-2/5 cursor-pointer group relative" @click="openLightbox(houstonImage)">
          <img
            :src="houstonImage"
            alt="Houston, Texas skyline"
            class="w-full h-64 md:h-full object-cover transition-opacity group-hover:opacity-90"
          />
          <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-8 h-8 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </span>
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

          <p class="text-gray-400 text-xs mb-4">Posted February 5, 2026</p>

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

  <!-- Lightbox -->
  <Teleport to="body">
    <div
      v-if="lightboxImage"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      @click.self="closeLightbox"
    >
      <button
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        @click="closeLightbox"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        :src="lightboxImage"
        class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        alt="Enlarged view"
      />
    </div>
  </Teleport>
</template>
