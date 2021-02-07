import { atom, atomFamily, selector, useRecoilState } from 'recoil';
import { useCallback, useMemo } from 'react';
import { useKinematic } from './host-context';
import minimatch from 'minimatch';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'kinematic-workspaces',
});

// These are updated when the route changes.
export const currentRepository = atom<string | undefined>({
  key: 'current-repository-id',
  default: undefined,
});

export const currentRepositoryBranch = atom({
  key: 'current-repository-branch-id',
  default: 'master',
});

export const treeState = atomFamily<boolean, { id: string; depth: number }>({
  key: 'file-tree-open-state',
  default: ({ depth }) => {
    return depth === 0;
  },
  effects_UNSTABLE: [persistAtom],
});

export const currentWorkspaceId = selector({
  key: `current-workspace-id`,
  get({ get }) {
    const repo = get(currentRepository);
    const branch = get(currentRepositoryBranch);

    return `${repo}/${branch}`;
  },
});

export type Workspace = {
  repository: string;
  isSaved: boolean;
  selectedFile: string | undefined;
  unsavedFiles: string[];
  openFiles: string[];
};

// Persisted.
export const workspace = atomFamily<Workspace, string>({
  key: `workspace`,
  default: (name: string) => ({
    repository: name,
    isSaved: true,
    selectedFile: undefined,
    unsavedFiles: [],
    openFiles: [],
  }),
  effects_UNSTABLE: [persistAtom],
});

// Broken down into better atoms.
export const currentWorkspace = selector<Workspace>({
  key: `current-workspace`,
  get: ({ get }) => {
    const workspaceId = get(currentWorkspaceId);
    return get(workspace(workspaceId));
  },
  set: ({ set, get }, newValue) => {
    const workspaceId = get(currentWorkspaceId);
    set(workspace(workspaceId), newValue);
  },
});

export type FileRecord = {
  path: string;
  name: string;
  hasChanged?: boolean;
  unsavedData?: string;
  sha?: string;
};

export const fileRecord = atomFamily<FileRecord, string>({
  key: `file-record`,
  default: (path: string) => ({
    path,
    name: 'Untitled',
  }),
  effects_UNSTABLE: [persistAtom],
});

export const openFiles = selector<FileRecord[]>({
  key: `workspace-open-files`,
  get: ({ get }) => {
    const _currentWorkspace = get(currentWorkspace);

    return (_currentWorkspace.openFiles || []).map((file) => get(fileRecord(file))).filter((e) => e);
  },
  set: ({ set }, newValue) => {
    if (Array.isArray(newValue)) {
      for (const fileRef of newValue) {
        set(fileRecord(fileRef.path), fileRef);
      }

      set(currentWorkspace, (_currentWorkspace) => {
        return {
          ..._currentWorkspace,
          openFiles: newValue.map((item) => item.path),
        };
      });
    }
  },
});

export const unsavedFiles = selector<FileRecord[]>({
  key: `unsaved-files`,
  get: ({ get }) => {
    const _currentWorkspace = get(currentWorkspace);

    return (_currentWorkspace.unsavedFiles || []).map((file) => get(fileRecord(file))).filter((e) => e);
  },
});

export const currentFile = selector<FileRecord | undefined>({
  key: `workspace-current-file`,
  get: ({ get }) => {
    const _currentWorkspace = get(currentWorkspace);

    if (_currentWorkspace.selectedFile) {
      return get(fileRecord(_currentWorkspace.selectedFile));
    }

    return undefined;
  },
});

// Helpers.
function selectNextFile(justClosed: string, files: string[]) {
  // Nothing to select.
  if (files.length <= 1) {
    return undefined;
  }

  const closedIndex = files.indexOf(justClosed);

  if (closedIndex <= 0) {
    // Look ahead.
    return files[closedIndex + 1];
  }

  // Look behind by default.
  return files[closedIndex - 1];
}

export function useCloseFile() {
  const [, setWorkspace] = useRecoilState(currentWorkspace);

  return useCallback(
    (ref: string) => {
      setWorkspace((_oldWorkspace) => {
        return {
          ..._oldWorkspace,
          selectedFile:
            _oldWorkspace.selectedFile === ref
              ? selectNextFile(_oldWorkspace.selectedFile, _oldWorkspace.openFiles)
              : _oldWorkspace.selectedFile,
          openFiles: _oldWorkspace.openFiles.filter((fileRef) => fileRef !== ref),
        };
      });
    },
    [setWorkspace]
  );
}

export function useSelectFile() {
  const [, setWorkspace] = useRecoilState(currentWorkspace);
  return useCallback(
    (id: string) => {
      setWorkspace((_oldWorkspace) => {
        return {
          ..._oldWorkspace,
          selectedFile: id,
        };
      });
    },
    [setWorkspace]
  );
}

export function useOpenFile() {
  const [, setOpenFiles] = useRecoilState(openFiles);
  const selectFile = useSelectFile();

  return useCallback(
    (file: { path: string; sha?: string; name: string }) => {
      setOpenFiles((_openFiles) => {
        const ids = _openFiles.map((i) => i.path);
        if (ids.indexOf(file.path) !== -1) {
          return _openFiles;
        }

        return [..._openFiles, file];
      });

      selectFile(file.path);
    },
    [selectFile, setOpenFiles]
  );
}

export function useExtensionType(id: string) {
  const { viewers } = useKinematic();
  return useMemo(
    () =>
      viewers.find((item) => {
        return minimatch(id, item.path, { matchBase: true });
      }),
    [id, viewers]
  );
}
