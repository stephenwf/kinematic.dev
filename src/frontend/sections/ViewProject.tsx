import { KinematicProvider } from '../state/host-context';
import React from 'react';
import { FileBrowser } from './FileBrowser';
import { Route, useParams } from 'react-router-dom';
import { FilePreview } from './FilePreview';

export const ViewProject: React.FC = () => {
  const params = useParams<{ user: string; repo: string; branch: string }>();

  return (
    <KinematicProvider user={params.user} repo={params.repo} branch={params.branch}>
      <div style={{ flex: '1 1 0px', display: 'flex' }}>
        <div style={{ width: 400 }}>
          <FileBrowser />
        </div>
        <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'column' }}>
          <Route path="/browse/:user/:repo/:branch/:path*">
            <FilePreview key={`${params.user}/${params.repo}/${params.branch}`} />
          </Route>
        </div>
      </div>
    </KinematicProvider>
  );
};
