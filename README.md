# Incognitus Feature Flag

![Continuous Integration](https://github.com/Incognitus-Io/client-react/workflows/Continuous%20Integration/badge.svg)
[![codecov](https://codecov.io/gh/Incognitus-Io/client-react/branch/master/graph/badge.svg?token=HJ4XoCv8oZ)](https://codecov.io/gh/Incognitus-Io/client-react)

## Usage

Install this as your projects's dependency

```
npm i @incognitus/client-react
# or
yarn add @incognitus/client-react
```

## Installing the plugin

Before you're able to use the service you'll need to install the plugin with your tenant and application IDs.

### App.tsx

```tsx
import { useInitIncognitus } from '@incognitus/client-react';
function App() {
  useInitIncognitus({
    tenantId: 'f632ac6a71e57bc77a8cb7d04c8704e52b9a5538',
    applicationId: 'fecf1202.8edffdf0',
  });
}
```

| Key           | Description                               |
| ------------- | ----------------------------------------- |
| tenantId      | Your tenant id                            |
| applicationId | The id of the application and environment |

## Checking features

### Component

You can use the included component to check feature flags. This is transparent and will not add an extra depth in the
DOM. Using slots, you can configure different aspects like the loading state, or if the flag is enabled/disabled.

```tsx
import FeatureFlag, {
  FeatureFlagLoading,
  FeatureFlagEnabled,
  FeatureFlagDisabled,
} from '@incognitus/client-react';

<FeatureFlag flag="feature name">
  <FeatureFlagLoading>
    <div>Loading</div>
  </FeatureFlagLoading>
  <FeatureFlagEnabled>
    <div>Enabled</div>
  </FeatureFlagEnabled>
  <FeatureFlagDisabled>
    <div>Disabled</div>
  </FeatureFlagDisabled>
</FeatureFlag>;
```

#### Props

| Prop   | Description                           |
| ------ | ------------------------------------- |
| flag   | The name of the feature flag          |
| hidden | Hide content when the flag is enabled |

#### Slots

| Slot                | Description                              |
| ------------------- | ---------------------------------------- |
| FeatureFlagLoading  | Displayed when fetching the feature flag |
| FeatureFlagEnabled  | Rendered when the flag is enabled        |
| FeatureFlagDisabled | Rendered when the flag is disabled       |

### React hook

If you would like to interact with the service directly, then it can be accessed through the `useIncognitus` hook.
This returns `isReady` which returns `true` when the service is initiatlized and ready to be used, and `service`
which returns the raw service

#### Service methods

| Method                          | Description                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| service.isEnabled(featureName)  | Checks if the flag is enabled                               |
| service.isDisabled(featureName) | Check if the flag is disabled                               |
| service.getFeature(featureName) | Fetches the feature from the server and returns it's status |
| service.getAllFeatures()        | Fetches all features and stores them in the cache           |

### Service

You can also use the service directly by importing `IncognitusService.instance`, however this is not recommended.

## Caching

Currently all known feature flags are cached when the app initializes. New features that are not found
in the cache are retrieved on-demand. The cache stays in place until the app is reloaded or by calling the `getAllFeatures()` method on the service.
