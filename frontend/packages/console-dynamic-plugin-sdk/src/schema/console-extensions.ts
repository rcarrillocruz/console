import { FeatureFlag, ModelFeatureFlag } from '../extensions/feature-flags';
import { ReduxReducer } from '../extensions/redux';
import { ContextProvider } from '../extensions/context-providers';
import { StandaloneRoutePage } from '../extensions/pages';

export type SupportedExtension =
  | FeatureFlag
  | ModelFeatureFlag
  | ReduxReducer
  | ContextProvider
  | StandaloneRoutePage;

/**
 * Schema of Console plugin's `console-extensions.json` file.
 */
export type ConsoleExtensionsJSON = {
  /** Reference to JSON schema. */
  $schema?: string;
  /** List of extensions contributed by the plugin. */
  data: SupportedExtension[];
};
