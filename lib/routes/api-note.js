import * as BaseDB from '../db/base-db';
import {requireToken} from '../config/token-check';
import validators from '../../app/models';

import d from 'debug';
const debug = d('plant:api');

const {
  note: validateNote
} = validators;

const baseDb = new BaseDB.BaseDB();

export default (app) => {

  // Note CRUD operations
  // Note Create
  app.post('/api/note', requireToken, (req, res) => {
    debug('POST /api/note req.user:', req.user && req.user.name);

    req.body.userId = req.user._id;
    const isNew = true;

    validateNote(req.body, {isNew}, (err, transformed) => {
      if(err) {
        debug(`response POST /api/note: 400`, err);
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

};
