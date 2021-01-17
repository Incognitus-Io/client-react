import React, {
  FunctionComponent,
  ReactElement,
  ReactNode,
  ReactNodeArray,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIncognitus } from './useIncognitus';

interface FeatureFlagProps {
  flag: string;
  hidden?: boolean;
}

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const FeatureFlagLoading = (_: any) => <></>;
export const FeatureFlagEnabled = (_: any) => <></>;
export const FeatureFlagDisabled = (_: any) => <></>;
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable no-unused-vars */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findSlot = (vnodes: ReactNode, slot: any): ReactElement | undefined => {
  if (Array.isArray(vnodes)) {
    return (vnodes as ReactNodeArray).find((child) => {
      const x = child as ReactElement;
      return (x.type as { name: string }).name === slot.name;
    }) as ReactElement;
  }
  const vnode = vnodes as ReactElement;
  const type = vnode.type as { name: string };
  if (type?.name === slot.name) {
    return vnodes as ReactElement;
  }
  return undefined;
};

export const FeatureFlag: FunctionComponent<FeatureFlagProps> = ({
  children,
  flag,
  hidden = false,
}) => {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const isLoading = useMemo(() => enabled === null, [enabled]);
  const { service, isReady } = useIncognitus();

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (enabled != null) {
      return;
    }

    if (!isReady || !service) {
      return;
    }

    if (!hidden) {
      service.isEnabled(flag).then((res) => setEnabled(res));
    } else {
      service.isDisabled(flag).then((res) => setEnabled(res));
    }
  });

  const loadingSlot = findSlot(children, FeatureFlagLoading);
  const enabledSlot = findSlot(children, FeatureFlagEnabled);
  const disabledSlot = findSlot(children, FeatureFlagDisabled);

  if (isLoading && loadingSlot) {
    return loadingSlot.props.children;
  } else {
    if (enabled && enabledSlot) {
      return enabledSlot.props.children;
    } else if (disabledSlot) {
      return disabledSlot.props.children;
    }
  }
  return null;
};
