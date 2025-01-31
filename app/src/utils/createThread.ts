// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatusCode } from './constants';

export const createThread = async (payload: any): Promise<string> => {
  try {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('/createThread', requestOptions);
    if (response.status === StatusCode.OK) {
      return await response.text();
    } else {
      throw new Error('Failed at creating thread ' + response.status);
    }
  } catch (error) {
    console.error('Failed creating thread, Error: ', error);
    throw new Error('Failed at creating thread');
  }
};
