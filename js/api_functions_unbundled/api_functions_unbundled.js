import * as osu from "osu-api-v2-js";

let socket = null;
let clientId = null;
let clientSecret = null;
let api = null;

const CrashReportDebug = document.getElementById('CrashReportDebug');
const CrashReason = document.getElementById('CrashReason');

export function initApiSocket(ws) {
  socket = ws;
  setupTosuConnectionHandlers();
}

function setupTosuConnectionHandlers() {
  if (socket.sockets?.['/websocket/v2']) {
    const originalOnOpen = socket.sockets['/websocket/v2'].onopen;
    socket.sockets['/websocket/v2'].onopen = function(event) {
      if (originalOnOpen) originalOnOpen.call(this, event);
      hideTosuWarning();
    };

    const originalOnClose = socket.sockets['/websocket/v2'].onclose;
    socket.sockets['/websocket/v2'].onclose = function(event) {
      showTosuWarning();
      if (originalOnClose) originalOnClose.call(this, event);
    };
  }
}

function showTosuWarning() {
  CrashReportDebug.classList.remove('crashpop');
  CrashReason.innerHTML = 
    `The tosu server socket is currently closed (or the program has crashed). Please relaunch tosu!<br><br>
    If this error still exists, please contact the overlay developer or tosu developer.`;
}

function hideTosuWarning() {
  if (!clientId || !clientSecret) {
    showCredentialsWarning();
  } else {
    CrashReportDebug.classList.add('crashpop');
  }
}

export async function setOsuCredentials(id, secret) {
  clientId = parseInt(id);
  clientSecret = secret;
  
  if (id && secret) {
    console.log('osu! API credentials set, initializing API...');
    try {
      api = await osu.API.createAsync(clientId, clientSecret, undefined, { verbose: "none" });
      console.log('osu! API initialized successfully');
      hideCredentialsWarning();
    } catch (error) {
      console.error('Failed to initialize osu! API:', error);
      showCredentialsWarning();
      api = null;
    }
  } else {
    console.log('osu! API credentials not set');
    api = null;
    showCredentialsWarning();
  }
}

function showCredentialsWarning() {
  CrashReportDebug.classList.remove('crashpop');
  CrashReason.innerHTML = 
    `To enable API features (user top scores, leaderboards):<br><br>
    Add your osu! OAuth Client ID and Secret in the overlay settings<br><br>
    Get your OAuth credentials at: <a href="https://osu.ppy.sh/home/account/edit" target="_blank" style="color: #a1c9ff;">https://osu.ppy.sh/home/account/edit</a>`;
}

function hideCredentialsWarning() {
  CrashReportDebug.classList.add('crashpop');
  CrashReason.innerHTML = '';
}

export async function getUserDataSet(username) {
  if (!api) {
    console.warn('osu! API not initialized');
    return null;
  }

  try {
    const data = await api.getUser(username, "osu");
    if (!data) return null;
    
    return {
      id: data.id,
      username: data.username,
      country_code: data.country_code,
      profile_colour: data.profile_colour,
      statistics: {
        global_rank: data.statistics?.global_rank || 0,
        country_rank: data.statistics?.country_rank || 0,
        pp: data.statistics?.pp || 0
      }
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserTop(userId) {
  if (!api) {
    console.warn('osu! API not initialized');
    return null;
  }

  try {
    const data = await api.getUserScores(userId, "best", "osu", { limit: 100 });
    if (!data || data.length === 0) return null;
    
    return data.map(score => ({
      beatmap_id: score.beatmap.id,
      pp: score.pp,
      mods_id: score.mods.map(mod => mod.acronym).join(''),
      rank: score.rank,
      ended_at: score.ended_at || score.created_at,
      legacy_score_id: score.legacy_score_id || score.id
    }));
  } catch (error) {
    console.error('Error fetching user top scores:', error);
    return null;
  }
}

export async function getMapDataSet(beatmapID) {
  if (!api || !beatmapID || beatmapID === 'undefined') {
    return null;
  }
  
  try {
    const data = await api.getBeatmap(beatmapID);
    if (!data) return null;
    
    return {
      id: data.id,
      beatmapset_id: data.beatmapset_id,
      difficulty_rating: data.difficulty_rating,
      version: data.version
    };
  } catch (error) {
    console.error('Error fetching beatmap:', error);
    return null;
  }
}

export async function getMapScores(beatmapID) {
  if (!api || !beatmapID || beatmapID === 'undefined' || beatmapID === 'null') {
    return null;
  }
  
  try {
    const data = await api.getBeatmapScores(beatmapID, "osu");
    if (!data || !data.scores || data.scores.length === 0) return null;

    return data.scores.map(score => {
      const { count_300, count_100, count_50, count_miss } = score.statistics;
      const totalHits = count_300 + count_100 + count_50 + count_miss;
      const accuracy = totalHits > 0 
        ? ((count_300 * 300 + count_100 * 100 + count_50 * 50) / (totalHits * 300)) * 100
        : 0;
      
      return {
        user_id: score.user_id,
        username: score.user?.username || 'Unknown',
        score: score.score,
        max_combo: score.max_combo,
        count_300,
        count_100,
        count_50,
        count_miss,
        rank: score.rank,
        pp: score.pp,
        mods: score.mods.map(mod => mod.acronym).join(''),
        acc: accuracy,
        created_at: score.created_at
      };
    });
  } catch (error) {
    console.error('Error fetching beatmap scores:', error);
    return null;
  }
}

export async function getModsScores(beatmapID, modsString) {
  if (!api || !beatmapID || beatmapID === 'undefined' || beatmapID === 'null') {
    return null;
  }
  
  try {
    const allScores = await getMapScores(beatmapID);
    if (!allScores) return null;

    const modsArray = [];
    if (modsString && modsString !== 'NM') {
      for (let i = 0; i < modsString.length; i += 2) {
        modsArray.push(modsString.substr(i, 2));
      }
    }

    if (modsArray.length === 0) {
      return allScores;
    }

    return allScores.filter(score => {
      const scoreMods = score.mods.match(/.{1,2}/g) || [];
      const requestedMods = modsArray.sort().join('');
      const scoreModsStr = scoreMods.sort().join('');
      return scoreModsStr === requestedMods;
    });
  } catch (error) {
    console.error('Error fetching scores with mods:', error);
    return null;
  }
}

export async function postUserID(id) {
  if (!api) {
    return {
      hsl1: [0.5277777777777778, 0],
      hsl2: [0.5277777777777778, 0]
    };
  }

  try {
    const userData = await getUserDataSet(id);
    if (!userData || !userData.profile_colour) {
      return {
        hsl1: [0.5277777777777778, 0],
        hsl2: [0.5277777777777778, 0]
      };
    }

    const hex = userData.profile_colour.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return {
      hsl1: [h, s],
      hsl2: [h, s * 0.8]
    };
  } catch (error) {
    console.error('Error getting user colors:', error);
    return {
      hsl1: [0.5277777777777778, 0],
      hsl2: [0.5277777777777778, 0]
    };
  }
}