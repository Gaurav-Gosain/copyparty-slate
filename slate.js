/*
 * slate: text labels instead of emoji for copyparty
 *
 * copyparty builds its toolbars in JavaScript and labels most controls with a
 * single emoji. That is compact but hard to read if you do not already know
 * what each picture means. This script swaps them for words.
 *
 * It only rewrites label text. Element ids, classes, event handlers and layout
 * are left alone, so every feature keeps working.
 *
 * Load with copyparty's --js-browser flag.
 */
(function () {
	"use strict";

	// Anything in these unicode ranges counts as decoration, not language.
	var EMOJI = /[\u{1F300}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2000}-\u{206F}\u{2100}-\u{214F}]/gu;

	// id -> replacement label. Derived from copyparty's own tooltips.
	var LABELS = {
		// top navigation
		opa_srch: "search",
		opa_del: "undo",
		opa_up: "upload",
		opa_bup: "basic up",
		opa_mkd: "new folder",
		opa_md: "new doc",
		opa_msg: "message",
		opa_auc: "player",
		opa_cfg: "settings",

		// file actions
		fshr: "share",
		fren: "rename",
		fcut: "cut",
		fpst: "paste",
		zip1: "zip",

		// now playing / playlist
		npirc: "copy",
		nptxt: "copy text",
		m3ua: "add to m3u",
		m3uc: "copy m3u",
		wtico: "audio",

		// settings toggles
		flag_en: "idle",
		upnag: "notify",
		upsfx: "sound",
		ico1: "favicon",

		// tree pane
		visdir: "reveal",
		filetree: "tree",
		parpane: "pin",
		wraptree: "wrap",
		hovertree: "hover"
	};

	function setLabel(el, text) {
		if (!el || el.dataset.slateDone === "1") return;
		el.textContent = text;
		el.dataset.slateDone = "1";
		// keep the original meaning available on hover
		if (!el.title && el.getAttribute("tt"))
			el.title = el.getAttribute("tt").replace(/<[^>]*>/g, "");
	}

	function stripEmoji(el) {
		if (!el || el.dataset.slateStrip === "1") return;
		var kids = el.childNodes;
		for (var i = 0; i < kids.length; i++) {
			var n = kids[i];
			if (n.nodeType !== 3) continue;          // text nodes only
			var was = n.nodeValue;
			var now = was.replace(EMOJI, "").replace(/\s{2,}/g, " ").trim();
			if (now !== was.trim()) n.nodeValue = now ? (was.startsWith(" ") ? " " + now : now) : "";
		}
		el.dataset.slateStrip = "1";
	}

	function pass() {
		// 1. known controls get real words
		for (var id in LABELS) {
			if (Object.prototype.hasOwnProperty.call(LABELS, id))
				setLabel(document.getElementById(id), LABELS[id]);
		}

		// 2. anything else that still carries decoration gets it removed,
		//    but only if the element keeps some text afterwards, so we never
		//    blank out a control we do not have a name for.
		var sel = "#ops a, #ops b, #treeul a, #u2conf a, #u2conf b, " +
		          "#files td a, .btn, #widget a, #barpos a, #barbuf a";
		var els = document.querySelectorAll(sel);
		for (var i = 0; i < els.length; i++) {
			var el = els[i];
			if (el.dataset.slateDone === "1") continue;
			var txt = el.textContent || "";
			if (!EMOJI.test(txt)) { EMOJI.lastIndex = 0; continue; }
			EMOJI.lastIndex = 0;
			var left = txt.replace(EMOJI, "").trim();
			EMOJI.lastIndex = 0;
			if (left.length) stripEmoji(el);
		}
	}

	function boot() {
		pass();
		// copyparty rebuilds toolbars when you switch tabs, so keep watching.
		var pending = null;
		new MutationObserver(function () {
			if (pending) return;
			pending = setTimeout(function () { pending = null; pass(); }, 120);
		}).observe(document.body, { childList: true, subtree: true });
	}

	if (document.readyState === "loading")
		document.addEventListener("DOMContentLoaded", boot);
	else
		boot();
})();
