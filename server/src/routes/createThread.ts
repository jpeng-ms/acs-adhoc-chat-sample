// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { createThread } from '../utils/chat/moderator';

const router = express.Router();

router.post('/', async function (req, res, next) {
  return res.send(await createThread(req, "Group Chat"));
});

export default router;
