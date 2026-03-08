import { useState, useEffect, useCallback, useRef } from "react";

const TOWNS = [
  { name: "Rolle", lat: 46.4601, lng: 6.3372, radius: 0 },
  { name: "Gland", lat: 46.4219, lng: 6.2708, radius: 3.5 },
  { name: "Perroy", lat: 46.4714, lng: 6.3564, radius: 2 },
  { name: "Allaman", lat: 46.4686, lng: 6.3953, radius: 4 },
  { name: "Aubonne", lat: 46.4961, lng: 6.3917, radius: 5 },
  { name: "Begnins", lat: 46.4439, lng: 6.2478, radius: 5 },
  { name: "Bursins", lat: 46.4547, lng: 6.2828, radius: 3 },
  { name: "Féchy", lat: 46.4722, lng: 6.3744, radius: 3.5 },
  { name: "Vinzel", lat: 46.4619, lng: 6.3164, radius: 1.5 },
  { name: "Dully", lat: 46.4039, lng: 6.2261, radius: 6 },
  { name: "Tartegnin", lat: 46.4503, lng: 6.3236, radius: 2 },
  { name: "Mont-sur-Rolle", lat: 46.4672, lng: 6.3308, radius: 1.5 },
  { name: "Essertines-sur-Rolle", lat: 46.4808, lng: 6.3575, radius: 3 },
  { name: "Bursinel", lat: 46.4347, lng: 6.2611, radius: 4 },
  { name: "Saint-Prex", lat: 46.4822, lng: 6.4539, radius: 8 },
  { name: "Morges", lat: 46.5119, lng: 6.4986, radius: 9 },
  { name: "Nyon", lat: 46.3833, lng: 6.2397, radius: 9 },
];

const PLATFORM_LINKS = [
  { name: "Immoscout24", url: "https://www.immoscout24.ch/fr/immobilier/louer/lieu-rolle?r=10", color: "#e74c3c", type: "platform" },
  { name: "Homegate", url: "https://www.homegate.ch/louer/appartement/lieu-rolle/liste-annonces?loc=rolle", color: "#1a73e8", type: "platform" },
  { name: "Anibis", url: "https://www.anibis.ch/fr/immobilier-appartements-location--477/advertlist?fts=rolle", color: "#ff9500", type: "platform" },
  { name: "Comparis", url: "https://www.comparis.ch/immobilien/marktplatz/mieten/kanton-vd", color: "#00b4d8", type: "platform" },
];

// USPI Vaud gérances with rental listings in the La Côte region
const GERANCES = [
  { name: "Burnier & Cie SA", town: "Nyon", url: "https://www.burnier.ch/locations", phone: "022 360 90 90", color: "#2c6e49" },
  { name: "CGGI Sàrl", town: "Gland", url: "https://www.cggi.ch", phone: "022 995 90 90", color: "#2c6e49" },
  { name: "Cogestim SA", town: "Rolle, Nyon, Morges", url: "https://www.cogestim.ch/louer/", phone: "021 822 08 60", color: "#2c6e49" },
  { name: "Comptoir Immobilier SA", town: "Nyon, Morges", url: "https://comptoir-immo.ch/location/", phone: "022 365 99 99", color: "#2c6e49" },
  { name: "Gerofinance Régie du Rhône", town: "Coppet, Nyon", url: "https://www.gerofinance.ch", phone: "022 950 97 97", color: "#2c6e49" },
  { name: "J. Lugrin SA", town: "Aubonne", url: "https://lugrinimmobilier.ch", phone: "021 802 21 94", color: "#2c6e49" },
  { name: "Gérances de Luze SA", town: "Morges", url: "http://www.deluze.ch", phone: "021 811 22 22", color: "#2c6e49" },
  { name: "Maillard Immobilier SA", town: "Nyon", url: "https://www.maillard-immo.ch", phone: "021 510 50 60", color: "#2c6e49" },
  { name: "move im SA", town: "Nyon", url: "https://moveim.ch", phone: "021 601 02 03", color: "#2c6e49" },
  { name: "Naef Immobilier SA", town: "Nyon", url: "https://www.naef.ch/location/", phone: "022 994 23 23", color: "#2c6e49" },
  { name: "Omnia Immobilier SA", town: "Rolle", url: "https://omnia.ch/agence/omnia-rolle/", phone: "021 825 50 50", color: "#2c6e49" },
  { name: "Publiaz Immobilier SA", town: "Rolle", url: "https://publiaz.ch", phone: "021 822 25 22", color: "#2c6e49" },
  { name: "Régie Duboux SA", town: "Rolle", url: "https://www.regieduboux.ch", phone: "021 321 90 70", color: "#2c6e49" },
  { name: "Régie Schmid SA", town: "Nyon", url: "https://www.regie-schmid.ch", phone: "022 365 17 60", color: "#2c6e49" },
  { name: "Rilsa SA", town: "Nyon", url: "https://rilsa.ch", phone: "022 362 37 27", color: "#2c6e49" },
  { name: "R. Savary Immobilier SA", town: "Nyon", url: "https://www.savaryimmobilier.ch", phone: "022 365 47 00", color: "#2c6e49" },
  { name: "SPG (Soc. Privée de Gérance)", town: "Nyon", url: "https://www.spg.ch/liste-dobjets-a-location/", phone: "058 810 36 00", color: "#2c6e49" },
  { name: "Verbel SA", town: "Nyon", url: "https://www.verbel.ch", phone: "022 807 23 23", color: "#2c6e49" },
  { name: "Vimova Gérance SA", town: "Nyon", url: "https://vimova.ch/fr/", phone: "058 123 52 80", color: "#2c6e49" },
  { name: "Morges Immo Sàrl", town: "Morges", url: "http://www.morgesimmo.ch", phone: "021 811 00 80", color: "#2c6e49" },
  { name: "De Rham SA", town: "Lausanne", url: "https://www.derham.ch/fr/objects/rent", phone: "058 211 11 11", color: "#6b6056" },
  { name: "Galland & Cie SA", town: "Lausanne", url: "https://www.galland.ch", phone: "021 310 25 25", color: "#6b6056" },
  { name: "Rosset SA", town: "Lausanne", url: "https://www.rosset.ch", phone: "021 313 43 13", color: "#6b6056" },
];

// Parse the Claude API response into structured listings
function parseListings(text) {
  const strategies = [
    // Strategy 1: JSON inside markdown code blocks
    () => {
      const m = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (m) return JSON.parse(m[1]);
    },
    // Strategy 2: find outermost JSON array
    () => {
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      if (start !== -1 && end > start) {
        return JSON.parse(text.substring(start, end + 1));
      }
    },
  ];

  for (const strategy of strategies) {
    try {
      const result = strategy();
      if (Array.isArray(result) && result.length > 0) {
        return result.filter(
          (l) => l && l.title && (l.price || l.rooms || l.town)
        );
      }
    } catch (e) {
      // try next
    }
  }
  return [];
}

// Simple SVG map of La Côte region
function LaCoteMap({ listings, selectedTown, onTownClick }) {
  const mapRef = useRef(null);

  // Bounds roughly: lat 46.38-46.52, lng 6.22-6.52
  const project = (lat, lng) => {
    const x = ((lng - 6.2) / (6.55 - 6.2)) * 700 + 50;
    const y = ((46.53 - lat) / (46.53 - 46.37)) * 400 + 20;
    return [x, y];
  };

  // Lake Geneva shoreline (approximate)
  const shoreline = [
    [46.385, 6.22],
    [46.395, 6.24],
    [46.41, 6.26],
    [46.425, 6.27],
    [46.435, 6.28],
    [46.45, 6.31],
    [46.455, 6.33],
    [46.46, 6.35],
    [46.465, 6.37],
    [46.47, 6.39],
    [46.475, 6.42],
    [46.48, 6.44],
    [46.485, 6.46],
    [46.49, 6.48],
    [46.5, 6.5],
    [46.51, 6.52],
    [46.52, 6.55],
  ];

  const shorelinePath = shoreline
    .map(([lat, lng], i) => {
      const [x, y] = project(lat, lng);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const lakeShape =
    shorelinePath + " L750,440 L750,20 L50,20 L50,440 " + "Z";

  // Count listings per town
  const townCounts = {};
  listings.forEach((l) => {
    const t = l.town || "";
    const match = TOWNS.find(
      (tw) =>
        t.toLowerCase().includes(tw.name.toLowerCase()) ||
        tw.name.toLowerCase().includes(t.toLowerCase())
    );
    if (match) townCounts[match.name] = (townCounts[match.name] || 0) + 1;
  });

  return (
    <svg
      ref={mapRef}
      viewBox="0 0 800 460"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8d8e8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7fb3d3" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="460" fill="#f5f0e8" rx="12" />

      {/* Terrain texture */}
      {[...Array(30)].map((_, i) => (
        <circle
          key={i}
          cx={80 + ((i * 137) % 640)}
          cy={100 + ((i * 89) % 300)}
          r={2 + (i % 3)}
          fill="#d4ccb8"
          opacity="0.3"
        />
      ))}

      {/* Lake */}
      <path d={lakeShape} fill="url(#lakeGrad)" />

      {/* Shoreline */}
      <path
        d={shorelinePath}
        fill="none"
        stroke="#6a9bb5"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Lake label */}
      <text x="500" y="80" fill="#5a8fa8" fontSize="14" fontStyle="italic" opacity="0.7" fontFamily="Georgia, serif">
        Lac Léman
      </text>

      {/* Towns */}
      {TOWNS.map((town) => {
        const [x, y] = project(town.lat, town.lng);
        const count = townCounts[town.name] || 0;
        const isSelected = selectedTown === town.name;
        const hasListings = count > 0;
        const baseR = town.name === "Rolle" ? 10 : 7;
        const r = hasListings ? baseR + Math.min(count * 1.5, 8) : baseR;

        return (
          <g
            key={town.name}
            onClick={() => onTownClick(town.name)}
            style={{ cursor: "pointer" }}
          >
            {/* Pulse for selected */}
            {isSelected && (
              <circle cx={x} cy={y} r={r + 8} fill="#c0392b" opacity="0.15">
                <animate
                  attributeName="r"
                  values={`${r + 5};${r + 14};${r + 5}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.05;0.2"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Town dot */}
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={
                isSelected
                  ? "#c0392b"
                  : hasListings
                  ? "#2c6e49"
                  : "#8b7d6b"
              }
              stroke={isSelected ? "#fff" : hasListings ? "#1a4731" : "#6b6056"}
              strokeWidth={isSelected ? 2.5 : 1.5}
              opacity={isSelected ? 1 : hasListings ? 0.9 : 0.5}
              filter={isSelected ? "url(#glow)" : undefined}
            />

            {/* Count badge */}
            {hasListings && (
              <text
                x={x}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="10"
                fontWeight="700"
                fontFamily="monospace"
              >
                {count}
              </text>
            )}

            {/* Town label */}
            <text
              x={x}
              y={y - r - 6}
              textAnchor="middle"
              fill={isSelected ? "#c0392b" : "#4a4440"}
              fontSize={town.name === "Rolle" ? "13" : "11"}
              fontWeight={
                isSelected || town.name === "Rolle" ? "700" : "500"
              }
              fontFamily="Georgia, serif"
            >
              {town.name}
            </text>
          </g>
        );
      })}

      {/* Scale hint */}
      <line x1="600" y1="430" x2="680" y2="430" stroke="#8b7d6b" strokeWidth="1.5" />
      <text x="640" y="445" textAnchor="middle" fill="#8b7d6b" fontSize="10" fontFamily="monospace">
        ~5km
      </text>
    </svg>
  );
}

// Listing card component
function ListingCard({ listing }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "18px 20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #e8e2d8",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "15px",
            fontWeight: 700,
            color: "#2d2926",
            fontFamily: "Georgia, serif",
            lineHeight: 1.3,
            flex: 1,
            paddingRight: "10px",
          }}
        >
          {listing.title}
        </h3>
        {listing.price && (
          <span
            style={{
              background: "#2c6e49",
              color: "#fff",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              fontFamily: "monospace",
            }}
          >
            CHF {listing.price}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
          fontSize: "13px",
          color: "#6b6056",
        }}
      >
        {listing.town && (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            📍 {listing.town}
          </span>
        )}
        {listing.rooms && (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            🏠 {listing.rooms} pièces
          </span>
        )}
        {listing.surface && (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            📐 {listing.surface} m²
          </span>
        )}
      </div>

      {listing.description && (
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "#7a7068",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {listing.description}
        </p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4px",
        }}
      >
        {listing.source && (
          <span
            style={{
              fontSize: "11px",
              color: "#fff",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              background: GERANCES.some((g) => listing.source?.includes(g.name.split(" ")[0])) ? "#2c6e49" : "#8b7d6b",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {listing.source}
          </span>
        )}
        {listing.url && (
          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "13px",
              color: "#c0392b",
              textDecoration: "none",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Voir l'annonce →
          </a>
        )}
      </div>
    </div>
  );
}

export default function LaCoteRentals() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchDone, setSearchDone] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Filters
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRooms, setMinRooms] = useState(1);
  const [selectedTown, setSelectedTown] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearchDone(false);
    setStatusMsg("Lancement de la recherche…");

    const townNames = TOWNS.map((t) => t.name).join(", ");

    const geranceNames = GERANCES.map((g) => `${g.name} (${g.town})`).join(", ");
    const geranceUrls = GERANCES.slice(0, 12).map((g) => g.url).join(", ");

    const systemPrompt = `You are a Swiss real estate search assistant specializing in the La Côte region (canton de Vaud). Your job is to search for apartment rental listings from both major platforms AND local property management companies (gérances). Always use web search to find real, current listings. After searching, return ONLY a valid JSON array of listings, no other text. Each listing object must have: title, price (number), rooms (number), surface (number or null), town, description, source, url.`;

    const userPrompt = `Search for current apartment rental listings ("appartement à louer") in the La Côte region of Switzerland, near these towns within 10km of Rolle: ${townNames}.

IMPORTANT: Search on BOTH major platforms AND local gérances (property management companies):

1. Major platforms: immoscout24.ch, homegate.ch for "appartement louer Rolle", "location Gland", "louer Nyon", "louer Morges"

2. Local USPI Vaud gérances active in La Côte - search their websites for current rental offers:
${geranceNames}

Key gérance websites to check: ${geranceUrls}

Search for "location appartement" on each gérance site. Extract real listings with actual prices and addresses.

After searching, return ONLY a JSON array with this exact format, no markdown, no backticks, no explanation:
[{"title":"Bel appartement 3.5 pièces","price":1850,"rooms":3.5,"surface":85,"town":"Rolle","description":"Lumineux appartement avec vue lac","source":"Cogestim","url":"https://example.com"}]

The "source" field should be the name of the gérance or platform where you found the listing.
Include every listing you find. Use null for missing fields. Find as many as possible (aim for 20+).`;

    try {
      let messages = [{ role: "user", content: userPrompt }];
      let allText = "";
      let maxTurns = 15; // safety limit for the conversation loop
      let turnCount = 0;

      while (turnCount < maxTurns) {
        turnCount++;
        setStatusMsg(
          turnCount === 1
            ? "Connexion aux plateformes immobilières…"
            : `Recherche en cours… (étape ${turnCount})`
        );

        const response = await fetch(
          "https://api.anthropic.com/v1/messages",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 16000,
              system: systemPrompt,
              tools: [
                { type: "web_search_20250305", name: "web_search" },
              ],
              messages,
            }),
          }
        );

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || "API error");
        }

        // Collect text from this turn
        const turnText = (data.content || [])
          .filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("\n");

        if (turnText) allText += "\n" + turnText;

        // If the model is done (not requesting more tool use), we're finished
        if (data.stop_reason === "end_turn" || data.stop_reason === "stop") {
          break;
        }

        // If the model wants to use tools, we need to feed back the response
        // and continue the conversation. The web_search tool is server-side,
        // so we just pass the full content back as an assistant turn.
        if (data.stop_reason === "tool_use") {
          // Add assistant response to conversation
          messages = [
            ...messages,
            { role: "assistant", content: data.content },
          ];

          // For each tool_use block, add a tool_result
          // With server-side web search, the results come automatically,
          // but we need to add placeholder tool results for any tool_use blocks
          const toolUseBlocks = (data.content || []).filter(
            (b) => b.type === "tool_use"
          );

          if (toolUseBlocks.length > 0) {
            const toolResults = toolUseBlocks.map((block) => ({
              type: "tool_result",
              tool_use_id: block.id,
              content: "Search completed. Please continue searching or compile the final results as a JSON array.",
            }));

            messages = [
              ...messages,
              { role: "user", content: toolResults },
            ];
          } else {
            // No tool_use blocks but stop_reason is tool_use? Break to avoid infinite loop
            break;
          }
        } else {
          // Unknown stop reason, break
          break;
        }
      }

      // Parse all collected text
      if (allText.trim()) {
        const parsed = parseListings(allText);
        if (parsed.length > 0) {
          setListings(parsed);
          setStatusMsg("");
        } else {
          // Debug: show first 300 chars of response
          console.log("Raw API text:", allText.substring(0, 500));
          setError(
            "Résultats reçus mais impossible de les structurer. La réponse ne contenait pas de données JSON exploitables. Essayez à nouveau."
          );
        }
      } else {
        setError("Aucune donnée textuelle reçue de l'API. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
      setSearchDone(true);
      setStatusMsg("");
    }
  }, []);

  // Filter listings
  const filtered = listings.filter((l) => {
    if (l.price && l.price > maxPrice) return false;
    if (l.rooms && l.rooms < minRooms) return false;
    if (selectedTown && l.town && !l.town.toLowerCase().includes(selectedTown.toLowerCase())) return false;
    if (selectedSource && l.source && !l.source.toLowerCase().includes(selectedSource.toLowerCase())) return false;
    return true;
  });

  // Get unique sources from listings
  const sources = [...new Set(listings.map((l) => l.source).filter(Boolean))].sort();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f0e8",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        color: "#2d2926",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #2c2420 0%, #4a3f38 100%)",
          padding: "28px 32px 24px",
          borderBottom: "3px solid #c0392b",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 700,
                color: "#f5f0e8",
                letterSpacing: "-0.5px",
              }}
            >
              La Côte{" "}
              <span style={{ color: "#c0392b", fontStyle: "italic" }}>
                Rentals
              </span>
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "14px",
                color: "#a09888",
                fontStyle: "italic",
              }}
            >
              Appartements à louer · 10km autour de Rolle · {GERANCES.length} gérances USPI
            </p>
          </div>

          <button
            onClick={fetchListings}
            disabled={loading}
            style={{
              background: loading ? "#8b7d6b" : "#c0392b",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              fontFamily: "Georgia, serif",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                    border: "2px solid #fff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Recherche en cours…
              </>
            ) : (
              <>🔍 Rechercher des annonces</>
            )}
          </button>
        </div>
      </header>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #c0392b;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
      `}</style>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* Quick links - Platforms */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#8b7d6b", alignSelf: "center", fontWeight: 600 }}>
              Portails:
            </span>
            {PLATFORM_LINKS.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, color: p.color, border: `1.5px solid ${p.color}`, textDecoration: "none", transition: "all 0.2s", fontFamily: "monospace" }}
                onMouseEnter={(e) => { e.target.style.background = p.color; e.target.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = p.color; }}
              >{p.name} ↗</a>
            ))}
          </div>
          {/* Gérances */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#8b7d6b", alignSelf: "center", fontWeight: 600 }}>
              Gérances USPI ({GERANCES.length}):
            </span>
            {GERANCES.map((g) => (
              <a key={g.name} href={g.url} target="_blank" rel="noopener noreferrer"
                style={{ padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 500, color: "#2c6e49", border: "1px solid #b8d8c8", textDecoration: "none", transition: "all 0.2s", fontFamily: "monospace", background: "#f0f8f4" }}
                onMouseEnter={(e) => { e.target.style.background = "#2c6e49"; e.target.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.target.style.background = "#f0f8f4"; e.target.style.color = "#2c6e49"; }}
                title={`${g.name} — ${g.town} — ${g.phone}`}
              >{g.name} ↗</a>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Map */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1px solid #e8e2d8",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "16px",
                fontWeight: 700,
                color: "#4a4440",
              }}
            >
              🗺️ Carte de La Côte
            </h2>
            <div style={{ height: "320px" }}>
              <LaCoteMap
                listings={filtered}
                selectedTown={selectedTown}
                onTownClick={(name) =>
                  setSelectedTown(selectedTown === name ? "" : name)
                }
              />
            </div>
            {selectedTown && (
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "13px",
                  color: "#8b7d6b",
                  textAlign: "center",
                }}
              >
                Filtre actif:{" "}
                <strong style={{ color: "#c0392b" }}>{selectedTown}</strong>{" "}
                <span
                  onClick={() => setSelectedTown("")}
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    marginLeft: "8px",
                  }}
                >
                  effacer
                </span>
              </p>
            )}
          </div>

          {/* Filters */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: "1px solid #e8e2d8",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 700,
                color: "#4a4440",
              }}
            >
              ⚙️ Filtres
            </h2>

            {/* Price slider */}
            <div>
              <label
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  color: "#6b6056",
                  marginBottom: "8px",
                }}
              >
                <span>Loyer max.</span>
                <strong style={{ color: "#2c6e49", fontFamily: "monospace" }}>
                  CHF {maxPrice.toLocaleString()}
                </strong>
              </label>
              <input
                type="range"
                min="500"
                max="6000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: "#c0392b",
                  height: "6px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "11px",
                  color: "#a09888",
                  marginTop: "4px",
                }}
              >
                <span>CHF 500</span>
                <span>CHF 6'000</span>
              </div>
            </div>

            {/* Rooms */}
            <div>
              <label
                style={{
                  fontSize: "14px",
                  color: "#6b6056",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Pièces minimum
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRooms(r)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border:
                        minRooms === r
                          ? "2px solid #c0392b"
                          : "1px solid #d4ccb8",
                      background: minRooms === r ? "#c0392b" : "transparent",
                      color: minRooms === r ? "#fff" : "#6b6056",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "monospace",
                      transition: "all 0.15s",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Town dropdown */}
            <div>
              <label style={{ fontSize: "14px", color: "#6b6056", display: "block", marginBottom: "8px" }}>Localité</label>
              <select value={selectedTown} onChange={(e) => setSelectedTown(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #d4ccb8", fontSize: "14px", fontFamily: "Georgia, serif", color: "#2d2926", background: "#faf8f4", cursor: "pointer" }}>
                <option value="">Toutes les localités</option>
                {TOWNS.map((t) => (<option key={t.name} value={t.name}>{t.name}</option>))}
              </select>
            </div>

            {/* Source dropdown */}
            <div>
              <label style={{ fontSize: "14px", color: "#6b6056", display: "block", marginBottom: "8px" }}>Source / Gérance</label>
              <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #d4ccb8", fontSize: "14px", fontFamily: "Georgia, serif", color: "#2d2926", background: "#faf8f4", cursor: "pointer" }}>
                <option value="">Toutes les sources</option>
                {sources.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>

            {/* Summary */}
            <div
              style={{
                padding: "12px 16px",
                background: "#faf8f4",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#6b6056",
                borderLeft: "3px solid #2c6e49",
                marginTop: "auto",
              }}
            >
              <strong style={{ color: "#2c6e49" }}>{filtered.length}</strong>{" "}
              annonce{filtered.length !== 1 ? "s" : ""} trouvée
              {filtered.length !== 1 ? "s" : ""}
              {listings.length !== filtered.length && (
                <span>
                  {" "}
                  (sur {listings.length} au total)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "16px 20px",
              background: "#fdf0ee",
              border: "1px solid #e8c5c0",
              borderRadius: "10px",
              color: "#c0392b",
              fontSize: "14px",
              marginBottom: "20px",
              animation: "fadeIn 0.3s ease",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid #e8e2d8",
                borderTopColor: "#c0392b",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <p style={{ fontSize: "16px", color: "#6b6056", margin: 0 }}>
              {statusMsg || "Recherche d'annonces sur les plateformes suisses…"}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#a09888",
                margin: "8px 0 0",
              }}
            >
              Cela peut prendre 30-60 secondes (recherches multiples)
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !searchDone && listings.length === 0 && (
          <div
            style={{
              padding: "60px",
              textAlign: "center",
              background: "#fff",
              borderRadius: "12px",
              border: "1px dashed #d4ccb8",
            }}
          >
            <p style={{ fontSize: "40px", margin: "0 0 12px" }}>🏔️</p>
            <p
              style={{
                fontSize: "18px",
                color: "#4a4440",
                fontWeight: 600,
                margin: "0 0 8px",
              }}
            >
              Bienvenue sur La Côte Rentals
            </p>
            <p style={{ fontSize: "14px", color: "#8b7d6b", margin: 0 }}>
              Cliquez sur{" "}
              <strong style={{ color: "#c0392b" }}>
                "Rechercher des annonces"
              </strong>{" "}
              pour lancer la recherche
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && filtered.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#2d2926",
                margin: "0 0 16px",
              }}
            >
              Annonces disponibles
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "16px",
              }}
            >
              {filtered.map((listing, i) => (
                <div
                  key={i}
                  style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No results after search */}
        {!loading && searchDone && filtered.length === 0 && listings.length > 0 && (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #e8e2d8",
            }}
          >
            <p style={{ fontSize: "15px", color: "#6b6056" }}>
              Aucune annonce ne correspond à vos filtres. Essayez d'ajuster vos
              critères.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "20px 32px",
          textAlign: "center",
          fontSize: "12px",
          color: "#a09888",
          borderTop: "1px solid #e8e2d8",
          marginTop: "40px",
        }}
      >
        La Côte Rentals · {GERANCES.length} gérances USPI Vaud · Données agrégées via recherche web · Vérifiez
        toujours les annonces sur les sites officiels
      </footer>
    </div>
  );
}
