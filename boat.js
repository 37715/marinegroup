// Marine Group — boat detail renderer
(function () {
  "use strict";

  var CAT = {
    semi: "Semi-rigide", day: "Day cruiser", vedette: "Vedette",
    yacht: "Yacht", neuf: "Bateau neuf", occasion: "Occasion & refit"
  };
  var SEASON_DATES = {
    basse: "15/04 – 30/06 · 01/09 – 15/11",
    moyenne: "01/07 – 14/07",
    haute: "15/07 – 31/08"
  };

  function euro(n) { return Number(n).toLocaleString("fr-FR"); }
  function metres(v) { return String(v).replace(".", ",") + " m"; }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  var params = new URLSearchParams(location.search);
  var id = params.get("id");
  var data = window.MG_BOATS || {};
  var b = id && data[id];

  if (!b) {
    var main = $("boatMain");
    if (main) {
      main.innerHTML =
        '<div class="wrap" style="padding:22vh 0 30vh;text-align:center">' +
        '<p class="eyebrow">Introuvable</p>' +
        '<h1 class="bd-title">Ce bateau n\u2019est plus disponible.</h1>' +
        '<p class="bd-blurb" style="margin:0 auto 2rem">La fiche demand\u00e9e est introuvable. ' +
        'Retrouvez l\u2019ensemble de nos bateaux sur la page d\u2019accueil.</p>' +
        '<a class="btn btn--solid" href="index.html#flotte">Voir toute la flotte</a></div>';
    }
    return;
  }

  var isRent = b.kind === "louer";
  var catLabel = CAT[b.cat] || "";
  var kindLabel = isRent ? "\u00c0 la location" : (b.cat === "occasion" ? "\u00c0 la vente" : "\u00c0 la vente \u2014 neuf");

  // Clean model name (rental page titles embed the tag, e.g. "Marlin 274 – Refit 2024")
  var display = b.name;
  if (b.tag) {
    display = display.replace(new RegExp("\\s*[\\u2013\\u2014-]\\s*" + b.tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$"), "");
  }

  document.title = b.name + " \u2014 Marine Group";

  /* ---- Breadcrumb ---- */
  var sec = $("crumbSection"), back = $("bdBackLink");
  if (isRent) {
    sec.textContent = "La flotte"; sec.href = "index.html#flotte";
    back.href = "index.html#flotte"; back.textContent = "Retour \u00e0 la flotte";
  } else {
    sec.textContent = "Vente"; sec.href = "index.html#vente";
    back.href = "index.html#vente"; back.textContent = "Retour \u00e0 la vente";
  }
  $("crumbName").textContent = display;

  /* ---- Gallery ---- */
  if (b.cat === "neuf") {
    var gEl = document.querySelector(".bd-gallery");
    if (gEl) gEl.classList.add("bd-gallery--product");
  }
  var gallery = (b.gallery && b.gallery.length) ? b.gallery : ["assets/images/hero.jpg"];
  var mainImg = $("bdMain");
  mainImg.src = gallery[0];
  mainImg.alt = b.name;
  var thumbs = $("bdThumbs");
  if (gallery.length > 1) {
    gallery.forEach(function (src, i) {
      var t = el("button", "bd-thumb" + (i === 0 ? " is-active" : ""));
      t.setAttribute("role", "listitem");
      t.setAttribute("aria-label", "Photo " + (i + 1));
      t.innerHTML = '<img src="' + src + '" alt="" loading="lazy" />';
      t.addEventListener("click", function () {
        mainImg.src = src;
        thumbs.querySelectorAll(".bd-thumb").forEach(function (x) { x.classList.remove("is-active"); });
        t.classList.add("is-active");
      });
      thumbs.appendChild(t);
    });
  } else {
    thumbs.hidden = true;
  }
  if (b.sold) { var sold = $("bdSold"); sold.hidden = false; mainImg.parentElement.classList.add("is-sold"); }

  /* ---- Header ---- */
  $("bdEyebrow").textContent = kindLabel + (catLabel ? " \u00b7 " + catLabel : "");
  $("bdTitle").innerHTML = display + (b.tag ? ' <span class="bd-tag">' + b.tag + "</span>" : "");
  if (b.color) { var c = $("bdColor"); c.hidden = false; c.textContent = "Coloris \u2014 " + b.color; }
  if (b.blurb) $("bdBlurb").textContent = b.blurb; else $("bdBlurb").hidden = true;

  /* ---- Key specs ---- */
  var ks = $("bdKeySpecs");
  function kspec(label, val) {
    if (!val) return;
    var li = el("li");
    li.innerHTML = '<span class="mono">' + label + '</span><strong>' + val + "</strong>";
    ks.appendChild(li);
  }
  kspec("Longueur", metres(b.length));
  if (isRent && b.cap) kspec("Capacit\u00e9", b.cap + " personnes");
  kspec("Motorisation", b.power + (b.engine ? " \u00b7 " + b.engine : ""));

  /* ---- Price ---- */
  var priceEl = $("bdPrice");
  if (b.sold) {
    priceEl.innerHTML = '<span class="bd-price__sold">Vendu</span>';
  } else if (isRent) {
    var day = (b.seasons && b.seasons.moyenne) || b.price;
    priceEl.innerHTML =
      '<span class="bd-price__from mono">\u00e0 partir de</span>' +
      '<span class="bd-price__val">' + euro(day) + " \u20ac<em>/ jour</em></span>" +
      '<span class="bd-price__note mono">Tarif moyenne saison \u00b7 TVA incluse</span>';
  } else {
    priceEl.innerHTML =
      '<span class="bd-price__from mono">\u00e0 partir de</span>' +
      '<span class="bd-price__val">' + euro(b.price) + " \u20ac</span>" +
      '<span class="bd-price__note mono">' + (b.cat === "neuf" ? "Prix TTC \u2014 hors options" : "Prix TTC") + "</span>";
  }

  /* ---- Mail CTA ---- */
  var subj = (isRent ? "Location \u2014 " : "Achat \u2014 ") + display;
  var body = "Bonjour,\n\nJe souhaite des informations sur le " + display + " (" +
    (isRent ? "location" : "vente") + ").\n\nMerci de me recontacter.\n";
  $("bdMail").href = "mailto:marinegroup2a@gmail.com?subject=" +
    encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
  $("bdMail").textContent = isRent ? "R\u00e9server ce bateau" : "Demander une offre";

  /* ---- Full spec grid ---- */
  var grid = $("bdSpecGrid");
  function row(label, val) {
    if (!val) return;
    grid.appendChild(el("dt", "mono", label));
    grid.appendChild(el("dd", null, val));
  }
  var ss = b.specsheet || {};
  row("Longueur", ss.Longueur || metres(b.length));
  row("Largeur", ss.Largeur);
  row("Poids", ss.Poids);
  row("Capacit\u00e9", isRent ? (b.cap ? b.cap + " personnes" : "") : (ss["Capacit\u00e9"] || ""));
  row("Motorisation", b.power);
  row("Puissance max", ss["Puissance max"]);
  row("Moteur", b.engine);
  row("Carburant", ss.Carburant || b.fuel);
  row("Eau", ss.Eau);
  row("Coque", ss.Coque);
  row("Cat\u00e9gorie", catLabel);
  if (b.color) row("Coloris", b.color);
  if (grid.children.length) $("bdSpecsBlock").hidden = false;

  /* ---- Seasonal pricing (rental) ---- */
  if (isRent && b.seasons) {
    var wrap = $("bdSeasons");
    [["basse", "Basse saison"], ["moyenne", "Moyenne saison"], ["haute", "Haute saison"]].forEach(function (p) {
      var key = p[0];
      if (b.seasons[key] == null) return;
      var card = el("div", "bd-season");
      card.innerHTML =
        '<span class="bd-season__name mono">' + p[1] + "</span>" +
        '<span class="bd-season__price">' + euro(b.seasons[key]) + " \u20ac<em>/ jour</em></span>" +
        '<span class="bd-season__dates mono">' + SEASON_DATES[key] + "</span>";
      wrap.appendChild(card);
    });
    $("bdOffers").textContent = "Tarif 3 jours : \u00bd journ\u00e9e offerte \u00b7 Tarif 7 jours : 1 journ\u00e9e offerte \u00b7 Skipper & extras sur demande.";
    $("bdSeasonsBlock").hidden = false;
  }

  /* ---- Equipment ---- */
  if (b.equip && b.equip.length) {
    var eq = $("bdEquip");
    b.equip.forEach(function (item) { eq.appendChild(el("li", null, item)); });
    $("bdEquipTitle").textContent = isRent ? "\u00c9quipement \u00e0 bord" : "\u00c9quipement de s\u00e9rie";
    $("bdEquipBlock").hidden = false;
  }

  /* ---- Options ---- */
  if (b.options && b.options.length) {
    var op = $("bdOptions");
    b.options.forEach(function (item) { op.appendChild(el("li", null, item)); });
    $("bdOptionsBlock").hidden = false;
  }
})();
