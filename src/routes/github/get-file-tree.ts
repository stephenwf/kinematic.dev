import { RouteMiddleware } from '../../types/application';
import path from 'path';
import fetch from 'node-fetch';

class File {
  id: string;
  name: string;
  sha: string;
  constructor(id: string, name: string, sha: string) {
    this.id = id;
    this.name = name;
    this.sha = sha;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      sha: this.sha,
      type: 'file',
    };
  }
}

class Directory {
  id: string;
  name: string;
  files: File[] = [];
  directories: {
    [key: string]: Directory;
  } = {};

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  addToDirectory(paths: string[], file: { id: string; name: string; sha: string }) {
    const [dir, ...otherPaths] = paths;
    const exists = this.directoryExists(dir);
    if (!exists) {
      this.createDirectory(this.id ? `${this.id}/${dir}` : dir, dir);
    }
    const directory = this.getDirectory(dir);
    if (otherPaths.length) {
      // Do stuff.
      directory.addToDirectory(otherPaths, file);
    } else {
      directory.addFile(file.id, file.name, file.sha);
    }
  }

  addFile(id: string, file: string, sha: string) {
    this.files.push(new File(id, file, sha));
  }

  directoryExists(name: string): boolean {
    return !!this.directories[name];
  }

  createDirectory(id: string, name: string): Directory {
    this.directories[name] = new Directory(id, name);
    return this.directories[name] as Directory;
  }

  getDirectory(name: string): Directory {
    if (!this.directories[name]) {
      throw new Error('Not exists');
    }
    return this.directories[name];
  }

  toJSON() {
    const directories = Object.values(this.directories);
    const files = this.files;
    const combined: Array<File | Directory> = [...directories, ...files];

    combined.sort((a, b) => {
      return ('' + a.name).localeCompare(b.name);
    });

    const children: any = combined.map((item) => item.toJSON());

    return {
      id: this.id,
      name: this.name,
      type: 'directory',
      children,
    };
  }
}

type JSDeliverFile = {
  type: 'file';
  name: string;
  time: string;
  size: number;
  hash: string;
};

type JSDeliverDirectory = {
  type: 'directory';
  name: string;
  files: Array<JSDeliverFile | JSDeliverDirectory>;
};

type JSDeliverResponse = {
  files: Array<JSDeliverFile | JSDeliverDirectory>;
};

function createDirectory(root: Directory, req: JSDeliverFile | JSDeliverDirectory) {
  if (req.type === 'file') {
    root.addFile(`${root.id}/${req.name}`, req.name, req.hash);
  } else {
    const dir = root.createDirectory(`${root.id}/${req.name}`, req.name);
    for (const file of req.files) {
      createDirectory(dir, file);
    }
  }
  return root;
}

/**
 * This will only work with tagged releases.
 * @param context
 */
export const getAnonymousFileTree: RouteMiddleware = async (context) => {
  const user = context.params.user;
  const repo = context.params.repo;
  const branch = context.params.branch;

  const resp: JSDeliverResponse = await fetch(
    `https://data.jsdelivr.com/v1/package/gh/${user}/${repo}#${branch}`
  ).then((r) => r.json());

  const root = new Directory('', `${user}/${repo}`);

  for (const file of resp.files) {
    createDirectory(root, file);
  }

  context.response.body = root;
};

export const getFileTree: RouteMiddleware = async (context) => {
  const github = context.state.getGithubApi();
  const user = context.params.user;
  const repo = context.params.repo;
  const branch = context.params.branch;

  const resp = await github.git.getTree({
    owner: user,
    repo: repo,
    tree_sha: branch,
    recursive: 'true',
  });

  // Start with: /path/to/file.json
  // Split it up. [path, to] + file.json
  // Pass into directory
  //  - addToDirectory(path, [to], file.json);
  // Then inside there, see that there is an additional directory
  // - this.getDirectory(to);
  // Create if not exists
  // Recursively add
  // Once you get to file
  // Add that to files.
  // Write toJSON method that will order by name.

  const root = new Directory('', `${user}/${repo}`);

  for (const item of resp.data.tree) {
    if (item.path && item.type === 'blob') {
      const details = path.parse(item.path);
      const dirs = details.dir.split('/').filter((r) => r);
      if (dirs.length === 0 && item.type === 'blob') {
        root.addFile(item.path, item.path, item.sha as string);
      } else {
        const file = details.base;
        root.addToDirectory(dirs, { id: item.path, name: file, sha: item.sha as string });
      }
    }
  }

  context.response.body = root;
};
