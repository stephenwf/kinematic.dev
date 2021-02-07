import { Octokit } from '@octokit/rest';
import { RouteMiddleware } from '../types/application';
import * as path from 'path';

//
// const madoc = {
//   owner: 'digirati-co-uk',
//   repo: 'madoc-platform',
//   tree_sha: '9a8bf8a',
//   recursive: 'true',
// };
//
// type FlatItem = {
//   path: string;
//   mode: string;
//   type: 'blob' | 'tree';
//   sha: string;
//   url: string;
// };
//
// class Directory {
//   name: string;
//   items: Array<FlatItem | Directory> = [];
//   type = 'tree';
//
//   constructor(name: string) {
//     this.name = name;
//   }
//
//   addNode(item: FlatItem | Directory) {
//     if (item instanceof Directory) {
//       this.items.push(item);
//       return;
//     }
//     if (item.type === 'blob') {
//       this.items.push(item);
//       return;
//     }
//
//     const directory = new Directory(item.path);
//     this.items.push(item);
//
//   }
// }

export const example: RouteMiddleware = async (context) => {
  if (!context.state.user) {
    context.response.body = { error: 'no user' };
    return;
  }

  const octokit = new Octokit({
    auth: `token ${context.state.user.accessToken}`,
  });

  const resp = await octokit.git.getTree({
    owner: 'stephenwf',
    repo: 'use-open-seadragon',
    tree_sha: 'master',
    recursive: 'true',
  });

  // const root = new Directory('/');
  for (const item of resp.data.tree) {
    if (item.path) {
      console.log(path.parse(item.path));
    }
  }

  context.response.body = resp.data;
};
