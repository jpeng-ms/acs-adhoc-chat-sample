// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient } from '@azure/communication-chat';
import * as express from 'express';
import { getEnvUrl } from '../utils/envHelper';
import { threadIdToModeratorCredentialMap } from '../utils/chat/threadIdToModeratorTokenMap';

const router = express.Router();
interface AddUserParam {
  Id: string;
  DisplayName: string;
  TeamsUser: boolean;
}

router.post('/:threadId', async function (req, res, next) {
  const addUserParam: AddUserParam = req.body;
  const threadId = req.params['threadId'];
  const moderatorCredential = threadIdToModeratorCredentialMap.get(threadId);

  const chatClient = new ChatClient(getEnvUrl(), moderatorCredential);
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  await chatThreadClient.addParticipants({
    participants: [
      {
        id: addUserParam.TeamsUser ? { microsoftTeamsUserId: addUserParam.Id } : { communicationUserId: addUserParam.Id },
        displayName: addUserParam.DisplayName
      }
    ]
  });
  res.sendStatus(201);
});

export default router;
