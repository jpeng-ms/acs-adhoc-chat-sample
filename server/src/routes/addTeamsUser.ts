// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import * as express from 'express';
import { getEnvUrl } from '../utils/envHelper';
import { threadIdToModeratorCredentialMap } from '../utils/chat/threadIdToModeratorTokenMap';

const router = express.Router();

router.post('/:threadId/:teamsId', async function (req, res, next) {
  const { threadId, teamsId } = req.params;
  const moderatorCredential = threadIdToModeratorCredentialMap.get(threadId);

  const chatClient = new ChatClient(getEnvUrl(), moderatorCredential);
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  await chatThreadClient.addParticipants({
    participants: [
      {
        id: { microsoftTeamsUserId: teamsId },
      }
    ]
  });
  res.sendStatus(201);
});

export default router;
