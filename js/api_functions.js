function Z(t) {
  for (let n = 0; n < Object.entries(t).length; n++)
    (!String(Object.values(t)[n]).length || Object.values(t)[n] === void 0) && (delete t[Object.keys(t)[n]], n--);
  for (let n = 0; n < Object.entries(t).length; n++)
    Array.isArray(Object.values(t)[n]) && !Object.keys(t)[n].includes("[]") && (t[`${Object.keys(t)[n]}[]`] = Object.values(t)[n], delete t[Object.keys(t)[n]], n--);
  let s = {};
  for (let n = 0; n < Object.entries(t).length; n++) {
    const i = Object.values(t)[n];
    if (typeof i == "object" && !Array.isArray(i) && i !== null) {
      const e = Object.keys(t)[n];
      for (let r = 0; r < Object.entries(i).length; r++)
        s[`${e}[${Object.keys(i)[r]}]`] = Object.values(i)[r];
      delete t[Object.keys(t)[n]], n--;
    }
  }
  for (let n = 0; n < Object.entries(s).length; n++)
    t[Object.keys(s)[n]] = Object.values(s)[n];
  for (let n = 0; n < Object.entries(t).length; n++)
    Object.values(t)[n] instanceof Date && (t[Object.keys(t)[n]] = Object.values(t)[n].toISOString());
  return t;
}
function D(t, s) {
  const n = [
    "name",
    "username",
    "new_user_username",
    "source_user_username",
    "previousUsername",
    "previous_usernames",
    "display_name",
    "github_username",
    "osu_username",
    "short_name",
    "artist",
    "artist_unicode",
    "title",
    "title_unicode",
    "tags",
    "location",
    "interests",
    "occupation",
    "twitter",
    "discord",
    "category",
    "beatmap_version",
    "version",
    "display_version",
    "author",
    "raw",
    "bbcode",
    "message",
    "creator",
    "source"
  ];
  if (s && typeof t != "object")
    return String(t);
  if (typeof t == "boolean")
    return t;
  if (/^[+-[0-9][0-9]+-[0-9]{2}-[0-9]{2}($|[ T].*)/.test(t))
    return /[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(t) && (t += "Z"), /[0-9]{2}:[0-9]{2}:[0-9]{2}\+[0-9]{2}:[0-9]{2}$/.test(t) && (t = t.substring(0, t.indexOf("+")) + "Z"), new Date(t);
  if (Array.isArray(t))
    return t.map((i) => D(i, s));
  if (!isNaN(t) && t !== "")
    return t === null ? null : Number(t);
  if (typeof t == "object" && t !== null) {
    const i = Object.keys(t), e = Object.values(t);
    for (let r = 0; r < i.length; r++)
      t[i[r]] = D(e[r], n.some((o) => i[r] === o));
  }
  return t;
}
var y;
(function(t) {
  (function(a) {
    async function u() {
      return (await this.request("get", ["tags"])).tags;
    }
    a.getAll = u;
  })(t.UserTag || (t.UserTag = {})), (function(a) {
    async function u(d, _ = !1) {
      const h = typeof d == "string" ? d : d.tag;
      return await this.request("get", ["beatmaps", "packs", h], { legacy_only: Number(_) });
    }
    a.getOne = u;
    async function l(d = "standard", _) {
      return await this.request("get", ["beatmaps", "packs"], { type: d, cursor_string: _ });
    }
    a.getMultiple = l;
  })(t.Pack || (t.Pack = {})), (function(a) {
    async function u(c, g, p) {
      return c = typeof c == "number" ? c : c.id, (await this.request("post", ["beatmaps", c, "attributes"], { ruleset_id: p, mods: g })).attributes;
    }
    a.get = u;
    async function l(c, g) {
      return await this.getBeatmapDifficultyAttributes(c, g, w.osu);
    }
    a.getOsu = l;
    async function d(c, g) {
      return await this.getBeatmapDifficultyAttributes(c, g, w.taiko);
    }
    a.getTaiko = d;
    async function _(c, g) {
      return await this.getBeatmapDifficultyAttributes(c, g, w.fruits);
    }
    a.getFruits = _;
    async function h(c, g) {
      return await this.getBeatmapDifficultyAttributes(c, g, w.mania);
    }
    a.getMania = h;
  })(t.DifficultyAttributes || (t.DifficultyAttributes = {}));
  async function s(a, u, l) {
    const d = l?.ruleset !== void 0 ? w[l.ruleset] : void 0;
    return delete l?.ruleset, a = typeof a == "number" ? a : a.id, u = typeof u == "number" ? u : u.id, await this.request("get", ["beatmaps", a, "scores", "users", u], { ...l, mode: d });
  }
  t.getUserScore = s;
  async function n(a, u, l) {
    const d = l?.ruleset !== void 0 ? w[l.ruleset] : void 0;
    return delete l?.ruleset, a = typeof a == "number" ? a : a.id, u = typeof u == "number" ? u : u.id, (await this.request("get", ["beatmaps", a, "scores", "users", u, "all"], { ...l, ruleset: d })).scores;
  }
  t.getUserScores = n;
  async function i(a) {
    const u = a.id ? String(a.id) : void 0;
    return await this.request("get", ["beatmaps", "lookup"], { ...a, id: u });
  }
  t.lookup = i;
  async function e(a) {
    return a = typeof a == "number" ? a : a.id, await this.request("get", ["beatmaps", a]);
  }
  t.getOne = e;
  async function r(a) {
    const u = a.map((d) => typeof d == "number" ? d : d.id);
    return (await this.request("get", ["beatmaps"], { ids: u })).beatmaps;
  }
  t.getMultiple = r;
  async function o(a, u) {
    const l = u?.ruleset !== void 0 ? w[u.ruleset] : void 0;
    return delete u?.ruleset, a = typeof a == "number" ? a : a.id, (await this.request("get", ["beatmaps", a, "scores"], { ...u, mode: l })).scores;
  }
  t.getScores = o;
})(y || (y = {}));
var A;
(function(t) {
  (function(e) {
    e[e.Graveyard = -2] = "Graveyard", e[e.Wip = -1] = "Wip", e[e.Pending = 0] = "Pending", e[e.Ranked = 1] = "Ranked", e[e.Approved = 2] = "Approved", e[e.Qualified = 3] = "Qualified", e[e.Loved = 4] = "Loved";
  })(t.RankStatus || (t.RankStatus = {})), (function(e) {
    e[e.Any = 0] = "Any", e[e.Unspecified = 1] = "Unspecified", e[e["Video Game"] = 2] = "Video Game", e[e.Anime = 3] = "Anime", e[e.Rock = 4] = "Rock", e[e.Pop = 5] = "Pop", e[e.Other = 6] = "Other", e[e.Novelty = 7] = "Novelty", e[e["Hip Hop"] = 9] = "Hip Hop", e[e.Electronic = 10] = "Electronic", e[e.Metal = 11] = "Metal", e[e.Classical = 12] = "Classical", e[e.Folk = 13] = "Folk", e[e.Jazz = 14] = "Jazz";
  })(t.Genre || (t.Genre = {})), (function(e) {
    e[e.Any = 0] = "Any", e[e.Unspecified = 1] = "Unspecified", e[e.English = 2] = "English", e[e.Japanese = 3] = "Japanese", e[e.Chinese = 4] = "Chinese", e[e.Instrumental = 5] = "Instrumental", e[e.Korean = 6] = "Korean", e[e.French = 7] = "French", e[e.German = 8] = "German", e[e.Swedish = 9] = "Swedish", e[e.Spanish = 10] = "Spanish", e[e.Italian = 11] = "Italian", e[e.Russian = 12] = "Russian", e[e.Polish = 13] = "Polish", e[e.Other = 14] = "Other";
  })(t.Language || (t.Language = {})), (function(e) {
    async function r(o, a, u) {
      const l = typeof o?.beatmapset == "object" ? o.beatmapset.id : o?.beatmapset, d = typeof o?.user == "object" ? o.user.id : o?.user;
      return await this.request("get", ["beatmapsets", "events"], {
        beatmapset_id: l,
        user: d,
        min_date: o?.min_date?.toISOString(),
        max_date: o?.max_date?.toISOString(),
        types: a,
        ...u
      });
    }
    e.getMultiple = r;
  })(t.Event || (t.Event = {})), (function(e) {
    (function(o) {
      async function a(u, l, d) {
        const _ = typeof u?.discussion == "object" ? u.discussion.id : u?.discussion, h = typeof u?.user == "object" ? u.user.id : u?.user;
        return await this.request("get", ["beatmapsets", "discussions", "posts"], { beatmapset_discussion_id: _, types: l, user: h, ...d });
      }
      o.getMultiple = a;
    })(e.Post || (e.Post = {})), (function(o) {
      async function a(u, l, d) {
        const _ = typeof u?.discussion == "object" ? u.discussion.id : u?.discussion, h = typeof u?.vote_giver == "object" ? u.vote_giver.id : u?.vote_giver, c = typeof u?.vote_receiver == "object" ? u.vote_receiver.id : u?.vote_receiver;
        return await this.request("get", ["beatmapsets", "discussions", "votes"], { beatmapset_discussion_id: _, receiver: c, score: l, user: h, ...d });
      }
      o.getMultiple = a;
    })(e.Vote || (e.Vote = {}));
    async function r(o, a, u) {
      const l = typeof o?.beatmapset == "object" ? o.beatmapset.id : o?.beatmapset, d = typeof o?.user == "object" ? o.user.id : o?.user;
      return await this.request("get", ["beatmapsets", "discussions"], {
        beatmapset_id: l,
        beatmapset_status: o?.status,
        message_types: a?.types,
        only_unresolved: a?.only_unresolved,
        user: d,
        ...u
      });
    }
    e.getMultiple = r;
  })(t.Discussion || (t.Discussion = {}));
  async function s(e) {
    const r = e?.sort ? e.sort.by + "_" + e.sort.in : void 0, o = e?.general ? e.general.map((h) => {
      if (h === "Recommended difficulty")
        return "recommended";
      if (h === "Include converted beatmaps")
        return "converts";
      if (h === "Subscribed mappers")
        return "follows";
      if (h === "Spotlighted beatmaps")
        return "spotlights";
      if (h === "Featured Artists")
        return "featured_artists";
    }).join(".") : void 0, a = e?.categories ? e.categories === "My Maps" ? "mine" : e.categories.toLowerCase() : void 0, u = !e?.hide_explicit_content, l = e?.extra ? e.extra.map((h) => {
      if (h === "must_have_video")
        return "video";
      if (h === "must_have_storyboard")
        return "storyboard";
    }).join(".") : void 0, d = e?.rank_achieved ? e.rank_achieved.map((h) => h === "Silver SS" ? "XH" : h === "SS" ? "X" : h === "Silver S" ? "SH" : h).join("x") : void 0, _ = e?.played ? e.played.toLowerCase() : void 0;
    return await this.request("get", ["beatmapsets", "search"], { q: e?.keywords, sort: r, c: o, m: e?.mode, s: a, nsfw: u, g: e?.genre, l: e?.language, e: l, r: d, played: _, cursor_string: e?.cursor_string });
  }
  t.search = s;
  async function n(e) {
    const r = typeof e == "number" ? e : e.id;
    return await this.request("get", ["beatmapsets", "lookup"], { beatmap_id: r });
  }
  t.lookup = n;
  async function i(e) {
    return e = typeof e == "number" ? e : e.id, await this.request("get", ["beatmapsets", e]);
  }
  t.getOne = i;
})(A || (A = {}));
var T;
(function(t) {
  (function(s) {
    async function n(r, o = ["html", "markdown"]) {
      return await this.request("get", ["changelog", r], { key: typeof r == "number" ? "id" : void 0, message_formats: o });
    }
    s.lookup = n;
    async function i(r, o) {
      return await this.request("get", ["changelog", r, o]);
    }
    s.getOne = i;
    async function e(r, o, a = ["html", "markdown"]) {
      const u = o?.from, l = typeof o?.to == "string" ? o.to : void 0, d = typeof o?.to == "number" ? o.to : void 0;
      return (await this.request("get", ["changelog"], { from: u, to: l, max_id: d, stream: r, message_formats: a })).builds;
    }
    s.getMultiple = e;
  })(t.Build || (t.Build = {})), (function(s) {
    async function n() {
      return (await this.request("get", ["changelog"], { max_id: 0 })).streams;
    }
    s.getAll = n;
  })(t.UpdateStream || (t.UpdateStream = {}));
})(T || (T = {}));
var b;
(function(t) {
  (function(n) {
    async function i(d) {
      const _ = typeof d == "number" ? d : d.channel_id;
      return (await this.request("get", ["chat", "channels", _])).channel;
    }
    n.getOne = i;
    async function e() {
      return await this.request("get", ["chat", "channels"]);
    }
    n.getAll = e;
    async function r(d, _) {
      const h = typeof d == "number" ? d : d.channel_id, c = typeof _ == "number" ? _ : _.message_id;
      return await this.request("put", ["chat", "channels", h, "mark-as-read", c], { channel_id: h, message_id: c });
    }
    n.markAsRead = r;
    async function o(d) {
      const _ = typeof d == "number" ? d : d.id;
      return await this.request("post", ["chat", "channels"], { type: "PM", target_id: _ });
    }
    n.createPrivate = o;
    async function a(d, _, h) {
      const c = _.map((g) => typeof g == "number" ? g : g.id);
      return await this.request("post", ["chat", "channels"], { type: "ANNOUNCE", channel: d, target_ids: c, message: h });
    }
    n.createAnnouncement = a;
    async function u(d, _) {
      const h = typeof d == "number" ? d : d.channel_id, c = typeof _ == "number" ? _ : typeof _ == "object" ? _.id : this.user;
      return await this.request("put", ["chat", "channels", h, "users", c]);
    }
    n.joinOne = u;
    async function l(d, _) {
      const h = typeof d == "number" ? d : d.channel_id, c = typeof _ == "number" ? _ : typeof _ == "object" ? _.id : this.user;
      return await this.request("delete", ["chat", "channels", h, "users", c]);
    }
    n.leaveOne = l;
  })(t.Channel || (t.Channel = {})), (function(n) {
    async function i(o, a = 20, u, l) {
      const d = typeof o == "number" ? o : o.channel_id;
      return u = typeof u == "number" ? u : u?.message_id, l = typeof l == "number" ? l : l?.message_id, await this.request("get", ["chat", "channels", d, "messages"], { limit: a, since: u, until: l });
    }
    n.getMultiple = i;
    async function e(o, a, u = !1) {
      const l = typeof o == "number" ? o : o.channel_id;
      return await this.request("post", ["chat", "channels", l, "messages"], { message: a, is_action: u });
    }
    n.send = e;
    async function r(o, a, u = !1, l) {
      const d = typeof o == "number" ? o : o.id;
      return await this.request("post", ["chat", "new"], { target_id: d, message: a, is_action: u, uuid: l });
    }
    n.sendPrivate = r;
  })(t.Message || (t.Message = {})), (function(n) {
    (function(r) {
      r.chatStart = JSON.stringify({ event: "chat.start" }), r.chatEnd = JSON.stringify({ event: "chat.end" });
    })(n.Command || (n.Command = {}));
    function i() {
      return { ...this.headers, Authorization: `${this.token_type} ${this.access_token}` };
    }
    n.getHeaders = i;
    function e(r, o = "wss://notify.ppy.sh") {
      return new WebSocket(o, { headers: r ?? this.getChatWebsocketHeaders() });
    }
    n.generate = e;
  })(t.Websocket || (t.Websocket = {}));
  async function s(n) {
    const i = typeof n?.user_silence == "object" ? n.user_silence.id : n?.user_silence, e = typeof n?.message == "object" ? n.message.message_id : n?.message;
    return (await this.request("post", ["chat", "ack"], { history_since: i, since: e })).silences;
  }
  t.keepAlive = s;
})(b || (b = {}));
function Q(t) {
  const s = t.commentable_meta.filter((n) => n.id);
  return t.deleted_commentable_meta = t.commentable_meta.length - s.length, t.commentable_meta = s, t;
}
var C;
(function(t) {
  async function s(i) {
    const e = typeof i == "number" ? i : i.id;
    return Q(await this.request("get", ["comments", e]));
  }
  t.getOne = s;
  async function n(i, e, r) {
    const o = typeof r?.after == "object" ? r.after.id : r?.after, a = typeof e == "number" ? e : e?.id;
    return Q(await this.request("get", ["comments"], {
      after: o,
      commentable_type: i?.type,
      commentable_id: i?.id,
      cursor: r?.cursor,
      parent_id: a,
      sort: r?.type
    }));
  }
  t.getMultiple = n;
})(C || (C = {}));
var N;
(function(t) {
  async function s(n) {
    return await this.request("get", ["events"], { sort: n?.sort ?? "id_desc", cursor_string: n?.cursor_string });
  }
  t.getMultiple = s;
})(N || (N = {}));
var O;
(function(t) {
  (function(i) {
    async function e(r, o) {
      const a = typeof r == "number" ? r : r.id;
      return await this.request("put", ["forums", "posts", a], { body: o });
    }
    i.edit = e;
  })(t.Post || (t.Post = {})), (function(i) {
    async function e(l, d) {
      const _ = typeof l == "number" ? l : l.id, h = d?.sort !== "id_desc" ? typeof d?.first_post == "object" ? d.first_post.id : d?.first_post : void 0, c = d?.sort === "id_desc" ? typeof d.first_post == "object" ? d.first_post.id : d.first_post : void 0;
      return await this.request("get", ["forums", "topics", _], { ...d, start: h, end: c });
    }
    i.getOne = e;
    async function r(l) {
      const d = l?.sort === "id_asc" ? "old" : l?.sort === "id_desc" ? "new" : void 0, _ = typeof l?.forum == "object" ? l.forum.id : l?.forum;
      return await this.request("get", ["forums", "topics"], { limit: l?.limit, cursor_string: l?.cursor_string, sort: d, forum_id: _ });
    }
    i.getMultiple = r;
    async function o(l, d, _, h) {
      const c = typeof l == "number" ? l : l.id, g = h !== void 0, p = h?.options !== void 0 ? h.options.toString().replace(/,/g, `
`) : void 0;
      return await this.request("post", ["forums", "topics"], { forum_id: c, title: d, body: _, with_poll: g, forum_topic_poll: h ? {
        title: h.title,
        options: p,
        length_days: h.length_days,
        max_options: h.max_options || 1,
        vote_change: h.vote_change || !1,
        hide_results: h.hide_results || !1
      } : void 0 });
    }
    i.create = o;
    async function a(l, d) {
      const _ = typeof l == "number" ? l : l.id;
      return await this.request("post", ["forums", "topics", _, "reply"], { body: d });
    }
    i.reply = a;
    async function u(l, d) {
      const _ = typeof l == "number" ? l : l.id;
      return await this.request("put", ["forums", "topics", _], { forum_topic: { topic_title: d } });
    }
    i.editTitle = u;
  })(t.Topic || (t.Topic = {}));
  async function s(i) {
    const e = typeof i == "number" ? i : i.id;
    return await this.request("get", ["forums", e]);
  }
  t.getOne = s;
  async function n() {
    return (await this.request("get", ["forums"])).forums;
  }
  t.getMultiple = n;
})(O || (O = {}));
var B;
(function(t) {
  (function(s) {
    async function n(e, r = 1) {
      return (await this.request("get", ["search"], { mode: "user", query: e, page: r })).user;
    }
    s.getUsers = n;
    async function i(e, r = 1) {
      return (await this.request("get", ["search"], { mode: "wiki_page", query: e, page: r })).wiki_page;
    }
    s.getWikiPages = i;
  })(t.Search || (t.Search = {}));
})(B || (B = {}));
var R;
(function(t) {
  async function s(i, e) {
    const r = typeof i == "number" ? i : i.id, o = typeof e?.before == "object" ? e.before.id : e?.before, a = typeof e?.after == "object" ? e.after.id : e?.after;
    return await this.request("get", ["matches", r], { before: o, after: a, limit: e?.limit });
  }
  t.getOne = s;
  async function n(i) {
    const e = typeof i?.first_match_in_array == "object" ? i?.first_match_in_array.id : i?.first_match_in_array, r = e ? { match_id: e + (i?.sort === "id_asc" ? -1 : 1) } : void 0;
    return (await this.request("get", ["matches"], { cursor: r, limit: i?.limit, sort: i?.sort })).matches;
  }
  t.getMultiple = n;
})(R || (R = {}));
var I;
(function(t) {
  (function(n) {
    async function i(e, r = 1) {
      return await this.request("get", ["rankings", w[e], "country"], { page: r });
    }
    n.getRanking = i;
  })(t.Country || (t.Country = {}));
  async function s() {
    return await this.request("get", ["seasonal-backgrounds"]);
  }
  t.getSeasonalBackgrounds = s;
})(I || (I = {}));
var M;
(function(t) {
  (function(s) {
    (function(e) {
      async function r(o, a) {
        const u = a?.limit ?? 50, l = a?.sort === "id_asc" ? "score_asc" : "score_desc";
        return await this.request("get", ["rooms", o.room_id, "playlist", o.id, "scores"], { limit: u, sort: l, cursor_string: a?.cursor_string });
      }
      e.getScores = r;
    })(s.PlaylistItem || (s.PlaylistItem = {})), (function(e) {
      async function r(o) {
        const a = typeof o == "number" ? o : o.id;
        return await this.request("get", ["rooms", a, "leaderboard"]);
      }
      e.getMultiple = r;
    })(s.Leader || (s.Leader = {})), (function(e) {
      async function r(o) {
        const a = typeof o == "number" ? o : o.id;
        return await this.request("get", ["rooms", a, "events"]);
      }
      e.getAll = r;
    })(s.Event || (s.Event = {}));
    async function n(e) {
      const r = typeof e == "number" ? e : e.id;
      return await this.request("get", ["rooms", r]);
    }
    s.getOne = n;
    async function i(e, r, o = 10, a = "created", u) {
      return await this.request("get", ["rooms"], { type_group: e, mode: r, limit: o, sort: a, season_id: u });
    }
    s.getMultiple = i;
  })(t.Room || (t.Room = {}));
})(M || (M = {}));
var x;
(function(t) {
  async function s(i) {
    const e = typeof i == "object" ? i.id : i, r = typeof i == "number" ? "id" : void 0;
    return await this.request("get", ["news", e], { key: r });
  }
  t.getOne = s;
  async function n(i) {
    return (await this.request("get", ["news"], { year: i, limit: 0 })).news_sidebar.news_posts;
  }
  t.getMultiple = n;
})(x || (x = {}));
var q;
(function(t) {
  async function s(e) {
    const r = typeof e == "object" ? e.id : e;
    return await this.request("get", ["scores", r]);
  }
  t.getOne = s;
  async function n(e) {
    return await this.request("get", ["scores"], { ...e });
  }
  t.getSome = n;
  async function i(e) {
    const r = typeof e == "number" ? e : e.id;
    return await this.request("get", ["scores", r, "download"]);
  }
  t.getReplay = i;
})(q || (q = {}));
var U;
(function(t) {
  async function s(i, e, r = "all") {
    return e = typeof e == "number" ? e : e.id, await this.request("get", ["rankings", w[i], "charts"], { spotlight: e, filter: r });
  }
  t.getRanking = s;
  async function n() {
    return (await this.request("get", ["spotlights"])).spotlights;
  }
  t.getAll = n;
})(U || (U = {}));
var m;
(function(t) {
  (function(c) {
    async function g(f, k) {
      const S = typeof f == "number" ? f : f.id;
      return await this.request("get", ["users", S, "kudosu"], { ...k });
    }
    c.getHistory = g;
    async function p() {
      return (await this.request("get", ["rankings", "kudosu"])).ranking;
    }
    c.getRanking = p;
  })(t.Kudosu || (t.Kudosu = {}));
  async function s(c, g, p) {
    return await this.request("get", ["rankings", w[c], g], { ...p });
  }
  t.getRanking = s;
  async function n(c) {
    return await this.request("get", ["me"], { mode: c });
  }
  t.getResourceOwner = n;
  async function i(c, g) {
    const p = g !== void 0 ? w[g] : "";
    return typeof c == "string" && (c = "@" + c), typeof c == "object" && (c = c.id), await this.request("get", ["users", c, p]);
  }
  t.getOne = i;
  async function e(c) {
    const g = c.map((f) => typeof f == "number" ? f : f.id);
    return (await this.request("get", ["users", "lookup"], { ids: g })).users;
  }
  t.lookupMultiple = e;
  async function r(c, g = !1) {
    const p = c.map((k) => typeof k == "number" ? k : k.id);
    return (await this.request("get", ["users"], { ids: p, include_variant_statistics: g })).users;
  }
  t.getMultiple = r;
  async function o(c, g, p, f, k) {
    const S = typeof c == "number" ? c : c.id, V = p !== void 0 ? w[p] : void 0, P = f?.lazer !== void 0 ? +!f.lazer : void 0, X = f?.fails !== void 0 ? String(Number(f.fails)) : void 0;
    return await this.request("get", ["users", S, "scores", g], { mode: V, ...k, legacy_only: P, include_fails: X });
  }
  t.getScores = o;
  async function a(c, g, p) {
    const f = typeof c == "number" ? c : c.id;
    return await this.request("get", ["users", f, "beatmapsets", g], { ...p });
  }
  t.getBeatmaps = a;
  async function u(c, g, p) {
    const f = typeof c == "number" ? c : c.id, k = g.map((P) => typeof P == "number" ? P : P.id), S = p?.ruleset;
    return delete p?.ruleset, (await this.request("get", ["users", f, "beatmaps-passed"], { beatmapset_ids: k, ruleset_id: S, ...p })).beatmaps_passed;
  }
  t.getPassedBeatmaps = u;
  async function l(c, g) {
    const p = typeof c == "number" ? c : c.id;
    return await this.request("get", ["users", p, "beatmapsets", "most_played"], { ...g });
  }
  t.getMostPlayed = l;
  async function d(c, g) {
    const p = typeof c == "number" ? c : c.id;
    return await this.request("get", ["users", p, "recent_activity"], { ...g });
  }
  t.getRecentActivity = d;
  async function _() {
    return await this.request("get", ["friends"]);
  }
  t.getFriends = _;
  async function h() {
    return (await this.request("get", ["me", "beatmapset-favourites"])).beatmapset_ids;
  }
  t.getFavouriteBeatmapsetsIds = h;
})(m || (m = {}));
var H;
(function(t) {
  async function s(n, i = "en") {
    return await this.request("get", ["wiki", i, n]);
  }
  t.getOne = s;
})(H || (H = {}));
var w;
(function(t) {
  t[t.osu = 0] = "osu", t[t.taiko = 1] = "taiko", t[t.fruits = 2] = "fruits", t[t.mania = 3] = "mania";
})(w || (w = {}));
class F {
  message;
  server;
  method;
  endpoint;
  parameters;
  status_code;
  original_error;
  /**
   * @param message The reason why things didn't go as expected
   * @param server The server to which the request was sent
   * @param method The method used for this request (like "get", "post", etc...)
   * @param endpoint The type of resource that was requested from the server
   * @param parameters The filters that were used to specify what resource was wanted
   * @param status_code The status code that was returned by the server, if there is one
   * @param original_error The error that caused the api to throw an {@link APIError} in the first place, if there is one
   */
  constructor(s, n, i, e, r, o, a) {
    this.message = s, this.server = n, this.method = i, this.endpoint = e, this.parameters = r, this.status_code = o, this.original_error = a;
  }
}
class E {
  // CLIENT CREATION
  /**
   * **Please use {@link API.createAsync} instead of the default constructor** if you don't have at least an {@link API.access_token}!
   * An API object without an `access_token` is pretty much useless!
   */
  constructor(s) {
    Object.keys(s).forEach((n) => s[n] === void 0 ? delete s[n] : {}), Object.assign(this, s);
  }
  /**
   * The normal way to create an API instance! Make sure to `await` it
   * @param client_id The ID of your client, which you can get on https://osu.ppy.sh/home/account/edit#oauth
   * @param client_secret The Secret of your client, which you can get or reset on https://osu.ppy.sh/home/account/edit#oauth
   * @param user If the instance is supposed to represent a user, use their Authorization Code and the Application Callback URL of your application!
   * @param settings Additional settings you'd like to specify now rather than later, check out the Accessors at https://osu-v2.taevas.xyz/classes/API.html
   * @returns A promise with an API instance
   */
  static async createAsync(s, n, i, e) {
    const r = new E({
      client_id: s,
      client_secret: n,
      ...e
    });
    return i ? await r.getAndSetToken({ client_id: s, client_secret: n, grant_type: "authorization_code", ...i }, r) : await r.getAndSetToken({ client_id: s, client_secret: n, grant_type: "client_credentials", scope: "public" }, r);
  }
  // CLIENT INFO
  _client_id = 0;
  /** The ID of your client, which you can get on https://osu.ppy.sh/home/account/edit#oauth */
  get client_id() {
    return this._client_id;
  }
  set client_id(s) {
    this._client_id = s;
  }
  _client_secret = "";
  /** The Secret of your client, which you can get or reset on https://osu.ppy.sh/home/account/edit#oauth */
  get client_secret() {
    return this._client_secret;
  }
  set client_secret(s) {
    this._client_secret = s;
  }
  _server = "https://osu.ppy.sh";
  /** The base url of the server where the requests should land (defaults to **https://osu.ppy.sh**) */
  get server() {
    return this._server;
  }
  set server(s) {
    this._server = s;
  }
  _route_api = ["api", "v2"];
  /** Used by practically every method to interact with the {@link API.server} (defaults to **[api, v2]**) */
  get route_api() {
    return this._route_api;
  }
  set route_api(s) {
    this._route_api = s;
  }
  _route_token = ["oauth", "token"];
  /** Used for getting an {@link API.access_token} and using your {@link API.refresh_token} (defaults to **[oauth, token]**) */
  get route_token() {
    return this._route_token;
  }
  set route_token(s) {
    this._route_token = s;
  }
  _scopes = [];
  /** The {@link Scope}s your application has, assuming it acts as a user */
  get scopes() {
    return this._scopes;
  }
  set scopes(s) {
    this._scopes = s;
  }
  _headers = {
    Accept: "application/json",
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
    "User-Agent": "osu-api-v2-js (https://github.com/TTTaevas/osu-api-v2-js)",
    "x-api-version": "20250530"
  };
  /** Used in practically all requests, those are all the headers the package uses excluding `Authorization`, the one with the token */
  get headers() {
    return this._headers;
  }
  set headers(s) {
    this._headers = s;
  }
  _user;
  /** The osu! user id of the user who went through the Authorization Code Grant */
  get user() {
    return this._user;
  }
  set user(s) {
    this._user = s;
  }
  // CLIENT CONFIGURATION
  _verbose = "none";
  /** Which events should be logged (defaults to **none**) */
  get verbose() {
    return this._verbose;
  }
  set verbose(s) {
    this._verbose = s;
  }
  _timeout = 20;
  /**
   * The maximum **amount of seconds** requests should take before returning an answer (defaults to **20**)
   * @remarks 0 means no maximum, no timeout
   */
  get timeout() {
    return this._timeout;
  }
  set timeout(s) {
    this._timeout = s;
  }
  _retry_delay = 2;
  /** In seconds, how long should it wait after a request failed before retrying? (defaults to **2**) */
  get retry_delay() {
    return this._retry_delay;
  }
  set retry_delay(s) {
    this._retry_delay = s;
  }
  _retry_maximum_amount = 4;
  /**
   * How many retries maximum before throwing an {@link APIError} (defaults to **4**)
   * @remarks Pro tip: Set that to 0 to **completely** disable retries!
   */
  get retry_maximum_amount() {
    return this._retry_maximum_amount;
  }
  set retry_maximum_amount(s) {
    this._retry_maximum_amount = s;
  }
  _retry_on_automatic_token_refresh = !0;
  /** Should it retry a request upon successfully refreshing the token due to {@link API.refresh_token_on_401} being `true`? (defaults to **true**) */
  get retry_on_automatic_token_refresh() {
    return this._retry_on_automatic_token_refresh;
  }
  set retry_on_automatic_token_refresh(s) {
    this._retry_on_automatic_token_refresh = s;
  }
  _retry_on_status_codes = [429];
  /** Upon failing a request and receiving a response, because of which received status code should the request be retried? (defaults to **[429]**) */
  get retry_on_status_codes() {
    return this._retry_on_status_codes;
  }
  set retry_on_status_codes(s) {
    this._retry_on_status_codes = s;
  }
  _retry_on_timeout = !1;
  /** Should it retry a request if that request failed because it has been aborted by the {@link API.timeout}? (defaults to **false**) */
  get retry_on_timeout() {
    return this._retry_on_timeout;
  }
  set retry_on_timeout(s) {
    this._retry_on_timeout = s;
  }
  // ACCESS TOKEN STUFF
  _access_token = "";
  /** The key that allows you to talk with the API */
  get access_token() {
    return this._access_token;
  }
  set access_token(s) {
    this._access_token = s;
  }
  _token_type = "Bearer";
  /** Should always be "Bearer" */
  get token_type() {
    return this._token_type;
  }
  set token_type(s) {
    this._token_type = s;
  }
  _expires = new Date((/* @__PURE__ */ new Date()).getTime() + 1440 * 60 * 1e3);
  // 24 hours default, is set through getAndSetToken anyway
  /** The expiration date of your access_token */
  get expires() {
    return this._expires;
  }
  set expires(s) {
    this._expires = s, this.updateRefreshTokenTimer();
  }
  async getAndSetToken(s, n) {
    const i = await fetch(`${this.server}/${this.route_token.join("/")}`, {
      method: "post",
      headers: this.headers,
      body: JSON.stringify(s),
      signal: this.timeout > 0 ? AbortSignal.timeout(this.timeout * 1e3) : void 0
    }).catch((u) => {
      throw new F("Failed to fetch a token", this.server, "post", this.route_token, s, void 0, u);
    }), e = await i.json();
    if (!e.access_token)
      throw this.log(!0, "Unable to obtain a token! Here's what was received from the API:", e), new F("No token obtained", this.server, "post", this.route_token, s, i.status);
    n.token_type = e.token_type, e.refresh_token && (n.refresh_token = e.refresh_token);
    const r = e.access_token;
    n.access_token = r;
    const o = JSON.parse(Buffer.from(r.substring(r.indexOf(".") + 1, r.lastIndexOf(".")), "base64").toString("ascii"));
    n.scopes = o.scopes, o.sub && o.sub.length && (n.user = Number(o.sub));
    const a = /* @__PURE__ */ new Date();
    return a.setSeconds(a.getSeconds() + e.expires_in), n.expires = a, n;
  }
  /**
   * Revoke your current token! **This will revoke the {@link API.refresh_token} as well if it exists**, so use this with care
   * @remarks Uses {@link API.route_api} instead of {@link API.route_token}, as normally expected by the server
   */
  async revokeToken() {
    return await this.request("delete", ["oauth", "tokens", "current"]);
  }
  // REFRESH TOKEN STUFF
  /** In other words, are we currently busy getting a new {@link API.access_token}? */
  is_refreshing_token = !1;
  _refresh_token;
  /**
   * Valid for an unknown amount of time, it allows you to get a new token without going through the Authorization Code Grant again!
   * Use {@link API.refreshToken} to make use of this token
   * @remarks There is no refresh_token if the Authorization Code Grant hasn't been done, it would be pointless to have one in that case
   */
  get refresh_token() {
    return this._refresh_token;
  }
  set refresh_token(s) {
    this._refresh_token = s, this.updateRefreshTokenTimer();
  }
  _refresh_token_on_401 = !0;
  /** If true, upon failing a request due to a 401, it will call {@link API.refreshToken} (defaults to **true**) */
  get refresh_token_on_401() {
    return this._refresh_token_on_401;
  }
  set refresh_token_on_401(s) {
    this._refresh_token_on_401 = s;
  }
  _refresh_token_on_expires = !1;
  /**
   * If true, the application will silently call {@link API.refreshToken} when the{@link API.access_token} is set to expire,
   * as determined by {@link API.expires} (defaults to **false**)
   */
  get refresh_token_on_expires() {
    return this._refresh_token_on_expires;
  }
  set refresh_token_on_expires(s) {
    this._refresh_token_on_expires = s, this.updateRefreshTokenTimer();
  }
  _refresh_token_timer;
  get refresh_token_timer() {
    return this._refresh_token_timer;
  }
  set refresh_token_timer(s) {
    this._refresh_token_timer && clearTimeout(this._refresh_token_timer), this._refresh_token_timer = s, this._refresh_token_timer.unref();
  }
  /** Add, remove, change the timeout used for refreshing the token automatically whenever certain properties change */
  updateRefreshTokenTimer() {
    if (this.expires && this.refresh_token_on_expires) {
      const s = /* @__PURE__ */ new Date(), n = this.expires.getTime() - s.getTime();
      if (n <= 0)
        return;
      this.refresh_token_timer = setTimeout(() => {
        try {
          this.refreshToken();
        } catch {
        }
      }, n);
    } else this._refresh_token_timer && clearTimeout(this._refresh_token_timer);
  }
  /**
   * - Uses the {@link API.refresh_token}, {@link API.client_id}, and {@link API.client_secret}
   * to set a new {@link API.access_token} and {@link API.refresh_token}
   * - Or uses the {@link API.client_id} and {@link API.client_secret} to set a new {@link API.access_token}
   * @returns Whether or not the token has been refreshed
   */
  async refreshToken() {
    const s = this.access_token;
    this.is_refreshing_token = !0;
    try {
      this.refresh_token ? await this.getAndSetToken({
        client_id: this.client_id,
        client_secret: this.client_secret,
        grant_type: "refresh_token",
        refresh_token: this.refresh_token
      }, this) : await this.getAndSetToken({
        client_id: this.client_id,
        client_secret: this.client_secret,
        grant_type: "client_credentials",
        scope: "public"
      }, this), s !== this.access_token && this.log(!1, "The token has been refreshed!");
    } catch (n) {
      this.log(!0, "Failed to refresh the token :(", n);
    } finally {
      this.is_refreshing_token = !1;
    }
    return s !== this.access_token;
  }
  // OTHER METHODS
  /**
   * Use this instead of `console.log` to log any information
   * @param is_error Is the logging happening because of an error?
   * @param to_log Whatever you would put between the parentheses of `console.log()`
   */
  log(s, ...n) {
    (this.verbose === "all" || this.verbose === "errors" && s === !0) && console.log("osu!api v2 ->", ...n);
  }
  /**
   * You can use this to specify additional settings for the method you're going to call, such as `headers`, an `AbortSignal`, and more advanced things!
   * @example
   * ```ts
   * const controller = new AbortController() // this controller can be used to abort any request that uses its signal!
   * const user = await api.withSettings({signal: controller.signal}).getUser(7276846)
   * ```
   * @param additional_fetch_settings You may get more info at https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#instance_properties
   * @returns A special version of the `API` that changes how requests are done
   */
  withSettings(s) {
    return new Y(this, s);
  }
  /**
   * The function that directly communicates with the API! Almost every functions of the API object uses this function!
   * @param method The type of request, each endpoint uses a specific one (if it uses multiple, the intent and parameters become different)
   * @param endpoint What comes in the URL after `api/`, **DO NOT USE TEMPLATE LITERALS (\`) OR THE ADDITION OPERATOR (+), put everything separately for type safety**
   * @param parameters The things to specify in the request, such as the beatmap_id when looking for a beatmap
   * @param settings Additional settings **to add** to the current settings of the `fetch()` request
   * @param info Context given by a prior request
   * @returns A Promise with the API's response
   */
  async request(s, n, i = {}, e, r = { number_try: 1, just_refreshed: !1 }) {
    let o = !1, a, u, l = "no error message available";
    const d = [];
    e?.signal && d.push(e.signal), this.timeout > 0 && d.push(AbortSignal.timeout(this.timeout * 1e3));
    const _ = this.route_api.length ? "/" : "";
    let h = `${this.server}/${this.route_api.join("/")}${_}${n.join("/")}`;
    if (s === "get" && i) {
      const f = Z(i);
      h += "?" + Object.entries(f).map((k) => Array.isArray(k[1]) ? k[1].map((S) => `${k[0]}=${S}`).join("&") : `${k[0]}=${k[1]}`).join("&");
    }
    const c = await fetch(h, {
      method: s,
      ...e,
      // has priority over what's above, but not over what's lower
      headers: {
        Authorization: `${this.token_type} ${this.access_token}`,
        ...this.headers,
        ...e?.headers
        // written that way, custom headers with (for example) only a user-agent would only overwrite the default user-agent
      },
      body: s !== "get" ? JSON.stringify(i) : void 0,
      // parameters are here if request is NOT GET
      signal: AbortSignal.any(d)
    }).catch((f) => {
      f.name === "TimeoutError" && this.retry_on_timeout && (o = !0), this.log(!0, f.message), a = f, l = `${f.name} (${f.message ?? f.errno ?? f.type})`;
    });
    if (!c || !c.ok) {
      if (c && (u = c.status, l = c.statusText, this.retry_on_status_codes.includes(c.status) && (o = !0), c.status === 401 ? this.refresh_token_on_401 && !r.just_refreshed ? this.is_refreshing_token ? (this.log(!0, "Server responded with status code 401, your token is currently being refreshed because of another 401 response!"), this.retry_on_automatic_token_refresh && (await new Promise((f) => setTimeout(f, 2e3)), o = !0, r.just_refreshed = !0)) : (this.log(!0, "Server responded with status code 401, your token might have expired, I will attempt to refresh your token..."), await this.refreshToken() && this.retry_on_automatic_token_refresh && (o = !0, r.just_refreshed = !0)) : this.log(!0, "Server responded with status code 401, maybe you need to do this action as a user?") : c.status === 403 ? this.log(!0, "Server responded with status code 403, you may lack the necessary scope for this action!") : c.status === 422 ? this.log(!0, "Server responded with status code 422, you may be unable to use those parameters together!") : c.status === 429 ? this.log(!0, "Server responded with status code 429, you're sending too many requests at once and are getting rate-limited!") : this.log(!0, "Server responded with status:", c.status, c.statusText)), o === !0 && r.number_try <= this.retry_maximum_amount)
        return this.log(!0, `Will request again in ${this.retry_delay} seconds...`, `(retry #${r.number_try}/${this.retry_maximum_amount})`), await new Promise((f) => setTimeout(f, this.retry_delay * 1e3)), await this.request(s, n, i, e, { number_try: r.number_try + 1, just_refreshed: r.just_refreshed });
      throw new F(l, `${this.server}/${this.route_api.join("/")}`, s, n, i, u, a);
    }
    if (this.log(!1, c.statusText, c.status, { method: s, endpoint: n, parameters: i }), c.status === 204)
      return;
    const g = await c.arrayBuffer(), p = Buffer.from(g);
    try {
      return D(JSON.parse(p.toString("utf-8")));
    } catch {
      return p.toString("binary");
    }
  }
  // BEATMAP STUFF
  /** {@inheritDoc Beatmap.lookup} @group Beatmap Methods */
  lookupBeatmap = y.lookup;
  /** {@inheritDoc Beatmap.getOne} @group Beatmap Methods */
  getBeatmap = y.getOne;
  /** {@inheritDoc Beatmap.getMultiple} @group Beatmap Methods */
  getBeatmaps = y.getMultiple;
  /** {@inheritDoc Beatmap.DifficultyAttributes.get} @group Beatmap Methods */
  getBeatmapDifficultyAttributes = y.DifficultyAttributes.get;
  /** {@inheritDoc Beatmap.DifficultyAttributes.getOsu} @group Beatmap Methods */
  getBeatmapDifficultyAttributesOsu = y.DifficultyAttributes.getOsu;
  /** {@inheritDoc Beatmap.DifficultyAttributes.getTaiko} @group Beatmap Methods */
  getBeatmapDifficultyAttributesTaiko = y.DifficultyAttributes.getTaiko;
  /** {@inheritDoc Beatmap.DifficultyAttributes.getFruits} @group Beatmap Methods */
  getBeatmapDifficultyAttributesFruits = y.DifficultyAttributes.getFruits;
  /** {@inheritDoc Beatmap.DifficultyAttributes.getMania} @group Beatmap Methods */
  getBeatmapDifficultyAttributesMania = y.DifficultyAttributes.getMania;
  /** {@inheritDoc Beatmap.getScores} @group Beatmap Methods */
  getBeatmapScores = y.getScores;
  /** {@inheritDoc Beatmap.getUserScore} @group Beatmap Methods */
  getBeatmapUserScore = y.getUserScore;
  /** {@inheritDoc Beatmap.getUserScores} @group Beatmap Methods */
  getBeatmapUserScores = y.getUserScores;
  /** {@inheritDoc Beatmap.UserTag.getAll} @group Beatmap Methods */
  getBeatmapUserTags = y.UserTag.getAll;
  /** {@inheritDoc Beatmap.Pack.getOne} @group Beatmap Methods */
  getBeatmapPack = y.Pack.getOne;
  /** {@inheritDoc Beatmap.Pack.getMultiple} @group Beatmap Methods */
  getBeatmapPacks = y.Pack.getMultiple;
  // BEATMAPSET STUFF
  /** {@inheritDoc Beatmapset.search} @group Beatmapset Methods */
  searchBeatmapsets = A.search;
  /** {@inheritDoc Beatmapset.lookup} @group Beatmapset Methods */
  lookupBeatmapset = A.lookup;
  /** {@inheritDoc Beatmapset.getOne} @group Beatmapset Methods */
  getBeatmapset = A.getOne;
  /** {@inheritDoc Beatmapset.Discussion.getMultiple} @group Beatmapset Methods */
  getBeatmapsetDiscussions = A.Discussion.getMultiple;
  /** {@inheritDoc Beatmapset.Discussion.Post.getMultiple} @group Beatmapset Methods */
  getBeatmapsetDiscussionPosts = A.Discussion.Post.getMultiple;
  /** {@inheritDoc Beatmapset.Discussion.Vote.getMultiple} @group Beatmapset Methods */
  getBeatmapsetDiscussionVotes = A.Discussion.Vote.getMultiple;
  /** {@inheritDoc Beatmapset.Event.getMultiple} @group Beatmapset Methods */
  getBeatmapsetEvents = A.Event.getMultiple;
  // CHANGELOG STUFF
  /** {@inheritDoc Changelog.Build.lookup} @group Changelog Methods */
  lookupChangelogBuild = T.Build.lookup;
  /** {@inheritDoc Changelog.Build.getOne} @group Changelog Methods */
  getChangelogBuild = T.Build.getOne;
  /** {@inheritDoc Changelog.Build.getMultiple} @group Changelog Methods */
  getChangelogBuilds = T.Build.getMultiple;
  /** {@inheritDoc Changelog.UpdateStream.getAll} @group Changelog Methods */
  getChangelogStreams = T.UpdateStream.getAll;
  // CHAT STUFF
  /** {@inheritDoc Chat.keepAlive} @group Chat Methods */
  keepChatAlive = b.keepAlive;
  /** {@inheritDoc Chat.Message.getMultiple} @group Chat Methods */
  getChatMessages = b.Message.getMultiple;
  /** {@inheritDoc Chat.Message.send} @group Chat Methods */
  sendChatMessage = b.Message.send;
  /** {@inheritDoc Chat.Message.sendPrivate} @group Chat Methods */
  sendChatPrivateMessage = b.Message.sendPrivate;
  /** {@inheritDoc Chat.Channel.getOne} @group Chat Methods */
  getChatChannel = b.Channel.getOne;
  /** {@inheritDoc Chat.Channel.getAll} @group Chat Methods */
  getChatChannels = b.Channel.getAll;
  /** {@inheritDoc Chat.Channel.markAsRead} @group Chat Methods */
  markChatChannelAsRead = b.Channel.markAsRead;
  /** {@inheritDoc Chat.Channel.createPrivate} @group Chat Methods */
  createChatPrivateChannel = b.Channel.createPrivate;
  /** {@inheritDoc Chat.Channel.createAnnouncement} @group Chat Methods */
  createChatAnnouncementChannel = b.Channel.createAnnouncement;
  /** {@inheritDoc Chat.Channel.joinOne} @group Chat Methods */
  joinChatChannel = b.Channel.joinOne;
  /** {@inheritDoc Chat.Channel.leaveOne} @group Chat Methods */
  leaveChatChannel = b.Channel.leaveOne;
  /** {@inheritDoc Chat.Websocket.getHeaders} @group Chat Methods */
  getChatWebsocketHeaders = b.Websocket.getHeaders;
  /** {@inheritDoc Chat.Websocket.generate} @group Chat Methods */
  generateChatWebsocket = b.Websocket.generate;
  // COMMENT STUFF
  /** {@inheritDoc Comment.getOne} @group Comment Methods */
  getComment = C.getOne;
  /** {@inheritDoc Comment.getMultiple} @group Comment Methods */
  getComments = C.getMultiple;
  // EVENT STUFF
  /** {@inheritDoc Event.getMultiple} @group Event Methods */
  getEvents = N.getMultiple;
  // FORUM STUFF
  /** {@inheritDoc Forum.getOne} @group Forum Methods */
  getForum = O.getOne;
  /** {@inheritDoc Forum.getMultiple} @group Forum Methods */
  getForums = O.getMultiple;
  /** {@inheritDoc Forum.Topic.getOne} @group Forum Methods */
  getForumTopic = O.Topic.getOne;
  /** {@inheritDoc Forum.Topic.getMultiple} @group Forum Methods */
  getForumTopics = O.Topic.getMultiple;
  /** {@inheritDoc Forum.Topic.create} @group Forum Methods */
  createForumTopic = O.Topic.create;
  /** {@inheritDoc Forum.Topic.reply} @group Forum Methods */
  replyForumTopic = O.Topic.reply;
  /** {@inheritDoc Forum.Topic.editTitle} @group Forum Methods */
  editForumTopicTitle = O.Topic.editTitle;
  /** {@inheritDoc Forum.Post.edit} @group Forum Methods */
  editForumPost = O.Post.edit;
  // HOME STUFF
  /** {@inheritDoc Home.Search.getUsers} @group Home Methods */
  searchUser = B.Search.getUsers;
  /** {@inheritDoc Home.Search.getWikiPages} @group Home Methods */
  searchWiki = B.Search.getWikiPages;
  // MATCH STUFF
  /** {@inheritDoc Match.getOne} @group Match Methods */
  getMatch = R.getOne;
  /** {@inheritDoc Match.getMultiple} @group Match Methods */
  getMatches = R.getMultiple;
  // MISCELLANEOUS STUFF
  /** {@inheritDoc Miscellaneous.Country.getRanking} @group Miscellaneous Methods */
  getCountryRanking = I.Country.getRanking;
  /** {@inheritDoc Miscellaneous.getSeasonalBackgrounds} @group Miscellaneous Methods */
  getSeasonalBackgrounds = I.getSeasonalBackgrounds;
  // MULTIPLAYER STUFF
  /** {@inheritDoc Multiplayer.Room.getOne} @group Multiplayer Methods */
  getRoom = M.Room.getOne;
  /** {@inheritDoc Multiplayer.Room.getMultiple} @group Multiplayer Methods */
  getRooms = M.Room.getMultiple;
  /** {@inheritDoc Multiplayer.Room.Leader.getMultiple} @group Multiplayer Methods */
  getRoomLeaderboard = M.Room.Leader.getMultiple;
  /** {@inheritDoc Multiplayer.Room.PlaylistItem.getScores} @group Multiplayer Methods */
  getPlaylistItemScores = M.Room.PlaylistItem.getScores;
  /** {@inheritDoc Multiplayer.Room.Event.getAll} @group Multiplayer Methods */
  getRoomEvents = M.Room.Event.getAll;
  // NEWS STUFF
  /** {@inheritDoc NewsPost.getOne} @group NewsPost Methods */
  getNewsPost = x.getOne;
  /** {@inheritDoc NewsPost.getMultiple} @group NewsPost Methods */
  getNewsPosts = x.getMultiple;
  // SCORE STUFF
  /** {@inheritDoc Score.getOne} @group Score Methods */
  getScore = q.getOne;
  /** {@inheritDoc Score.getSome} @group Score Methods */
  getScores = q.getSome;
  /** {@inheritDoc Score.getReplay} @group Score Methods */
  getReplay = q.getReplay;
  // SPOTLIGHT STUFF
  /** {@inheritDoc Spotlight.getAll} @group Spotlight Methods */
  getSpotlights = U.getAll;
  /** {@inheritDoc Spotlight.getRanking} @group Spotlight Methods */
  getSpotlightRanking = U.getRanking;
  // USER STUFF
  /** {@inheritDoc User.getResourceOwner} @group User Methods */
  getResourceOwner = m.getResourceOwner;
  /** {@inheritDoc User.getOne} @group User Methods */
  getUser = m.getOne;
  /** {@inheritDoc User.getMultiple} @group User Methods */
  getUsers = m.getMultiple;
  /** {@inheritDoc User.lookupMultiple} @group User Methods */
  lookupUsers = m.lookupMultiple;
  /** {@inheritDoc User.getScores} @group User Methods */
  getUserScores = m.getScores;
  /** {@inheritDoc User.getBeatmaps} @group User Methods */
  getUserBeatmaps = m.getBeatmaps;
  /** {@inheritDoc User.getPassedBeatmaps} @group User Methods */
  getUserPassedBeatmaps = m.getPassedBeatmaps;
  /** {@inheritDoc User.getMostPlayed} @group User Methods */
  getUserMostPlayed = m.getMostPlayed;
  /** {@inheritDoc User.getRecentActivity} @group User Methods */
  getUserRecentActivity = m.getRecentActivity;
  /** {@inheritDoc User.getRanking} @group User Methods */
  getUserRanking = m.getRanking;
  /** {@inheritDoc User.getFriends} @group User Methods */
  getFriends = m.getFriends;
  /** {@inheritDoc User.getFavouriteBeatmapsetsIds} @group User Methods */
  getFavouriteBeatmapsetsIds = m.getFavouriteBeatmapsetsIds;
  /** {@inheritDoc User.Kudosu.getHistory} @group User Methods */
  getUserKudosuHistory = m.Kudosu.getHistory;
  /** {@inheritDoc User.Kudosu.getRanking} @group User Methods */
  getKudosuRanking = m.Kudosu.getRanking;
  // WIKI STUFF
  /** {@inheritDoc WikiPage.getOne} @group WikiPage Methods */
  getWikiPage = H.getOne;
}
class Y extends E {
  /** The {@link API} where {@link API.withSettings} was used; this `ChildAPI` gets everything from it! */
  original;
  /** The additional settings that are used for every request made by this object */
  additional_fetch_settings;
  request = async (...s) => (s[3] ??= this.additional_fetch_settings, await this.original.request(...s));
  // Those are first in accessors -> methods order, then in alphabetical order
  // For the sake of decent documentation and autocomplete
  /** @hidden @deprecated use API equivalent */
  get access_token() {
    return this.original.access_token;
  }
  /** @hidden @deprecated use API equivalent */
  get client_id() {
    return this.original.client_id;
  }
  /** @hidden @deprecated use API equivalent */
  get client_secret() {
    return this.original.client_secret;
  }
  /** @hidden @deprecated use API equivalent */
  get expires() {
    return this.original.expires;
  }
  /** @hidden @deprecated use API equivalent */
  get refresh_token_on_401() {
    return this.original.refresh_token_on_401;
  }
  /** @hidden @deprecated use API equivalent */
  get refresh_token_on_expires() {
    return this.original.refresh_token_on_expires;
  }
  /** @hidden @deprecated use API equivalent */
  get refresh_token_timer() {
    return this.original.refresh_token_timer;
  }
  /** @hidden @deprecated use API equivalent */
  get refresh_token() {
    return this.original.refresh_token;
  }
  /** @hidden @deprecated use API equivalent */
  get retry_delay() {
    return this.original.retry_delay;
  }
  /** @hidden @deprecated use API equivalent */
  get retry_maximum_amount() {
    return this.original.retry_maximum_amount;
  }
  /** @hidden @deprecated use API equivalent */
  get retry_on_automatic_token_refresh() {
    return this.original.retry_on_automatic_token_refresh;
  }
  /** @hidden @deprecated use API equivalent */
  get retry_on_status_codes() {
    return this.original.retry_on_status_codes;
  }
  /** @hidden @deprecated use API equivalent */
  get retry_on_timeout() {
    return this.original.retry_on_timeout;
  }
  /** @hidden @deprecated use API equivalent */
  get route_api() {
    return this.original.route_api;
  }
  /** @hidden @deprecated use API equivalent */
  get route_token() {
    return this.original.route_token;
  }
  /** @hidden @deprecated use API equivalent */
  get scopes() {
    return this.original.scopes;
  }
  /** @hidden @deprecated use API equivalent */
  get server() {
    return this.original.server;
  }
  /** @hidden @deprecated use API equivalent */
  get timeout() {
    return this.original.timeout;
  }
  /** @hidden @deprecated use API equivalent */
  get token_type() {
    return this.original.token_type;
  }
  /** @hidden @deprecated use API equivalent */
  get user() {
    return this.original.user;
  }
  /** @hidden @deprecated use API equivalent */
  get verbose() {
    return this.original.verbose;
  }
  /** @hidden @deprecated use API equivalent */
  refreshToken = async () => await this.original.refreshToken();
  /** @hidden @deprecated use API equivalent */
  revokeToken = async () => await this.original.revokeToken();
  /** @hidden @deprecated use API equivalent */
  withSettings = (...s) => this.original.withSettings(...s);
  constructor(s, n) {
    super({}), this.original = s, this.additional_fetch_settings = n;
  }
}
let j = null, W = null, z = null, v = null;
const $ = document.getElementById("CrashReportDebug"), K = document.getElementById("CrashReason");
function re(t) {
  j = t, L();
}
function L() {
  if (j.sockets?.["/websocket/v2"]) {
    const t = j.sockets["/websocket/v2"].onopen;
    j.sockets["/websocket/v2"].onopen = function(n) {
      t && t.call(this, n), ee();
    };
    const s = j.sockets["/websocket/v2"].onclose;
    j.sockets["/websocket/v2"].onclose = function(n) {
      G(), s && s.call(this, n);
    };
  }
}
function G() {
  $.classList.remove("crashpop"), K.innerHTML = `The tosu server socket is currently closed (or the program has crashed). Please relaunch tosu!<br><br>
    If this error still exists, please contact the overlay developer or tosu developer.`;
}
function ee() {
  !W || !z ? J() : $.classList.add("crashpop");
}
async function ie(t, s) {
  if (W = parseInt(t), z = s, t && s) {
    console.log("osu! API credentials set, initializing API...");
    try {
      v = await E.createAsync(W, z, void 0, { verbose: "none" }), console.log("osu! API initialized successfully"), te();
    } catch (n) {
      console.error("Failed to initialize osu! API:", n), J(), v = null;
    }
  } else
    console.log("osu! API credentials not set"), v = null, J();
}
function J() {
  $.classList.remove("crashpop"), K.innerHTML = `To enable API features (user top scores, leaderboards):<br><br>
    Add your osu! OAuth Client ID and Secret in the overlay settings<br><br>
    Get your OAuth credentials at: <a href="https://osu.ppy.sh/home/account/edit" target="_blank" style="color: #a1c9ff;">https://osu.ppy.sh/home/account/edit</a>`;
}
function te() {
  $.classList.add("crashpop"), K.innerHTML = "";
}
async function se(t) {
  if (!v)
    return console.warn("osu! API not initialized"), null;
  try {
    const s = await v.getUser(t, "osu");
    return s ? {
      id: s.id,
      username: s.username,
      country_code: s.country_code,
      profile_colour: s.profile_colour,
      statistics: {
        global_rank: s.statistics?.global_rank || 0,
        country_rank: s.statistics?.country_rank || 0,
        pp: s.statistics?.pp || 0
      }
    } : null;
  } catch (s) {
    return console.error("Error fetching user:", s), null;
  }
}
async function oe(t) {
  if (!v)
    return console.warn("osu! API not initialized"), null;
  try {
    const s = await v.getUserScores(t, "best", "osu", { limit: 100 });
    return !s || s.length === 0 ? null : s.map((n) => ({
      beatmap_id: n.beatmap.id,
      pp: n.pp,
      mods_id: n.mods.map((i) => i.acronym).join(""),
      rank: n.rank,
      ended_at: n.ended_at || n.created_at,
      legacy_score_id: n.legacy_score_id || n.id
    }));
  } catch (s) {
    return console.error("Error fetching user top scores:", s), null;
  }
}
async function ae(t) {
  if (!v || !t || t === "undefined")
    return null;
  try {
    const s = await v.getBeatmap(t);
    return s ? {
      id: s.id,
      beatmapset_id: s.beatmapset_id,
      difficulty_rating: s.difficulty_rating,
      version: s.version
    } : null;
  } catch (s) {
    return console.error("Error fetching beatmap:", s), null;
  }
}
async function ne(t) {
  if (!v || !t || t === "undefined" || t === "null")
    return null;
  try {
    const s = await v.getBeatmapScores(t, "osu");
    return !s || !s.scores || s.scores.length === 0 ? null : s.scores.map((n) => {
      const { count_300: i, count_100: e, count_50: r, count_miss: o } = n.statistics, a = i + e + r + o, u = a > 0 ? (i * 300 + e * 100 + r * 50) / (a * 300) * 100 : 0;
      return {
        user_id: n.user_id,
        username: n.user?.username || "Unknown",
        score: n.score,
        max_combo: n.max_combo,
        count_300: i,
        count_100: e,
        count_50: r,
        count_miss: o,
        rank: n.rank,
        pp: n.pp,
        mods: n.mods.map((l) => l.acronym).join(""),
        acc: u,
        created_at: n.created_at
      };
    });
  } catch (s) {
    return console.error("Error fetching beatmap scores:", s), null;
  }
}
async function ue(t, s) {
  if (!v || !t || t === "undefined" || t === "null")
    return null;
  try {
    const n = await ne(t);
    if (!n) return null;
    const i = [];
    if (s && s !== "NM")
      for (let e = 0; e < s.length; e += 2)
        i.push(s.substr(e, 2));
    return i.length === 0 ? n : n.filter((e) => {
      const r = e.mods.match(/.{1,2}/g) || [], o = i.sort().join("");
      return r.sort().join("") === o;
    });
  } catch (n) {
    return console.error("Error fetching scores with mods:", n), null;
  }
}
async function ce(t) {
  if (!v)
    return {
      hsl1: [0.5277777777777778, 0],
      hsl2: [0.5277777777777778, 0]
    };
  try {
    const s = await se(t);
    if (!s || !s.profile_colour)
      return {
        hsl1: [0.5277777777777778, 0],
        hsl2: [0.5277777777777778, 0]
      };
    const n = s.profile_colour.replace("#", ""), i = parseInt(n.substr(0, 2), 16) / 255, e = parseInt(n.substr(2, 2), 16) / 255, r = parseInt(n.substr(4, 2), 16) / 255, o = Math.max(i, e, r), a = Math.min(i, e, r);
    let u, l, d = (o + a) / 2;
    if (o === a)
      u = l = 0;
    else {
      const _ = o - a;
      switch (l = d > 0.5 ? _ / (2 - o - a) : _ / (o + a), o) {
        case i:
          u = ((e - r) / _ + (e < r ? 6 : 0)) / 6;
          break;
        case e:
          u = ((r - i) / _ + 2) / 6;
          break;
        case r:
          u = ((i - e) / _ + 4) / 6;
          break;
      }
    }
    return {
      hsl1: [u, l],
      hsl2: [u, l * 0.8]
    };
  } catch (s) {
    return console.error("Error getting user colors:", s), {
      hsl1: [0.5277777777777778, 0],
      hsl2: [0.5277777777777778, 0]
    };
  }
}
export {
  ae as getMapDataSet,
  ne as getMapScores,
  ue as getModsScores,
  se as getUserDataSet,
  oe as getUserTop,
  re as initApiSocket,
  ce as postUserID,
  ie as setOsuCredentials
};
