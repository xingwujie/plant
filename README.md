# plant

A website app to manage backyard orchards and anything else you can grow
in your yard.

## Objectives

* Allow users to track the plants that they're growing.
  * Provide stats on growth rates.
  * Pull in weather information.
  * Compare against other growers.
* Allow users to research plants to grow.
  * Users can search within a radius of their location for plants others are
  growing.
  * Users can determine likelihood of success.
* Assist users in management of their plants.
  * Send alerts to users when action needs to be taken based on time-of-year
  or on weather. For example, should prune/fertilize on X Date, or "there's
  a freeze warning, you need to protect your avocado tree."
* Usability
  * Users should be able to post entries about a tree from their yard on a smart
  phone.
  * Users should be able to take photos and add them to a plant entry from
  their smart phone while making a post.
  * Users should be able to operate the app while disconnected with syncing
  done later.

## Versions

### 0.0.1 MVP

* User can create an account using OAuth from their Google account.
* User can add/delete/update each plant in their yard.
* User can add entries to each plant. Each entry will have a date and
details.

### 0.0.2 and beyond

* Add features/fields to user's account.
  * Add Facebook as OAuth option.
  * Allow user to add their GPS location to their account.
* Add features to a plant post.
  * Allow photos to be added.
  * Add markdown for details to allow for formatting.
* Add structured fields for each plant.
  * Dates for planting, germination.
  * Multi-bud - treat each scion as its own tree but group on this.
  * Perennial/annual (other?)
* Add structured fields for data entry posts.
  * E.g. height, width etc. to calculate growth rates.
  * Applications of fertilizer, mulch etc for reporting on growth effectiveness.
  * Start and end dates for harvest. (Allow for reporting on year round
    production and prediction.)
  * Volume harvested.
* Perform calculations on entries to show changes. e.g. growth in gallons per
week.
* Use user's GPS location to pull in weather data from date of first plant
entry to current date.
* Keep user's weather data up-to-date.
* Use user's GPS location to allow them to compare their plants to the same
plants in nearby locations.
* Allow users to add parentage/genealogy to their plants.
  * i.e. if another user gave them a plant or they planted another plant from
  one that they're already documenting on the system then they can link a parent
  plant.
* Support multi-bud trees.
  * Allow for structured data entry for root stock(s) and multiple scions.
  * Allow dates for adding scions to trees.
* Allow for termination date of plants.
  * Distinguish between perennial and annuals. i.e. plants that are designed
  to die annually and those that aren't. Helps in reporting life and reason
  for death or disposal of perennial.
* Search
  * User can find a male pollinator for their female plant within a certain
  radius of their location.
