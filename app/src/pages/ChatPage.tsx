// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  toFlatCommunicationIdentifier,
  createAzureCommunicationChatAdapter,
  ChatAdapter,
  ChatComposite
} from '@azure/communication-react';
import { Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { getEndpointUrl } from '../utils/getEndpointUrl';
import { getThreadId } from '../utils/getThreadId';
import { createThread } from '../utils/createThread';
import { joinThread } from '../utils/joinThread';

export interface CallPageProps {
  token: string;
  userId: CommunicationUserIdentifier
  teamsUserMRIs?: string;
  displayName: string;
  teamsMemberNames: string;
}

export const ChatPage = (props: CallPageProps): JSX.Element => {
  const { token, userId, teamsUserMRIs, displayName, teamsMemberNames } = props;
  const [adapter, setAdapter] = useState<ChatAdapter>();
  const threadIdRef = useRef<string>();
  const adapterRef = useRef<ChatAdapter>();

  useEffect(() => {
    (async () => {
      console.log(`Chat teams MRIs: ${teamsUserMRIs ?? 'undefined'}`);
      var payload = {
        "token": token,
        "userId": userId,
      }
      const threadId = getThreadId() || await createThread(payload);
      const teamsUserMriList = teamsUserMRIs?.split(',') ?? [];
      const teamsUserNameList = teamsMemberNames?.split(',') ?? [];
      console.log(teamsUserNameList);

      // await joinThread(threadId, userId.communicationUserId, displayName);

      teamsUserMriList.forEach((mri, index) => {
        joinThread(threadId, mri.trim(), teamsUserNameList[index]?.trim() ?? 'No Name', true);
      })

      const adapter = await createAzureCommunicationChatAdapter({
        userId,
        displayName,
        credential: createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token),
        endpoint: await getEndpointUrl(),
        threadId: threadId
      });

      adapter.on('error', (e) => {
        // Error is already acted upon by the Call composite, but the surrounding application could
        // add top-level error handling logic here (e.g. reporting telemetry).
        console.log('Adapter error event:', e);
      });

      threadIdRef.current = threadId;

      setAdapter(adapter);
      adapterRef.current = adapter;
    })();

    return () => {
      adapterRef?.current?.dispose();
    };
  }, [displayName, token, userId, teamsUserMRIs, teamsMemberNames]);

  if (!adapter) {
    return (
      <Stack verticalFill verticalAlign='center'>
        <Spinner label={'Creating adapter'} ariaLive="assertive" labelPosition="top" />
      </Stack>
    );
  }

  return (
    <>
      <ChatComposite
        adapter={adapter}
      />
    </>
  );
};
