import React, { FC, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { defaultConfig } from '../config/default-react-query';
import { useKinematicHost } from '../state/host-context';
import { KinematicHostSession } from '../../protocol/kinematic-host-session';
import { currentRepository, useExtensionType } from '../state/workspace';
import { useRecoilValue } from 'recoil';

export const ViewFile: FC<{ id: string; sha: string }> = ({ id, sha }) => {
  const host = useKinematicHost();
  const [session, setSession] = useState<KinematicHostSession>();
  const repo = useRecoilValue(currentRepository);
  const { data } = useQuery(
    ['get-blob', { repo, sha }],
    async () => {
      return fetch(`/api/blob/${repo}/${sha}`).then((r) => r.json());
    },
    defaultConfig
  );
  const iframe = useRef<HTMLIFrameElement>();
  const found = useExtensionType(id);

  useLayoutEffect(() => {
    if (iframe.current) {
      const hostUrl = found ? new URL(found.loader) : new URL(window.location.host);
      // @todo use origin from config.
      host.createSession(iframe.current, `${hostUrl.protocol}//${hostUrl.host}`).then((sess) => {
        setSession(sess);
      });
    }
  }, [host]);

  const realData = useMemo(() => {
    if (data) {
      return atob(data.content);
    }
  }, [data]);

  useEffect(() => {
    if (session && realData) {
      session.dispatchEvent('FILE_LOADED', { content: realData });
    }
  }, [session, realData]);

  return (
    <iframe
      sandbox="allow-forms allow-scripts allow-same-origin"
      style={{ border: 'none', width: '100%', height: '100%' }}
      ref={iframe as any}
      src={found?.loader || window.location.host + '/frames/echo-frame'}
    />
  );
};
