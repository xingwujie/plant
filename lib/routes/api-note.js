import * as BaseDB from '../db/base-db';
import {requireToken} from '../config/token-check';
import validators from '../../app/models';

import d from 'debug';
const debug = d('plant:api-note');

const {
  note: validateNote
} = validators;

const baseDb = new BaseDB.BaseDB();

export default (app) => {

  // Note CRUD operations
  // Note Create
  app.post('/api/note', requireToken, (req, res) => {
    // debug('POST /api/note req.user:', req.user && req.user.name);

    req.body.userId = req.user._id;
    const isNew = true;

    validateNote(req.body, {isNew}, (err, transformed) => {
      if(err) {
        // debug(`response POST /api/note: 400`, err);
        // TODO: Log this - only happens if someone is hacking
        return res.status(400).send(err);
      }

      baseDb.create(transformed, (err2, result) => {
        if(err) {
          return res.status(err.statusCode).send(err2);
        }
        return res.status(200).send(result);
      });
    });
  });

  // Note Update
  app.put('/api/note', requireToken, (req, res) => {
    // debug('PUT /api/note req.user:', req.user && req.user.name);

    req.body.userId = req.user._id;
    const isNew = false;

    validateNote(req.body, {isNew}, (err, transformed) => {
      if(err) {
        debug('response PUT /api/note: 400', err);
        return res.status(400).send(err);
      }

      baseDb.updateByUser(transformed, (err2, result) => {
        if(err2) {
          return res.status(err2.statusCode || 500).send(err2);
        }
        return res.status(200).send(result);
      });
    });
  });

  // Note Delete
  app.delete('/api/note/:noteId', requireToken, (req, res) => {

    const noteId = req.params.noteId;
    // debug(`DELETE /api/note/${noteId} req.user:`, req.user && req.user.name);

    if(!noteId) {
      return res.status(403).send({error: 'Missing noteId'});
    }

    const userId = req.user._id;

    baseDb.delete(noteId, userId, (err, result) => {
      if(err) {
        return res.status(err.statusCode || 500).send(err.message);
      } else {
        return res.send(result);
      }
    });
  });

};
