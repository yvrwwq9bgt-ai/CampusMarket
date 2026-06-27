const sourceText = document.querySelector("#sourceText");
const claimInput = document.querySelector("#claimInput");
const experienceInput = document.querySelector("#experienceInput");
const evidenceInput = document.querySelector("#evidenceInput");
const counterInput = document.querySelector("#counterInput");
const checkerScoreInput = document.querySelector("#checkerScoreInput");
const genreSelect = document.querySelector("#genreSelect");
const toneSelect = document.querySelector("#toneSelect");
const targetLengthInput = document.querySelector("#targetLengthInput");
const rewriteOutput = document.querySelector("#rewriteOutput");
const briefOutput = document.querySelector("#briefOutput");
const charCount = document.querySelector("#charCount");
const readinessScore = document.querySelector("#readinessScore");
const chunkCount = document.querySelector("#chunkCount");
const meterFill = document.querySelector("#meterFill");
const statusCard = document.querySelector("#statusCard");
const statusTitle = document.querySelector("#statusTitle");
const statusText = document.querySelector("#statusText");
const signalList = document.querySelector("#signalList");
const todoList = document.querySelector("#todoList");
const checkerNote = document.querySelector("#checkerNote");
const chunkList = document.querySelector("#chunkList");
const splitterPanel = document.querySelector("#splitterPanel");
const copyButton = document.querySelector("#copyButton");
const copyOpenButton = document.querySelector("#copyOpenButton");
const rewriteButton = document.querySelector("#rewriteButton");
const copyRewriteButton = document.querySelector("#copyRewriteButton");
const applyRewriteButton = document.querySelector("#applyRewriteButton");
const rewriteModeInputs = [...document.querySelectorAll('input[name="rewriteMode"]')];
const copyBriefButton = document.querySelector("#copyBriefButton");
const clearButton = document.querySelector("#clearButton");
const toast = document.querySelector("#toast");

const MAX_CHARS = 10000;
const RECOMMENDED_CHARS = 500;
const STORAGE_KEY = "authorship-desk-state";
const CHECKER_URL = "https://ai-tool.userlocal.jp/ai_classifier";

const phraseChecks = [
  {
    label: "常套句",
    hint: "自分の対象・時期・場面がわかる語に置き換える",
    patterns: [
      "現代社会において",
      "近年",
      "重要です",
      "必要があります",
      "と言えるでしょう",
      "多くの人々",
      "さまざまな",
      "メリットとデメリット",
      "以上のことから",
    ],
  },
  {
    label: "弱い断定",
    hint: "根拠を添えて、言い切れる範囲を絞る",
    patterns: ["考えられます", "思われます", "可能性があります", "ではないでしょうか"],
  },
];

const sourceMarkers = [
  "によると",
  "調査",
  "研究",
  "論文",
  "報告",
  "出典",
  "引用",
  "ページ",
  "p.",
  "http",
  "年",
  "%",
];

const fields = [sourceText, claimInput, experienceInput, evidenceInput, counterInput, checkerScoreInput, rewriteOutput];
const writerControls = [genreSelect, toneSelect, targetLengthInput];
const rewriteReplacements = [
  ["現代社会において、", ""],
  ["現代社会において", "このテーマでは"],
  ["近年、", ""],
  ["多くの人々", "利用者"],
  ["さまざまな", "複数の"],
  ["メリットとデメリット", "利点と課題"],
  ["重要です", "重要だ"],
  ["必要があります", "必要だ"],
  ["と言えるでしょう", "と言える"],
  ["考えられます", "考えられる"],
  ["思われます", "見られる"],
  ["可能性があります", "可能性がある"],
  ["ではないでしょうか", "だと考える"],
];

const copyText = async (text) => {
  if (!text) {
    showToast("コピーする内容がありません");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("コピーしました");
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.className = "clipboard-helper";
    document.body.append(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    showToast("コピーしました");
  }
};

const splitIntoChunks = (text) => {
  const chunks = [];

  for (let index = 0; index < text.length; index += MAX_CHARS) {
    chunks.push(text.slice(index, index + MAX_CHARS));
  }

  return chunks.length > 0 ? chunks : [""];
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
};

const getSentences = (text) =>
  text
    .split(/[。！？\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const countPhraseHits = (text) =>
  phraseChecks.flatMap((group) =>
    group.patterns
      .filter((pattern) => text.includes(pattern))
      .map((pattern) => ({
        group: group.label,
        pattern,
        hint: group.hint,
      }))
  );

const countMarkers = (text) => sourceMarkers.filter((marker) => text.includes(marker)).length;

const ensureSentence = (text) => {
  const cleanText = text.trim().replace(/\s+/g, " ");
  if (!cleanText) return "";
  return /[。！？]$/.test(cleanText) ? cleanText : `${cleanText}。`;
};

const stripEndPunctuation = (text) => text.trim().replace(/[。！？]+$/, "");

const getRewriteMode = () =>
  rewriteModeInputs.find((input) => input.checked)?.value || "strong";

const segmentDraft = (text) =>
  text
    .replace(/\r/g, "")
    .split(/\n+/)
    .flatMap((paragraph) => paragraph.match(/[^。！？]+[。！？]?/g) || [])
    .map((sentence) => sentence.trim())
    .filter(Boolean);

const splitLongSentence = (sentence) => {
  if (sentence.length <= 86 || !sentence.includes("、")) return sentence;

  const body = sentence.replace(/[。！？]$/, "");
  const commaIndexes = [...body.matchAll(/、/g)].map((match) => match.index);
  const targetIndex = body.length / 2;
  const splitIndex = commaIndexes.reduce((best, current) =>
    Math.abs(current - targetIndex) < Math.abs(best - targetIndex) ? current : best
  );

  return `${body.slice(0, splitIndex)}。\n${ensureSentence(body.slice(splitIndex + 1))}`;
};

const rewriteSentence = (sentence) => {
  let next = sentence;
  rewriteReplacements.forEach(([from, to]) => {
    next = next.replaceAll(from, to);
  });
  return splitLongSentence(ensureSentence(next));
};

const normalizePoint = (text) => {
  let next = stripEndPunctuation(text)
    .replace(/^また、?/, "")
    .replace(/^そして、?/, "")
    .replace(/^さらに、?/, "")
    .replace(/^つまり、?/, "")
    .replace(/^以上のことから、?/, "")
    .trim();

  rewriteReplacements.forEach(([from, to]) => {
    next = next.replaceAll(from, to);
  });

  return next;
};

const pickDraftPoints = (text, limit = 3) => {
  const seen = new Set();

  return segmentDraft(text)
    .map(normalizePoint)
    .filter((sentence) => sentence.length >= 12)
    .filter((sentence) => {
      const key = sentence.slice(0, 18);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
};

const joinPoints = (points) => {
  if (points.length === 0) return "";
  if (points.length === 1) return ensureSentence(points[0]);
  return ensureSentence(`${points.slice(0, -1).join("。")}。加えて、${points.at(-1)}`);
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getTargetLength = () => clamp(Number(targetLengthInput.value) || 800, 300, 3000);

const getWriterSettings = () => ({
  genre: genreSelect.value,
  tone: toneSelect.value,
  targetLength: getTargetLength(),
});

const getMaterialCount = () =>
  [sourceText, claimInput, experienceInput, evidenceInput, counterInput].filter((field) => field.value.trim()).length;

const inferSubject = (claim, draftPoints) => {
  const source = claim || draftPoints[0] || "このテーマ";
  const beforeTopicMarker = source.split(/は、|は|について|に関して/)[0]?.trim();

  if (beforeTopicMarker && beforeTopicMarker.length >= 3 && beforeTopicMarker.length <= 28) {
    return beforeTopicMarker;
  }

  return source
    .replace(/そのまま.+$/, "")
    .replace(/する必要がある.*$/, "")
    .replace(/と考える.*$/, "")
    .replace(/という点.*$/, "")
    .slice(0, 28)
    .trim() || "このテーマ";
};

const getContext = (text) => {
  const claim = stripEndPunctuation(claimInput.value);
  const experience = stripEndPunctuation(experienceInput.value);
  const evidence = stripEndPunctuation(evidenceInput.value);
  const counter = stripEndPunctuation(counterInput.value);
  const draftPoints = pickDraftPoints(text, 5);
  const subject = inferSubject(claim, draftPoints);
  const topic = claim || draftPoints[0] || subject;

  return {
    claim,
    counter,
    draftPoints,
    evidence,
    experience,
    subject,
    topic,
  };
};

const sentenceJoin = (...parts) => ensureSentence(parts.filter(Boolean).join(""));

const buildParagraphsByGenre = (context, settings) => {
  const { claim, counter, draftPoints, evidence, experience, subject, topic } = context;
  const keyPoint = draftPoints[0] || (claim ? `${subject}を使う場面では、便利さだけでなく確認の責任も問題になる` : topic);
  const otherPoints = draftPoints.slice(1, 4);

  if (settings.genre === "application") {
    return [
      `私がこの文章で伝えたい中心は、${claim || `${subject}について自分の考えを示すこと`}です。単に結論を置くだけでなく、その考えに至った経験と根拠を示すことで、読み手に納得してもらえる文章にします。`,
      experience
        ? `特に大きかったのは、${experience}という経験です。この経験を通して、私は${claim || keyPoint}を自分の問題として考えるようになりました。`
        : `きっかけになったのは、${keyPoint}という点です。ここを具体的に書くことで、文章が一般論だけで終わらなくなります。`,
      evidence
        ? `また、${evidence}も、この考えを支える材料になります。経験だけでは主観に寄りすぎるため、資料や数字を合わせて示すことが大切です。`
        : `ただし、説得力を高めるには、経験に加えて資料や数字を確認する必要があります。根拠を足すことで、読み手は判断の筋道を追いやすくなります。`,
      counter
        ? `一方で、${counter}という見方もあります。私はその点を認めたうえで、それでも${claim || topic}と考えます。`
        : `もちろん、別の見方がないわけではありません。だからこそ、良い面だけでなく注意点も入れながら、自分の考えを丁寧に示します。`,
      `以上の理由から、私は${claim || `${subject}について考え続けること`}を大切にしたいです。この文章では、結論、経験、根拠、注意点を順に示すことで、自分の言葉として伝わる内容にします。`,
    ];
  }

  if (settings.genre === "explain") {
    return [
      `この文章では、${subject}について説明する。最初に結論を示すと、重要なのは${claim || keyPoint}という点である。`,
      `背景には、${joinPoints([keyPoint, ...otherPoints]).replace(/[。！？]$/, "")}という事情がある。これらを分けて考えると、問題の中心が見えやすくなる。`,
      experience
        ? `具体例として、${experience}がある。この例は、抽象的な説明だけでは伝わりにくい部分を補っている。`
        : `具体例を加えると、説明はさらに伝わりやすくなる。読み手が場面を想像できるように、いつ、どこで、何が起きたのかを入れる必要がある。`,
      evidence
        ? `根拠としては、${evidence}を挙げられる。資料を確認することで、説明は思いつきではなく、検討できる情報になる。`
        : `根拠が弱い場合は、資料名、調査結果、ページ番号などを補う必要がある。ここが入ると、説明の信頼性が上がる。`,
      counter
        ? `ただし、${counter}という点もある。そのため、説明では一つの面だけを強調せず、条件や限界も示すことが必要である。`
        : `最後に、条件や限界も確認しておきたい。どの場面でも同じように言えるとは限らないため、使える範囲を示すと説明が安定する。`,
    ];
  }

  if (settings.genre === "opinion") {
    return [
      `私は、${claim || `${subject}について考える必要がある`}と考える。理由は、${claim || keyPoint}という点が、文章全体の判断を左右するからである。`,
      otherPoints.length
        ? `下書きの中で残したい要素は、${joinPoints(otherPoints).replace(/[。！？]$/, "")}である。ただ並べるだけでは弱いので、どれが理由で、どれが具体例なのかを分けて書く。`
        : `この考えを強くするには、結論のあとに理由を置き、その理由を具体例と根拠で支える必要がある。`,
      experience
        ? `実際に、${experience}。この経験があるため、私はこの問題を遠い話ではなく、自分に関係することとして捉えている。`
        : `自分の経験を入れると、文章は一気に具体的になる。どの場面でそう感じたのかを入れることで、読み手は主張の背景を理解しやすくなる。`,
      evidence
        ? `さらに、${evidence}という根拠がある。主張を経験だけで支えると印象論になりやすいが、資料を合わせることで説得力が増す。`
        : `ただし、現時点では根拠がまだ弱い。資料や数字を確認し、主張を支える情報を本文に入れる必要がある。`,
      counter
        ? `もちろん、${counter}という反論も考えられる。しかし、その点を踏まえても、私は${claim || topic}という立場を取る。`
        : `反対の見方にも触れる必要がある。反論を入れることで、文章は単なる賛成意見ではなく、考えたうえでの結論になる。`,
      `したがって、結論は${claim || `${subject}について自分の立場を明確にすること`}である。結論、理由、経験、根拠、反論をこの順に並べることで、読み手に伝わる文章になる。`,
    ];
  }

  return [
    `本稿では、${subject}について考える。結論から言えば、${claim || keyPoint}という点を中心に論じるべきである。`,
    `第一に、${joinPoints([keyPoint, ...otherPoints]).replace(/[。！？]$/, "")}という背景がある。これは単なる一般論ではなく、本文全体の前提になる部分である。`,
    experience
      ? `第二に、${experience}という具体的な観察がある。この観察を入れることで、主張は抽象的な説明から離れ、筆者自身の問題意識に結びつく。`
      : `第二に、具体的な観察が必要である。自分が見た場面や考えた過程を入れなければ、文章は資料の要約に近づいてしまう。`,
    evidence
      ? `第三に、${evidence}という根拠を確認できる。根拠を示すことで、読み手は主張の妥当性を検討しやすくなる。`
      : `第三に、根拠の補強が必要である。資料名、数字、ページ番号などを本文に入れることで、主張の確認可能性が高まる。`,
    counter
      ? `もっとも、${counter}という限界もある。この点を本文に含めることで、主張は一面的ではなくなる。`
      : `もっとも、限界や反論も確認する必要がある。反対の見方を避けるより、先に認めたうえで結論を示すほうが文章は強くなる。`,
    `以上より、${claim || topic}という結論に至る。下書きの一般的な表現を減らし、根拠と観察を本文の中心に置くことで、より説得力のある文章になる。`,
  ];
};

const toneRewrite = (paragraphs, tone) => {
  if (tone === "academic") {
    return paragraphs.map((paragraph) =>
      paragraph
        .replaceAll("示します。", "示す。")
        .replaceAll("確認します。", "確認する。")
        .replaceAll("考えます。", "考える。")
        .replaceAll("なります。", "なる。")
        .replaceAll("します。", "する。")
        .replaceAll("です。", "である。")
        .replaceAll("思います。", "考える。")
        .replaceAll("私は、", "本稿では、")
        .replaceAll("私は", "本稿では")
    );
  }

  if (tone === "personal") {
    return paragraphs.map((paragraph, index) => {
      if (index === 0 && !paragraph.startsWith("私は")) return `私は、${paragraph}`;
      return paragraph
        .replaceAll("本稿では、", "私は、")
        .replaceAll("本稿では", "私は")
        .replaceAll("である。", "だ。");
    });
  }

  if (tone === "concise") {
    return paragraphs.map((paragraph) =>
      paragraph
        .replace(/。この[^。]+。/g, "。")
        .replace(/。そのため、/g, "。")
        .replace(/。ただし、/g, "。ただし、")
    );
  }

  return paragraphs;
};

const expansionSentences = (context, settings) => {
  const { claim, counter, draftPoints, evidence, experience, subject, topic } = context;
  const pointText = joinPoints(draftPoints).replace(/[。！？]$/, "") || topic;
  const base = [
    `ここで大切なのは、結論を急がず、なぜそう考えるのかを一つずつ示すことである。`,
    `読み手にとって分かりやすい文章にするには、主張と根拠の対応関係をはっきりさせる必要がある。`,
    draftPoints.length
      ? `下書きに含まれる${pointText}という要素は使えるが、そのまま並べるだけでは説得力が弱い。`
      : `入力された主張だけでは説明が薄くなりやすいため、${subject}について理由、経験、根拠を分けて補う必要がある。`,
    claim ? `特に、${claim}という主張は、本文の最初と最後でぶれないように置く必要がある。` : "",
    experience ? `また、${experience}という経験は、筆者自身の視点を示す材料として使える。` : "",
    evidence ? `さらに、${evidence}を本文に入れることで、主張を確認できる形にできる。` : "",
    counter ? `一方で、${counter}という点を入れると、文章は単純な賛成や反対に見えにくくなる。` : "",
    settings.genre === "report"
      ? `レポートでは、感想だけで終わらせず、資料と考察を分けて示すことが重要である。`
      : `意見を伝える文章では、読み手が反対の立場にいても追えるように、理由の順番を整える必要がある。`,
    `その結果、文章は単なる言い換えではなく、筆者が何を見て、何を根拠に、どこまで言えると判断したのかを示すものになる。`,
  ].filter(Boolean);

  return toneRewrite(base, settings.tone);
};

const expandToTarget = (paragraphs, context, settings) => {
  const next = [...paragraphs];
  const additions = expansionSentences(context, settings);
  let additionIndex = 0;

  while (next.join("\n\n").length < settings.targetLength && additionIndex < additions.length) {
    const targetParagraph = clamp((additionIndex % Math.max(1, next.length - 1)) + 1, 0, next.length - 1);
    next[targetParagraph] = `${next[targetParagraph]}${additions[additionIndex]}`;
    additionIndex += 1;
  }

  return next;
};

const trimToTarget = (text, targetLength) => {
  if (text.length <= targetLength + 260) return text;
  const paragraphs = text.split(/\n{2,}/);
  const trimmed = [];

  for (const paragraph of paragraphs) {
    if ([...trimmed, paragraph].join("\n\n").length > targetLength + 220) break;
    trimmed.push(paragraph);
  }

  return trimmed.join("\n\n") || text.slice(0, targetLength + 220);
};

const buildLightRewrite = (text) => {
  if (!text) return "";

  const claim = ensureSentence(claimInput.value);
  const experience = stripEndPunctuation(experienceInput.value);
  const evidence = stripEndPunctuation(evidenceInput.value);
  const counter = stripEndPunctuation(counterInput.value);
  const body = segmentDraft(text).map(rewriteSentence).join("\n");
  const paragraphs = [];

  if (claim) paragraphs.push(claim);
  if (body) paragraphs.push(body);
  if (experience) paragraphs.push(`具体例として、${experience}。`);
  if (evidence) paragraphs.push(`根拠として、${evidence}。`);
  if (counter) paragraphs.push(`一方で、${counter}。`);

  return paragraphs.join("\n\n");
};

const buildStrongRewrite = (text) => {
  const settings = getWriterSettings();
  const context = getContext(text);
  const baseParagraphs = buildParagraphsByGenre(context, settings);
  const tonedParagraphs = toneRewrite(baseParagraphs, settings.tone);
  const expandedParagraphs = expandToTarget(tonedParagraphs, context, settings);

  return trimToTarget(expandedParagraphs.join("\n\n"), settings.targetLength);
};

const buildRebuildRewrite = (text) => {
  const settings = getWriterSettings();
  const context = getContext(text);
  const rewrittenContext = {
    ...context,
    draftPoints: context.draftPoints.slice(0, 2),
  };
  const baseParagraphs = buildParagraphsByGenre(rewrittenContext, settings).map((paragraph, index) => {
    if (index === 0) {
      return paragraph.replace("下書きの内容で", "文章の中心として");
    }
    return paragraph;
  });
  const craftParagraph = settings.genre === "report"
    ? `全体の構成は、問題提起、理由、具体例、根拠、限界、結論の順にする。この順番にすると、読み手は主張の流れを追いやすく、筆者の判断も見えやすい。`
    : `全体の構成は、結論を先に出し、そのあとに理由と具体例を重ねる形にする。最後に反対の見方へ触れることで、文章の厚みを出す。`;
  const tonedParagraphs = toneRewrite([baseParagraphs[0], craftParagraph, ...baseParagraphs.slice(1)], settings.tone);
  const expandedParagraphs = expandToTarget(tonedParagraphs, rewrittenContext, settings);

  return trimToTarget(expandedParagraphs.join("\n\n"), settings.targetLength);
};

const buildRewrite = (text) => {
  const mode = getRewriteMode();
  if (mode === "light") return text ? buildLightRewrite(text) : buildStrongRewrite(text);
  if (mode === "rebuild") return buildRebuildRewrite(text);
  return buildStrongRewrite(text);
};

const getAnalysis = (text) => {
  const sentences = getSentences(text);
  const averageSentenceLength = sentences.length
    ? Math.round(text.replace(/\s/g, "").length / sentences.length)
    : 0;
  const longSentences = sentences.filter((sentence) => sentence.length > 80).length;
  const phraseHits = countPhraseHits(text);
  const markerCount = countMarkers(text);
  const numericDetails = (text.match(/[0-9０-９]/g) || []).length;

  return {
    sentences,
    averageSentenceLength,
    longSentences,
    phraseHits,
    markerCount,
    numericDetails,
  };
};

const calculateReadiness = (text, analysis) => {
  const materialScores = [
    claimInput.value.trim().length >= 12 ? 18 : 0,
    experienceInput.value.trim().length >= 24 ? 18 : 0,
    evidenceInput.value.trim().length >= 24 ? 18 : 0,
    counterInput.value.trim().length >= 16 ? 14 : 0,
  ];
  const draftScore = text.length >= RECOMMENDED_CHARS ? 16 : Math.round((text.length / RECOMMENDED_CHARS) * 16);
  const evidenceScore = analysis.markerCount > 0 || analysis.numericDetails >= 3 ? 10 : 0;
  const sentenceScore = analysis.averageSentenceLength > 0 && analysis.averageSentenceLength <= 70 ? 8 : 0;
  const phrasePenalty = Math.min(12, analysis.phraseHits.length * 3);

  return Math.max(0, Math.min(100, materialScores.reduce((sum, score) => sum + score, 0) + draftScore + evidenceScore + sentenceScore - phrasePenalty));
};

const getStatus = (score, length) => {
  if (length === 0) {
    return {
      tone: "empty",
      title: "下書きを貼り付け",
      text: "改稿準備度",
    };
  }

  if (score < 45) {
    return {
      tone: "low",
      title: "材料が不足",
      text: "主張・根拠を追加",
    };
  }

  if (score < 75) {
    return {
      tone: "medium",
      title: "改稿途中",
      text: "具体例を強化",
    };
  }

  return {
    tone: "good",
    title: "材料あり",
    text: "本文に反映",
  };
};

const makeSignal = (label, value, tone = "neutral") => {
  const item = document.createElement("div");
  item.className = "signal-item";
  item.dataset.tone = tone;

  const name = document.createElement("span");
  name.textContent = label;

  const stat = document.createElement("strong");
  stat.textContent = value;

  item.append(name, stat);
  return item;
};

const renderSignals = (text, analysis) => {
  signalList.innerHTML = "";
  const materialCount = [claimInput, experienceInput, evidenceInput, counterInput].filter((field) => field.value.trim()).length;

  signalList.append(
    makeSignal("文数", `${analysis.sentences.length}文`),
    makeSignal(
      "平均文長",
      analysis.averageSentenceLength ? `${analysis.averageSentenceLength}字` : "-",
      analysis.averageSentenceLength > 70 ? "warn" : "good"
    ),
    makeSignal("長い文", `${analysis.longSentences}文`, analysis.longSentences > 0 ? "warn" : "good"),
    makeSignal("資料の手がかり", `${analysis.markerCount + analysis.numericDetails}件`, analysis.markerCount + analysis.numericDetails > 0 ? "good" : "warn"),
    makeSignal("定型表現", `${analysis.phraseHits.length}件`, analysis.phraseHits.length > 0 ? "warn" : "good"),
    makeSignal("本人材料", `${materialCount}/4`, materialCount >= 3 ? "good" : "warn")
  );

  if (!text) {
    signalList.innerHTML = "";
    signalList.append(makeSignal("状態", "未入力"));
  }
};

const makeTodo = (text) => {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
};

const renderTodos = (text, analysis) => {
  const todos = [];

  if (!text) todos.push("下書き本文を貼り付ける");
  if (text && text.length < RECOMMENDED_CHARS) todos.push("判定前に500字以上まで内容を増やす");
  if (!claimInput.value.trim()) todos.push("主張を1文で書く");
  if (!experienceInput.value.trim()) todos.push("自分の体験・観察・授業メモを足す");
  if (!evidenceInput.value.trim()) todos.push("資料名、数字、URL、ページなどを確認する");
  if (!counterInput.value.trim()) todos.push("反論や限界を1つ入れる");
  if (analysis.longSentences > 0) todos.push("80字を超える文を短く分ける");
  if (analysis.phraseHits.length > 0) todos.push("定型表現を対象固有の言葉に置き換える");
  if (analysis.markerCount === 0 && text) todos.push("出典や調査名が本文から読める形にする");

  if (todos.length === 0) {
    todos.push("改稿メモを見ながら、自分で本文へ反映する");
  }

  todoList.innerHTML = "";
  todos.slice(0, 7).forEach((todo) => todoList.append(makeTodo(todo)));
};

const renderCheckerNote = () => {
  const score = checkerScoreInput.value.trim();

  if (!score) {
    checkerNote.textContent = "未記録";
    checkerNote.dataset.tone = "neutral";
    return;
  }

  const numericScore = Math.max(0, Math.min(100, Number(score)));

  if (Number.isNaN(numericScore)) {
    checkerNote.textContent = "0〜100の数字で記録";
    checkerNote.dataset.tone = "warn";
    return;
  }

  checkerScoreInput.value = String(numericScore);
  checkerNote.textContent = `AI判定 ${numericScore}%：数値は目安。根拠と本人材料を本文で確認。`;
  checkerNote.dataset.tone = numericScore >= 50 ? "warn" : "good";
};

const renderBrief = (analysis) => {
  const phraseLines = analysis.phraseHits.length
    ? analysis.phraseHits.map((hit) => `- ${hit.pattern}：${hit.hint}`).join("\n")
    : "- 目立つ定型表現は見つかっていません";

  briefOutput.value = [
    "【主張】",
    claimInput.value.trim() || "未入力",
    "",
    "【体験・観察】",
    experienceInput.value.trim() || "未入力",
    "",
    "【根拠・出典】",
    evidenceInput.value.trim() || "未入力",
    "",
    "【反論・限界】",
    counterInput.value.trim() || "未入力",
    "",
    "【本文で見直す表現】",
    phraseLines,
    "",
    "【次にやること】",
    [...todoList.querySelectorAll("li")].map((item) => `- ${item.textContent}`).join("\n") || "- 下書きを貼り付ける",
  ].join("\n");
};

const renderChunks = (chunks) => {
  chunkList.innerHTML = "";

  chunks.forEach((chunk, index) => {
    const item = document.createElement("article");
    item.className = "chunk-item";

    const heading = document.createElement("div");
    heading.className = "chunk-heading";

    const title = document.createElement("h3");
    title.textContent = `Part ${index + 1}`;

    const count = document.createElement("span");
    count.textContent = `${chunk.length.toLocaleString()}字`;

    const preview = document.createElement("p");
    preview.textContent = chunk ? chunk.slice(0, 120) : "文章を入力すると、ここに分割プレビューが表示されます。";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "コピー";
    button.disabled = chunk.length === 0;
    button.addEventListener("click", () => copyText(chunk));

    heading.append(title, count);
    item.append(heading, preview, button);
    chunkList.append(item);
  });
};

const saveState = () => {
  const state = {
    sourceText: sourceText.value,
    claimInput: claimInput.value,
    experienceInput: experienceInput.value,
    evidenceInput: evidenceInput.value,
    counterInput: counterInput.value,
    checkerScoreInput: checkerScoreInput.value,
    rewriteOutput: rewriteOutput.value,
    rewriteMode: getRewriteMode(),
    genreSelect: genreSelect.value,
    toneSelect: toneSelect.value,
    targetLengthInput: targetLengthInput.value,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadState = () => {
  try {
    const state = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    sourceText.value = state.sourceText || "";
    claimInput.value = state.claimInput || "";
    experienceInput.value = state.experienceInput || "";
    evidenceInput.value = state.evidenceInput || "";
    counterInput.value = state.counterInput || "";
    checkerScoreInput.value = state.checkerScoreInput || "";
    rewriteOutput.value = state.rewriteOutput || "";
    genreSelect.value = state.genreSelect || "report";
    toneSelect.value = state.toneSelect || "balanced";
    targetLengthInput.value = state.targetLengthInput || "800";
    if (state.rewriteMode) {
      const modeInput = rewriteModeInputs.find((input) => input.value === state.rewriteMode);
      if (modeInput) modeInput.checked = true;
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const update = () => {
  const value = sourceText.value.trim();
  const length = value.length;
  const chunks = splitIntoChunks(value);
  const analysis = getAnalysis(value);
  const score = calculateReadiness(value, analysis);
  const status = getStatus(score, length);
  const progress = Math.min(100, (length / MAX_CHARS) * 100);

  charCount.textContent = length.toLocaleString();
  readinessScore.textContent = String(score);
  chunkCount.textContent = chunks.length.toLocaleString();
  meterFill.style.width = `${progress}%`;
  statusCard.dataset.tone = status.tone;
  statusTitle.textContent = status.title;
  statusText.textContent = status.text;
  copyButton.disabled = length === 0;
  copyOpenButton.disabled = length === 0;
  rewriteButton.disabled = getMaterialCount() === 0;
  copyRewriteButton.disabled = rewriteOutput.value.trim().length === 0;
  applyRewriteButton.disabled = rewriteOutput.value.trim().length === 0;
  splitterPanel.hidden = length <= MAX_CHARS;

  renderSignals(value, analysis);
  renderTodos(value, analysis);
  renderCheckerNote();
  renderBrief(analysis);
  renderChunks(chunks);
  saveState();
};

loadState();
fields.forEach((field) => field.addEventListener("input", update));
writerControls.forEach((field) => field.addEventListener("input", update));
writerControls.forEach((field) => field.addEventListener("change", update));
rewriteModeInputs.forEach((input) => input.addEventListener("change", update));

copyButton.addEventListener("click", () => copyText(sourceText.value.trim().slice(0, MAX_CHARS)));
copyOpenButton.addEventListener("click", async () => {
  await copyText(sourceText.value.trim().slice(0, MAX_CHARS));
  window.open(CHECKER_URL, "_blank", "noopener");
});
rewriteButton.addEventListener("click", () => {
  const rewrite = buildRewrite(sourceText.value.trim());
  if (!rewrite) {
    showToast("下書きか材料を入力してください");
    return;
  }
  rewriteOutput.value = rewrite;
  update();
  showToast("改稿案を作りました");
});
copyRewriteButton.addEventListener("click", () => copyText(rewriteOutput.value.trim()));
applyRewriteButton.addEventListener("click", () => {
  const rewrite = rewriteOutput.value.trim();
  if (!rewrite) {
    showToast("反映する改稿案がありません");
    return;
  }
  sourceText.value = rewrite;
  sourceText.focus();
  update();
  showToast("本文へ反映しました");
});
copyBriefButton.addEventListener("click", () => copyText(briefOutput.value.trim()));
clearButton.addEventListener("click", () => {
  fields.forEach((field) => {
    field.value = "";
  });
  genreSelect.value = "report";
  toneSelect.value = "balanced";
  targetLengthInput.value = "800";
  const strongModeInput = rewriteModeInputs.find((input) => input.value === "strong");
  if (strongModeInput) strongModeInput.checked = true;
  sourceText.focus();
  update();
});

update();
