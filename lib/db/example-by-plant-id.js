// Example JSON that needs to be returned to client
// for a full plant display.
import {makeCouchId} from '../../app/libs/utils';

export default {
  _id: makeCouchId(),
  type: 'plant',
  name: '2 in 1 Fuji/Anna Apple',
  description: 'Espalier Fuji/Anna Apple',
  userId: makeCouchId(),
  rootstock: 'M111',
  scions: [{
    _id: makeCouchId(),
    type: 'scion',
    name: 'Fuji',
    graftedOn: '2013-01-01',
    notes: [{
      date: '2014-01-01',
      note: 'Did something interesting',
      images: ['image-url1.png'],
      comments: [{
        userId: 'uuid-of-user-that-made-comment',
        date: '2014-02-01',
        comment: 'How did you do this?'
      }, {
        userId: 'uuid-of-owener-for-example',
        date: '2014-02-02',
        comment: 'With some clippers.'
      }]
    }]
  }, {
    name: 'Anna',
    notes: [{
      note: '',
      comments: []
    }]
  }],
  notes: [{
    date: '2010-01-01',
    note: 'Big frost shortly after planting',
    comments: [{
      userId: 'uuid-of-user-that-made-comment',
      date: '2010-01-03',
      comment: 'Did you protect tree?'
    }, {
      userId: 'uuid-of-owener-for-example',
      date: '2010-01-04',
      comment: 'No.'
    }]
  }]
};
