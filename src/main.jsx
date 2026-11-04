import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft, Bell, Check, ChevronRight, CircleUserRound, Flame, Flower2,
  Heart, Info, LampCeiling, LogOut, Menu, Moon, Music, Pause, Play, ShoppingBag, House,
  RotateCcw, Settings, Sparkles, Sun, Volume2, VolumeX, X
} from 'lucide-react';
import './styles.css';
import krishnaMurti from './assets/krishna-murti.svg';
import radhaMurti from './assets/radha-murti.svg';

const STORAGE_KEY = 'virtual-temple-progress';
const defaultProgress = {
  visitorName: '', totalVisits: 0, totalMalas: 0, totalBeads: 0,
  totalMeditationSessions: 0, totalMeditationMinutes: 0, totalDiyas: 0,
  soundEnabled: true, musicEnabled: true, animations: true, lastVisit: null,
};

const mantras = ['Om Namah Shivaya', 'Hare Krishna', 'Shri Ram Jai Ram', 'Om Gan Ganapataye Namah'];
const visitorNames = ['Aarav', 'Meera', 'Rohan', 'Kavya', 'Dev', 'Ishani', 'Vihaan', 'Anaya', 'Arjun', 'Diya', 'Kabir', 'Saanvi', 'Neil', 'Tara'];
const poses = ['meditating', 'praying', 'sitting', 'standing'];

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return saved ? { ...defaultProgress, ...saved } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

function saveProgress(progress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* storage can be unavailable */ }
}

function isInsideSanctum(point, bounds) {
  return point.x > bounds.left && point.x < bounds.right
    && point.y > bounds.top && point.y < bounds.bottom;
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [entered, setEntered] = useState(Boolean(readProgress().visitorName));
  const [name, setName] = useState(readProgress().visitorName);
  const [activePanel, setActivePanel] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [userPose, setUserPose] = useState('standing');
  const [soundOn, setSoundOn] = useState(progress.soundEnabled);
  const [sidebar, setSidebar] = useState(false);
  const [location, setLocation] = useState('temple');
  const [townPanel, setTownPanel] = useState(null);
  const [journey, setJourney] = useState(() => progress.journey || { shopsVisited: [], purchases: [], busBoarded: false });

  useEffect(() => saveProgress(progress), [progress]);
  useEffect(() => setProgress((current) => ({ ...current, journey })), [journey]);
  useEffect(() => {
    const onShortcut = (event) => {
      if (event.key.toLowerCase() === 'i' && location === 'town' && !townPanel) {
        event.preventDefault();
        setLocation('temple');
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, [location, townPanel]);

  const enterTemple = (event) => {
    event.preventDefault();
    const trimmed = name.trim().slice(0, 20);
    if (!trimmed) return;
    setName(trimmed);
    setProgress((p) => ({ ...p, visitorName: trimmed, totalVisits: p.visitorName ? p.totalVisits : p.totalVisits + 1, lastVisit: new Date().toISOString() }));
    setEntered(true);
  };
  const exitTemple = () => { setEntered(false); setActivePanel(null); setSelectedSeat(null); setUserPose('standing'); setLocation('temple'); };
  const updateProgress = (patch) => setProgress((p) => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) }));
  const sitAt = (seat) => { setSelectedSeat(seat); setUserPose('sitting'); };
  const reset = () => { setProgress(defaultProgress); setJourney({ shopsVisited: [], purchases: [], busBoarded: false }); setName(''); setEntered(false); setActivePanel(null); };

  if (!entered) return <WelcomeScreen name={name} setName={setName} onEnter={enterTemple} savedName={progress.visitorName} />;
  return (
    <div className="app-shell">
      <TempleHeader name={progress.visitorName} onMenu={() => setSidebar(true)} soundOn={soundOn} setSoundOn={setSoundOn} />
      <main className="temple-stage">
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        {location === 'temple' ? <TempleScene name={progress.visitorName} userPose={userPose} selectedSeat={selectedSeat} onSit={sitAt} onDarshan={() => setActivePanel('darshan')} onExit={() => setLocation('town')} /> : <TownScene name={progress.visitorName} journey={journey} setJourney={setJourney} openShop={setTownPanel} openInventory={() => setTownPanel('inventory')} onHome={() => setTownPanel('home')} />}
        <TempleStats progress={progress} />
        <div className="stage-hint"><Sparkles size={14} /> Select a glowing cushion to take your place</div>
      </main>
      <KeyboardLegend location={location} />
      <AnimatePresence>
        {townPanel && !['home', 'inventory'].includes(townPanel) && <ShopModal shop={townPanel} journey={journey} setJourney={setJourney} close={() => setTownPanel(null)} />}
        {townPanel === 'inventory' && <InventoryModal journey={journey} close={() => setTownPanel(null)} />}
        {townPanel === 'home' && <HomeModal journey={journey} restart={() => { setJourney({ shopsVisited: [], purchases: [], busBoarded: false }); setLocation('temple'); setTownPanel(null); }} />}
        {sidebar && <SidePanel progress={progress} name={name} setName={setName} onClose={() => setSidebar(false)} onExit={exitTemple} onReset={reset} updateProgress={updateProgress} />}
        {activePanel === 'mala' && <MalaModal progress={progress} updateProgress={updateProgress} close={() => setActivePanel(null)} />}
        {activePanel === 'pray' && <PrayerModal close={() => setActivePanel(null)} />}
        {activePanel === 'meditate' && <MeditationModal updateProgress={updateProgress} close={() => setActivePanel(null)} />}
        {activePanel === 'diya' && <DiyaModal updateProgress={updateProgress} close={() => setActivePanel(null)} />}
        {activePanel === 'darshan' && <DarshanModal close={() => setActivePanel(null)} />}
      </AnimatePresence>
      {location === 'temple' && <InteractionDock pose={userPose} seated={Boolean(selectedSeat)} setPanel={setActivePanel} setPose={setUserPose} onStand={() => { setSelectedSeat(null); setUserPose('standing'); }} />}
    </div>
  );
}

function WelcomeScreen({ name, setName, onEnter, savedName }) {
  return <div className="welcome-screen">
    <div className="welcome-glow" /><div className="welcome-arch"><div className="arch-inner" /></div>
    <div className="welcome-content">
      <div className="brand-mark"><span>ॐ</span></div>
      <p className="eyebrow">A quiet corner of the digital world</p>
      <h1>Welcome to <em>Virtual Temple</em></h1>
      <p className="welcome-copy">Find peace, offer your prayers,<br />and experience devotion together.</p>
      <form className="entry-form" onSubmit={onEnter}>
        <label htmlFor="visitor-name">How shall we welcome you?</label>
        <div className="name-field"><CircleUserRound size={18} /><input id="visitor-name" value={name} onChange={(e) => setName(e.target.value.slice(0, 20))} placeholder="Your name" maxLength="20" autoComplete="name" /><span>{name.length}/20</span></div>
        <button className="primary-button" type="submit">Enter the temple <ChevronRight size={17} /></button>
      </form>
      {savedName && <p className="saved-note">Welcome back, {savedName}. Your journey is waiting.</p>}
      <div className="welcome-foot"><span><Flame size={14} /> Light within</span><span><Flower2 size={14} /> Peace around</span><span><Heart size={14} /> Devotion always</span></div>
    </div>
  </div>;
}

function TempleHeader({ name, onMenu, soundOn, setSoundOn }) {
  return <header className="temple-header">
    <button className="icon-button" onClick={onMenu} aria-label="Open temple menu"><Menu size={21} /></button>
    <div className="header-brand"><span className="mini-om">ॐ</span><div><strong>Virtual Temple</strong><small>अन्तः शान्तिः · Inner peace</small></div></div>
    <div className="header-actions"><div className="presence"><i /> {18 + (name.length % 8)} devotees within</div><button className="icon-button" onClick={() => setSoundOn(!soundOn)} aria-label="Toggle sound">{soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}</button></div>
  </header>;
}

function KeyboardLegend({ location }) {
  const controls = location === 'temple'
    ? [['Q', 'Exit temple'], ['WASD', 'Move'], ['E', 'Interact']]
    : [['I', 'Re-enter temple'], ['P', 'Inventory'], ['B', 'Bus stand'], ['K', 'Board bus'], ['M', 'Buy in shop']];
  return <div className="keyboard-legend" aria-label="Keyboard controls"><span className="legend-title">Controls</span>{controls.map(([key, label]) => <span className="key-control" key={key}><kbd>{key}</kbd>{label}</span>)}</div>;
}

function TempleScene({ name, userPose, selectedSeat, onSit, onDarshan, onExit }) {
  const [player, setPlayer] = useState({ x: 1000, y: 680 });
  const [moving, setMoving] = useState(false);
  const [target, setTarget] = useState(null);
  const world = { width: 2200, height: 1400 };
  // World-space sacred rectangle: it matches the complete altar and railing footprint.
  const sanctum = { left: 810, right: 1390, top: 250, bottom: 630 };
  const zones = [
    { id: 'hall', label: 'Main prayer hall', x: 760, y: 180, width: 680, height: 470, icon: 'ॐ', className: 'hall-zone' },
    { id: 'courtyard', label: 'Temple courtyard', x: 80, y: 210, width: 570, height: 440, icon: '✦', className: 'courtyard-zone' },
    { id: 'garden', label: 'Meditation garden', x: 1490, y: 170, width: 600, height: 500, icon: '❀', className: 'garden-zone' },
    { id: 'kirtan', label: 'Kirtan mandap', x: 700, y: 850, width: 800, height: 400, icon: '♫', className: 'kirtan-zone' },
    { id: 'entrance', label: 'Temple entrance', x: 130, y: 890, width: 470, height: 320, icon: 'द्वार', className: 'entrance-zone' },
  ];
  const mockVisitors = useMemo(() => visitorNames.map((visitor, i) => ({
    name: visitor, x: 180 + ((i * 271) % 1780), y: 260 + ((i * 173) % 840),
    pose: poses[i % poses.length], walking: i % 3 !== 0,
  })).map((visitor) => isInsideSanctum(visitor, sanctum)
    ? { ...visitor, x: sanctum.left - 70, y: sanctum.bottom + 75 }
    : visitor), [sanctum.left, sanctum.right, sanctum.top, sanctum.bottom]);
  const nearDarshan = player.x > sanctum.left - 120 && player.x < sanctum.right + 120 && player.y > sanctum.bottom + 25 && player.y < sanctum.bottom + 145;
  const nearExit = player.x > 120 && player.x < 600 && player.y > 1030 && player.y < 1240;
  useEffect(() => {
    const pressed = new Set();
    const onDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key)) {
        event.preventDefault(); pressed.add(event.key.toLowerCase()); setMoving(true);
      }
      if (event.key.toLowerCase() === 'q') {
        event.preventDefault();
        onExit();
        return;
      }
      if (event.key.toLowerCase() === 'e') {
        if (nearExit) onExit();
        else if (nearDarshan) onDarshan();
        else if (target) onSit(target);
      }
    };
    const onUp = (event) => { pressed.delete(event.key.toLowerCase()); if (!pressed.size) setMoving(false); };
    const timer = window.setInterval(() => {
      if (!pressed.size) return;
      setPlayer((current) => {
        const speed = 9;
        const dx = (pressed.has('d') || pressed.has('arrowright') ? speed : 0) - (pressed.has('a') || pressed.has('arrowleft') ? speed : 0);
        const dy = (pressed.has('s') || pressed.has('arrowdown') ? speed : 0) - (pressed.has('w') || pressed.has('arrowup') ? speed : 0);
        return moveWithCollision(current, { x: Math.max(70, Math.min(world.width - 70, current.x + dx)), y: Math.max(90, Math.min(world.height - 70, current.y + dy)) });
      });
    }, 30);
    window.addEventListener('keydown', onDown); window.addEventListener('keyup', onUp);
    return () => { window.clearInterval(timer); window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, [target, nearExit, nearDarshan, onExit, onDarshan, onSit]);
  const moveTo = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(70, Math.min(world.width - 70, ((event.clientX - bounds.left) / bounds.width) * world.width));
    const y = Math.max(90, Math.min(world.height - 70, ((event.clientY - bounds.top) / bounds.height) * world.height));
    setTarget(null); setMoving(true);
    const destination = moveWithCollision(player, { x, y });
    const distance = Math.hypot(destination.x - player.x, destination.y - player.y);
    window.setTimeout(() => { setPlayer(destination); setMoving(false); }, Math.min(1400, distance * 1.8));
  };
  const moveWithCollision = (current, next) => {
    const radius = 30;
    const intersectsSanctum = (point) => point.x + radius > sanctum.left && point.x - radius < sanctum.right && point.y + radius > sanctum.top && point.y - radius < sanctum.bottom;
    for (let step = 1; step <= 20; step += 1) {
      const progress = step / 20;
      if (intersectsSanctum({ x: current.x + (next.x - current.x) * progress, y: current.y + (next.y - current.y) * progress })) {
        return current;
      }
    }
    return next;
  };
  const cameraX = Math.max(0, Math.min(world.width - 1000, player.x - 500));
  const cameraY = Math.max(0, Math.min(world.height - 650, player.y - 325));
  const nearSeat = zones.find((zone) => zone.id !== 'entrance' && player.x > zone.x + 100 && player.x < zone.x + zone.width - 100 && player.y > zone.y + zone.height - 145 && player.y < zone.y + zone.height);
  useEffect(() => { if (nearSeat && !selectedSeat) setTarget(nearSeat.id); }, [nearSeat, selectedSeat]);
  useEffect(() => {
    const onDarshanKey = (event) => { if (event.key.toLowerCase() === 'e' && nearDarshan) onDarshan(); };
    window.addEventListener('keydown', onDarshanKey);
    return () => window.removeEventListener('keydown', onDarshanKey);
  }, [nearDarshan, onDarshan]);
  useEffect(() => {
    const onExitKey = (event) => { if (event.key.toLowerCase() === 'e' && nearExit) onExit(); };
    window.addEventListener('keydown', onExitKey);
    return () => window.removeEventListener('keydown', onExitKey);
  }, [nearExit, onExit]);
  return <section className="temple-scene open-world" aria-label="Explorable temple campus">
    <div className="world-viewport" onClick={moveTo}><div className="world-map" style={{ width: world.width, height: world.height, transform: `translate(${-cameraX}px, ${-cameraY}px)` }}>
      <div className="map-sky" /><div className="map-path path-main" /><div className="map-path path-cross" />
      {zones.map((zone) => <div key={zone.id} className={`world-zone ${zone.className}`} style={{ left: zone.x, top: zone.y, width: zone.width, height: zone.height }}>
        <div className="zone-header"><span>{zone.icon}</span><div><strong>{zone.label}</strong><small>{zone.id === 'hall' ? 'Radha Krishna altar' : zone.id === 'kirtan' ? 'Gather · chant · rejoice' : 'Walk gently · breathe deeply'}</small></div></div>
        <div className="zone-architecture">{Array.from({ length: zone.id === 'garden' ? 8 : 6 }, (_, index) => <i key={index} />)}</div>
        {zone.id === 'hall' && <div className="sanctum" aria-label="Restricted Radha Krishna sanctum">
          <div className="sanctum-arch"><span>श्री राधा कृष्ण</span><div className="sanctum-glow" /><div className="murti-pair"><img src={radhaMurti} alt="Radha Rani murti" /><img src={krishnaMurti} alt="Lord Krishna murti" /></div><div className="altar-base"><b>राधे</b><b>कृष्ण</b></div></div>
          <div className="sanctum-railing"><i /><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="sanctum-boundary" aria-hidden="true" />
          <div className="darshan-mark">DARSHAN</div>
        </div>}
        {(zone.id === 'garden' || zone.id === 'courtyard') && <div className="plants">{Array.from({ length: 9 }, (_, index) => <span key={index}>{zone.id === 'garden' ? '✿' : '❀'}</span>)}</div>}
        <div className="sit-zone-label">{zone.id === 'entrance' ? 'Welcome, traveler' : 'Sit & spend time here'}</div>
      </div>)}
      {Array.from({ length: 18 }, (_, index) => <div key={index} className="map-lamp" style={{ left: 120 + ((index * 337) % 1940), top: 120 + ((index * 191) % 1140) }}><Flame size={16} /></div>)}
      {mockVisitors.map((visitor) => <div key={visitor.name} className={`world-devotee ${visitor.pose} ${visitor.walking ? 'patrolling' : ''}`} style={{ left: visitor.x, top: visitor.y }}><Devotee {...visitor} /></div>)}
      <div className={`world-player ${moving ? 'walking' : ''} ${userPose}`} style={{ left: player.x, top: player.y }}><Devotee name={name} pose={userPose} user /></div>
      {nearDarshan ? <button className="interaction-indicator darshan-indicator" onClick={(event) => { event.stopPropagation(); onDarshan(); }}><span>E</span> Offer Darshan</button> : nearExit ? <button className="interaction-indicator darshan-indicator exit-indicator" onClick={(event) => { event.stopPropagation(); onExit(); }}><span>E</span> Exit temple</button> : target && <div className="interaction-indicator" style={{ left: player.x, top: player.y - 75 }}><span>E</span> Sit in {target === 'hall' ? 'the prayer hall' : target}</div>}
    </div></div>
    <div className="map-compass"><span>N</span><i>✦</i><small>Temple campus</small></div>
    <div className="movement-help"><strong>Explore freely</strong><span>WASD / arrows to walk · click to move</span></div>
  </section>;
}

const townShops = [
  { id: 'kirana', name: 'Sharma Kirana', sign: 'किराना', products: [['Rice · 1 kg', 60], ['Wheat flour · 1 kg', 45], ['Milk', 30], ['Biscuits', 20]] },
  { id: 'flowers', name: 'Radha Flower House', sign: 'फूल', products: [['Rose', 10], ['Marigold garland', 40], ['Lotus', 30], ['Bouquet', 100]] },
  { id: 'sweets', name: 'Madhur Sweets', sign: 'मिठाई', products: [['Ladoo', 20], ['Jalebi', 30], ['Barfi', 40], ['Pedha', 25]] },
  { id: 'tea', name: 'Chai Junction', sign: 'चाय', products: [['Masala chai', 15], ['Samosa', 20]] },
];

function TownScene({ name, journey, setJourney, openShop, openInventory, onHome }) {
  const [player, setPlayer] = useState({ x: 760, y: 440 });
  const [moving, setMoving] = useState(false);
  const [busReady, setBusReady] = useState(false);
  const [busProgress, setBusProgress] = useState(0);
  const world = { width: 2200, height: 1250 };
  const shops = townShops.map((shop, index) => ({ ...shop, x: 240 + index * 400, y: 260 }));
  useEffect(() => {
    const pressed = new Set();
    const down = (event) => {
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) {
        event.preventDefault(); pressed.add(event.key.toLowerCase()); setMoving(true);
      }
      if (event.key.toLowerCase() === 'b') {
        event.preventDefault();
        setPlayer({ x: 1740, y: 920 });
        return;
      }
      if (event.key.toLowerCase() === 'p') {
        event.preventDefault();
        openInventory();
        return;
      }
      if (event.key.toLowerCase() === 'k' && player.y > 820 && player.x > 1530) {
        event.preventDefault();
        setJourney((current) => ({ ...current, busBoarded: true })); setMoving(false);
        return;
      }
      if (event.key.toLowerCase() === 'e' && player.y > 820 && player.x > 1530) setBusReady(true);
      if (event.key.toLowerCase() === 'e' && busReady && player.y > 820 && player.x > 1530) {
        setJourney((current) => ({ ...current, busBoarded: true })); setMoving(false);
      }
    };
    const up = (event) => { pressed.delete(event.key.toLowerCase()); if (!pressed.size) setMoving(false); };
    const timer = window.setInterval(() => {
      if (!pressed.size || busReady) return;
      setPlayer((current) => ({ x: Math.max(70, Math.min(world.width - 70, current.x + ((pressed.has('d') || pressed.has('arrowright') ? 8 : 0) - (pressed.has('a') || pressed.has('arrowleft') ? 8 : 0)))), y: Math.max(110, Math.min(world.height - 70, current.y + ((pressed.has('s') || pressed.has('arrowdown') ? 8 : 0) - (pressed.has('w') || pressed.has('arrowup') ? 8 : 0)))) }));
    }, 30);
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.clearInterval(timer); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [busReady, player.x, player.y, setJourney, openInventory]);
  useEffect(() => {
    if (journey.busBoarded) {
      const timer = window.setInterval(() => setBusProgress((current) => {
        if (current >= 100) { window.clearInterval(timer); onHome(); return 100; }
        return current + 5;
      }), 700);
      return () => window.clearInterval(timer);
    }
  }, [journey.busBoarded, onHome]);
  const nearbyShop = shops.find((shop) => Math.abs(player.x - shop.x) < 150 && Math.abs(player.y - shop.y) < 150);
  const nearBus = player.x > 1480 && player.x < 1900 && player.y > 760;
  const cameraX = Math.max(0, Math.min(world.width - 1000, player.x - 500));
  const cameraY = Math.max(0, Math.min(world.height - 650, player.y - 325));
  if (journey.busBoarded) return <section className="town-scene bus-journey"><div className="bus-window"><div className="bus-view" style={{ transform: `translateX(-${busProgress * 2}px)` }} /><div className="bus-seat">Your bus is travelling home</div></div><div className="journey-progress"><strong>Journey home</strong><span style={{ width: `${busProgress}%` }} /><small>{busProgress}% · Please enjoy the ride</small></div></section>;
  return <section className="temple-scene open-world town-scene" aria-label="Indian town">
    <div className="world-viewport"><div className="world-map town-map" style={{ width: world.width, height: world.height, transform: `translate(${-cameraX}px, ${-cameraY}px)` }}>
      <div className="town-ground" /><div className="town-road" /><div className="town-sidewalk" />
      <div className="town-title">Temple Road <small>शुभ यात्रा · A good journey</small></div>
      <div className="town-temple-gate">Krishna Temple <small>← You came from here</small></div>
      {shops.map((shop) => <button key={shop.id} className="town-shop" style={{ left: shop.x, top: shop.y }} onClick={() => openShop(shop.id)}><span>{shop.sign}</span><strong>{shop.name}</strong><small>Press E to explore</small></button>)}
      <div className="bus-stop" style={{ left: 1650, top: 820 }}><span>BUS STOP</span><strong>Vrindavan Circular</strong><small>Home route · every 60 sec</small><i>⌛ {busReady ? 'Bus is here' : 'Press E to wait'}</i></div>
      {visitorNames.slice(0, 9).map((visitor, index) => <div key={visitor} className="town-pedestrian" style={{ left: 170 + index * 210, top: 585 + (index % 2) * 90 }}><Devotee name={visitor} pose={index % 3 === 0 ? 'standing' : 'walking'} /></div>)}
      <div className={`world-player ${moving ? 'walking' : ''}`} style={{ left: player.x, top: player.y }}><Devotee name={name} pose="standing" user /></div>
      {nearbyShop && <button className="interaction-indicator darshan-indicator" style={{ left: player.x, top: player.y - 75 }} onClick={() => openShop(nearbyShop.id)}><span>E</span> Explore shop · P inventory</button>}
      {nearBus && <button className="interaction-indicator darshan-indicator" style={{ left: player.x, top: player.y - 75 }} onClick={() => setBusReady(true)}><span>E</span> {busReady ? 'Board bus' : 'Wait for bus'}</button>}
      {busReady && <div className="town-bus" style={{ left: 1740, top: 690 }}><strong>VRINDAVAN</strong><small>Driver · ready</small></div>}
    </div></div><div className="movement-help"><strong>Town road</strong><span>WASD / arrows to explore · walk to a shop or bus stop</span></div><div className="town-badge">Outside the temple · local demo journey</div>
  </section>;
}

function ShopModal({ shop, journey, setJourney, close }) {
  const data = townShops.find((item) => item.id === shop) || townShops[0];
  const [cart, setCart] = useState({});
  const total = data.products.reduce((sum, [, price], index) => sum + price * (cart[index] || 0), 0);
  const buy = () => { if (!total) return; setJourney((current) => ({ ...current, shopsVisited: [...new Set([...current.shopsVisited, data.name])], purchases: [...current.purchases, ...data.products.flatMap(([label], index) => Array(cart[index] || 0).fill(label))] })); close(); };
  useEffect(() => {
    const onBuy = (event) => { if (event.key.toLowerCase() === 'm') { event.preventDefault(); buy(); } };
    window.addEventListener('keydown', onBuy);
    return () => window.removeEventListener('keydown', onBuy);
  }, [total]);
  return <Modal title={data.name} icon={<ShoppingBag size={22} />} close={close} className="shop-modal"><p className="modal-lead">A friendly local shop on Temple Road.</p><div className="shop-products">{data.products.map(([label, price], index) => <div className="product-row" key={label}><div><strong>{label}</strong><small>₹{price} virtual price</small></div><div className="quantity"><button onClick={() => setCart((c) => ({ ...c, [index]: Math.max(0, (c[index] || 0) - 1) }))}>−</button><span>{cart[index] || 0}</span><button onClick={() => setCart((c) => ({ ...c, [index]: (c[index] || 0) + 1 }))}>+</button></div></div>)}</div><div className="cart-total"><span>Total</span><strong>₹{total}</strong></div><button className="primary-button modal-button" onClick={buy} disabled={!total}>Buy virtually · M <Check size={17} /></button></Modal>;
}

function InventoryModal({ journey, close }) {
  return <Modal title="Your inventory" icon={<ShoppingBag size={22} />} close={close} className="inventory-modal"><p className="modal-lead">Items collected during your town journey.</p>{journey.purchases.length ? <div className="inventory-list">{journey.purchases.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div> : <p className="empty-inventory">Nothing purchased yet. Visit a shop and press <b>M</b> to buy.</p>}<button className="secondary-button modal-button" onClick={close}>Continue exploring</button></Modal>;
}

function HomeModal({ journey, restart }) {
  return <Modal title="Welcome Home!" icon={<House size={22} />} close={() => {}} className="home-modal"><div className="home-symbol">⌂</div><p className="modal-lead">You completed your journey from the temple through town and safely arrived home.</p><div className="journey-summary"><span>Temple visit <b>Complete</b></span><span>Shops visited <b>{journey.shopsVisited.length}</b></span><span>Items purchased <b>{journey.purchases.length}</b></span><span>Bus journey <b>Complete</b></span></div><button className="primary-button modal-button" onClick={restart}>Start another journey <RotateCcw size={17} /></button></Modal>;
}

function Devotee({ name, pose, user }) {
  return <div className={`devotee ${pose} ${user ? 'current-devotee' : ''}`}><span className="devotee-name">{name}{user && <small> · you</small>}</span><div className="avatar-head" /><div className="avatar-body">{pose === 'praying' ? '🙏' : pose === 'meditating' ? '✦' : ''}</div><div className="avatar-shadow" /></div>;
}

function TempleStats({ progress }) {
  return <aside className="temple-stats"><div className="stat-label"><span className="live-dot" /> Temple today</div><div className="stat-row"><span>Visitors present</span><strong>26</strong></div><div className="stat-row"><span>Prayers offered</span><strong>184</strong></div><div className="stat-divider" /><div className="your-stats"><p>Your journey</p><div><span><Flame size={15} /> Malas</span><strong>{progress.totalMalas}</strong></div><div><span><LampCeiling size={15} /> Diyas lit</span><strong>{progress.totalDiyas}</strong></div></div></aside>;
}

function InteractionDock({ pose, seated, setPanel, onStand }) {
  return <div className="interaction-dock"><div className="dock-intro"><span className="dock-avatar">{pose === 'meditating' ? '✦' : 'ॐ'}</span><div><strong>{seated ? 'You are seated' : 'Explore the campus'}</strong><small>{seated ? 'What would you like to do?' : 'Walk toward a zone and press E to sit'}</small></div></div><div className="dock-actions"><button onClick={() => setPanel('mala')} disabled={!seated}><Flame size={17} /><span>Chant</span></button><button onClick={() => setPanel('pray')} disabled={!seated}><Heart size={17} /><span>Pray</span></button><button onClick={() => setPanel('meditate')} disabled={!seated}><Moon size={17} /><span>Meditate</span></button><button onClick={() => setPanel('diya')} disabled={!seated}><LampCeiling size={17} /><span>Light diya</span></button><button className="stand-button" onClick={onStand} disabled={!seated}><ArrowLeft size={17} /><span>Stand</span></button></div></div>;
}

function Modal({ children, title, icon, close, className = '' }) {
  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className={`modal-card ${className}`} initial={{ y: 30, opacity: 0, scale: .97 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }}><button className="modal-close" onClick={close}><X size={18} /></button><div className="modal-heading"><span>{icon}</span><div><p className="eyebrow">Your private practice</p><h2>{title}</h2></div></div>{children}</motion.div></motion.div>;
}

function MalaModal({ progress, updateProgress, close }) {
  const [beads, setBeads] = useState(0); const [mantra, setMantra] = useState(mantras[0]); const complete = beads === 108;
  const chant = () => { if (complete) return; const next = beads + 1; setBeads(next); updateProgress({ totalBeads: progress.totalBeads + 1, ...(next === 108 ? { totalMalas: progress.totalMalas + 1 } : {}) }); };
  return <Modal title="Chanting mala" icon={<span className="modal-om">ॐ</span>} close={close} className="mala-modal"><p className="modal-lead">Let each bead carry you a little closer to stillness.</p><select value={mantra} onChange={(e) => setMantra(e.target.value)}>{mantras.map((m) => <option key={m}>{m}</option>)}</select><div className={`mala-visual ${complete ? 'complete' : ''}`}><div className="mala-ring">{Array.from({ length: 27 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 13.33}deg) translateY(-98px)` }} />)}<span>{complete ? '✦' : beads}<small>{complete ? 'Mala complete' : '/ 108 beads'}</small></span></div></div><div className="progress-track"><span style={{ width: `${(beads / 108) * 100}%` }} /></div><button className="primary-button modal-button" onClick={complete ? () => { setBeads(0); } : chant}>{complete ? 'Begin another mala' : `Chant · ${mantra.split(' ')[0]}`} <ChevronRight size={17} /></button>{complete && <p className="success-message"><Check size={15} /> Your mala is complete. May peace stay with you.</p>}</Modal>;
}

function PrayerModal({ close }) {
  const [prayer, setPrayer] = useState(''); const [saved, setSaved] = useState(false);
  return <Modal title="Offer a prayer" icon={<Heart size={22} />} close={close}><p className="modal-lead">Place your intention here. This prayer remains private on your device.</p><textarea value={prayer} onChange={(e) => setPrayer(e.target.value)} placeholder="Write a prayer, gratitude, or intention..." rows="5" /><button className="primary-button modal-button" onClick={() => setSaved(true)}>{saved ? 'Prayer held in silence' : 'Offer privately'} {saved ? <Check size={17} /> : <Heart size={17} />}</button>{saved && <p className="success-message"><Sparkles size={15} /> Your intention has been received.</p>}</Modal>;
}

function DarshanModal({ close }) {
  const [offered, setOffered] = useState(false);
  return <Modal title="Offer Darshan" icon={<Sparkles size={22} />} close={close} className="darshan-modal">
    <div className="darshan-symbol">ॐ</div>
    <p className="modal-lead">Stand before Radha and Krishna. Let the heart become quiet, and offer your respects in silence.</p>
    <button className="primary-button modal-button" onClick={() => setOffered(true)}>{offered ? 'Darshan offered' : 'Offer Namaste'} {offered ? <Check size={17} /> : <Heart size={17} />}</button>
    {offered && <p className="success-message"><Bell size={15} /> May their grace accompany your path.</p>}
  </Modal>;
}

function MeditationModal({ updateProgress, close }) {
  const [minutes, setMinutes] = useState(null); const [active, setActive] = useState(false);
  const begin = (m) => { setMinutes(m); setActive(true); }; const end = () => { updateProgress({ totalMeditationSessions: 1, totalMeditationMinutes: mVal(minutes) }); close(); };
  const mVal = (v) => Number(v || 0);
  return <Modal title="Meditation" icon={<Moon size={22} />} close={close} className="meditation-modal"><p className="modal-lead">Follow the breath. Nothing to solve, nowhere else to be.</p>{active ? <div className="breathing"><div className="breath-circle"><span>inhale<br /><small>gently</small></span></div><p>{minutes} minute practice</p><button className="secondary-button" onClick={end}>End meditation <Check size={16} /></button></div> : <><div className="duration-options">{[1, 5, 10].map((m) => <button key={m} onClick={() => begin(m)}><strong>{m}</strong><span>minutes</span></button>)}</div><p className="center-note"><Sparkles size={14} /> Choose a gentle duration</p></>}</Modal>;
}

function DiyaModal({ updateProgress, close }) {
  const [lit, setLit] = useState(false);
  return <Modal title="Light a diya" icon={<LampCeiling size={22} />} close={close}><p className="modal-lead">Offer a little light to this shared space.</p><div className={`diya-large ${lit ? 'is-lit' : ''}`}><div className="flame">{lit && <Flame size={40} />}</div><div className="diya-bowl">◡</div></div><button className="primary-button modal-button" onClick={() => { if (!lit) { setLit(true); updateProgress((p) => ({ totalDiyas: p.totalDiyas + 1 })); } }}>{lit ? 'Diya is glowing' : 'Light the diya'} {lit ? <Check size={17} /> : <Flame size={17} />}</button>{lit && <p className="success-message"><Sparkles size={15} /> May this light guide your way.</p>}</Modal>;
}

function SidePanel({ progress, name, setName, onClose, onExit, onReset, updateProgress }) {
  const [view, setView] = useState('journey'); const [draft, setDraft] = useState(name);
  const save = () => { const clean = draft.trim().slice(0, 20); if (clean) { setName(clean); updateProgress({ visitorName: clean }); } };
  return <motion.div className="side-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.aside className="side-panel" initial={{ x: -340 }} animate={{ x: 0 }} exit={{ x: -340 }}><div className="side-top"><div className="header-brand"><span className="mini-om">ॐ</span><strong>Temple menu</strong></div><button className="icon-button" onClick={onClose}><X size={20} /></button></div><div className="profile-chip"><div className="profile-avatar">ॐ</div><div><strong>{progress.visitorName}</strong><small>Seeker on the path</small></div></div><div className="side-tabs"><button className={view === 'journey' ? 'active' : ''} onClick={() => setView('journey')}>My journey</button><button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>Settings</button></div>{view === 'journey' ? <div className="journey-view"><p className="side-intro">Every small act of devotion is a step inward.</p><div className="journey-grid"><div><strong>{progress.totalVisits}</strong><span>Temple visits</span></div><div><strong>{progress.totalMalas}</strong><span>Malas completed</span></div><div><strong>{progress.totalBeads}</strong><span>Beads chanted</span></div><div><strong>{progress.totalMeditationMinutes}</strong><span>Minutes in stillness</span></div><div><strong>{progress.totalMeditationSessions}</strong><span>Meditation sessions</span></div><div><strong>{progress.totalDiyas}</strong><span>Diyas lit</span></div></div><div className="quote">“The temple is not a place. It is a feeling you carry.”</div></div> : <div className="settings-view"><label>Display name<input value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={save} /></label><label className="toggle-row">Sound and ambience<button className={`toggle ${progress.soundEnabled ? 'on' : ''}`} onClick={() => updateProgress({ soundEnabled: !progress.soundEnabled })}><i /></button></label><label className="toggle-row">Gentle animations<button className={`toggle ${progress.animations ? 'on' : ''}`} onClick={() => updateProgress({ animations: !progress.animations })}><i /></button></label><button className="reset-button" onClick={onReset}><RotateCcw size={15} /> Reset local progress</button></div>}<div className="side-bottom"><button className="exit-button" onClick={onExit}><LogOut size={16} /> Leave temple</button><small>Your journey is stored only on this device.</small></div></motion.aside></motion.div>;
}

createRoot(document.getElementById('root')).render(<App />);
