## Components

### plant

Components in the `/app/components/plant` folder.

Component naming uses CRUD (Create, Read, Update, Delete) names to identify what the component does.

* Plant
  * Container for showing and managing a single plant
  * All other components in this section are used by the Plant component directly or indirectly. i.e. Plant is the top parent
* PlantRead
  * Shows the details of the Plant
  * PlantCreateUpdate hidden
* PlantCreateUpdate
  * Create or Update a Plant.
  * PlantRead hidden
* Notes
  * Manages the Hide/Show "add note" functionality
  * Container to show a list of Notes
* NoteCreateUpdate
  * Create or Update a Note.
* NoteRead
  * Shows the details of a Note

### plants

Components in the `/app/components/plants` folder.

Components for managing a collection and the listing of plants.
