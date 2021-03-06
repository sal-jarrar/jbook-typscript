import React, { useRef, useEffect } from 'react';
import './Preview.css';

interface PreviewProps {
  code: string;
  err: string;
}
const html = `
    <html>
      <head>
        <style>html {  background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>RunTime Error</h4>' + err + '</div>'
            console.error(err)
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error)
          });

          window.addEventListener(
            'message',
            (event) => {
              try {
              eval(event.data);
              } catch (error) {
                handleError(error)
              }
            },
            false
          );
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();
  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);
  console.log(err);

  return (
    <div className='preview-wrapper'>
      <iframe
        title='code preview'
        ref={iframe}
        srcDoc={html}
        sandbox='allow-scripts'
      />
      {err && <div className='preview-err'>{err}</div>}
    </div>
  );
};

export default Preview;
