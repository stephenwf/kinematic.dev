import * as React from 'react';

export function KinematicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 57 66" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(-.003)">
          <g fill="#000">
            <path d="M.014.949l13.141.004V17.32C6.575 18.967 2.19 22.748 0 28.662L.014.949zM0 40.344V65h13.17l-.002-13.314C5.278 49.888 1.92 45.08 0 40.344zM22.027 17.87L37.908.945 55.19.944 31.235 25.052c-.95-1.502-1.634-2.222-2.521-3.11L44.504 5h-4.096L26.346 20.046c-1.07-.705-2.398-1.546-4.32-2.177zM34.003 34.208L56.538 65H39.324L27.44 48.174c1.34-1.08 2.539-2.409 3.626-3.934L43.18 61h3.704L32.632 41.31c.987-2.257 1.354-4.643 1.371-7.102z" />
          </g>
          <circle fill="#5B79D7" cx={16.503} cy={34.5} r={14.5} />
        </g>
      </g>
    </svg>
  );
}
