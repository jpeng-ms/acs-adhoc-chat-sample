// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient, CreateChatThreadOptions, CreateChatThreadRequest } from '@azure/communication-chat';
import { getEnvUrl } from '../envHelper';
import { INITIAL_TOPIC_NAME } from '../constants';
import { threadIdToModeratorCredentialMap } from './threadIdToModeratorTokenMap';
import { createUser, getToken } from '../identityClient';
import { Request } from 'express';


export const createThread = async (req: Request<any>, topicName?: string): Promise<string> => {


  console.log('createThread req: ', req);
  const payload = req.body;
  console.log('createThread payload: ', payload);
  const credential = new AzureCommunicationTokenCredential(payload.token);

  /*new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(user, ['chat', 'voip'])).token,
    refreshProactively: true
  });*/
  const chatClient = new ChatClient(getEnvUrl(), credential);

  const request: CreateChatThreadRequest = {
    topic: topicName ?? INITIAL_TOPIC_NAME
  };
  const options: CreateChatThreadOptions = {
    participants: [
      {
        id: {
          communicationUserId: payload.userId.communicationUserId
        }
      }
    ]
  };
  const result = await chatClient.createChatThread(request, options);

  const threadID = result.chatThread?.id;
  if (!threadID) {
    throw new Error(`Invalid or missing ID for newly created thread ${result.chatThread}`);
  }

  threadIdToModeratorCredentialMap.set(threadID, credential);
  return threadID;
};
