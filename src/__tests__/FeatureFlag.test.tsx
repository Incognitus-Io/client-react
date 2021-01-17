import * as React from 'react';
import { render, screen } from '@testing-library/react';
import FeatureFlag, {
  FeatureFlagLoading,
  FeatureFlagEnabled,
  FeatureFlagDisabled,
} from '../FeatureFlag';
import { useIncognitus } from '../useIncognitus';
import {
  IncognitusConfig,
  IncognitusService,
} from '@incognitus/client-web-core';

jest.mock('../useIncognitus');
jest.mock('@incognitus/client-web-core');

describe('FeatureFlag component', () => {
  let mockUseIncognitus: jest.Mock<ReturnType<typeof useIncognitus>>;
  let useIncognitusMock: ReturnType<typeof useIncognitus>;

  beforeEach(() => {
    mockUseIncognitus = useIncognitus as jest.Mock;
    useIncognitusMock = {
      isReady: false,
      service: new IncognitusService({} as IncognitusConfig),
    };
    (useIncognitusMock.service!.isEnabled as jest.Mock).mockResolvedValue(
      false,
    );

    mockUseIncognitus.mockReturnValue(useIncognitusMock);
  });

  const Sut = ({ hidden = false }) => (
    <FeatureFlag flag="foobar" hidden={hidden}>
      <FeatureFlagLoading>
        <span data-testid="loading">Loading</span>
      </FeatureFlagLoading>
      <FeatureFlagEnabled>
        <span data-testid="enabled">Enabled</span>
      </FeatureFlagEnabled>
      <FeatureFlagDisabled>
        <span data-testid="disabled">Disabled</span>
      </FeatureFlagDisabled>
    </FeatureFlag>
  );

  describe('Loading slot', () => {
    it('renders when not ready', async () => {
      render(<Sut />);

      expect(screen.getByTestId('loading').textContent).toContain('Loading');
    });

    it('renders when ready but fetching', async () => {
      useIncognitusMock.isReady = true;
      useIncognitusMock.service = null;

      const { rerender } = render(<Sut />);
      rerender(<Sut />);

      const res = await screen.findByTestId('loading');
      expect(res.textContent).toContain('Loading');
    });
  });

  describe('normal mode', () => {
    it('renders enabled when flag is enabled', async () => {
      (useIncognitusMock.service!.isEnabled as jest.Mock).mockResolvedValue(
        true,
      );
      useIncognitusMock.isReady = true;

      const { rerender } = render(<Sut />);
      rerender(<Sut />);

      const res = await screen.findByTestId('enabled');
      expect(res.textContent).toContain('Enabled');
    });

    it('renders disabled when flag is disabled', async () => {
      (useIncognitusMock.service!.isEnabled as jest.Mock).mockResolvedValue(
        false,
      );
      useIncognitusMock.isReady = true;

      const { rerender } = render(<Sut />);
      rerender(<Sut />);

      const res = await screen.findByTestId('disabled');
      expect(res.textContent).toContain('Disabled');
    });
  });

  describe('hidden mode', () => {
    it('renders disabled when flag is enabled', async () => {
      (useIncognitusMock.service!.isDisabled as jest.Mock).mockResolvedValue(
        false,
      );
      useIncognitusMock.isReady = true;

      const { rerender } = render(<Sut hidden />);
      rerender(<Sut hidden />);

      const res = await screen.findByTestId('disabled');
      expect(res.textContent).toContain('Disabled');
    });

    it('renders enabled when flag is disabled', async () => {
      (useIncognitusMock.service!.isDisabled as jest.Mock).mockResolvedValue(
        true,
      );
      useIncognitusMock.isReady = true;

      const { rerender } = render(<Sut hidden />);
      rerender(<Sut hidden />);

      const res = await screen.findByTestId('enabled');
      expect(res.textContent).toContain('Enabled');
    });
  });
});
