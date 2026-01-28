// Debug Console - Handles global error reporting
(function () {
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug-console';
    debugDiv.style.cssText = 'position:fixed; bottom:0; left:0; right:0; height:200px; background:rgba(0,0,0,0.9); color:#0f0; font-family:monospace; font-size:14px; padding:15px; overflow-y:auto; z-index:10000; pointer-events:none; border-top: 2px solid #0f0;';

    // Initial message
    const initMsg = document.createElement('div');
    initMsg.textContent = '[DEBUG] Console initialized. Listening for errors...';
    debugDiv.appendChild(initMsg);

    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(debugDiv);
    });

    function log(type, args) {
        const msg = Array.from(args).map(a => {
            if (a instanceof Error) return `${a.message}\n${a.stack}`;
            if (typeof a === 'object') return JSON.stringify(a);
            return String(a);
        }).join(' ');

        const line = document.createElement('div');
        line.textContent = `[${type}] ${msg}`;
        line.style.borderBottom = '1px solid #333';
        line.style.padding = '2px 0';

        if (type === 'ERROR') {
            line.style.color = '#ff4444';
            line.style.fontWeight = 'bold';
            line.style.background = 'rgba(255,0,0,0.1)';
        }
        else if (type === 'WARN') line.style.color = '#ffbb33';

        if (document.body.contains(debugDiv)) {
            debugDiv.appendChild(line);
            debugDiv.scrollTop = debugDiv.scrollHeight;
        }
    }

    // Capture console output
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    console.log = function (...args) { origLog.apply(console, args); log('LOG', args); };
    console.warn = function (...args) { origWarn.apply(console, args); log('WARN', args); };
    console.error = function (...args) { origError.apply(console, args); log('ERROR', args); };

    // Capture Global Errors (Syntax, Runtime)
    window.onerror = function (msg, url, line, col, error) {
        console.error(`GLOBAL ERROR: ${msg}\nLocation: ${url}:${line}:${col}\nstack: ${error ? error.stack : 'N/A'}`);
        return false; // let default handler run too
    };

    // Capture Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', function (event) {
        console.error(`UNHANDLED PROMISE: ${event.reason}`);
    });

})();
