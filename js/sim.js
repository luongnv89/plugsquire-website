/* Plugsquire simulator: the app's window, rebuilt in the browser with sample data.
   Every screen mirrors a feature described in the app's README. Nothing here reads the visitor's Mac. */
(function () {
  'use strict';
  var root = document.getElementById('sim');
  if (!root) return;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function gb(n) { return n >= 100 ? n.toFixed(1) + ' GB' : n >= 1 ? n.toFixed(2) + ' GB' : Math.round(n * 1000) + ' MB'; }
  function pct(a, b) { return Math.round((a / b) * 100); }

  /* ---------- Icons (SF Symbols-like strokes) ---------- */
  var P = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    warn: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
    kbd: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    head: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    drive: '<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 13h5M17 12h.01"/>',
    display: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    cable: '<path d="M8 2v5M16 2v5"/><rect x="6" y="7" width="12" height="7" rx="2"/><path d="M12 14v8"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    bt: '<path d="m7 7 10 10-5 5V2l5 5L7 17"/>',
    net: '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-5h14v5"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.5h.01"/>',
    shield: '<path d="M12 2 4 5v6c0 5 3.5 9.3 8 11 4.5-1.7 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-11 6"/>',
    map: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h9M12 8h9M16 8v13"/>',
    files: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    app: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M8 12h8M12 8v8"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><path d="M7 6.5h.01M7 17.5h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6L20 8"/><path d="M20 3v5h-5"/>',
    brush: '<path d="M18 2 9 11l4 4 9-9z"/><path d="M9 11c-3 0-5 2-5 5 0 2-2 3-2 3h7c3 0 4-2 4-4"/>',
    cam: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    back: '<path d="m15 6-6 6 6 6"/>',
    box: '<path d="M3 7 12 3l9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>'
  };
  function ic(n, cls) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '>' + P[n] + '</svg>'; }

  /* ---------- Sample data ---------- */
  var DISK_TOTAL = 994.66;
  var S = {
    view: { name: 'overview' }, stack: [], native: false, online: true, plugged: false, inspected: '4:07 PM',
    free: 48.1, names: {}, removed: {}, ejected: false, mouseTwoButtons: false, knock: false,
    netSel: null, ports: null, portTimer: null, query: '', histQuery: '',
    worktreesGone: {}, wtSel: {}, mapPath: [], filesGone: {}, fileSel: {}, sizeOn: true, sizeMin: 5, ageOn: true, ageMin: 365, sortBy: 'size',
    appsGone: {}, appReview: null, leftoverSel: {}, sketchQuit: false, readAgo: 2
  };

  var GROUPS = ['Input', 'Audio', 'Mobile', 'Storage', 'Displays & cameras', 'Hubs & adapters', 'Power'];
  var GROUP_ICON = { 'Input': 'kbd', 'Audio': 'head', 'Mobile': 'phone', 'Storage': 'drive', 'Displays & cameras': 'display', 'Hubs & adapters': 'cable', 'Power': 'bolt' };

  var DEVICES = [
    { id: 'storage', name: 'Internal Storage', group: 'Storage', bus: 'Apple Fabric', on: true, maker: 'Apple', sub: '994.66 GB · APFS',
      id2: [['Capacity', '994.66 GB'], ['Format', 'APFS'], ['S.M.A.R.T. status', 'Verified'], ['Protocol', 'Apple Fabric']] },
    { id: 'battery', name: 'Internal Battery', group: 'Power', bus: 'Internal', on: true, maker: 'Apple', sub: '82% of original capacity',
      id2: [['Maximum capacity', '82%'], ['Charge cycles', '462'], ['Condition', 'Normal'], ['Charging', 'Yes, 96 W adapter']] },
    { id: 'airpods', name: 'AirPods Pro', group: 'Audio', bus: 'Bluetooth', on: true, maker: 'Apple', sub: 'L 82% · R 79% · Case 40%',
      batt: [['Left', 82], ['Right', 79], ['Case', 40]],
      id2: [['Model', 'AirPods Pro 2 with MagSafe Charging Case (USB-C)'], ['Firmware', '9A348'], ['Protocol', 'Classic Bluetooth'], ['Vendor ID', '0x004C'], ['Product ID', '0x2024'], ['Serial', 'Shown on this Mac only']],
      about: 'Wireless noise-cancelling earbuds made by Apple. The second generation was released in September 2022.' },
    { id: 'asus', name: 'ASUS VX278', group: 'Displays & cameras', bus: 'HDMI', on: true, maker: 'ASUSTeK', sub: '1920 × 1080 · 60 Hz',
      id2: [['Resolution', '1920 × 1080'], ['Refresh rate', '60 Hz'], ['Manufactured', 'Week 32, 2017'], ['Connection', 'HDMI through USB-C Hub']] },
    { id: 'kbd', name: 'Blue Element Keyboard', group: 'Input', bus: 'Bluetooth', on: true, maker: 'Not confirmed', sub: 'Keyboard · Classic Bluetooth',
      id2: [['Reported as', 'Internal Keyboard/Trackpad (ANSI)'], ['Vendor ID', '0x05AC (claimed)'], ['Protocol', 'Classic Bluetooth'], ['Signal', 'Not reported']] },
    { id: 'mouse', name: 'Magic Mouse', group: 'Input', bus: 'Bluetooth', on: true, maker: 'Apple', sub: '64% · Low Energy', batt: [['Mouse', 64]],
      id2: [['Protocol', 'Bluetooth Low Energy'], ['Signal', '−58 dBm, good'], ['Firmware', '2.0.4'], ['Buttons', 'One button']] },
    { id: 'hub', name: 'USB-C Hub', group: 'Hubs & adapters', bus: 'USB', on: true, maker: 'Generic', sub: 'USB 3.1 · 5 Gb/s · 4 ports',
      id2: [['Link speed', '5 Gb/s (USB 3.1 Gen 1)'], ['Ports', '4 USB, HDMI, card reader'], ['Power drawn', '0.9 W'], ['Port', 'USB-C port 1 (left, front)']] },
    { id: 'mic', name: 'USB Microphone', group: 'Audio', bus: 'USB', on: true, maker: 'Registered vendor 0x1B3F', sub: '12 Mb/s · via USB-C Hub',
      id2: [['Link speed', '12 Mb/s (USB Full Speed)'], ['Power', '100 mA wanted · 500 mA granted'], ['Hub', 'USB-C Hub, port 2']] },
    { id: 'adapter', name: '96W USB-C Power Adapter', group: 'Power', bus: 'USB-C PD', on: true, maker: 'Apple', sub: '96 W · charging',
      id2: [['Wattage', '96 W'], ['Negotiated', '20 V · 4.7 A'], ['Port', 'USB-C port 3 (right)']] },
    { id: 'silent', name: 'Unidentified accessory', group: 'Power', bus: 'USB-C power only', on: true, maker: '—', sub: 'Charging on USB-C port 2', silent: true,
      id2: [['Port', 'USB-C port 2 (left, rear)'], ['Data', 'None: it only charges'], ['Power', '5 V · 1.5 A'], ['Seen by', 'The port controller']] },
    { id: 'facetime', name: 'FaceTime HD Camera', group: 'Displays & cameras', bus: 'Built in', on: true, maker: 'Apple', sub: '1080p · built in',
      id2: [['Resolution', '1080p'], ['Connection', 'Built in']] },
    { id: 'speakers', name: 'MacBook Pro Speakers', group: 'Audio', bus: 'Built in', on: true, maker: 'Apple', sub: 'Output · built in',
      id2: [['Kind', 'Output'], ['Sample rate', '48 kHz']] },
    { id: 'ssd', name: 'Field SSD', group: 'Storage', bus: 'USB', on: true, maker: 'Registered vendor 0x0BDA', sub: '1 TB · 10 Gb/s',
      id2: [['Capacity', '1 TB'], ['Volume', 'Field SSD · APFS'], ['Link speed', '10 Gb/s (USB 3.2 Gen 2)'], ['S.M.A.R.T. status', 'Verified']] },
    { id: 'dock', name: 'Thunderbolt 4 Dock', group: 'Hubs & adapters', bus: 'Thunderbolt', on: false, maker: 'Generic', sub: 'Last seen yesterday',
      id2: [['Link', '40 Gb/s'], ['Last connected', 'Yesterday, 6:12 PM']] },
    { id: 'iphone', name: 'iPhone', group: 'Mobile', bus: 'Bluetooth', on: false, maker: 'Apple', sub: 'Remembered · Classic Bluetooth', remembered: true, id2: [['Protocol', 'Classic Bluetooth'], ['Paired', 'Yes']] },
    { id: 'iphone13', name: 'iPhone13', group: 'Mobile', bus: 'Bluetooth', on: false, maker: 'Apple', sub: 'Remembered · −52 dBm', remembered: true, id2: [['Protocol', 'Classic Bluetooth'], ['Last signal', '−52 dBm, good']] },
    { id: 'iphone8', name: 'iPhone8', group: 'Mobile', bus: 'Bluetooth', on: false, maker: 'Apple', sub: 'Remembered · Classic Bluetooth', remembered: true, id2: [['Protocol', 'Classic Bluetooth'], ['Paired', 'Yes']] },
    { id: 'ipad', name: 'iPad', group: 'Mobile', bus: 'Bluetooth', on: false, maker: 'Apple', sub: 'Remembered · Low Energy', remembered: true, id2: [['Protocol', 'Bluetooth Low Energy'], ['Paired', 'Yes']] }
  ];
  var FLASH = { id: 'flash', name: 'USB Flash Drive', group: 'Storage', bus: 'USB', on: true, maker: 'Registered vendor 0x0781', sub: '64 GB · 480 Mb/s', fresh: true,
    id2: [['Capacity', '64 GB'], ['Link speed', '480 Mb/s (USB 2.0)'], ['Supports', '5 Gb/s (USB 3.2 Gen 1)'], ['Port', 'USB-C Hub, port 4']] };

  function devices() { return DEVICES.concat(S.plugged ? [FLASH] : []).filter(function (d) { return !S.removed[d.id]; }); }
  function dev(id) { return devices().filter(function (d) { return d.id === id; })[0]; }
  function dname(d) { return (d.silent && S.names.silent) || d.name; }

  var CATS = [
    { id: 'apps', name: 'Applications', size: 61.3, desc: 'Apps in /Applications and ~/Applications' },
    { id: 'appdata', name: 'Application data', size: 104.8, desc: 'Application Support and preferences' },
    { id: 'caches', name: 'App caches', size: 22.71, desc: 'All of it; apps rebuild their caches', safe: 'Safe to clear', clean: true, items: ['~/Library/Caches (412 folders)'] },
    { id: 'xcode', name: 'Xcode build data', size: 15.62, desc: 'Derived data and simulator caches older than 30 days', safe: 'Rebuilt or downloaded again when needed', clean: true, items: ['~/Library/Developer/Xcode/DerivedData (38 projects)', '~/Library/Developer/CoreSimulator/Caches'] },
    { id: 'archives', name: 'Xcode archives', size: 6.4, desc: 'Archives older than 30 days', safe: 'Moved to the Trash, so you can put them back', clean: true, trash: true, items: ['~/Library/Developer/Xcode/Archives (14 archives)'] },
    { id: 'pkg', name: 'Package manager caches', size: 12.64, desc: 'npm, Yarn, pnpm, pip, Conda, Homebrew', safe: 'Downloaded again when needed', clean: true, items: ['~/.npm/_cacache', '~/Library/Caches/pip', '~/Library/Caches/Homebrew'] },
    { id: 'deps', name: 'Project dependencies', size: 5.87, desc: 'node_modules folders untouched for more than 30 days', safe: 'Rebuilt or downloaded again when needed', clean: true, items: ['~/code/atlas/node_modules', '~/code/old-site/node_modules', '~/Projects/demo/node_modules'] },
    { id: 'backups', name: 'iPhone backups', size: 18.3, desc: 'Device backups older than 90 days', safe: 'Moved to the Trash, so you can put them back', clean: true, trash: true, items: ['~/Library/Application Support/MobileSync/Backup (1 backup)'] },
    { id: 'logs', name: 'Logs', size: 1.94, desc: 'Log files older than 7 days', safe: 'Rebuilt when needed', clean: true, items: ['~/Library/Logs (126 files)'] },
    { id: 'crash', name: 'Crash reports', size: 1.18, desc: 'Diagnostic reports older than 30 days', safe: 'Safe to clear', clean: true, items: ['~/Library/Logs/DiagnosticReports (.crash, .diag, .ips)'] },
    { id: 'trash', name: 'Trash', size: 4.83, desc: 'Everything in the Trash', safe: 'Gone for good once emptied', empty: true }
  ];
  function cat(id) { return CATS.filter(function (c) { return c.id === id; })[0]; }
  function used() { return DISK_TOTAL - S.free; }
  function freeable() { return CATS.reduce(function (a, c) { return a + ((c.clean || c.empty) ? c.size : 0); }, 0); }

  /* ---------- Findings (the audit) ---------- */
  var SEV_LABEL = { critical: 'Act now', warning: 'Needs attention', advisory: 'Advisory', note: 'Note' };
  var SEV_RANK = { critical: 0, warning: 1, advisory: 2, note: 3 };
  function findings() {
    // Titles, details, actions and steps follow the app's own audit rules (PlugsquireCore/Audit.swift).
    var f = [], frac = S.free / DISK_TOTAL, target = Math.max(DISK_TOTAL * 0.15 - S.free, 0);
    var spaceSteps = ['Open System Settings › General › Storage and wait for the coloured bar to finish calculating.',
      'Turn on the recommendations there: “Empty Trash Automatically” and, if you use iCloud, “Store in iCloud”.',
      'Click the ⓘ beside the largest categories (Documents, Applications, iOS Files, Developer) and delete what you no longer need.',
      'Empty the Trash: deleted files still take space until you do.',
      'Move photo libraries, videos and old projects to an external drive.',
      'Aim to free about ' + gb(target) + ' so that 15% of the disk is available.'];
    if (frac < 0.05) f.push({ id: 'space', dev: 'storage', sev: 'critical', title: 'Almost out of space',
      text: gb(S.free) + ' free of 994.66 GB (' + Math.round(frac * 100) + '%). macOS needs free space for updates, swap and snapshots; it slows down and apps may fail to save.',
      action: 'Free up space now.', steps: spaceSteps, settings: 'Open Storage settings' });
    else if (frac < 0.10) f.push({ id: 'space', dev: 'storage', sev: 'warning', title: 'Running low on space',
      text: gb(S.free) + ' free of 994.66 GB (' + Math.round(frac * 100) + '%). Below about 10% free, macOS has little room for updates and temporary files.',
      action: 'Free up space.', steps: spaceSteps, settings: 'Open Storage settings' });
    f.push({ id: 'fw', dev: 'airpods', sev: 'warning', title: 'Firmware is out of date',
      text: 'Installed version 9A348; Apple lists 9B47 as the latest for AirPods Pro 2 with MagSafe Charging Case (USB-C) (list dated November 10, 2026). It is 2 releases behind.',
      action: 'Let the AirPods update themselves in their case, on power, near this Mac.',
      steps: ['Update this Mac (or your iPhone or iPad) to the latest system version and keep Bluetooth on.',
        'Connect the AirPods to that device over Bluetooth, and connect the device to Wi-Fi.',
        'Plug the charging case into power.',
        'Put the AirPods in the case and close the lid. Keep the case within Bluetooth range.',
        'Wait at least 30 minutes. The update installs by itself.',
        'Open the lid to reconnect, then check the version here again.'],
      src: 'Apple Support' });
    f.push({ id: 'batt', dev: 'battery', sev: 'advisory', title: 'Battery capacity is wearing down',
      text: 'It holds 82% of its original capacity after 462 charge cycles. Apple’s service threshold is 80%.',
      action: 'No repair needed yet. Slow the wear with the steps below.',
      steps: ['Open System Settings › Battery, click the ⓘ next to Battery Health and turn on Optimised Battery Charging.',
        'If the Mac stays plugged in most of the day, also choose the 80% charge limit where your macOS offers it.',
        'Keep the Mac out of heat: do not leave it in a hot car or charge it under a blanket.',
        'Look again in a few months. Below 80%, book a battery service.'],
      settings: 'Open Battery settings', src: 'Apple Support' });
    if (S.plugged && !S.removed.flash) f.push({ id: 'slow', dev: 'flash', sev: 'warning', title: 'Drive is on a slow USB 2.0 link',
      text: 'It connected at 480 Mb/s through “USB-C Hub”. Modern drives transfer ten times faster or more on a USB 3 link.',
      action: 'Change the cable or the port.',
      steps: ['Unplug it from “USB-C Hub” and plug it straight into a port on the Mac.',
        'If it is still slow, replace the cable with one marked for USB 3 data (5 Gb/s or more). Cables bundled with chargers usually carry only USB 2.0.',
        'Push both ends fully home: a plug that is not fully seated can fall back to USB 2.0.',
        'Come back to this window: the speed shown should read 5 Gb/s or higher.'] });
    f.push({ id: 'age', dev: 'asus', sev: 'note', title: 'Manufactured in 2017', text: 'This panel is 9 years old. Backlights dim and colours drift with age.', nothing: true });
    f.push({ id: 'ident', dev: 'kbd', sev: 'note', title: 'Borrows an Apple identity', text: 'It identifies itself as “Internal Keyboard/Trackpad (ANSI)”, an ID Apple uses for keyboards built into a MacBook. Third-party keyboards do this so macOS applies the Apple key layout.', nothing: true });
    return f.filter(function (x) { return dev(x.dev); }).sort(function (a, b) { return SEV_RANK[a.sev] - SEV_RANK[b.sev]; });
  }
  function attention() { return findings().filter(function (f) { return f.sev !== 'note'; }); }
  function devFindings(id) { return findings().filter(function (f) { return f.dev === id; }); }
  function worst(id) { var f = devFindings(id)[0]; return f ? f.sev : null; }
  var SEV_COLOR = { critical: 'var(--w-red)', warning: 'var(--w-orange)', advisory: 'var(--w-yellow)', note: 'var(--w-blue)' };

  function headline() {
    var n = attention().length;
    return n === 0 ? 'Everything is in order.' : n === 1 ? 'One thing deserves your attention.' : ['', '', 'Two', 'Three', 'Four', 'Five'][n] + ' things deserve your attention.';
  }

  /* ---------- Network, Wi-Fi, security, history, worktrees, disk, apps, fleet ---------- */
  var NET = [
    { id: 'router', name: 'Router', kind: 'Routers', ip: '192.168.1.1', mac: '02:1a:2b:00:00:01', maker: 'Kestrel', from: 'UPnP description', model: 'Kestrel AX3000', svc: ['_http._tcp', 'UPnP InternetGatewayDevice'], why: 'It is the default route.', ports: { 53: 'open', 80: 'open', 443: 'open' } },
    { id: 'ws', name: 'Workstation', kind: 'Computers', ip: '192.168.1.20', mac: '02:1a:2b:00:00:14', maker: 'Apple', from: 'Bonjour', model: 'Mac mini', svc: ['_ssh._tcp', '_smb._tcp', '_device-info._tcp'], why: 'It announces a Mac model.', ports: { 22: 'open', 445: 'open', 5900: 'closed' } },
    { id: 'build', name: 'build-box', kind: 'Computers', ip: '192.168.1.23', mac: '02:1a:2b:00:00:17', maker: 'Intel Corporate', from: 'IEEE MAC address table', model: '—', svc: ['_ssh._tcp'], why: 'It announces SSH and a workstation name.', ports: { 22: 'open', 8080: 'open' } },
    { id: 'phone', name: 'iPhone', kind: 'Phones and tablets', ip: '192.168.1.31', mac: '02:1a:2b:00:00:1f', maker: 'Apple', from: 'Bonjour', model: 'iPhone', svc: ['_companion-link._tcp'], why: 'It announces an iPhone model.' },
    { id: 'printer', name: 'Office Printer', kind: 'Printers and scanners', ip: '192.168.1.40', mac: '02:1a:2b:00:00:28', maker: 'Inkwell', from: 'Bonjour TXT record', model: 'Inkwell LX-400', svc: ['_ipp._tcp', '_printer._tcp', '_http._tcp', '_uscan._tcp'], why: 'It announces IPP printing.', ports: { 80: 'open', 443: 'open', 631: 'open', 9100: 'open', 21: 'closed', 23: 'closed' } },
    { id: 'camera', name: 'Hallway Camera', kind: 'Cameras', ip: '192.168.1.52', mac: '02:1a:2b:00:00:34', maker: 'Lumen', from: 'UPnP description', model: 'Lumen Cam 2', svc: ['_rtsp._tcp', 'UPnP Basic'], why: 'It announces an RTSP stream.', ports: { 80: 'open', 554: 'open', 23: 'open' } },
    { id: 'tv', name: 'Living Room TV', kind: 'TVs and media players', ip: '192.168.1.60', mac: '02:1a:2b:00:00:3c', maker: 'Vista', from: 'UPnP description', model: 'Vista 55Q', svc: ['_airplay._tcp', 'UPnP MediaRenderer'], why: 'Its UPnP description says MediaRenderer.' },
    { id: 'speaker', name: 'Kitchen Speaker', kind: 'Speakers', ip: '192.168.1.64', mac: '02:1a:2b:00:00:40', maker: 'Sonora', from: 'Bonjour', model: 'Sonora One', svc: ['_raop._tcp', '_airplay._tcp'], why: 'It announces AirPlay audio only.' },
    { id: 'nas', name: 'atelier-nas', kind: 'Network storage', ip: '192.168.1.70', mac: '02:1a:2b:00:00:46', maker: 'Vaultline', from: 'Bonjour', model: 'Vaultline DS2', svc: ['_smb._tcp', '_afpovertcp._tcp', '_http._tcp'], why: 'It announces file sharing and a storage model.', ports: { 80: 'open', 139: 'open', 445: 'open', 548: 'open', 443: 'open' } },
    { id: 'thermo', name: 'Thermostat', kind: 'Smart home', ip: '192.168.1.81', mac: '02:1a:2b:00:00:51', maker: 'Hearth', from: 'Bonjour', model: 'Hearth T3', svc: ['_hap._tcp'], why: 'It announces HomeKit.' },
    { id: 'unk1', name: '192.168.1.57', kind: 'Kind not known', ip: '192.168.1.57', mac: '02:1a:2b:00:00:39', maker: 'Espressif Inc.', from: 'IEEE MAC address table (network chip)', model: '—', svc: [], why: 'It announces nothing; only its network chip maker is known.' }
  ];
  var KNOCKED = [{ id: 'unk2', name: '192.168.1.88', kind: 'Kind not known', ip: '192.168.1.88', mac: '02:1a:2b:00:00:58', maker: 'Unknown', from: '—', model: '—', svc: [], why: 'Found by knocking: it answered but announces nothing.' }];
  var KINDS = ['Computers', 'Phones and tablets', 'Printers and scanners', 'Cameras', 'TVs and media players', 'Speakers', 'Routers', 'Network storage', 'Smart home', 'Kind not known'];
  var PORTS = [[21, 'FTP'], [22, 'SSH'], [23, 'Telnet'], [53, 'DNS'], [80, 'HTTP'], [139, 'NetBIOS'], [443, 'HTTPS'], [445, 'SMB'], [548, 'AFP'], [554, 'RTSP'], [631, 'IPP'], [1883, 'MQTT'], [3389, 'RDP'], [5900, 'VNC'], [8080, 'HTTP (alt)'], [9100, 'Raw printing']];
  function netDevices() { return NET.concat(S.knock ? KNOCKED : []); }

  var HISTORY_BASE = [
    ['4:06 PM', 'Connected', 'AirPods Pro', 'Apple', 'Bluetooth', '—', '—'],
    ['3:52 PM', 'Connected', 'Unidentified accessory', '—', 'USB-C power', 'Port 2', '—'],
    ['3:40 PM', 'Disconnected', 'Unidentified accessory', '—', 'USB-C power', 'Port 2', '—'],
    ['2:18 PM', 'Connected', 'Field SSD', 'Registered vendor 0x0BDA', 'USB', 'Port 1 › Hub', '10 Gb/s'],
    ['1:05 PM', 'Disconnected', 'Thunderbolt 4 Dock', 'Generic', 'Thunderbolt', 'Port 1', '40 Gb/s'],
    ['9:31 AM', 'Connected', 'USB-C Hub', 'Generic', 'USB', 'Port 1', '5 Gb/s'],
    ['9:31 AM', 'Connected', 'USB Microphone', 'Registered vendor 0x1B3F', 'USB', 'Hub › Port 2', '12 Mb/s'],
    ['9:30 AM', 'Connected', 'Magic Mouse', 'Apple', 'Bluetooth', '—', '—'],
    ['9:30 AM', 'Connected', 'Blue Element Keyboard', 'Not confirmed', 'Bluetooth', '—', '—'],
    ['Yesterday 6:12 PM', 'Disconnected', 'iPhone13', 'Apple', 'Bluetooth', '—', '—']
  ];
  function history() { return (S.plugged ? [[S.pluggedAt || 'Now', 'Connected', 'USB Flash Drive', 'Registered vendor 0x0781', 'USB', 'Hub › Port 4', '480 Mb/s']] : []).concat(HISTORY_BASE); }

  var WT = [
    { id: 'w1', path: '~/code/atlas/.worktrees/search-filters', size: 1.8, safe: true, why: 'No uncommitted or untracked files, and every commit is on a remote.' },
    { id: 'w2', path: '~/code/atlas/.worktrees/hotfix-login', size: 1.6, safe: true, why: 'No uncommitted or untracked files, and every commit is on a remote.' },
    { id: 'w3', path: '~/code/ledger/wt/new-api', size: 0.94, safe: false, why: '2 commits are on no remote.' },
    { id: 'w4', path: '~/code/ledger/wt/spike', size: 0.31, safe: false, why: 'Uncommitted changes in 3 files.' },
    { id: 'w5', path: '~/code/notes/wt/rebase-docs', size: 0.12, safe: false, why: 'A rebase is not finished.' },
    { id: 'w6', path: '~/code/old/wt/release-2024', size: 2.2, safe: false, why: 'The worktree is locked.' }
  ];

  var TREE = { name: 'Macintosh HD', kids: [
    { name: 'Users', kids: [
      { name: 'Home', kids: [
        { name: 'Library', kids: [{ name: 'Application Support', size: 96 }, { name: 'Developer', size: 48 }, { name: 'Caches', size: 34 }, { name: 'Containers', size: 32 }] },
        { name: 'code', kids: [{ name: 'ml-experiments', size: 64 }, { name: 'atlas', size: 46 }, { name: 'ledger', size: 38 }] },
        { name: 'Movies', kids: [{ name: 'Exports', size: 84 }, { name: 'Footage', size: 36 }] },
        { name: 'Pictures', size: 58 }, { name: 'Downloads', size: 54 }, { name: 'Music', size: 21 }] },
      { name: 'Shared', size: 22 }] },
    { name: 'Applications', kids: [{ name: 'Xcode.app', size: 14.2 }, { name: 'Final Frame.app', size: 4.8 }, { name: 'Other apps', size: 42.3 }] },
    { name: 'Library', size: 41 }, { name: 'opt', size: 18 }, { name: 'private', size: 14 }] };
  function tsize(n) { return n.size != null ? n.size : n.kids.reduce(function (a, k) { return a + tsize(k); }, 0); }

  var FILES = [
    { id: 'f1', path: '~/Movies/Exports/brand-film-master.mov', size: 38.2, date: '2025-03-14' },
    { id: 'f2', path: '~/Movies/Footage/drone-raw-2024.mp4', size: 21.6, date: '2024-08-02' },
    { id: 'f3', path: '~/code/ml-experiments/checkpoints/model-v3.ckpt', size: 12.4, date: '2026-10-21' },
    { id: 'f4', path: '~/Downloads/Xcode_16.1.xip', size: 7.9, date: '2025-11-02' },
    { id: 'f5', path: '~/Downloads/linux-desktop-amd64.iso', size: 5.8, date: '2025-01-10' },
    { id: 'f6', path: '~/Library/Developer/CoreSimulator/runtime.dmg', size: 4.1, date: '2026-11-20' },
    { id: 'f7', path: '~/Pictures/Archive/2019-trip.zip', size: 3.2, date: '2020-06-01' },
    { id: 'f8', path: '~/Documents/old-thesis-scans.pdf', size: 1.3, date: '2019-04-11' },
    { id: 'f9', path: '~/Downloads/meeting-recording.m4a', size: 1.1, date: '2026-11-23' }
  ];
  var TODAY = new Date('2026-11-25');
  function ageDays(d) { return Math.round((TODAY - new Date(d)) / 864e5); }

  var APPS = [
    { id: 'xcode', name: 'Xcode', size: 14.2, store: true, left: [['Caches', '~/Library/Caches/com.apple.dt.Xcode', 1.4], ['Preferences', '~/Library/Preferences/com.apple.dt.Xcode.plist', 0.001]] },
    { id: 'ff', name: 'Final Frame', size: 4.8, left: [['Application Support', '~/Library/Application Support/Final Frame', 2.1], ['Caches', '~/Library/Caches/com.example.finalframe', 0.64], ['Preferences', '~/Library/Preferences/com.example.finalframe.plist', 0.001], ['Saved Application State', '~/Library/Saved Application State/com.example.finalframe.savedState', 0.002], ['Logs', '~/Library/Logs/Final Frame', 0.03]] },
    { id: 'sketch', name: 'Sketchbook Studio', size: 1.2, running: true, left: [['Application Support', '~/Library/Application Support/Sketchbook Studio', 0.44], ['Preferences', '~/Library/Preferences/com.example.sketchbook.plist', 0.001]] },
    { id: 'notely', name: 'Notely', size: 0.38, left: [['Containers', '~/Library/Containers/com.example.notely', 0.21], ['Group Containers', '~/Library/Group Containers/group.com.example.notely', 0.05], ['HTTPStorages', '~/Library/HTTPStorages/com.example.notely', 0.002]] },
    { id: 'timeline', name: 'Timeline', size: 0.21, shared: 'Timeline 2', left: [['Preferences', '~/Library/Preferences/com.example.timeline.plist', 0.001], ['Application Support', '~/Library/Application Support/Timeline', 0.09]] },
    { id: 'safari', name: 'Safari', size: 0.02, system: true },
    { id: 'plugsquire', name: 'Plugsquire', size: 0.042, self: true }
  ];

  var FLEET = [
    { name: 'web-eu-1', host: 'web-eu-1.example.net', os: 'Debian 12', health: 'Degraded', hwhy: 'Disk 91% full', risk: 'High', open: 7, expl: 2, scan: '15 min ago' },
    { name: 'build-01', host: 'build-01.lan', os: 'Ubuntu 24.04', health: 'Healthy', hwhy: '', risk: 'Low', open: 0, expl: 0, scan: '12 min ago' },
    { name: 'backup-nas', host: '192.168.1.70', os: 'Ubuntu 22.04', health: 'Healthy', hwhy: '', risk: 'Medium', open: 3, expl: 0, scan: '3 days ago', stale: true },
    { name: 'pi-sensor', host: 'pi-sensor.lan', os: 'Raspberry Pi OS 12', health: 'Healthy', hwhy: '', risk: 'Low', open: 1, expl: 0, scan: '40 min ago' }
  ];

  /* ---------- Shared bits ---------- */
  var NAV = [
    { h: 'Collection' }, { v: 'overview', label: 'All devices', icon: 'grid', n: function () { return devices().length; } },
    { v: 'attention', label: 'Needs attention', icon: 'warn', n: function () { return attention().length; }, hot: true },
    { h: 'By kind' }
  ].concat(GROUPS.map(function (g) { return { v: 'group', arg: g, label: g, icon: GROUP_ICON[g], n: function () { return devices().filter(function (d) { return d.group === g; }).length; } }; }))
   .concat([{ h: 'Diagnostics' },
    { v: 'bluetooth', label: 'Bluetooth', icon: 'bt', pro: true },
    { v: 'network', label: 'Local network', icon: 'net', pro: true },
    { v: 'wifi', label: 'Wi-Fi', icon: 'wifi', pro: true },
    { v: 'security', label: 'Security', icon: 'shield', pro: true },
    { v: 'history', label: 'Connection history', icon: 'clock' },
    { v: 'worktrees', label: 'Git worktrees', icon: 'git', pro: true },
    { v: 'diskmap', label: 'Disk map', icon: 'map', pro: true },
    { v: 'files', label: 'Large and old files', icon: 'files', pro: true },
    { v: 'apps', label: 'App uninstaller', icon: 'app', pro: true },
    { v: 'fleet', label: 'SSH fleet', icon: 'server' }]);

  function sevDot(sev) { return '<span class="sev-dot sd-' + sev + '" aria-hidden="true">' + (sev === 'critical' ? '!' : sev === 'note' ? 'i' : sev === 'advisory' ? '!' : '') + '</span>'; }
  function findingRow(f, showDev) {
    var d = dev(f.dev);
    return '<button class="sim-row" data-go="device" data-arg="' + f.dev + '">' + sevDot(f.sev) +
      '<span class="body"><span class="t">' + esc(f.title) + (showDev ? '<em>' + esc(dname(d)) + '</em>' : '') + '</span><span class="d">' + esc(f.text) + '</span></span>' +
      '<span class="sev sev-' + f.sev + '">' + SEV_LABEL[f.sev] + '</span><span class="chev">' + ic('chev') + '</span></button>';
  }
  function devCard(d) {
    var w = worst(d.id);
    return '<button class="sim-card sim-dev' + (d.on ? '' : ' dim') + '" data-go="device" data-arg="' + d.id + '"><span class="top">' + ic(GROUP_ICON[d.group]) +
      '<small>' + esc(d.bus) + '</small>' + (w && w !== 'note' ? '<span class="flag" style="background:' + SEV_COLOR[w] + '" title="' + SEV_LABEL[w] + '"></span>' : '') + '</span>' +
      '<b>' + esc(dname(d)) + '</b><small>' + esc(d.sub) + '</small></button>';
  }
  function topbar(eyebrow, search) {
    return '<div class="sim-topbar"><span class="sim-eyebrow">' + esc(eyebrow) + '</span>' + (search ? '<label class="sim-search">' + ic('search') + '<span class="visually-hidden">Search devices</span><input type="search" placeholder="Search devices" data-input="query" value="' + esc(S.query) + '"></label>' : '') + '</div>';
  }
  function backBtn(label) { return '<button class="sim-back" data-back>' + ic('back') + ' ' + esc(label || 'Back') + '</button>'; }

  /* ---------- Screens ---------- */
  var V = {};
  V.overview = function () {
    var all = devices(), on = all.filter(function (d) { return d.on; }), att = attention();
    var q = S.query.trim().toLowerCase();
    var list = q ? all.filter(function (d) { return (dname(d) + ' ' + d.maker + ' ' + d.group).toLowerCase().indexOf(q) >= 0; }) : null;
    var healthy = all.length - att.length;
    var low = on.filter(function (d) { return d.batt; }).map(function (d) { return [d, Math.min.apply(null, d.batt.map(function (b) { return b[1]; }))]; }).sort(function (a, b) { return a[1] - b[1]; })[0];
    var h = topbar('Wednesday, November 25', true) +
      '<h2 class="sim-h1">' + headline() + '</h2><p class="sim-sub">' + on.length + ' devices connected to your MacBook Pro · ' + all.filter(function (d) { return !d.on; }).length + ' remembered · ' + findings().filter(function (f) { return f.sev === 'note'; }).length + ' notes</p>';
    if (list) return h + '<h3 class="sim-h2">Matches <small>' + list.length + '</small></h3>' + (list.length ? '<div class="sim-cards">' + list.map(devCard).join('') + '</div>' : '<p class="sim-sub">No device matches this view.</p>');
    h += '<div class="sim-stats"><div><div class="k">Connected</div><div class="v">' + on.length + '</div><div class="s">right now</div></div>' +
      '<div><div class="k">Healthy</div><div class="v" style="color:var(--w-green)">' + healthy + '</div><div class="s">of ' + all.length + ' known devices</div></div>' +
      '<div><div class="k">To review</div><div class="v" style="color:' + (att.length ? 'var(--w-red)' : 'var(--w-green)') + '">' + att.length + '</div><div class="s">across ' + att.length + ' devices</div></div>' +
      '<div><div class="k">Lowest battery</div><div class="v">' + (low ? low[1] + '%' : '—') + '</div><div class="s">' + (low ? esc(low[0].name) : 'no accessory reports one') + '</div></div></div>';
    h += '<h3 class="sim-h2">What the audit found</h3><div class="sim-list">' + findings().map(function (f) { return findingRow(f, true); }).join('') + '</div>';
    h += '<h3 class="sim-h2">Connected now <small>' + on.length + '</small></h3><div class="sim-cards">' + on.map(devCard).join('') + '</div>';
    h += '<h3 class="sim-h2">Remembered <small>' + (all.length - on.length) + '</small></h3><div class="sim-cards">' + all.filter(function (d) { return !d.on; }).map(devCard).join('') + '</div>';
    h += '<h3 class="sim-h2">SSH fleet <small>optional plugin</small></h3><button class="sim-card sim-row" data-go="fleet">' + sevDot('warning') + '<span class="body"><span class="t">1 of 4 hosts needs attention</span><span class="d">web-eu-1: disk 91% full, 2 exploited vulnerabilities open. Read from ssh-fleet-monitor.</span></span><span class="chev">' + ic('chev') + '</span></button>';
    return h;
  };
  V.attention = function () {
    var att = attention();
    return topbar('Needs attention') + '<h2 class="sim-h1">' + headline() + '</h2><p class="sim-sub">Findings that need an action, most serious first. Notes that need none stay in the overview.</p>' +
      (att.length ? '<div class="sim-list">' + att.map(function (f) { return findingRow(f, true); }).join('') + '</div>' : '<p class="sim-sub">Nothing needs your attention.</p>');
  };
  V.group = function (g) {
    var list = devices().filter(function (d) { return d.group === g; });
    return topbar('By kind') + '<h2 class="sim-h1">' + esc(g) + '</h2><p class="sim-sub">' + list.length + ' devices, connected and remembered.</p><div class="sim-cards">' + list.map(devCard).join('') + '</div>';
  };
  V.device = function (id) {
    var d = dev(id);
    if (!d) return V.overview();
    var fs = devFindings(id), h = backBtn() + topbar(d.group + ' · ' + d.bus);
    h += '<h2 class="sim-h1">' + esc(dname(d)) + '</h2><p class="sim-sub">' + esc(d.maker === '—' ? 'Maker not known' : d.maker) + ' · ' + (d.on ? 'Connected' : 'Not connected') + '</p>';
    if (d.silent) {
      h += '<div class="sim-card sim-fix"><span class="one">This accessory only charges, so it never appears in the USB list.</span><span class="d" style="color:var(--w-muted)">Plugsquire read it from the Mac’s port controller. Say what it is and it keeps that name on this port.</span>' +
        '<form class="sim-btns" data-form="name"><label class="visually-hidden" for="sim-name">Name this accessory</label><input id="sim-name" class="sim-select" style="flex:1;min-width:160px" placeholder="For example: Desk lamp" value="' + esc(S.names.silent || '') + '"><button class="sbtn primary" type="submit">Save</button></form></div>';
    }
    if (fs.length) {
      h += '<h3 class="sim-h2">Findings</h3>';
      fs.forEach(function (f) {
        h += '<div class="sim-card" style="margin-bottom:10px"><div class="sim-row" style="padding-bottom:0">' + sevDot(f.sev) + '<span class="body"><span class="t">' + esc(f.title) + '</span><span class="d">' + esc(f.text) + '</span></span><span class="sev sev-' + f.sev + '">' + SEV_LABEL[f.sev] + '</span></div>';
        if (f.nothing) h += '<div class="sim-fix"><span class="sev sev-ok" style="align-self:start">Nothing to fix</span></div>';
        else h += '<div class="sim-fix"><span class="one">' + esc(f.action) + '</span><ol>' + f.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol><div class="sim-btns">' +
          (f.settings ? '<button class="sbtn" data-act="settings" data-arg="' + esc(f.settings) + '">' + esc(f.settings) + '</button>' : '') + '</div>' + (f.src ? '<span class="src">Source: ' + esc(f.src) + '</span>' : '') + '</div>';
        h += '</div>';
      });
    }
    if (d.batt) h += '<h3 class="sim-h2">Battery <small>read ' + S.readAgo + ' min ago</small></h3><div class="batt">' + d.batt.map(function (b) { return '<div class="sim-card"><small>' + b[0] + '</small><b>' + b[1] + '%</b><div class="sim-bar"><i style="width:' + b[1] + '%;background:' + (b[1] < 20 ? 'var(--w-red)' : 'var(--w-green)') + '"></i></div></div>'; }).join('') + '</div>';
    if (id === 'storage') h += storageBlock();
    if (id === 'ssd' || id === 'flash') h += '<h3 class="sim-h2">Volume</h3><div class="sim-card sim-row"><span class="body"><span class="t">' + esc(d.name) + '</span><span class="d">' + (S.ejected && id === 'ssd' ? 'Not mounted' : 'Mounted at /Volumes/' + esc(d.name)) + '</span></span>' +
      (S.ejected && id === 'ssd' ? '<button class="sbtn" data-act="mount">Mount</button>' : '<button class="sbtn" data-act="eject" data-arg="' + id + '">Eject</button>') + '</div>';
    h += '<h3 class="sim-h2">Identity</h3><dl class="sim-card sim-kv">' + d.id2.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>';
    if (d.about) h += '<h3 class="sim-h2">About</h3>' + (S.online ? '<div class="sim-card sim-about"><div class="sim-photo">' + ic(GROUP_ICON[d.group]) + '</div><div><p>' + esc(d.about) + '</p><span class="src" style="font-size:11.5px;color:var(--w-faint)">From Wikipedia and Wikidata, stored on this Mac after the first lookup.</span></div></div>' : '<p class="sim-sub">Online details are off. Turn them on in the sidebar to see a photo and description; stored details stay on this Mac.</p>');
    if (d.on || d.remembered) h += '<h3 class="sim-h2">History</h3><dl class="sim-card sim-kv"><dt>First seen connected</dt><dd>' + (d.fresh ? 'Just now' : 'November 13, 9:02 AM') + '</dd><dt>Last seen connected</dt><dd>' + (d.on ? 'Now' : 'Yesterday, 6:12 PM') + '</dd></dl>';
    if (d.remembered) h += '<div class="sim-btns" style="margin-top:14px"><button class="sbtn" data-act="remove" data-arg="' + id + '">Remove from list</button><span style="color:var(--w-faint);font-size:12px">macOS keeps it paired; it is listed again when it connects.</span></div>';
    return h;
  };
  function storageBlock() {
    var u = used(), fr = freeable();
    var h = '<h3 class="sim-h2" id="sim-breakdown">Where the space goes <small>' + gb(u) + ' used · ' + gb(S.free) + ' free</small></h3><div class="sim-list">';
    CATS.slice().sort(function (a, b) { return b.size - a.size; }).forEach(function (c) {
      h += '<div class="sim-row"><span class="body"><span class="t" style="display:flex;justify-content:space-between;gap:10px"><span>' + esc(c.name) + '</span><span style="font-family:var(--w-head);font-weight:400">' + (c.size ? gb(c.size) : '—') + '</span></span><span class="d">' + esc(c.desc) + (c.safe ? ' · ' + esc(c.safe) : '') + '</span><div class="sim-bar"><i style="width:' + Math.max(0.5, c.size / u * 100 * 2.5) + '%"></i></div></span>' +
        (c.clean && c.size > 0 ? '<button class="sbtn" data-act="clean" data-arg="' + c.id + '">Clean…</button>' : c.empty && c.size > 0 ? '<button class="sbtn" data-act="empty">Empty Trash…</button>' : '') + '</div>';
    });
    var other = u - CATS.reduce(function (a, c) { return a + c.size; }, 0);
    h += '<div class="sim-row"><span class="body"><span class="t" style="display:flex;justify-content:space-between"><span>Everything else</span><span style="font-family:var(--w-head);font-weight:400">' + gb(other) + '</span></span><span class="d">macOS, documents, photos, other users, and folders Plugsquire does not open</span></span></div></div>';
    h += '<div class="sim-card sim-fix" style="margin-top:12px"><span class="sim-eyebrow" style="color:var(--w-accent)">Could be freed</span><span class="sim-big">' + (fr > 0.01 ? 'At least ' + gb(fr) + ' in total' : 'Nothing left to free') + '</span><span class="src">Cleaning is a Pro feature. Every item is checked again just before it is removed.</span></div>';
    return h;
  }
  V.bluetooth = function () {
    var score = S.mouseTwoButtons ? 70 : 65, p = Math.round(score / 80 * 100);
    var recs = [['critical', 'High Bluetooth error rate (90 in 5 minutes)', 'Turn Bluetooth off and on again, or restart the Mac.', null]];
    if (!S.mouseTwoButtons) recs.push(['warning', 'Magic Mouse uses one button', 'Set it to two buttons so right-click works without a modifier key.', 'mouse']);
    recs.push(['ok', 'Keep firmware up to date', 'Check companion apps (Logi Options+ and others) for device updates.', null]);
    var bts = devices().filter(function (d) { return d.bus === 'Bluetooth'; });
    return '<div class="sim-topbar"><span class="sim-eyebrow">Bluetooth diagnostic</span><button class="sbtn" data-act="rerun">Run again</button></div>' +
      '<h2 class="sim-h1">Bluetooth health is good.</h2><p class="sim-sub">' + score + ' of 80 points · ' + bts.filter(function (d) { return d.on; }).length + ' devices connected · checked at 4:08 PM</p>' +
      '<div class="sim-score"><b>' + p + '%</b><div class="sim-bar"><i style="width:' + p + '%"></i></div></div>' +
      '<h3 class="sim-h2">Recommendations</h3><div class="sim-list">' + recs.map(function (r) {
        return '<div class="sim-row">' + sevDot(r[0]) + '<span class="body"><span class="t">' + esc(r[1]) + '</span><span class="d">' + esc(r[2]) + '</span></span>' + (r[3] ? '<button class="sbtn" data-act="btfix">Set to two buttons…</button>' : '') + '</div>';
      }).join('') + '</div>' +
      '<h3 class="sim-h2">Controller</h3><dl class="sim-card sim-kv"><dt>Chipset</dt><dd>Built in, powered on</dd><dt>Devices sharing the radio</dt><dd>3 connected (2 input, 1 audio)</dd><dt>Input (HID) errors, 5 min</dt><dd>4</dd><dt>Bluetooth errors, 5 min</dt><dd>90 (known-harmless messages left out)</dd></dl>' +
      '<h3 class="sim-h2">Devices</h3><div class="sim-list">' + bts.map(function (d) {
        return '<div class="sim-row"><span class="sev-dot ' + (d.on ? 'ok' : '') + '" style="width:8px;height:8px;margin-top:6px;background:' + (d.on ? 'var(--w-green)' : 'var(--w-line-2)') + '"></span><span class="body"><span class="t" style="font-family:var(--w-head);font-weight:500;font-size:14.5px">' + esc(d.name) + '</span><span class="d">' + esc(d.id2.filter(function (r) { return r[0] === 'Protocol'; }).map(function (r) { return r[1]; })[0] || '') + (d.batt ? ' · battery ' + d.batt[0][1] + '%' : '') + (d.id === 'airpods' ? ' · audio profile AAC' : '') + '</span></span><span class="sev ' + (d.on ? 'sev-ok' : '') + '" style="' + (d.on ? '' : 'color:var(--w-faint)') + '">' + (d.on ? 'Healthy' : 'Not connected') + '</span></div>';
      }).join('') + '</div>';
  };
  V.network = function () {
    var list = netDevices(), sel = list.filter(function (n) { return n.id === S.netSel; })[0];
    var h = '<div class="sim-topbar"><span class="sim-eyebrow">Local network · Wi-Fi · 192.168.1.0/24</span><button class="sbtn" data-act="netscan">Scan again</button></div>' +
      '<h2 class="sim-h1">' + list.length + ' devices on your network.</h2><p class="sim-sub">Found from what devices announce (Bonjour and one SSDP search), this Mac’s table of neighbours and the default route.</p>' +
      '<div class="sim-tools"><button class="sim-switch" role="switch" aria-checked="' + S.knock + '" data-act="knock"><span class="track"></span>Knock on every address</button><span style="font-size:12px;color:var(--w-faint)">Off at every launch. Sends one small packet to each address so silent devices answer.</span></div>';
    h += '<div class="sim-pane"><div>';
    KINDS.forEach(function (k) {
      var g = list.filter(function (n) { return n.kind === k; });
      if (!g.length) return;
      h += '<h3 class="sim-h2" style="margin-top:14px">' + k + ' <small>' + g.length + '</small></h3><div class="sim-list">' + g.map(function (n) {
        return '<button class="sim-row" data-act="netsel" data-arg="' + n.id + '"' + (S.netSel === n.id ? ' style="background:var(--w-sel)"' : '') + '><span class="body"><span class="t">' + esc(n.name) + '</span><span class="d">' + esc(n.ip) + ' · ' + esc(n.maker) + (n.model !== '—' ? ' · ' + esc(n.model) : '') + '</span></span><span class="chev">' + ic('chev') + '</span></button>';
      }).join('') + '</div>';
    });
    h += '</div><aside>' + (sel ? netDetail(sel) : '<div class="sim-card sim-fix"><span class="d" style="color:var(--w-muted)">Select a device to see its addresses, maker, model, the services it announces, and why it was given its kind.</span></div>') + '</aside></div>';
    return h;
  };
  function netDetail(n) {
    var h = '<div class="sim-card"><div class="sim-fix"><span class="t" style="font-family:var(--w-head);font-size:18px">' + esc(n.name) + '</span><span class="sim-eyebrow">' + esc(n.kind) + '</span></div>' +
      '<dl class="sim-kv" style="grid-template-columns:110px 1fr;border-top:1px solid var(--w-line)"><dt>Address</dt><dd class="mono">' + n.ip + '</dd><dt>Hardware</dt><dd class="mono">' + n.mac + '</dd><dt>Maker</dt><dd>' + esc(n.maker) + '<br><small style="color:var(--w-faint)">from ' + esc(n.from) + '</small></dd><dt>Model</dt><dd>' + esc(n.model) + '</dd><dt>Services</dt><dd>' + (n.svc.length ? n.svc.map(function (s) { return '<span class="mono" style="display:block">' + esc(s) + '</span>'; }).join('') : 'None announced') + '</dd><dt>Why this kind</dt><dd>' + esc(n.why) + '</dd></dl>' +
      '<div class="sim-fix" style="border-top:1px solid var(--w-line)">';
    if (S.ports && S.ports.id === n.id) {
      var done = S.ports.done;
      h += '<span class="t">Open ports' + (done < PORTS.length ? ' · checking ' + done + ' of 16' : '') + '</span><div class="ports">' + PORTS.map(function (p, i) {
        var r = i < done ? ((n.ports || {})[p[0]] || (i % 3 === 0 ? 'noreply' : 'closed')) : 'wait';
        var label = { open: 'Service answered', closed: 'Closed', noreply: 'No reply', wait: '…' }[r];
        return '<div><span><span class="mono">' + p[0] + '</span> ' + p[1] + '</span><span class="' + r + '">' + label + '</span></div>';
      }).join('') + '</div><div class="sim-btns">' + (done < PORTS.length ? '<button class="sbtn" data-act="portstop">Stop</button>' : '<button class="sbtn" data-act="portclear">Done</button>') + '</div>';
    } else h += '<div class="sim-btns"><button class="sbtn" data-act="ports" data-arg="' + n.id + '">Check open ports…</button></div><span class="src">Tries 16 common TCP ports on this one device, only after you confirm.</span>';
    return h + '</div></div>';
  }
  V.wifi = function () {
    var nearby = [['Atelier-5G', -52, 36, '5 GHz', true], ['Atelier', -55, 6, '2.4 GHz'], ['Café Lune', -67, 44, '5 GHz'], ['Biblio-Guest', -72, 1, '2.4 GHz'], ['DIRECT-41-Inkwell', -74, 6, '2.4 GHz'], ['Studio 4B', -81, 149, '5 GHz'], ['Hidden network', -86, 11, '2.4 GHz']];
    return topbar('Wi-Fi') + '<h2 class="sim-h1">Atelier-5G, excellent signal.</h2><p class="sim-sub">Read from this Mac’s Wi-Fi interface. Nothing is sent anywhere, and no network is joined or changed.</p>' +
      '<div class="sim-grid2"><dl class="sim-card sim-kv" style="grid-template-columns:130px 1fr"><dt>Network</dt><dd>Atelier-5G</dd><dt>Signal</dt><dd>−52 dBm</dd><dt>Noise</dt><dd>−92 dBm</dd><dt>Margin</dt><dd>40 dB, excellent</dd><dt>Channel</dt><dd>36</dd><dt>Band</dt><dd>5 GHz</dd></dl>' +
      '<dl class="sim-card sim-kv" style="grid-template-columns:130px 1fr"><dt>Channel width</dt><dd>80 MHz</dd><dt>Transmit rate</dt><dd>1,201 Mb/s</dd><dt>Standard</dt><dd>Wi-Fi 6 (802.11ax)</dd><dt>Security</dt><dd>WPA3 Personal</dd><dt>Router</dt><dd class="mono">02:1a:2b:00:00:01</dd><dt>Location access</dt><dd>Allowed</dd></dl></div>' +
      '<h3 class="sim-h2">Nearby networks <small>strongest first</small></h3><table class="sim-card sim-table"><thead><tr><th>Network</th><th>Signal</th><th>Channel</th><th>Band</th></tr></thead><tbody>' +
      nearby.map(function (r) { return '<tr><td>' + esc(r[0]) + (r[4] ? ' <span class="badge" style="color:var(--w-accent)">This Mac</span>' : '') + '</td><td>' + r[1] + ' dBm</td><td>' + r[2] + '</td><td class="m">' + r[3] + '</td></tr>'; }).join('') + '</tbody></table>';
  };
  V.security = function () {
    var macCves = [['CVE-SAMPLE-0001', 'WebKit', 'Processing web content may lead to code execution', true], ['CVE-SAMPLE-0002', 'Kernel', 'An app may gain elevated privileges', false], ['CVE-SAMPLE-0003', 'ImageIO', 'Processing an image may disclose memory', false], ['CVE-SAMPLE-0004', 'Safari', 'A website may track you across sites', false]];
    var h = topbar('Security · National Vulnerability Database') + '<h2 class="sim-h1">This Mac needs an update.</h2><p class="sim-sub">Matched on this Mac from what Plugsquire already knows. It probes nothing. Sample IDs in this demo.</p>' +
      '<h3 class="sim-h2">This Mac <small>macOS 15.1 · Safari 18.1 · exact verdict</small></h3><div class="sim-card"><div class="sim-row">' + sevDot('critical') + '<span class="body"><span class="t">4 vulnerabilities apply, 1 exploited in attacks</span><span class="d">CISA lists one as exploited, so it is sorted first. All 4 are fixed in macOS 15.2.</span></span></div>' +
      '<div class="sim-fix"><span class="one">Install the macOS update for this version.</span><ol><li>Open Software Update.</li><li>Install macOS 15.2, which fixes all 4.</li></ol><div class="sim-btns"><button class="sbtn" data-act="settings" data-arg="Open Software Update">Open Software Update</button></div></div>' +
      '<table class="sim-table" style="border-top:1px solid var(--w-line)"><tbody>' + macCves.map(function (c) { return '<tr><td class="mono">' + c[0] + '</td><td>' + c[1] + '</td><td class="m hide-sm">' + c[2] + '</td><td>' + (c[3] ? '<span class="badge" style="color:var(--w-red)">Exploited in attacks</span>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<h3 class="sim-h2">Accessories</h3><div class="sim-list">' +
      '<div class="sim-row">' + sevDot('ok') + '<span class="body"><span class="t">AirPods Pro</span><span class="d">No published vulnerability matches this model.</span></span></div>' +
      '<div class="sim-row">' + sevDot('note') + '<span class="body"><span class="t">USB Microphone</span><span class="d">Not checked: no catalog or USB ID Repository product name to look up.</span></span></div></div>' +
      '<h3 class="sim-h2">Local network <small>checked when this screen opens</small></h3><div class="sim-list">' +
      '<div class="sim-row">' + sevDot('warning') + '<span class="body"><span class="t">Router · Kestrel AX3000</span><span class="d">3 vulnerabilities may apply to this model, 1 exploited in attacks. Its firmware version is not known, so it is not called vulnerable. Routers: install the latest firmware from the admin page, and turn off remote administration and UPnP if you do not use them.</span></span><span class="sev sev-warning">May apply</span></div>' +
      '<div class="sim-row">' + sevDot('advisory') + '<span class="body"><span class="t">Hallway Camera · Lumen Cam 2</span><span class="d">1 vulnerability may apply to this model. Cameras: update the firmware and change the default password.</span></span><span class="sev sev-advisory">May apply</span></div>' +
      '<div class="sim-row">' + sevDot('note') + '<span class="body"><span class="t">iPhone</span><span class="d">Not checked: the risk of Apple phones and tablets depends on an iOS version they do not share.</span></span></div>' +
      '<div class="sim-row">' + sevDot('note') + '<span class="body"><span class="t">192.168.1.57</span><span class="d">Not checked: it names only its network chip maker.</span></span></div></div>';
    return h;
  };
  V.history = function () {
    var q = S.histQuery.trim().toLowerCase();
    var rows = history().filter(function (r) { return !q || (r[2] + ' ' + r[3] + ' ' + r[4]).toLowerCase().indexOf(q) >= 0; });
    return topbar('Connection history') +
      '<h2 class="sim-h1">What came and went.</h2><p class="sim-sub">Every connect and disconnect while Plugsquire was running, newest first. Kept only on this Mac.</p>' +
      '<label class="sim-search" style="display:flex;width:100%;margin-bottom:12px">' + ic('search') + '<span class="visually-hidden">Search history</span><input type="search" placeholder="Search by device, maker or bus" data-input="histQuery" value="' + esc(S.histQuery) + '"></label>' +
      '<table class="sim-card sim-table"><thead><tr><th>Time</th><th>Device</th><th class="hide-sm">Bus</th><th class="hide-sm">Port</th><th class="hide-sm">Speed</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (r) { return '<tr><td class="m">' + esc(r[0]) + '</td><td><b style="font-weight:600">' + esc(r[2]) + '</b> <span style="color:' + (r[1] === 'Connected' ? 'var(--w-green)' : 'var(--w-faint)') + '">' + r[1].toLowerCase() + '</span><br><small style="color:var(--w-faint)">' + esc(r[3]) + '</small></td><td class="hide-sm">' + esc(r[4]) + '</td><td class="m hide-sm">' + esc(r[5]) + '</td><td class="m hide-sm">' + esc(r[6]) + '</td></tr>'; }).join('') : '<tr><td colspan="5" class="m">No change matches.</td></tr>') + '</tbody></table>';
  };
  V.worktrees = function () {
    var list = WT.filter(function (w) { return !S.worktreesGone[w.id]; }), sel = list.filter(function (w) { return S.wtSel[w.id]; });
    var total = list.reduce(function (a, w) { return a + w.size; }, 0);
    return '<div class="sim-topbar"><span class="sim-eyebrow">Git worktree cleanup · ~ (home folder)</span><button class="sbtn" data-act="wtscan">Choose folder…</button></div>' +
      '<h2 class="sim-h1">' + list.length + ' worktrees, ' + gb(total) + '.</h2><p class="sim-sub">Safe only when Git confirms no uncommitted or untracked files and no commit missing from every remote.</p>' +
      '<div class="sim-list">' + (list.length ? list.map(function (w) {
        return '<label class="sim-row chk"><input type="checkbox" data-wt="' + w.id + '"' + (w.safe ? '' : ' disabled') + (S.wtSel[w.id] ? ' checked' : '') + '><span class="body"><span class="t mono" style="font-weight:500">' + esc(w.path) + '</span><span class="d">' + gb(w.size) + ' · ' + esc(w.why) + '</span></span><span class="sev ' + (w.safe ? 'sev-ok' : 'sev-warning') + '">' + (w.safe ? 'Safe to delete' : 'Not safe') + '</span></label>';
      }).join('') : '<div class="sim-row"><span class="d">No worktrees left under this folder.</span></div>') + '</div>' +
      '<div class="sim-btns" style="margin-top:12px"><button class="sbtn primary danger" data-act="wtdelete"' + (sel.length ? '' : ' disabled') + '>Delete selected…</button><span style="color:var(--w-faint);font-size:12px">Runs git worktree remove, never forced. Branches stay in the repository.</span></div>';
  };
  function treemapLayout(items, x, y, w, h) {
    var out = [], total = items.reduce(function (a, i) { return a + i.v; }, 0), rest = items.slice().sort(function (a, b) { return b.v - a.v; });
    function worstRatio(row, side, scale) {
      var s = row.reduce(function (a, r) { return a + r.v * scale; }, 0), mx = 0, mn = Infinity;
      row.forEach(function (r) { mx = Math.max(mx, r.v * scale); mn = Math.min(mn, r.v * scale); });
      return Math.max(side * side * mx / (s * s), (s * s) / (side * side * mn));
    }
    var scale = (w * h) / total;
    while (rest.length) {
      var side = Math.min(w, h), row = [rest[0]], i = 1;
      while (i < rest.length && worstRatio(row.concat([rest[i]]), side, scale) <= worstRatio(row, side, scale)) { row.push(rest[i]); i++; }
      rest = rest.slice(i);
      var sum = row.reduce(function (a, r) { return a + r.v * scale; }, 0), thick = sum / side, off = 0;
      row.forEach(function (r) {
        var len = r.v * scale / thick;
        if (w >= h) out.push({ it: r, x: x, y: y + off, w: thick, h: len }); else out.push({ it: r, x: x + off, y: y, w: len, h: thick });
        off += len;
      });
      if (w >= h) { x += thick; w -= thick; } else { y += thick; h -= thick; }
    }
    return out;
  }
  var TM_COLORS = ['#7A5F2E', '#4F5F7C', '#5D7350', '#7C4F4F', '#5E527A', '#46706D', '#7A6A3E', '#555A60', '#6E5640', '#4E6A86'];
  V.diskmap = function () {
    var node = TREE; S.mapPath.forEach(function (n) { node = node.kids.filter(function (k) { return k.name === n; })[0]; });
    var kids = node.kids.map(function (k) { return { name: k.name, v: tsize(k), dir: !!k.kids }; });
    var rects = treemapLayout(kids, 0, 0, 100, 100);
    var crumbs = '<div class="crumbs">' + (S.mapPath.length ? '<button data-act="mapback">' + ic('back').replace('<svg', '<svg style="width:12px;height:12px;display:inline"') + ' Back</button> · ' : '') + ['Macintosh HD'].concat(S.mapPath).map(function (n, i) { return i < S.mapPath.length ? '<button data-act="mapto" data-arg="' + i + '">' + esc(n) + '</button>' : '<span>' + esc(n) + '</span>'; }).join(' › ') + '</div>';
    return '<div class="sim-topbar"><span class="sim-eyebrow">Disk map · startup disk</span><button class="sbtn" data-act="settings" data-arg="Choose folder">Choose folder…</button></div>' +
      '<h2 class="sim-h1">' + esc(node.name) + ', ' + gb(tsize(node)) + '.</h2><p class="sim-sub">Each rectangle is sized by the space it takes. Click a folder to look inside.</p>' + crumbs +
      '<div class="tmap" role="group" aria-label="Disk map of ' + esc(node.name) + '">' + rects.map(function (r, i) {
        return '<button class="' + (r.it.dir ? '' : 'file') + (r.h < 12 || r.w < 10 ? ' tiny' : '') + '" style="left:' + r.x + '%;top:' + r.y + '%;width:' + r.w + '%;height:' + r.h + '%;background:' + TM_COLORS[i % TM_COLORS.length] + '"' + (r.it.dir ? ' data-act="mapin" data-arg="' + esc(r.it.name) + '"' : ' tabindex="-1"') + ' title="' + esc(r.it.name) + ', ' + gb(r.it.v) + '"><b>' + esc(r.it.name) + '</b><span>' + gb(r.it.v) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="sim-list" style="margin-top:12px">' + kids.slice().sort(function (a, b) { return b.v - a.v; }).map(function (k) { return '<div class="sim-row"><span class="body"><span class="t">' + esc(k.name) + '</span><span class="d">' + gb(k.v) + '</span></span>' + (k.dir ? '<button class="sbtn" data-act="mapin" data-arg="' + esc(k.name) + '">Open</button>' : '') + '</div>'; }).join('') +
      (S.mapPath.length ? '' : '<div class="sim-row"><span class="body"><span class="t">System</span><span class="d">Not readable: macOS keeps some system folders closed, even with Full Disk Access.</span></span></div>') + '</div>';
  };
  V.files = function () {
    var list = FILES.filter(function (f) { return !S.filesGone[f.id] && ((S.sizeOn && f.size >= S.sizeMin) || (S.ageOn && ageDays(f.date) >= S.ageMin)); })
      .sort(function (a, b) { return S.sortBy === 'size' ? b.size - a.size : new Date(a.date) - new Date(b.date); });
    var sel = list.filter(function (f) { return S.fileSel[f.id]; });
    function opt(v, cur, label) { return '<option value="' + v + '"' + (String(v) === String(cur) ? ' selected' : '') + '>' + label + '</option>'; }
    return topbar('Large and old files · from the last disk map scan') + '<h2 class="sim-h1">' + list.length + ' files to look at.</h2><p class="sim-sub">"Changed" is a file’s modification date: macOS keeps no reliable date for when a file was last opened.</p>' +
      '<div class="sim-tools"><label><input type="checkbox" data-filter="sizeOn"' + (S.sizeOn ? ' checked' : '') + '> At least <select class="sim-select" data-filter="sizeMin">' + opt(1, S.sizeMin, '1 GB') + opt(5, S.sizeMin, '5 GB') + opt(10, S.sizeMin, '10 GB') + '</select></label>' +
      '<label><input type="checkbox" data-filter="ageOn"' + (S.ageOn ? ' checked' : '') + '> Not changed for <select class="sim-select" data-filter="ageMin">' + opt(180, S.ageMin, '6 months') + opt(365, S.ageMin, '1 year') + opt(730, S.ageMin, '2 years') + '</select></label>' +
      '<label>Sort by <select class="sim-select" data-filter="sortBy">' + opt('size', S.sortBy, 'Size') + opt('date', S.sortBy, 'Date') + '</select></label></div>' +
      '<div class="sim-list">' + (list.length ? list.map(function (f) {
        return '<div class="sim-row"><label class="chk" style="flex:1;min-width:0"><input type="checkbox" data-file="' + f.id + '"' + (S.fileSel[f.id] ? ' checked' : '') + '><span class="body"><span class="t mono" style="font-weight:500;word-break:break-all">' + esc(f.path) + '</span><span class="d">' + gb(f.size) + ' · changed ' + f.date + '</span></span></label><button class="sbtn" data-act="reveal">Reveal in Finder</button></div>';
      }).join('') : '<div class="sim-row"><span class="d">No file matches these rules.</span></div>') + '</div>' +
      '<div class="sim-btns" style="margin-top:12px"><button class="sbtn primary danger" data-act="filestrash"' + (sel.length ? '' : ' disabled') + '>Move to Trash…</button><span style="color:var(--w-faint);font-size:12px">Each file is checked again just before it goes.</span></div>';
  };
  V.apps = function () {
    if (S.appReview) return appReview(S.appReview);
    var list = APPS.filter(function (a) { return !S.appsGone[a.id]; }).sort(function (a, b) { return b.size - a.size; });
    return topbar('App uninstaller · /Applications and ~/Applications') + '<h2 class="sim-h1">' + list.length + ' apps, largest first.</h2><p class="sim-sub">Remove an app together with the files it left in your Library. Everything goes to the Trash.</p>' +
      '<div class="sim-list">' + list.map(function (a) {
        var right = a.system ? '<span class="sev" style="color:var(--w-faint)">Part of macOS</span>' : a.self ? '<span class="sev" style="color:var(--w-faint)">This app</span>' :
          (a.running && !S.sketchQuit) ? '<span class="sev sev-warning">Running: quit it first</span><button class="sbtn" data-act="checkagain">Check again</button>' : '<button class="sbtn" data-act="review" data-arg="' + a.id + '">Review…</button>';
        return '<div class="sim-row"><span class="sim-photo" style="width:30px;height:30px;border-radius:8px">' + ic('app').replace('style', 'data-x') + '</span><span class="body"><span class="t">' + esc(a.name) + '</span><span class="d">' + gb(a.size) + (a.store ? ' · from the App Store: macOS may refuse to move it' : '') + '</span></span>' + right + '</div>';
      }).join('') + '</div>';
  };
  function appReview(id) {
    var a = APPS.filter(function (x) { return x.id === id; })[0];
    var items = [['Application', '/Applications/' + a.name + '.app', a.size]].concat(a.left || []);
    return backBtn('All apps') + topbar('Review') + '<h2 class="sim-h1">Remove ' + esc(a.name) + '?</h2><p class="sim-sub">' + (a.shared ? 'Timeline 2 is installed too and would use some of these files, so they start unticked.' : 'Found by its bundle identifier and name. Untick anything you want to keep.') + '</p>' +
      '<div class="sim-list">' + items.map(function (it, i) {
        var key = id + ':' + i, checked = S.leftoverSel[key] != null ? S.leftoverSel[key] : !(a.shared && i > 0);
        return '<div class="sim-row"><label class="chk" style="flex:1;min-width:0"><input type="checkbox" data-left="' + key + '"' + (checked ? ' checked' : '') + (i === 0 ? ' disabled' : '') + '><span class="body"><span class="t">' + esc(it[0]) + '</span><span class="d mono" style="word-break:break-all">' + esc(it[1]) + ' · ' + gb(it[2]) + '</span></span></label><button class="sbtn" data-act="reveal">Reveal in Finder</button></div>';
      }).join('') + '</div><div class="sim-btns" style="margin-top:12px"><button class="sbtn primary danger" data-act="uninstall" data-arg="' + id + '">Move to Trash…</button></div>';
  }
  V.fleet = function () {
    var riskC = { High: 'var(--w-red)', Medium: 'var(--w-orange)', Low: 'var(--w-green)' };
    return topbar('SSH fleet · from ssh-fleet-monitor') + '<h2 class="sim-h1">1 of 4 hosts needs attention.</h2><p class="sim-sub">An optional plugin: Plugsquire only reads what ssh-fleet-monitor already knows, and never connects to the hosts.</p>' +
      '<div class="sim-list">' + FLEET.map(function (f) {
        return '<div class="sim-row"><span class="sim-photo" style="width:30px;height:30px;border-radius:8px">' + ic('server') + '</span><span class="body"><span class="t">' + esc(f.name) + ' <em>' + esc(f.host) + '</em></span><span class="d">' + esc(f.os) + ' · last scan ' + f.scan + (f.stale ? ' · stale data' : '') + (f.hwhy ? ' · ' + esc(f.hwhy) : '') + ' · ' + f.open + ' open findings' + (f.expl ? ', ' + f.expl + ' exploited' : '') + '</span></span>' +
          '<span class="tag-row"><span class="badge" style="color:' + (f.health === 'Healthy' ? 'var(--w-green)' : 'var(--w-orange)') + '">' + f.health + '</span><span class="badge" style="color:' + riskC[f.risk] + '">Risk ' + f.risk.toLowerCase() + '</span></span></div>';
      }).join('') + '</div>';
  };

  /* ---------- Frame: sidebar, footer, menus, widgets ---------- */
  function navHtml() {
    return NAV.map(function (n) {
      if (n.h) return '<h4>' + n.h + '</h4>';
      var cur = S.view.name === n.v && (n.arg == null || S.view.arg === n.arg) || (n.v === 'overview' && S.view.name === 'device' && false);
      var count = n.n ? n.n() : null;
      return '<button data-go="' + n.v + '"' + (n.arg ? ' data-arg="' + esc(n.arg) + '"' : '') + ' aria-current="' + (cur ? 'true' : 'false') + '">' + ic(n.icon) + '<span>' + esc(n.label) + '</span>' +
        (n.pro ? '<span class="pro">Pro</span>' : count != null ? '<span class="n' + (n.hot && count ? ' hot' : '') + '">' + count + '</span>' : '') + '</button>';
    }).join('');
  }
  function menuHtml() {
    var att = attention().slice(0, 3), bat = devices().filter(function (d) { return d.on && d.batt; });
    return '<div class="mh">Plugsquire: ' + headline() + '</div><hr>' +
      (att.length ? '<div class="ms">To review</div>' + att.map(function (f) { return '<button data-menu="device" data-arg="' + f.dev + '"><span>' + esc(f.title) + '</span><small>' + esc(dname(dev(f.dev))) + '</small></button>'; }).join('') + '<button data-menu="attention">All ' + attention().length + ' to review…</button><hr>' : '') +
      '<div class="ms">Batteries</div>' + bat.map(function (d) { return '<div class="mi"><span>' + esc(d.name) + '</span><small>' + d.batt.map(function (b) { return (d.batt.length > 1 ? b[0][0] + ' ' : '') + b[1] + '%'; }).join(' · ') + '</small></div>'; }).join('') +
      '<hr><button data-menu="overview">Open Plugsquire</button><button data-menu="updates">Check for Updates…</button><button data-menu="settings">Settings…</button><hr><button data-menu="quit">Quit Plugsquire</button>';
  }
  function widgetsHtml() {
    var a = dev('airpods'), m = dev('mouse');
    return '<button class="sbtn wdg-close" data-act="widgets-close">Close</button>' +
      '<div class="wdg"><h6>PLUGSQUIRE · BATTERIES</h6><div class="wb">' +
      (a && a.on ? a.batt.map(function (b) { return '<span>AirPods Pro · ' + b[0] + '</span><span>' + b[1] + '%</span>'; }).join('') : '') +
      (m ? '<span>Magic Mouse</span><span>' + m.batt[0][1] + '%</span>' : '') + '</div><small>Read ' + S.readAgo + ' min ago</small></div>' +
      '<div class="wdg small"><h6>PLUGSQUIRE</h6><svg class="ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="4"/><circle cx="18" cy="18" r="15" fill="none" stroke="#8CC497" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (0.64 * 94.2) + ' 94.2" transform="rotate(-90 18 18)"/></svg><div><b style="font-size:20px">64%</b><br><small>Magic Mouse · read ' + S.readAgo + ' min ago</small></div></div>';
  }

  /* ---------- Build the frame once ---------- */
  root.innerHTML =
    '<div class="sim-menubar"><b>Plugsquire</b><span class="mb-items mb-dim"><span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></span>' +
      '<span class="mb-right"><button class="mb-btn" data-act="menubar" aria-haspopup="true" aria-expanded="false" aria-label="Plugsquire menu bar icon">' + ic('shield') + '<span class="mb-sev" style="width:6px;height:6px;border-radius:50%;background:#EE7A62"></span></button>' +
      '<button class="mb-btn" data-act="widgets" aria-label="Show widgets">' + ic('grid') + '</button><span class="mb-clock mb-dim">Wed 25 Nov 4:08 PM</span></span></div>' +
    '<div class="sim-menu" role="menu" hidden></div>' +
    '<div class="sim-notes" aria-live="polite"></div>' +
    '<div class="sim-widgets" aria-label="Desktop widgets"></div>' +
    '<div class="sim-desk"><div class="sim-win">' +
      '<div class="sim-side"><div class="sim-lights" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<div class="sim-brand"><strong>Plugsquire</strong><span>Everything in your Mac’s company</span></div>' +
        '<button class="sim-mac" data-go="device" data-arg="storage"><span class="mac-ico" aria-hidden="true"></span><span><b>MacBook Pro</b><small>M1 Max · 32 GB</small></span></button>' +
        '<nav class="sim-nav" aria-label="Plugsquire sidebar"></nav>' +
        '<div class="sim-foot"><button class="sim-switch" role="switch" data-act="online"><span>Online details</span><span class="track"></span></button>' +
          '<p class="hint">Sends model and maker names only. Never serial numbers, addresses or your name.</p>' +
          '<button class="sim-appearance" data-act="appearance">' + ic('brush') + '<span></span></button>' +
          '<div class="row"><span class="dot"></span><span class="insp"></span><button class="sim-icon-btn" data-act="rescan" aria-label="Inspect again">' + ic('refresh') + '</button></div></div>' +
      '</div>' +
      '<div class="sim-main" tabindex="-1"></div>' +
    '</div></div>';

  var winEl = root.querySelector('.sim-win'), mainEl = root.querySelector('.sim-main'), navEl = root.querySelector('.sim-nav'),
      menuEl = root.querySelector('.sim-menu'), notesEl = root.querySelector('.sim-notes'), widgetsEl = root.querySelector('.sim-widgets');

  function render(keepScroll) {
    var st = mainEl.scrollTop;
    var fn = V[S.view.name] || V.overview;
    mainEl.innerHTML = fn(S.view.arg);
    navEl.innerHTML = navHtml();
    winEl.classList.toggle('is-native', S.native);
    root.querySelector('[data-act="online"]').setAttribute('aria-checked', String(S.online));
    root.querySelector('.sim-appearance span').textContent = 'Appearance: ' + (S.native ? 'Native macOS' : 'Signature');
    root.querySelector('.insp').textContent = 'Inspected at ' + S.inspected;
    var w = attention()[0];
    root.querySelector('.mb-sev').style.background = w ? (w.sev === 'critical' ? '#EE7A62' : w.sev === 'warning' ? '#E9A15A' : '#E7C65A') : '#8CC497';
    if (!menuEl.hidden) menuEl.innerHTML = menuHtml();
    if (widgetsEl.classList.contains('open')) widgetsEl.innerHTML = widgetsHtml();
    if (keepScroll) mainEl.scrollTop = st; else mainEl.scrollTop = 0;
  }
  function go(name, arg, opts) {
    if (!opts || !opts.noPush) S.stack.push(S.view);
    stopPorts(); S.ports = null; S.appReview = null;
    S.view = { name: name, arg: arg };
    render();
  }
  function back() { S.view = S.stack.pop() || { name: 'overview' }; if (S.view.name === 'apps') S.appReview = null; render(); }

  /* ---------- Sheets and notifications ---------- */
  function sheet(o) {
    return new Promise(function (resolve) {
      var wrap = document.createElement('div');
      wrap.className = 'sim-sheet-wrap';
      wrap.innerHTML = '<div class="sim-sheet" role="dialog" aria-modal="true" aria-labelledby="sim-sheet-t"><h5 id="sim-sheet-t">' + esc(o.title) + '</h5>' + (o.body || '') +
        '<div class="sim-btns"><button class="sbtn" data-r="0">' + esc(o.cancel || 'Cancel') + '</button>' + (o.ok ? '<button class="sbtn primary' + (o.danger ? ' danger' : '') + '" data-r="1">' + esc(o.ok) + '</button>' : '') + '</div></div>';
      winEl.appendChild(wrap);
      var prev = document.activeElement;
      var first = wrap.querySelector('[data-r="1"]') || wrap.querySelector('[data-r="0"]');
      first.focus({ preventScroll: true });
      function done(v) { wrap.remove(); if (prev && prev.focus) prev.focus({ preventScroll: true }); resolve(v); }
      wrap.addEventListener('click', function (e) { var b = e.target.closest('[data-r]'); if (b) done(b.getAttribute('data-r') === '1'); else if (e.target === wrap) done(false); });
      wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); done(false); } });
    });
  }
  function notify(title, body, target) {
    var n = document.createElement('button');
    n.className = 'sim-note';
    n.innerHTML = '<img src="assets/favicon.svg" alt=""><span><b>' + esc(title) + '</b><span>' + esc(body) + '</span></span>';
    n.addEventListener('click', function () { n.remove(); if (target) go('device', target); });
    notesEl.appendChild(n);
    while (notesEl.children.length > 3) notesEl.removeChild(notesEl.firstChild);
    setTimeout(function () { n.remove(); }, 6500);
  }
  function toastInfo(t) { notify('Plugsquire', t); }

  /* ---------- Port check ---------- */
  function stopPorts() { if (S.portTimer) { clearInterval(S.portTimer); S.portTimer = null; } }
  function runPorts(id) {
    stopPorts();
    S.ports = { id: id, done: 0 };
    render(true);
    S.portTimer = setInterval(function () {
      S.ports.done = Math.min(PORTS.length, S.ports.done + 4);
      if (S.view.name === 'network') render(true);
      if (S.ports.done >= PORTS.length) stopPorts();
    }, reduceMotion ? 50 : 650);
  }

  /* ---------- Events ---------- */
  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go],[data-back],[data-act],[data-menu]');
    if (!t || !root.contains(t)) { if (!e.target.closest('.sim-menu')) closeMenu(); return; }
    if (t.hasAttribute('data-go')) { closeMenu(); return go(t.getAttribute('data-go'), t.getAttribute('data-arg') || undefined); }
    if (t.hasAttribute('data-back')) return back();
    if (t.hasAttribute('data-menu')) return menuAction(t.getAttribute('data-menu'), t.getAttribute('data-arg'));
    act(t.getAttribute('data-act'), t.getAttribute('data-arg'), t);
  });
  root.addEventListener('input', function (e) {
    var k = e.target.getAttribute('data-input');
    if (!k) return;
    S[k] = e.target.value;
    var pos = e.target.selectionStart, idx = Array.prototype.indexOf.call(root.querySelectorAll('[data-input="' + k + '"]'), e.target);
    render(true);
    var el = root.querySelectorAll('[data-input="' + k + '"]')[idx];
    if (el) { el.focus({ preventScroll: true }); try { el.setSelectionRange(pos, pos); } catch (x) {} }
  });
  root.addEventListener('change', function (e) {
    var el = e.target, a;
    if ((a = el.getAttribute('data-wt'))) { S.wtSel[a] = el.checked; render(true); }
    else if ((a = el.getAttribute('data-file'))) { S.fileSel[a] = el.checked; render(true); }
    else if ((a = el.getAttribute('data-left'))) { S.leftoverSel[a] = el.checked; }
    else if ((a = el.getAttribute('data-filter'))) { S[a] = el.type === 'checkbox' ? el.checked : (a === 'sortBy' ? el.value : Number(el.value)); render(true); }
  });
  root.addEventListener('submit', function (e) {
    if (e.target.getAttribute('data-form') !== 'name') return;
    e.preventDefault();
    var v = e.target.querySelector('input').value.trim();
    S.names.silent = v.slice(0, 40);
    render(true);
    if (v) toastInfo('Named "' + S.names.silent + '". It keeps this name on USB-C port 2.');
  });
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); widgetsEl.classList.remove('open'); } });

  function closeMenu() { if (!menuEl.hidden) { menuEl.hidden = true; root.querySelector('[data-act="menubar"]').setAttribute('aria-expanded', 'false'); } }
  function openMenu() { menuEl.innerHTML = menuHtml(); menuEl.hidden = false; root.querySelector('[data-act="menubar"]').setAttribute('aria-expanded', 'true'); var b = menuEl.querySelector('button'); if (b) b.focus({ preventScroll: true }); }
  function menuAction(m, arg) {
    closeMenu();
    if (m === 'device') go('device', arg); else if (m === 'attention') go('attention'); else if (m === 'overview') go('overview');
    else if (m === 'updates') sheet({ title: 'You’re up to date.', body: '<p>Sparkle checked plugsquire.luongnv.com/appcast.xml. Every update waits for your confirmation before it installs.</p>', cancel: 'OK' });
    else if (m === 'settings') sheet({ title: 'Settings', body: '<ul><li>General: appearance, online details</li><li>Alerts: low battery at 20%, low disk space below 10% free</li><li>Startup & Updates: open at login, check automatically, include betas</li><li>Plugins: ssh-fleet-monitor</li></ul>', cancel: 'Close' });
    else if (m === 'quit') toastInfo('Quit Plugsquire. In the demo, it stays open.');
  }

  function act(a, arg, el) {
    switch (a) {
      case 'menubar': return menuEl.hidden ? openMenu() : closeMenu();
      case 'widgets': notesEl.innerHTML = ''; widgetsEl.innerHTML = widgetsHtml(); widgetsEl.classList.add('open'); return;
      case 'widgets-close': widgetsEl.classList.remove('open'); return;
      case 'online': S.online = !S.online; return render(true);
      case 'appearance': S.native = !S.native; return render(true);
      case 'rescan':
        el.classList.add('spin');
        setTimeout(function () { el.classList.remove('spin'); S.inspected = '4:09 PM'; S.readAgo = 0; render(true); }, reduceMotion ? 0 : 900);
        return;
      case 'settings': return toastInfo(arg + ' opens in System Settings.');
      case 'jump': var b = mainEl.querySelector('#sim-breakdown'); if (b) mainEl.scrollTop = b.offsetTop - 10; return;
      case 'clean': {
        var c = cat(arg);
        sheet({ title: 'Clean ' + c.name + '?', ok: 'Clean', danger: true, body: '<p>' + (c.trash ? gb(c.size) + ' goes to the Trash, so you can put it back.' : gb(c.size) + ' is deleted for good.') + ' Plugsquire removes exactly these items, checking each one again just before:</p><ul>' + c.items.map(function (i) { return '<li class="mono">' + esc(i) + '</li>'; }).join('') + '</ul>' })
          .then(function (ok) {
            if (!ok) return;
            if (c.trash) cat('trash').size += c.size; else S.free += c.size;
            var freed = c.size; c.size = 0; render(true);
            toastInfo(c.trash ? gb(freed) + ' moved to the Trash. Measured again: ' + c.name + ' and the Trash.' : gb(freed) + ' freed. Measured again: ' + c.name + '.');
          });
        return;
      }
      case 'empty': {
        var tr = cat('trash');
        sheet({ title: 'Empty the Trash?', ok: 'Empty Trash', danger: true, body: '<p>' + gb(tr.size) + ' is deleted for good. This cannot be undone.</p>' }).then(function (ok) { if (ok) { S.free += tr.size; tr.size = 0; render(true); } });
        return;
      }
      case 'eject':
        if (arg === 'flash') { S.removed.flash = true; S.plugged = false; go('overview', null, { noPush: true }); toastInfo('USB Flash Drive ejected. You can unplug it.'); return; }
        S.ejected = true; render(true); toastInfo('Field SSD ejected, with every volume on it.'); return;
      case 'mount': S.ejected = false; render(true); return;
      case 'remove': S.removed[arg] = true; back(); toastInfo('Removed from the list. macOS keeps it paired.'); return;
      case 'rerun': el.textContent = 'Reading logs…'; el.disabled = true; setTimeout(function () { render(true); }, reduceMotion ? 0 : 1200); return;
      case 'btfix':
        sheet({ title: 'Set Magic Mouse to two buttons?', ok: 'Set to two buttons', body: '<p>Plugsquire changes the Magic Mouse button setting. You can change it back in System Settings, Mouse.</p>' })
          .then(function (ok) { if (ok) { S.mouseTwoButtons = true; render(true); toastInfo('Magic Mouse now uses two buttons.'); } });
        return;
      case 'knock': S.knock = !S.knock; return render(true);
      case 'netscan': return render(true);
      case 'netsel': S.netSel = arg; if (!S.ports || S.ports.id !== arg) { stopPorts(); S.ports = null; } render(true);
        if (window.matchMedia('(max-width: 900px)').matches) { var as = mainEl.querySelector('aside'); if (as) mainEl.scrollTop = as.offsetTop - 10; }
        return;
      case 'ports': {
        var n = netDevices().filter(function (x) { return x.id === arg; })[0];
        sheet({ title: 'Check open ports on ' + n.name + '?', ok: 'Check 16 ports', body: '<p>Plugsquire opens a TCP connection to 16 common ports at <span class="mono">' + n.ip + '</span>, four at a time, sends nothing over them and closes each at once. It may first send one 1-byte packet to port 9 to find the device again.</p><p>Check only devices you own or may test.</p>' })
          .then(function (ok) { if (ok) runPorts(arg); });
        return;
      }
      case 'portstop': stopPorts(); toastInfo('Port check stopped.'); return render(true);
      case 'portclear': S.ports = null; return render(true);
      case 'wtscan': return toastInfo('Choose any folder; the default is your home folder.');
      case 'wtdelete': {
        var sel = WT.filter(function (w) { return S.wtSel[w.id] && !S.worktreesGone[w.id]; });
        sheet({ title: 'Delete ' + sel.length + ' worktree' + (sel.length > 1 ? 's' : '') + '?', ok: 'Delete', danger: true, body: '<ul>' + sel.map(function (w) { return '<li class="mono">' + esc(w.path) + '</li>'; }).join('') + '</ul><p>Each is checked again just before it goes. Their branches stay in the repository.</p>' })
          .then(function (ok) {
            if (!ok) return;
            var fr = 0; sel.forEach(function (w) { S.worktreesGone[w.id] = true; S.wtSel[w.id] = false; fr += w.size; });
            render(true); toastInfo(sel.length + ' deleted, ' + gb(fr) + ' freed.');
          });
        return;
      }
      case 'mapin': S.mapPath.push(arg); return render();
      case 'mapback': S.mapPath.pop(); return render();
      case 'mapto': S.mapPath = S.mapPath.slice(0, Number(arg)); return render();
      case 'reveal': return toastInfo('Shown in Finder.');
      case 'filestrash': {
        var fs = FILES.filter(function (f) { return S.fileSel[f.id] && !S.filesGone[f.id]; });
        sheet({ title: 'Move ' + fs.length + ' file' + (fs.length > 1 ? 's' : '') + ' to the Trash?', ok: 'Move to Trash', danger: true, body: '<ul>' + fs.map(function (f) { return '<li class="mono">' + esc(f.path) + '</li>'; }).join('') + '</ul><p>A file that changed since the scan is left as it is.</p>' })
          .then(function (ok) { if (!ok) return; fs.forEach(function (f) { S.filesGone[f.id] = true; S.fileSel[f.id] = false; }); render(true); toastInfo(fs.length + ' moved to the Trash.'); });
        return;
      }
      case 'checkagain': S.sketchQuit = true; render(true); return toastInfo('Sketchbook Studio is no longer running.');
      case 'review': S.appReview = arg; S.stack.push(S.view); return render();
      case 'uninstall': {
        var ap = APPS.filter(function (x) { return x.id === arg; })[0];
        sheet({ title: 'Move ' + ap.name + ' and its files to the Trash?', ok: 'Move to Trash', danger: true, body: '<p>The app goes first. If macOS refuses to move it, its files are left as they are, so it keeps its settings.</p>' })
          .then(function (ok) { if (!ok) return; S.appsGone[arg] = true; S.appReview = null; S.stack.pop(); render(); toastInfo(ap.name + ' moved to the Trash.'); });
        return;
      }
    }
  }

  /* ---------- Live: plug a device in ---------- */
  function plugIn() {
    if (S.plugged) return;
    S.plugged = true; delete S.removed.flash; S.pluggedAt = '4:08 PM';
    render(true);
    notify('New or unknown device connected', 'USB Flash Drive connected for the first time, on USB-C Hub, port 4.', 'flash');
    setTimeout(function () { notify('Device on a slow USB link', 'USB Flash Drive connected at 480 Mb/s through “USB-C Hub”.', 'flash'); }, reduceMotion ? 0 : 1400);
  }

  /* ---------- Tour ---------- */
  var SCENES = [
    { id: 'overview', label: 'Overview', title: 'One headline says how things stand.', text: 'The overview counts what is connected, what is healthy and what needs review, then lists every finding by severity with its device.', run: function () { reset(); go('overview'); } },
    { id: 'fix', label: 'Fix guides', title: 'Every finding ends in a fix.', text: 'Open a finding: one line says what to do, numbered steps follow, a button opens the right System Settings pane, and the source is named. Toggle "Online details" to see the product description come and go.', run: function () { reset(); go('device', 'airpods'); } },
    { id: 'silent', label: 'Silent devices', title: 'Even a charge-only gadget gets a name.', text: 'A lamp or shaver on USB-C sends no data, so macOS never lists it. Plugsquire reads the port controller and lets you name it. Try typing a name.', run: function () { reset(); go('device', 'silent'); } },
    { id: 'live', label: 'Plug something in', title: 'It notices the moment you plug in.', text: 'A new drive appears within seconds, a notification says it connected for the first time, and the audit flags its slow USB link. The menu bar icon changes with it.', run: function () { reset(); go('overview'); plugIn(); } },
    { id: 'storage', label: 'Storage cleaning', pro: true, title: 'See where space goes. Free it after you review.', text: 'The breakdown is free. With Pro, each Clean button lists exactly what would go and asks first. Clean a few categories and watch the "Almost out of space" finding resolve.', run: function () { reset(); go('device', 'storage'); setTimeout(function () { act('jump'); }, 50); } },
    { id: 'eject', label: 'Eject and mount', title: 'Eject a drive without hunting for it.', text: 'Eject removes the whole drive with every volume on it; Mount brings an unmounted volume back. If macOS refuses, Plugsquire shows its reason.', run: function () { reset(); go('device', 'ssd'); } },
    { id: 'bluetooth', label: 'Bluetooth', pro: true, title: 'A health score for the Bluetooth radio.', text: 'Signal, protocol, battery, load on the radio and the last five minutes of errors, scored and turned into recommendations. Two of them have a fix button, confirmed first.', run: function () { reset(); go('bluetooth'); } },
    { id: 'network', label: 'Local network', pro: true, title: 'Everything else on your network, by kind.', text: 'Computers, phones, printers, cameras, TVs, speakers, routers, storage and smart home devices, from what they announce. Unknown devices are listed, not hidden.', run: function () { reset(); go('network'); act('netsel', 'printer'); } },
    { id: 'ports', label: 'Open-port check', pro: true, title: 'Check one device’s open ports, on purpose.', text: 'It tries 16 common TCP ports on a single device you pick, only after you confirm a warning, and it can be stopped.', run: function () { reset(); go('network'); act('netsel', 'printer'); act('ports', 'printer'); } },
    { id: 'wifi', label: 'Wi-Fi', pro: true, title: 'Your Wi-Fi, measured.', text: 'Signal, noise and margin, channel, band, width, rate, standard and security, then the networks nearby, strongest first.', run: function () { reset(); go('wifi'); } },
    { id: 'security', label: 'Security check', pro: true, title: 'Published vulnerabilities, matched to your Mac.', text: 'Your macOS and Safari versions are checked against the National Vulnerability Database, exploited ones first, with the update that fixes them. Network devices with an unknown firmware version show what may apply, never a false alarm.', run: function () { reset(); go('security'); } },
    { id: 'history', label: 'Connection history', title: 'A searchable log of what came and went.', text: 'Every USB, Thunderbolt, Bluetooth and power-only device that connected or disconnected while Plugsquire was running, with time, bus, port and speed.', run: function () { reset(); go('history'); } },
    { id: 'worktrees', label: 'Git worktrees', pro: true, title: 'Delete forgotten Git worktrees safely.', text: 'Only worktrees Git confirms have nothing uncommitted and nothing unpushed can be ticked. Tick the safe ones and delete them.', run: function () { reset(); go('worktrees'); } },
    { id: 'diskmap', label: 'Disk map', pro: true, title: 'A map of your disk, sized by space.', text: 'Rectangles sized by what each folder or file takes. Click a folder to look inside; Back takes you out.', run: function () { reset(); go('diskmap'); } },
    { id: 'files', label: 'Large and old files', pro: true, title: 'Find the big files and the forgotten ones.', text: 'Files over a size you choose, or unchanged for a time you choose, or both. Reveal in Finder, or move ticked files to the Trash after confirming.', run: function () { reset(); go('files'); } },
    { id: 'apps', label: 'App uninstaller', pro: true, title: 'Remove an app and what it left behind.', text: 'Review lists the app and its files in your Library, each with a tick. Files another installed app would use start unticked.', run: function () { reset(); go('apps'); } },
    { id: 'fleet', label: 'SSH fleet', title: 'Your servers beside your Mac.', text: 'With the optional ssh-fleet-monitor plugin installed, the hosts it monitors show health and risk here. Without it, Plugsquire shows nothing of it.', run: function () { reset(); go('fleet'); } },
    { id: 'menubar', label: 'Menu bar', title: 'Health at a glance from the menu bar.', text: 'The icon follows the most serious finding. Its menu says how things stand, what needs attention and each accessory’s battery. Alerts arrive once, when a problem starts.', run: function () { reset(); go('overview'); openMenu(); } },
    { id: 'widgets', label: 'Battery widgets', title: 'Accessory batteries on your desktop.', text: 'A small and a medium widget show each connected accessory’s battery, per component, and when it was read.', run: function () { reset(); go('overview'); act('widgets'); } },
    { id: 'native', label: 'Native look', title: 'Prefer the native look? One switch.', text: 'Signature is the app’s own dark look. Native macOS follows the system’s light or dark mode and accent colour. Switch in the sidebar, Settings or the View menu.', run: function () { reset(); S.native = true; go('overview'); } }
  ];
  function reset() { notesEl.innerHTML = ''; closeMenu(); widgetsEl.classList.remove('open'); S.native = false; root.querySelectorAll('.sim-sheet-wrap').forEach(function (n) { n.remove(); }); }

  var chipsEl = document.getElementById('sim-chips'), capT = document.getElementById('sim-cap-title'), capP = document.getElementById('sim-cap-text'), playBtn = document.getElementById('sim-play');
  var playing = null, idx = 0;
  function showScene(i, fromTour) {
    idx = i; var s = SCENES[i];
    s.run();
    if (capT) { capT.textContent = s.title; capP.textContent = s.text; }
    if (chipsEl) chipsEl.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === i)); });
    if (!fromTour) stopTour();
  }
  function stopTour() { if (playing) { clearInterval(playing); playing = null; } if (playBtn) playBtn.textContent = 'Play the tour'; }
  if (chipsEl) {
    chipsEl.innerHTML = SCENES.map(function (s, i) { return '<li><button type="button" aria-pressed="' + (i === 0) + '" data-scene="' + i + '">' + esc(s.label) + (s.pro ? ' <span class="pro-mini">Pro</span>' : '') + '</button></li>'; }).join('');
    chipsEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-scene]');
      if (!b) return;
      showScene(Number(b.getAttribute('data-scene')));
      if (window.matchMedia('(max-width: 900px)').matches) root.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }
  if (playBtn) playBtn.addEventListener('click', function () {
    if (playing) return stopTour();
    playBtn.textContent = 'Pause the tour';
    showScene((idx + 1) % SCENES.length, true);
    playing = setInterval(function () { showScene((idx + 1) % SCENES.length, true); }, 7000);
  });
  root.addEventListener('pointerdown', function () { stopTour(); });
  var plugBtn = document.getElementById('sim-plug');
  if (plugBtn) plugBtn.addEventListener('click', function () { stopTour(); if (S.plugged) { toastInfo('The drive is already plugged in. Eject it from its details to try again.'); return; } go('overview'); plugIn(); });

  document.querySelectorAll('[data-show]').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = SCENES.map(function (s) { return s.id; }).indexOf(b.getAttribute('data-show'));
      if (i < 0) return;
      document.getElementById('demo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      showScene(i);
    });
  });

  root.removeAttribute('hidden');
  var ns = document.getElementById('sim-fallback'); if (ns) ns.remove();
  render();
  if (capT) { capT.textContent = SCENES[0].title; capP.textContent = SCENES[0].text; }
})();
