export type PackageJson = {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  repository?:
    | string
    | {
        type: string;
        url: string;
        directory?: string;
      };
  license?: string;
  bin?: string | { [key: string]: string };
  main?: string;
  module?: string;
  types?: string;
  exports?:
    | string
    | {
        [key: string]:
          | string
          | {
              require?: string;
              import?: string;
              default?: string;
              types?: string;
            }
          | {
              [key: string]:
                | string
                | {
                    require?: string;
                    import?: string;
                    default?: string;
                    types?: string;
                  };
            };
      };
  files?: string[];
  scripts?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
  peerDependenciesMeta?: {
    [key: string]: {
      optional: boolean;
    };
  };
  optionalDependencies?: { [key: string]: string };
  bundledDependencies?: string[]; // Also common as 'bundleDependencies'
  bundleDependencies?: string[];
};
