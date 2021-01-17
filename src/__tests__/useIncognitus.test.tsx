// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import fetchMock from 'jest-fetch-mock';
import { IncognitusConfig } from '@incognitus/client-web-core';

import { useIncognitus, useInitIncognitus } from '../useIncognitus';

describe('useIncognitus hook', () => {
  const defaultConfig = Object.freeze({
    tenantId: 'abc',
    applicationId: 'xyz',
    aipUrl: 'https://localhost',
  } as IncognitusConfig);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(async () => ({
      body: JSON.stringify({ Features: [] }),
    }));
  });

  it('is marked as not ready before calling `useInitIncognitus`', () => {
    const { result } = renderHook(() => useIncognitus());

    expect(result.current.isReady).toBe(false);
  });

  it('the service is undefined before calling `useInitIncognitus`', () => {
    const { result } = renderHook(() => useIncognitus());

    expect(result.current.service).toBeUndefined();
  });

  it('initialize the service and mark as ready', async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useInitIncognitus(defaultConfig),
    );

    await waitForNextUpdate();

    const { result } = renderHook(() => useIncognitus());

    expect(result.current.isReady).toBe(true);
    expect(result.current.service).toBeDefined();
  });
});
