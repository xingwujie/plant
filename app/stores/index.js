// Redux state

// Expected single state
const state = {
  user: {
    id: '',
    name: '',
    token: '',
    plants: [] // id's of plants owned by this user
  },
  users: [], // Each user the same as user above but without token
  plants: {
    '<plant-id>': {
      summary: true, // if true then notes have not been fetched
      title: '',
      commonName: '',
      botanicalName: '',
      notes: [{
        date: ''
      }] // if summary is false then this is complete
    }
  }, // Collection of plants. Key is plant id.
};

export default state;
