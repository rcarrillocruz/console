/* eslint-disable no-console */

import { PluginStore } from '@console/plugin-sdk/src/store';
import { overrideSharedModules } from '../shared-modules';
import { ConsolePluginManifestJSON } from '../schema/plugin-manifest';
import { resolveEncodedCodeRefs } from '../coderefs/coderef-resolver';
import { remoteEntryFile } from '../constants';
import { RemoteEntryModule } from '../types';
import { resolveURL } from '../utils/url';

type ConsolePluginData = {
  /** The manifest containing plugin metadata and extension declarations. */
  manifest: ConsolePluginManifestJSON;
  /** Indicates if `window.loadPluginEntry` callback has been fired for this plugin. */
  entryCallbackFired: boolean;
};

const pluginMap = new Map<string, ConsolePluginData>();

export const scriptIDPrefix = 'console-plugin';

export const getPluginID = (m: ConsolePluginManifestJSON) => `${m.name}@${m.version}`;

export const getScriptElementID = (m: ConsolePluginManifestJSON) => `${scriptIDPrefix}-${m.name}`;

export const loadDynamicPlugin = (baseURL: string, manifest: ConsolePluginManifestJSON) =>
  new Promise<string>((resolve, reject) => {
    const pluginID = getPluginID(manifest);

    const existingPluginData = Array.from(pluginMap.values()).find(
      (p) => p.manifest.name === manifest.name,
    );

    if (existingPluginData) {
      const existingPluginID = getPluginID(existingPluginData.manifest);
      reject(new Error(`Attempt to reload plugin ${existingPluginID} with ${pluginID}`));
      return;
    }

    pluginMap.set(pluginID, { manifest, entryCallbackFired: false });

    const script = document.createElement('script');
    script.id = getScriptElementID(manifest);
    script.src = resolveURL(baseURL, remoteEntryFile);
    script.async = true;

    script.onload = () => {
      if (pluginMap.get(pluginID).entryCallbackFired) {
        resolve(pluginID);
      } else {
        reject(new Error(`Entry script for plugin ${pluginID} loaded without callback`));
      }
    };

    script.onerror = (event) => {
      console.error(event);
      reject(new Error(`Error while loading entry script for plugin ${pluginID}`));
    };

    console.info(`Loading entry script for plugin ${pluginID} from ${script.src}`);
    document.head.appendChild(script);
  });

export const getPluginEntryCallback = (
  pluginStore: PluginStore,
  overrideSharedModulesCallback: typeof overrideSharedModules,
  resolveEncodedCodeRefsCallback: typeof resolveEncodedCodeRefs,
) => (pluginID: string, entryModule: RemoteEntryModule) => {
  if (!pluginMap.has(pluginID)) {
    console.error(`Received callback for unknown plugin ${pluginID}`);
    return;
  }

  const pluginData = pluginMap.get(pluginID);

  if (pluginData.entryCallbackFired) {
    console.error(`Received callback for already loaded plugin ${pluginID}`);
    return;
  }

  pluginData.entryCallbackFired = true;

  try {
    overrideSharedModulesCallback(entryModule);
  } catch (error) {
    console.error(`Failed to override shared modules for plugin ${pluginID}`, error);
    return;
  }

  const resolvedExtensions = resolveEncodedCodeRefsCallback(
    pluginData.manifest.extensions,
    entryModule,
    pluginID,
    () => pluginStore.setDynamicPluginEnabled(pluginID, false),
  );

  pluginStore.addDynamicPlugin(pluginID, pluginData.manifest, resolvedExtensions);
};

export const registerPluginEntryCallback = (pluginStore: PluginStore) => {
  window.loadPluginEntry = getPluginEntryCallback(
    pluginStore,
    overrideSharedModules,
    resolveEncodedCodeRefs,
  );
};

export const getStateForTestPurposes = () => ({
  pluginMap,
});

export const resetStateAndEnvForTestPurposes = () => {
  pluginMap.clear();

  document.querySelectorAll(`[id^="${scriptIDPrefix}"]`).forEach((element) => {
    element.remove();
  });

  window.loadPluginEntry = undefined;
};
