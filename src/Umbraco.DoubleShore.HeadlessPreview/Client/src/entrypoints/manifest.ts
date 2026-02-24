export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Umbraco Double Shore Headless Preview Entrypoint",
    alias: "Umbraco.DoubleShore.HeadlessPreview.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
