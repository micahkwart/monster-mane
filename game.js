/* ================================================================
   Monster Mane – Dragon Chronicles
   A Dragon Ball Xenoverse 2-style game built with pure HTML5 Canvas.
   - 10 Parallel Quest levels, each unlocking a Dragon Ball power
   - Conton City hub world with buildings and walking NPCs
   - XP / character level system (Lv 1-50)
   - IndexedDB database (localStorage fallback)
   ================================================================ */

// ── CONSTANTS ──────────────────────────────────────────────────────
const XP_PER_LEVEL = lvl => lvl * 150;

const ALL_POWERS = [
    { id:0, name:'Ki Blast',       key:'1', cooldown: 800,  damage: 15,  color:'#ffff44', type:'projectile', desc:'Basic Ki blast. Fast and reliable.' },
    { id:1, name:'Kamehameha',     key:'2', cooldown:2000,  damage: 45,  color:'#4488ff', type:'beam',       desc:'Iconic beam attack — fires forward.' },
    { id:2, name:'Galick Gun',     key:'3', cooldown:2500,  damage: 50,  color:'#cc44ff', type:'beam',       desc:"Vegeta's signature beam." },
    { id:3, name:'Spirit Bomb',    key:'4', cooldown:8000,  damage: 80,  color:'#aaddff', type:'aoe',        desc:'Massive AoE energy sphere.' },
    { id:4, name:'Senzu Bean',     key:'5', cooldown:6000,  damage:-45,  color:'#00ff88', type:'heal',       desc:'Restores 45 HP instantly.' },
    { id:5, name:'Ki Shield',      key:'6', cooldown:12000, damage:  0,  color:'#8800ff', type:'shield',     desc:'Energy barrier — 5 s invincibility.' },
    { id:6, name:'Explosive Wave', key:'7', cooldown:4000,  damage: 55,  color:'#ff8800', type:'aoe',        desc:'AoE burst around you.' },
    { id:7, name:'Solar Flare',    key:'8', cooldown:5000,  damage: 20,  color:'#ffffaa', type:'stun',       desc:'Stuns all nearby enemies for 2 s.' },
    { id:8, name:'Super Saiyan',   key:'9', cooldown:15000, damage:  0,  color:'#ffff00', type:'buff',       desc:'2× damage for 10 s.' },
    { id:9, name:'Final Flash',    key:'0', cooldown:10000, damage:130,  color:'#ffff88', type:'beam',       desc:"Vegeta's ultimate — massive damage." },
];

const LEVELS = [
    { id:1,  name:'PQ 01: Saiyan Warriors',       bg:'day',    desc:'Defeat the Saiyan invaders!',              enemies:5,  hp:40,  spd:0.022, dmg:0.3, xp:100, coins:50,  power:0 },
    { id:2,  name:'PQ 02: The Android Files',      bg:'day',    desc:'Android units are attacking the city!',    enemies:7,  hp:50,  spd:0.025, dmg:0.35,xp:150, coins:60,  power:1 },
    { id:3,  name:'PQ 03: Namek Showdown',         bg:'orange', desc:'The fight for the Dragon Balls!',          enemies:8,  hp:60,  spd:0.027, dmg:0.4, xp:200, coins:75,  power:2 },
    { id:4,  name:'PQ 04: Cell Games',             bg:'orange', desc:'Cell has powered up to Perfect form!',     enemies:10, hp:70,  spd:0.028, dmg:0.45,xp:250, coins:90,  power:3 },
    { id:5,  name:'PQ 05: Buu Saga',               bg:'orange', desc:'Stop Majin Buu\'s rampage!',               enemies:10, hp:80,  spd:0.030, dmg:0.5, xp:300, coins:100, power:4 },
    { id:6,  name:'PQ 06: Tournament of Power',    bg:'space',  desc:'Survive the multiverse tournament!',       enemies:12, hp:90,  spd:0.032, dmg:0.55,xp:380, coins:120, power:5 },
    { id:7,  name:'PQ 07: Frieza\'s Revenge',       bg:'space',  desc:'Golden Frieza has returned!',              enemies:12, hp:100, spd:0.033, dmg:0.6, xp:450, coins:140, power:6 },
    { id:8,  name:'PQ 08: Golden Age',             bg:'hell',   desc:'Face the most powerful warriors!',         enemies:15, hp:115, spd:0.035, dmg:0.65,xp:550, coins:160, power:7 },
    { id:9,  name:'PQ 09: Ultra Instinct Test',    bg:'hell',   desc:'A divine challenge awaits!',               enemies:15, hp:130, spd:0.037, dmg:0.7, xp:650, coins:180, power:8 },
    { id:10, name:'PQ 10: Supreme Battle',         bg:'hell',   desc:'The ultimate test of the Time Patrol!',   enemies:20, hp:150, spd:0.040, dmg:0.8, xp:800, coins:250, power:9 },
];

// City buildings  { x, z, w(width along X), d(depth along Z), h(height), color, label }
const CITY_BUILDINGS = [
    { x: 0,   z:-22,  w:12, d: 8, h:18, color:'#4455aa', label:'Time Nest'       },
    { x:16,   z:-14,  w: 9, d: 9, h:12, color:'#4499ff', label:'Capsule Corp'    },
    { x:-16,  z:-10,  w: 8, d: 8, h: 7, color:'#ff8800', label:'Z-Store'         },
    { x:20,   z: 12,  w:13, d:10, h: 5, color:'#338844', label:'Training Grounds'},
    { x:14,   z:-20,  w:10, d:10, h: 4, color:'#885533', label:'Tournament Arena'},
    { x:-20,  z: 10,  w: 5, d: 5, h: 6, color:'#ff5555', label:'Kame House'      },
    { x:11,   z:  3,  w: 5, d: 5, h: 9, color:'#667788', label:''                },
    { x:-11,  z:  3,  w: 5, d: 5, h: 9, color:'#667788', label:''                },
    { x: 7,   z:-16,  w: 4, d: 4, h: 5, color:'#998866', label:''                },
    { x:-7,   z:-16,  w: 4, d: 4, h: 5, color:'#889966', label:''                },
    // Perimeter walls
    { x: 0,   z: 27,  w:60, d: 2, h: 7, color:'#334455', label:''                },
    { x: 0,   z:-30,  w:60, d: 2, h: 7, color:'#334455', label:''                },
    { x: 29,  z:  0,  w: 2, d:60, h: 7, color:'#334455', label:''                },
    { x:-29,  z:  0,  w: 2, d:60, h: 7, color:'#334455', label:''                },
];

// NPCs  { x, z, color, name, dialogue, isShop?, path:[{x,z}…] }
const NPCS_DATA = [
    { x: 0,   z:-4,  color:'#ffaaff', name:'Chronoa',      isShop:false,
      dialogue:"Welcome to Conton City! The Time Portal ahead leads to Parallel Quests. Good luck, Time Patroller!",
      path:[{x:0,z:-4},{x:3,z:-4},{x:3,z:-2},{x:0,z:-2}] },
    { x:-5,   z:-4,  color:'#cc44cc', name:'Elder Kai',    isShop:false,
      dialogue:"Train hard and master all 10 powers. Only then can you protect the timeline!",
      path:[{x:-5,z:-4},{x:-3,z:-4},{x:-3,z:-6},{x:-5,z:-6}] },
    { x:-13,  z:-7,  color:'#88aaff', name:'Bulma',        isShop:true,
      dialogue:"Welcome to the Z-Store! I've got the best Capsule Corp upgrades money can buy.",
      path:[{x:-13,z:-7},{x:-13,z:-5}] },
    { x: 5,   z: 2,  color:'#4488cc', name:'Future Trunks',isShop:false,
      dialogue:"The villains are getting stronger each Parallel Quest. Use every power you have!",
      path:[{x:5,z:2},{x:7,z:2},{x:7,z:5},{x:5,z:5}] },
    { x: 3,   z: 9,  color:'#44cc44', name:'Piccolo',      isShop:false,
      dialogue:"Power comes from discipline. Master your Ki and no enemy can stop you.",
      path:[{x:3,z:9},{x:6,z:9},{x:6,z:12},{x:3,z:12}] },
    { x:-3,   z: 7,  color:'#ffcc88', name:'Krillin',      isShop:false,
      dialogue:"Hey! Even I can keep up with these enemies… well, sort of. You'll do great!",
      path:[{x:-3,z:7},{x:0,z:7},{x:0,z:10},{x:-3,z:10}] },
    { x:14,   z:-6,  color:'#cc8844', name:'Gohan',        isShop:false,
      dialogue:"Study the enemy's patterns. Knowledge is just as important as raw power.",
      path:[{x:14,z:-6},{x:17,z:-6},{x:17,z:-3},{x:14,z:-3}] },
    { x:-11,  z:13,  color:'#885511', name:'Yamcha',       isShop:false,
      dialogue:"I used to be the strongest on Earth… but hey, good luck out there, rookie!",
      path:[{x:-11,z:13},{x:-8,z:13},{x:-8,z:16},{x:-11,z:16}] },
];

const PORTAL = { x:0, z:-9, radius:2.5 };  // mission portal in hub

// Shop items (indices 0-4)
const SHOP_ITEMS = [
    { id:1, name:'Senzu Bean',        cost:50,  desc:'Restore full health',          effect: save => { save.tempHeal = true; } },
    { id:2, name:'Battle Suit',       cost:100, desc:'+20 max HP (permanent)',        effect: save => { save.maxHealth += 20; } },
    { id:3, name:'Super Training',    cost:150, desc:'+10% damage (permanent)',       effect: save => { save.damageBoost = +(save.damageBoost * 1.10).toFixed(3); } },
    { id:4, name:'Gravity Chamber',   cost:120, desc:'+15% move speed (permanent)',  effect: save => { save.speedBoost  = +(save.speedBoost  * 1.15).toFixed(3); } },
    { id:5, name:'Time Crystals',     cost:200, desc:'-10% cooldowns (permanent)',   effect: save => { save.cooldownMult = +(save.cooldownMult * 0.90).toFixed(3); } },
];

// ── DATABASE MODULE ─────────────────────────────────────────────────
const DB = {
    _idb: null,
    _useIDB: true,

    async open() {
        if (typeof indexedDB === 'undefined') { this._useIDB = false; return; }
        return new Promise(resolve => {
            const req = indexedDB.open('MonsterManeDB', 2);
            req.onupgradeneeded = e => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('saves'))
                    db.createObjectStore('saves', { keyPath: 'id' });
            };
            req.onsuccess  = e => { this._idb = e.target.result; resolve(); };
            req.onerror    = () => { this._useIDB = false; resolve(); };
        });
    },

    async save(data) {
        const payload = { id: 'slot1', ...data };
        if (this._useIDB && this._idb) {
            return new Promise(resolve => {
                const tx = this._idb.transaction('saves', 'readwrite');
                tx.objectStore('saves').put(payload);
                tx.oncomplete = resolve;
                tx.onerror    = () => { this._ls(data); resolve(); };
            });
        }
        this._ls(data);
    },

    async load() {
        if (this._useIDB && this._idb) {
            return new Promise(resolve => {
                const tx  = this._idb.transaction('saves', 'readonly');
                const req = tx.objectStore('saves').get('slot1');
                req.onsuccess = () => resolve(req.result || null);
                req.onerror   = () => resolve(this._lsLoad());
            });
        }
        return this._lsLoad();
    },

    _ls(data) {
        try { localStorage.setItem('mm_save', JSON.stringify(data)); } catch {}
    },
    _lsLoad() {
        try { const s = localStorage.getItem('mm_save'); return s ? JSON.parse(s) : null; }
        catch { return null; }
    },
};

function defaultSave(name) {
    return {
        playerName:   name || 'Time Patroller',
        charLevel:    1,
        xp:           0,
        maxHealth:    100,
        coins:        0,
        completedLevels: [],
        unlockedPowers:  Array(10).fill(false),
        damageBoost:  1.0,
        speedBoost:   1.0,
        cooldownMult: 1.0,
    };
}

// ── CANVAS & RENDERER SETUP ─────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Project a 3D world point to 2D screen coords.
// Forward direction = (sin(angle), cos(angle)) in (X, Z).
function project3D(wx, wy, wz) {
    const dx = wx - hub.px;
    const dy = wy - 1.1;          // 1.1 = eye height
    const dz = wz - hub.pz;
    const ca = Math.cos(hub.angle), sa = Math.sin(hub.angle);
    // Rotate so camera looks along +rz
    const rx =  dx * ca - dz * sa;
    const rz =  dx * sa + dz * ca;
    if (rz <= 0.15) return null;
    const scale  = 420 / rz;
    return {
        x:    canvas.width  / 2 + rx * scale,
        y:    canvas.height / 2 - dy * scale,
        size: scale,
        dist: rz,
    };
}

function shadeHex(hex, f) {   // f in [-1,1]
    const n = parseInt(hex.replace('#',''), 16);
    const clamp = v => Math.min(255, Math.max(0, v));
    const r = clamp(((n >> 16) & 0xff) + f * 255);
    const g = clamp(((n >>  8) & 0xff) + f * 255);
    const b = clamp(( n        & 0xff) + f * 255);
    return `rgb(${r|0},${g|0},${b|0})`;
}

function drawFace(pts4, color, stroke) {
    const p = pts4.map(q => project3D(q[0], q[1], q[2]));
    if (p.some(q => !q)) return;
    ctx.fillStyle   = color;
    ctx.strokeStyle = stroke || color;
    ctx.lineWidth   = 0.5;
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
    ctx.closePath();
    ctx.fill();
    if (stroke) ctx.stroke();
}

function drawBuilding(b) {
    const { x, z, w, d, h, color } = b;
    const hw = w/2, hd = d/2;
    const px = hub.px, pz = hub.pz;
    const faces = [];

    if (pz < z) faces.push({ pts:[[x-hw,0,z-hd],[x+hw,0,z-hd],[x+hw,h,z-hd],[x-hw,h,z-hd]], c:color,               dist:(z-hd)-pz });
    if (pz > z) faces.push({ pts:[[x+hw,0,z+hd],[x-hw,0,z+hd],[x-hw,h,z+hd],[x+hw,h,z+hd]], c:shadeHex(color,-0.2), dist:pz-(z+hd) });
    if (px > x) faces.push({ pts:[[x+hw,0,z-hd],[x+hw,0,z+hd],[x+hw,h,z+hd],[x+hw,h,z-hd]], c:shadeHex(color,-0.1), dist:px-(x+hw) });
    if (px < x) faces.push({ pts:[[x-hw,0,z+hd],[x-hw,0,z-hd],[x-hw,h,z-hd],[x-hw,h,z+hd]], c:shadeHex(color,-0.1), dist:(x-hw)-px });
    // top face always
    faces.push({ pts:[[x-hw,h,z-hd],[x+hw,h,z-hd],[x+hw,h,z+hd],[x-hw,h,z+hd]], c:shadeHex(color,0.25), dist:-1 });

    faces.sort((a,b) => b.dist - a.dist);
    const outline = shadeHex(color, -0.4);
    for (const f of faces) drawFace(f.pts, f.c, outline);

    // Building label
    if (b.label) {
        const mid = project3D(x, h + 0.8, z);
        if (mid) {
            ctx.fillStyle   = '#fff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth   = 2;
            const fs = Math.min(16, Math.max(8, mid.size * 0.35));
            ctx.font = `bold ${fs}px Arial`;
            ctx.textAlign = 'center';
            ctx.strokeText(b.label, mid.x, mid.y);
            ctx.fillText(b.label,   mid.x, mid.y);
        }
    }
}

function drawNPCSprite(npc, pos) {
    const s = Math.min(pos.size, 90);
    const bodyH = s * 0.9, bodyW = s * 0.55;
    const headR = s * 0.32;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 2, bodyW * 0.6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = npc.color;
    ctx.fillRect(pos.x - bodyW/2, pos.y - bodyH, bodyW, bodyH);

    // Head
    ctx.fillStyle = npc.color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - bodyH - headR * 0.7, headR, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(pos.x - headR*0.35, pos.y - bodyH - headR*0.8, headR*0.18, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(pos.x + headR*0.35, pos.y - bodyH - headR*0.8, headR*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(pos.x - headR*0.35, pos.y - bodyH - headR*0.8, headR*0.09, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(pos.x + headR*0.35, pos.y - bodyH - headR*0.8, headR*0.09, 0, Math.PI*2); ctx.fill();

    // Name tag
    const fs = Math.min(14, Math.max(7, s * 0.28));
    ctx.font = `bold ${fs}px Arial`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeText(npc.name, pos.x, pos.y - bodyH - headR * 2.0);
    ctx.fillStyle = '#fff';
    ctx.fillText(npc.name, pos.x, pos.y - bodyH - headR * 2.0);

    // Shop indicator
    if (npc.isShop) {
        ctx.font = `bold ${fs * 1.3}px Arial`;
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#000';
        ctx.strokeText('🛒', pos.x, pos.y - bodyH - headR * 3.2);
        ctx.fillText('🛒',   pos.x, pos.y - bodyH - headR * 3.2);
    }
}

function drawEnemySprite(en, pos) {
    const s = Math.min(pos.size, 100);
    const bH = s * 1.0, bW = s * 0.65, hR = s * 0.36;

    // Shadow
    ctx.fillStyle = 'rgba(200,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 2, bW * 0.6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = en.color || '#cc2222';
    ctx.fillRect(pos.x - bW/2, pos.y - bH, bW, bH);
    // Head
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - bH - hR * 0.6, hR, 0, Math.PI * 2);
    ctx.fill();

    // Angry eyes
    ctx.fillStyle = '#ff0';
    ctx.beginPath(); ctx.arc(pos.x - hR*0.38, pos.y - bH - hR*0.75, hR*0.18, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(pos.x + hR*0.38, pos.y - bH - hR*0.75, hR*0.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#f00';
    ctx.beginPath(); ctx.arc(pos.x - hR*0.38, pos.y - bH - hR*0.75, hR*0.09, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(pos.x + hR*0.38, pos.y - bH - hR*0.75, hR*0.09, 0, Math.PI*2); ctx.fill();

    // Health bar
    const pct = en.health / en.maxHealth;
    ctx.fillStyle = '#333';
    ctx.fillRect(pos.x - s*0.55, pos.y - bH - hR*2.0, s*1.1, 7);
    ctx.fillStyle = pct > 0.5 ? '#22dd44' : pct > 0.25 ? '#ffaa00' : '#ff2222';
    ctx.fillRect(pos.x - s*0.55, pos.y - bH - hR*2.0, s * 1.1 * pct, 7);

    // Level indicator
    if (s > 20) {
        const fs = Math.max(7, s * 0.2);
        ctx.font = `bold ${fs}px Arial`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
        ctx.strokeText(`Lv${en.level||1}`, pos.x, pos.y - bH - hR*2.9);
        ctx.fillStyle = '#fff';
        ctx.fillText(`Lv${en.level||1}`, pos.x, pos.y - bH - hR*2.9);
    }
}

function drawProjectileSprite(pr, pos) {
    const r = Math.max(4, pos.size * 0.28);
    const grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2.5);
    grd.addColorStop(0,   pr.color);
    grd.addColorStop(0.5, pr.color + '99');
    grd.addColorStop(1,   pr.color + '00');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
}

function drawPortal() {
    const pos = project3D(PORTAL.x, 0, PORTAL.z);
    if (!pos) return;
    const s = Math.min(pos.size, 150);
    const t = Date.now() / 1000;
    const pulse = 0.5 + 0.4 * Math.sin(t * 3);

    // Pillar glow
    const grd = ctx.createLinearGradient(pos.x, pos.y, pos.x, pos.y - s * 3.5);
    grd.addColorStop(0, `rgba(0,170,255,${0.55 + pulse * 0.3})`);
    grd.addColorStop(1, 'rgba(0,170,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(pos.x - s*0.35, pos.y - s*3.5, s*0.7, s*3.5);

    // Base ring
    ctx.strokeStyle = `rgba(0,170,255,${0.7 + pulse * 0.3})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, s*0.85, s*0.3, 0, 0, Math.PI*2);
    ctx.stroke();

    // Labels
    const fs = Math.min(18, Math.max(10, s * 0.45));
    ctx.font = `bold ${fs}px Arial`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#003366'; ctx.lineWidth = 3;
    ctx.strokeText('⚡ TIME PORTAL ⚡', pos.x, pos.y - s * 3.7);
    ctx.fillStyle = '#00ddff';
    ctx.fillText('⚡ TIME PORTAL ⚡', pos.x, pos.y - s * 3.7);
    ctx.font = `${Math.max(8, fs*0.75)}px Arial`;
    ctx.fillStyle = '#aaddff';
    ctx.fillText('[E] Enter Parallel Quest', pos.x, pos.y - s * 3.1);
}

function drawSkyGround(bg) {
    let skyTop, skyBot, groundTop, groundBot;
    switch(bg) {
        case 'city':
            skyTop = '#1a1a2e'; skyBot = '#16213e';
            groundTop = '#2a2a2a'; groundBot = '#1a1a1a';
            break;
        case 'orange':
            skyTop = '#ff6600'; skyBot = '#ff3300';
            groundTop = '#8b4513'; groundBot = '#5c2e00';
            break;
        case 'space':
            skyTop = '#000022'; skyBot = '#000044';
            groundTop = '#111133'; groundBot = '#000022';
            break;
        case 'hell':
            skyTop = '#220000'; skyBot = '#440000';
            groundTop = '#330000'; groundBot = '#1a0000';
            break;
        default: // day
            skyTop = '#1a6ea8'; skyBot = '#87ceeb';
            groundTop = '#228B22'; groundBot = '#196619';
    }
    const hw = canvas.height / 2;
    let grd = ctx.createLinearGradient(0, 0, 0, hw);
    grd.addColorStop(0, skyTop); grd.addColorStop(1, skyBot);
    ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, hw);

    grd = ctx.createLinearGradient(0, hw, 0, canvas.height);
    grd.addColorStop(0, groundTop); grd.addColorStop(1, groundBot);
    ctx.fillStyle = grd; ctx.fillRect(0, hw, canvas.width, canvas.height);

    // Draw ground grid
    if (bg === 'city') {
        ctx.strokeStyle = 'rgba(80,80,120,0.5)'; ctx.lineWidth = 1;
    } else if (bg === 'day') {
        ctx.strokeStyle = 'rgba(25,102,25,0.5)'; ctx.lineWidth = 1;
    } else {
        ctx.strokeStyle = 'rgba(100,0,0,0.4)'; ctx.lineWidth = 1;
    }
    for (let i = -30; i <= 30; i += 2) {
        const s1 = project3D(i, 0, -30), e1 = project3D(i, 0, 30);
        if (s1 && e1) { ctx.beginPath(); ctx.moveTo(s1.x, s1.y); ctx.lineTo(e1.x, e1.y); ctx.stroke(); }
        const s2 = project3D(-30, 0, i), e2 = project3D(30, 0, i);
        if (s2 && e2) { ctx.beginPath(); ctx.moveTo(s2.x, s2.y); ctx.lineTo(e2.x, e2.y); ctx.stroke(); }
    }
}

function drawCrosshair() {
    const cx = canvas.width/2, cy = canvas.height/2;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx-12,cy); ctx.lineTo(cx+12,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-12); ctx.lineTo(cx,cy+12); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2); ctx.stroke();
}

// ── SHARED PLAYER POSITION (used by both hub & combat renderer) ─────
const hub = {
    px: 0, pz: 5, angle: Math.PI,   // start facing south toward portal
    speed: 0.10,
    // NPC instances (runtime state)
    npcs: [],
};

// ── INPUT ───────────────────────────────────────────────────────────
const keys = {};
let ePressed = false;

document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    keys[e.key] = true;
    if ((e.key === 'e' || e.key === 'E') && !ePressed) {
        ePressed = true;
        onInteract();
    }
    if ((e.key === 'b' || e.key === 'B') && gameState === 'hub') {
        toggleShop();
    }
    if (gameState === 'combat' && !game.isPaused) {
        const num = e.key;
        if ('1234567890'.includes(num)) {
            const idx = num === '0' ? 9 : parseInt(num) - 1;
            usePower(idx);
        }
    }
});
document.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
    keys[e.key] = false;
    if (e.key === 'e' || e.key === 'E') ePressed = false;
});

// ── GAME STATE ──────────────────────────────────────────────────────
// 'menu' | 'hub' | 'missionSelect' | 'combat' | 'levelComplete' | 'gameOver'
let gameState = 'menu';
let save = null;

// Combat state
const game = {
    health: 100,
    isPaused: false,
    currentLevelId: null,
    enemies: [],
    projectiles: [],
    killCount: 0,
    xpGained: 0,
    coinsGained: 0,
    lastSpawn: 0,
    shieldActive: false, shieldEnd: 0,
    ssActive: false, ssEnd: 0,    // Super Saiyan buff
    powerCooldowns: new Map(),
    pendingXP: 0,
    pendingCoins: 0,
};

// Notifications queue
const notifications = [];
function pushNote(msg, color) {
    notifications.push({ msg, color: color||'#fff', born: Date.now(), life: 2500 });
}

// ── HUB LOGIC ───────────────────────────────────────────────────────
function initHub() {
    hub.npcs = NPCS_DATA.map(n => ({
        ...n,
        pathIdx: 0,
        progress: 0,
    }));
}

function updateNPCs(dt) {
    for (const npc of hub.npcs) {
        const path = npc.path;
        if (path.length < 2) continue;
        const target = path[npc.pathIdx];
        const dx = target.x - npc.x;
        const dz = target.z - npc.z;
        const dist = Math.sqrt(dx*dx + dz*dz);
        const step = 0.015 * dt;
        if (dist < 0.15) {
            npc.pathIdx = (npc.pathIdx + 1) % path.length;
        } else {
            npc.x += (dx / dist) * step;
            npc.z += (dz / dist) * step;
        }
    }
}

function checkBuildingCollision(nx, nz) {
    for (const b of CITY_BUILDINGS) {
        const pad = 1.0;
        if (nx > b.x - b.w/2 - pad && nx < b.x + b.w/2 + pad &&
            nz > b.z - b.d/2 - pad && nz < b.z + b.d/2 + pad) return true;
    }
    return false;
}

function getNearbyInteractable() {
    // Portal?
    const pdx = hub.px - PORTAL.x, pdz = hub.pz - PORTAL.z;
    if (Math.sqrt(pdx*pdx + pdz*pdz) < PORTAL.radius + 1.5) return { type:'portal' };
    // NPCs?
    for (const npc of hub.npcs) {
        const ndx = hub.px - npc.x, ndz = hub.pz - npc.z;
        if (Math.sqrt(ndx*ndx + ndz*ndz) < 2.8) return { type:'npc', npc };
    }
    return null;
}

function onInteract() {
    if (gameState === 'hub') {
        const near = getNearbyInteractable();
        if (!near) return;
        if (near.type === 'portal') { openMissionSelect(); return; }
        if (near.type === 'npc') {
            if (near.npc.isShop) { toggleShop(); return; }
            openDialogue(near.npc);
        }
    }
    if (gameState === 'hub' && document.getElementById('dialogue').style.display !== 'none') {
        closeDialogue();
    }
    if (gameState === 'missionSelect') closeMissionSelect();
}

function movePlayer(dt) {
    const spd = hub.speed * (save ? save.speedBoost : 1) * dt;
    const angle = hub.angle;
    // Forward direction = (sin(a), cos(a))
    let nx = hub.px, nz = hub.pz;
    if (keys['w'] || keys['arrowup'])    { nx += Math.sin(angle)*spd; nz += Math.cos(angle)*spd; }
    if (keys['s'] || keys['arrowdown'])  { nx -= Math.sin(angle)*spd; nz -= Math.cos(angle)*spd; }
    if (keys['a'])  { nx -= Math.cos(angle)*spd; nz += Math.sin(angle)*spd; }
    if (keys['d'])  { nx += Math.cos(angle)*spd; nz -= Math.sin(angle)*spd; }
    const BOUND = 26;
    nx = Math.max(-BOUND, Math.min(BOUND, nx));
    nz = Math.max(-BOUND, Math.min(BOUND, nz));
    if (!checkBuildingCollision(nx, hub.pz)) hub.px = nx;
    if (!checkBuildingCollision(hub.px, nz)) hub.pz = nz;
    if (keys['arrowleft'])  hub.angle -= 0.05 * dt;
    if (keys['arrowright']) hub.angle += 0.05 * dt;
}

// ── COMBAT LOGIC ────────────────────────────────────────────────────
function startLevel(levelId) {
    const lvlData = LEVELS.find(l => l.id === levelId);
    if (!lvlData) return;
    closeMissionSelect();
    gameState = 'combat';
    game.currentLevelId = levelId;
    game.health = save ? save.maxHealth : 100;
    game.enemies = [];
    game.projectiles = [];
    game.killCount = 0;
    game.xpGained = 0;
    game.coinsGained = 0;
    game.lastSpawn = Date.now() - 500;
    game.shieldActive = false;
    game.ssActive = false;
    game.powerCooldowns.clear();
    game.isPaused = false;
    // Reset player position for combat (same hub position)
    hub.px = 0; hub.pz = 0; hub.angle = Math.PI;
    showHUD();
    hidePowerBar(false);
    updatePowerBar();
    updateHUDStats();
    document.getElementById('combat-level-name').textContent = lvlData.name;
    document.getElementById('combat-level-name').style.display = 'block';
}

function spawnEnemy(lvlData) {
    const angle = Math.random() * Math.PI * 2;
    const dist  = 18 + Math.random() * 10;
    const dmgBoost = save ? save.damageBoost : 1;
    // Higher levels → brighter/bigger enemies
    const hue = lvlData.id < 4 ? '#cc2222'
              : lvlData.id < 7 ? '#cc5500'
              : '#aa0088';
    game.enemies.push({
        x: hub.px + Math.sin(angle) * dist,
        z: hub.pz + Math.cos(angle) * dist,
        health:    lvlData.hp,
        maxHealth: lvlData.hp,
        speed:     lvlData.spd,
        damage:    lvlData.dmg,
        color:     hue,
        level:     lvlData.id,
        stunEnd:   0,
    });
}

function usePower(idx) {
    if (!save || !save.unlockedPowers[idx]) return;
    const p   = ALL_POWERS[idx];
    const now = Date.now();
    const cd  = Math.round(p.cooldown * (save ? save.cooldownMult : 1));
    const lastUsed = game.powerCooldowns.get(idx) || 0;
    if (now - lastUsed < cd) return;
    game.powerCooldowns.set(idx, now);

    const dmg = Math.round(p.damage * (save ? save.damageBoost : 1) * (game.ssActive ? 2 : 1));

    if (p.type === 'heal') {
        game.health = Math.min(save.maxHealth, game.health - p.damage); // damage is negative
        pushNote('Senzu Bean!', '#00ff88');
    } else if (p.type === 'shield') {
        game.shieldActive = true;
        game.shieldEnd    = now + 5000;
        pushNote('Ki Shield activated!', '#8800ff');
    } else if (p.type === 'buff') {
        game.ssActive  = true;
        game.ssEnd     = now + 10000;
        pushNote('SUPER SAIYAN!', '#ffff00');
    } else if (p.type === 'aoe' || p.type === 'stun') {
        // Affect all nearby enemies
        for (const en of game.enemies) {
            const dx = en.x - hub.px, dz = en.z - hub.pz;
            if (Math.sqrt(dx*dx+dz*dz) < 12) {
                en.health -= dmg;
                if (p.type === 'stun') en.stunEnd = now + 2000;
            }
        }
        pushNote(p.type === 'stun' ? 'Solar Flare! Enemies stunned!' : 'Explosive Wave!', p.color);
    } else {
        // Projectile / beam
        game.projectiles.push({
            x:    hub.px,
            y:    1.0,
            z:    hub.pz,
            vx:   Math.sin(hub.angle) * 0.45,
            vz:   Math.cos(hub.angle) * 0.45,
            dmg,
            color: p.color,
            life:  220,
        });
    }
    updatePowerBar();
}

function updateCombat(dt) {
    const now = Date.now();
    const lvlData = LEVELS.find(l => l.id === game.currentLevelId);

    // Update shield / SS
    if (game.shieldActive && now > game.shieldEnd) game.shieldActive = false;
    if (game.ssActive     && now > game.ssEnd)     game.ssActive     = false;

    // Spawn enemies
    const alive   = game.enemies.length;
    const spawned = game.killCount + alive;
    if (alive < 6 && spawned < lvlData.enemies && now - game.lastSpawn > 1600) {
        spawnEnemy(lvlData);
        game.lastSpawn = now;
    }

    // Move enemies
    for (let i = game.enemies.length - 1; i >= 0; i--) {
        const en = game.enemies[i];
        if (en.health <= 0) {
            game.enemies.splice(i, 1);
            game.killCount++;
            const xpGain    = Math.round(lvlData.hp / 4);
            const coinGain  = Math.round(lvlData.hp / 10) + 2;
            game.xpGained  += xpGain;
            game.coinsGained += coinGain;
            save.xp    += xpGain;
            save.coins += coinGain;
            checkLevelUp();
            updateHUDStats();
            continue;
        }
        if (now < en.stunEnd) continue; // stunned
        const dx = hub.px - en.x, dz = hub.pz - en.z;
        const dist = Math.sqrt(dx*dx + dz*dz);
        if (dist > 0.1) {
            en.x += (dx/dist) * en.speed * dt;
            en.z += (dz/dist) * en.speed * dt;
        }
        if (dist < 1.6 && !game.shieldActive) {
            game.health -= en.damage * dt;
            if (game.health <= 0) { triggerGameOver(); return; }
            updateHUDStats();
        }
    }

    // Move projectiles
    for (let i = game.projectiles.length - 1; i >= 0; i--) {
        const pr = game.projectiles[i];
        pr.x += pr.vx * dt;
        pr.z += pr.vz * dt;
        pr.life -= dt;
        if (pr.life <= 0) { game.projectiles.splice(i,1); continue; }
        let hit = false;
        for (const en of game.enemies) {
            const dx = pr.x - en.x, dz = pr.z - en.z;
            if (Math.sqrt(dx*dx+dz*dz) < 1.2) {
                en.health -= pr.dmg;
                game.projectiles.splice(i,1);
                hit = true;
                break;
            }
        }
        if (hit) continue;
    }

    // Win condition
    if (game.killCount >= lvlData.enemies && game.enemies.length === 0) {
        completeLevelSuccess();
    }
}

function checkLevelUp() {
    const needed = XP_PER_LEVEL(save.charLevel);
    if (save.xp >= needed && save.charLevel < 50) {
        save.xp      -= needed;
        save.charLevel++;
        save.maxHealth = 100 + (save.charLevel - 1) * 10;
        save.damageBoost = +(1.0 + (save.charLevel - 1) * 0.05).toFixed(3);
        pushNote(`⬆ LEVEL UP! Now Lv.${save.charLevel}!`, '#ffd700');
    }
}

function completeLevelSuccess() {
    const lvlData = LEVELS.find(l => l.id === game.currentLevelId);
    if (!save.completedLevels.includes(game.currentLevelId))
        save.completedLevels.push(game.currentLevelId);
    // Per-kill XP/coins already added in updateCombat; add level completion bonus
    save.coins += lvlData.coins;
    save.xp    += lvlData.xp;
    checkLevelUp();
    // Unlock power
    const powerIdx = lvlData.power;
    const isNew = !save.unlockedPowers[powerIdx];
    save.unlockedPowers[powerIdx] = true;
    DB.save(save);
    setGameState('levelComplete', { lvlData, isNew, powerIdx });
}

function triggerGameOver() {
    game.health = 0;
    updateHUDStats();
    DB.save(save);
    setGameState('gameOver');
}

// ── STATE MACHINE ───────────────────────────────────────────────────
function setGameState(state, extra) {
    gameState = state;

    document.getElementById('menu-screen').style.display       = 'none';
    document.getElementById('mission-select').style.display    = 'none';
    document.getElementById('level-complete-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display  = 'none';
    document.getElementById('shop').style.display              = 'none';
    document.getElementById('dialogue').style.display          = 'none';
    document.getElementById('combat-level-name').style.display = 'none';
    document.getElementById('controls-hint').style.display     = 'none';
    game.isPaused = false;

    if (state === 'menu') {
        document.getElementById('menu-screen').style.display = 'flex';
        hideHUD();
    }
    if (state === 'hub') {
        showHUD();
        hidePowerBar(true);
        updateHUDStats();
        document.getElementById('controls-hint').style.display = 'block';
    }
    if (state === 'missionSelect') {
        game.isPaused = true;
        document.getElementById('mission-select').style.display = 'flex';
    }
    if (state === 'levelComplete') {
        const { lvlData, isNew, powerIdx } = extra;
        document.getElementById('lc-level-name').textContent = lvlData.name;
        document.getElementById('lc-xp').textContent         = lvlData.xp + game.xpGained;
        document.getElementById('lc-coins').textContent      = lvlData.coins + game.coinsGained;
        const pw = ALL_POWERS[powerIdx];
        document.getElementById('lc-power').textContent      = isNew ? `🔓 New Power: ${pw.name} (${pw.desc})` : `${pw.name} (already known)`;
        document.getElementById('lc-power').style.color      = isNew ? '#ffd700' : '#aaa';
        document.getElementById('lc-charlevel').textContent  = `Character Level: ${save.charLevel}`;
        document.getElementById('level-complete-screen').style.display = 'flex';
        game.isPaused = true;
    }
    if (state === 'gameOver') {
        document.getElementById('go-score').textContent = game.killCount * 10;
        document.getElementById('game-over-screen').style.display = 'flex';
        game.isPaused = true;
    }
    if (state === 'combat') {
        // handled by startLevel
    }
}

function openMissionSelect() {
    setGameState('missionSelect');
    renderMissionList();
}
function closeMissionSelect() {
    setGameState('hub');
}

function renderMissionList() {
    const cont = document.getElementById('missions-list');
    cont.innerHTML = '';
    for (const lvl of LEVELS) {
        const completed = save.completedLevels.includes(lvl.id);
        const available = lvl.id === 1 || save.completedLevels.includes(lvl.id - 1) || completed;
        const div = document.createElement('div');
        div.className = 'mission-item' + (completed?' completed':available?'':' locked');
        div.innerHTML = `
            <div class="mission-info">
                <span class="mission-name">${lvl.name}</span>
                <span class="mission-desc">${lvl.desc} (${lvl.enemies} enemies)</span>
                <span class="mission-power">Reward: Unlock <b>${ALL_POWERS[lvl.power].name}</b></span>
            </div>
            <div class="mission-status">
                ${completed ? '<span class="badge-done">✅ DONE</span>' : available ? '' : '<span class="badge-lock">🔒 LOCKED</span>'}
            </div>
            ${available ? `<button class="mission-start-btn" data-id="${lvl.id}">▶ Start</button>` : ''}
        `;
        cont.appendChild(div);
    }
    cont.querySelectorAll('.mission-start-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            startLevel(id);
        });
    });
}

function toggleShop() {
    if (gameState === 'hub' || gameState === 'missionSelect') {
        const sh = document.getElementById('shop');
        if (sh.style.display === 'none' || sh.style.display === '') {
            renderShop();
            sh.style.display = 'flex';
            game.isPaused = true;
        } else {
            sh.style.display = 'none';
            if (gameState === 'hub') game.isPaused = false;
        }
    }
}

function renderShop() {
    const cont = document.getElementById('shop-items');
    cont.innerHTML = '';
    for (const item of SHOP_ITEMS) {
        const canAfford = save.coins >= item.cost;
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong> — <span class="item-desc">${item.desc}</span>
            </div>
            <div>
                <span class="shop-cost">💰 ${item.cost}</span>
                <button ${canAfford?'':'disabled'} class="shop-buy-btn" data-id="${item.id}">Buy</button>
            </div>`;
        cont.appendChild(div);
    }
    cont.querySelectorAll('.shop-buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = SHOP_ITEMS.find(i => i.id === id);
            if (item && save.coins >= item.cost) {
                save.coins -= item.cost;
                item.effect(save);
                if (save.tempHeal) { save.tempHeal = false; game.health = save.maxHealth; updateHUDStats(); }
                DB.save(save);
                renderShop();
                updateHUDStats();
                pushNote(`Bought ${item.name}!`, '#ffd700');
            }
        });
    });
    document.getElementById('shop-coins').textContent = save.coins;
}

function openDialogue(npc) {
    const dl = document.getElementById('dialogue');
    document.getElementById('dialogue-name').textContent = npc.name;
    document.getElementById('dialogue-text').textContent = npc.dialogue;
    dl.style.display = 'flex';
    game.isPaused = true;
}
function closeDialogue() {
    document.getElementById('dialogue').style.display = 'none';
    if (gameState === 'hub') game.isPaused = false;
}

// ── UI HELPERS ───────────────────────────────────────────────────────
function showHUD() { document.getElementById('hud').style.display = 'block'; }
function hideHUD() { document.getElementById('hud').style.display = 'none';  }
function hidePowerBar(hidden) {
    document.getElementById('powers-bar').style.display = hidden ? 'none' : 'flex';
}

function updateHUDStats() {
    if (!save) return;
    const maxHp = save ? save.maxHealth : 100;
    const pct   = Math.max(0, game.health / maxHp * 100).toFixed(1);
    document.getElementById('h-hp').textContent      = Math.max(0, Math.floor(game.health));
    document.getElementById('h-maxhp').textContent   = maxHp;
    document.getElementById('h-hp-fill').style.width = pct + '%';

    const xpPct = (save.xp / XP_PER_LEVEL(save.charLevel) * 100).toFixed(1);
    document.getElementById('h-xp').textContent      = save.xp;
    document.getElementById('h-xpnext').textContent  = XP_PER_LEVEL(save.charLevel);
    document.getElementById('h-xp-fill').style.width = xpPct + '%';

    document.getElementById('h-level').textContent = save.charLevel;
    document.getElementById('h-coins').textContent = save.coins;
    document.getElementById('h-name').textContent  = save.playerName;
    if (game.ssActive) document.getElementById('hud').style.borderColor = '#ffff00';
    else              document.getElementById('hud').style.borderColor = 'transparent';
}

function updatePowerBar() {
    if (!save) return;
    const cont = document.getElementById('powers-bar');
    cont.innerHTML = '';
    const now = Date.now();
    ALL_POWERS.forEach((p, idx) => {
        const unlocked = save.unlockedPowers[idx];
        const cd = Math.round(p.cooldown * save.cooldownMult);
        const lastUsed = game.powerCooldowns.get(idx) || 0;
        const remaining = Math.max(0, cd - (now - lastUsed));
        const pct = remaining > 0 ? (remaining / cd * 100) : 0;

        const el = document.createElement('div');
        el.className = 'power-btn' + (unlocked ? '' : ' locked') + (remaining>0 ? ' on-cd':'');
        el.title = unlocked ? `${p.name}: ${p.desc}` : 'Complete a level to unlock';
        el.innerHTML = `
            <div class="pkey">${p.key}</div>
            <div class="pname">${unlocked ? p.name.split(' ')[0] : '🔒'}</div>
            ${remaining>0 ? `<div class="pcd">${(remaining/1000).toFixed(1)}s</div>
              <div class="pcd-bar" style="height:${pct}%"></div>` : ''}`;
        if (unlocked) {
            el.style.borderColor = p.color;
            el.style.boxShadow = `0 0 6px ${p.color}66`;
            el.addEventListener('click', () => usePower(idx));
        }
        cont.appendChild(el);
    });
}

function drawNotifications() {
    const now = Date.now();
    let y = canvas.height / 2 - 60;
    for (let i = notifications.length - 1; i >= 0; i--) {
        const n = notifications[i];
        const age  = now - n.born;
        if (age > n.life) { notifications.splice(i,1); continue; }
        const alpha = age < 300 ? age/300 : age > n.life-400 ? (n.life-age)/400 : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(n.msg, canvas.width/2, y);
        ctx.fillStyle = n.color;
        ctx.fillText(n.msg, canvas.width/2, y);
        ctx.restore();
        y -= 30;
    }
}

function drawInteractPrompt() {
    const near = getNearbyInteractable();
    if (!near || gameState !== 'hub') return;
    let label = near.type === 'portal' ? '[E] Enter Time Portal'
              : near.npc.isShop        ? '[E] Open Z-Store'
                                       : `[E] Talk to ${near.npc.name}`;
    ctx.save();
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(canvas.width/2 - tw/2 - 14, canvas.height * 0.72 - 20, tw + 28, 32);
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(canvas.width/2 - tw/2 - 14, canvas.height * 0.72 - 20, tw + 28, 32);
    ctx.fillStyle = '#00aaff';
    ctx.fillText(label, canvas.width/2, canvas.height * 0.72 + 8);
    ctx.restore();
}

function drawSSAura() {
    if (!game.ssActive) return;
    const t = Date.now()/1000;
    const grd = ctx.createRadialGradient(canvas.width/2, canvas.height*0.65, 20, canvas.width/2, canvas.height*0.65, 180);
    grd.addColorStop(0, `rgba(255,255,0,${0.3+0.2*Math.sin(t*8)})`);
    grd.addColorStop(1, 'rgba(255,255,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height*0.65, 180, 0, Math.PI*2);
    ctx.fill();
}

function drawShieldAura() {
    if (!game.shieldActive) return;
    const t = Date.now()/1000;
    ctx.strokeStyle = `rgba(136,0,255,${0.6+0.3*Math.sin(t*6)})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height*0.62, 120, 0, Math.PI*2);
    ctx.stroke();
}

function drawKillProgress(lvlData) {
    const done = game.killCount;
    const total = lvlData.enemies;
    const bar = 200;
    const x = canvas.width/2 - bar/2;
    const y = 70;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x - 2, y - 2, bar + 4, 20);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(x, y, bar, 16);
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(x, y, bar * Math.min(1, done/total), 16);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Enemies: ${done}/${total}`, canvas.width/2, y + 13);
}

// ── MAIN DRAW LOOP ──────────────────────────────────────────────────
let lastTime = 0;

function mainLoop(ts) {
    const dt = Math.min((ts - lastTime) / 16.7, 4); // ~1 at 60fps
    lastTime = ts;

    if (!game.isPaused && gameState === 'hub') {
        movePlayer(dt);
        updateNPCs(dt);
    }
    if (!game.isPaused && gameState === 'combat') {
        updateCombat(dt);
        updatePowerBar();
    }

    // ── RENDER ──
    const bg = gameState === 'combat'
        ? (LEVELS.find(l => l.id === game.currentLevelId) || {}).bg || 'day'
        : 'city';

    drawSkyGround(bg);

    if (gameState === 'hub' || gameState === 'missionSelect') {
        // Gather drawable objects, sort far→near
        const objs = [
            ...CITY_BUILDINGS.map(b => ({
                type:'building', data:b,
                dist: Math.sqrt((hub.px-b.x)**2 + (hub.pz-b.z)**2)
            })),
            ...hub.npcs.map(n => ({
                type:'npc', data:n,
                dist: Math.sqrt((hub.px-n.x)**2 + (hub.pz-n.z)**2)
            })),
            { type:'portal', dist: Math.sqrt((hub.px-PORTAL.x)**2 + (hub.pz-PORTAL.z)**2) },
        ];
        objs.sort((a,b) => b.dist - a.dist);
        for (const o of objs) {
            if (o.type === 'building') { drawBuilding(o.data); }
            else if (o.type === 'npc') {
                const pos = project3D(o.data.x, 0, o.data.z);
                if (pos) drawNPCSprite(o.data, pos);
            }
            else if (o.type === 'portal') drawPortal();
        }
        drawCrosshair();
        drawInteractPrompt();
    }

    if (gameState === 'combat') {
        const lvlData = LEVELS.find(l => l.id === game.currentLevelId);
        // Sort enemies + projectiles far→near
        const objs = [
            ...game.enemies.map(e => ({ type:'enemy', data:e, dist: Math.sqrt((hub.px-e.x)**2+(hub.pz-e.z)**2) })),
            ...game.projectiles.map(p => ({ type:'proj',  data:p, dist: Math.sqrt((hub.px-p.x)**2+(hub.pz-p.z)**2) })),
        ];
        objs.sort((a,b) => b.dist - a.dist);
        for (const o of objs) {
            if (o.type === 'enemy') {
                const pos = project3D(o.data.x, 0, o.data.z);
                if (pos) drawEnemySprite(o.data, pos);
            } else {
                const pos = project3D(o.data.x, o.data.y, o.data.z);
                if (pos) drawProjectileSprite(o.data, pos);
            }
        }
        drawSSAura();
        drawShieldAura();
        drawCrosshair();
        if (lvlData) drawKillProgress(lvlData);
    }

    drawNotifications();
    requestAnimationFrame(mainLoop);
}

// ── MENU INIT ───────────────────────────────────────────────────────
async function init() {
    await DB.open();
    const existing = await DB.load();
    const loadBtn  = document.getElementById('load-game-btn');
    if (existing) {
        loadBtn.disabled = false;
        document.getElementById('save-info').textContent =
            `Saved: ${existing.playerName} | Lv.${existing.charLevel} | ${existing.completedLevels.length}/10 quests`;
        document.getElementById('player-name-input').value = existing.playerName;
    }

    document.getElementById('new-game-btn').addEventListener('click', () => {
        const name = document.getElementById('player-name-input').value.trim() || 'Time Patroller';
        save = defaultSave(name);
        DB.save(save);
        afterLogin();
    });

    document.getElementById('load-game-btn').addEventListener('click', async () => {
        save = await DB.load();
        if (!save) { save = defaultSave('Time Patroller'); }
        afterLogin();
    });
}

function afterLogin() {
    initHub();
    setGameState('hub');
    game.health = save.maxHealth;
    updateHUDStats();
    updatePowerBar();
    pushNote(`Welcome, ${save.playerName}!`, '#ffd700');
}

// Wire up persistent UI buttons (outside game loop)
document.getElementById('close-missions-btn').addEventListener('click', closeMissionSelect);
document.getElementById('close-shop-btn').addEventListener('click', () => {
    document.getElementById('shop').style.display = 'none';
    if (gameState === 'hub') game.isPaused = false;
});
document.getElementById('dialogue-close-btn').addEventListener('click', closeDialogue);
document.getElementById('lc-continue-btn').addEventListener('click', () => {
    // Return to hub
    hub.px = 0; hub.pz = 5; hub.angle = Math.PI;
    setGameState('hub');
    updatePowerBar();
    updateHUDStats();
});
document.getElementById('respawn-btn').addEventListener('click', () => {
    hub.px = 0; hub.pz = 5; hub.angle = Math.PI;
    game.health = save ? save.maxHealth : 100;
    setGameState('hub');
    updatePowerBar();
    updateHUDStats();
    pushNote('Respawned in Conton City', '#00aaff');
});

// Start
init().then(() => requestAnimationFrame(mainLoop));
