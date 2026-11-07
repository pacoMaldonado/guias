// @ts-nocheck
/**
 * Rehype plugin that transforms Markdown cheat sheets at build time:
 *
 *  - Every `## Heading` and the content after it is wrapped in a
 *    `<section class="sheet-section">` card inside a 2-column `.sheet-grid`.
 *  - Tables are classified by their last header cell:
 *      "Comando"          -> `cmd-table`: dark terminal boxes with one-click copy.
 *      "Atajo" (o ...)    -> `key-table`: hybrid! Ex/terminal commands become dark
 *                            copyable terminal boxes, while shortcuts become `<kbd>` keycaps.
 *      anything else      -> `def-table`: term / description rows.
 *  - Every fenced `<pre>` code block is wrapped in a `.term-window` with a
 *    macOS-style terminal header bar, language badge, and copy button.
 *    Blocks longer than COLLAPSE_AFTER_LINES get a "Ver todo" toggle.
 *  - Text before the first `##` becomes a `.sheet-intro` tip callout.
 */

const text = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');

const el = (tagName, properties = {}, children = []) => ({
  type: 'element',
  tagName,
  properties,
  children,
});

const isEl = (node, tag) => node.type === 'element' && node.tagName === tag;

const svg = (paths, className) =>
  el(
    'svg',
    { viewBox: '0 0 24 24', width: 16, height: 16, ariaHidden: 'true', className: [className] },
    paths.map((d) => el('path', { d, fill: 'currentColor' })),
  );

const COPY_PATH =
  'M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z';
const CHECK_PATH = 'M21 7 9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59z';

function findAll(node, predicate, out = []) {
  if (predicate(node)) out.push(node);
  for (const child of node.children ?? []) findAll(child, predicate, out);
  return out;
}

/** Tokens longer than this may wrap inside the command box instead of overflowing it. */
const LONG_TOKEN = 28;

/**
 * Tokenize a command string for terminal syntax highlighting.
 */
function tokenizeCommand(displayCmd, isEx) {
  const parts = displayCmd.split(/(\s+)/).filter(Boolean);
  let seenFirstToken = false;

  return parts.map((part) => {
    if (/^\s+$/.test(part)) {
      return { type: 'text', value: part };
    }
    let tokenClass = 'tok-arg';
    if (!seenFirstToken) {
      seenFirstToken = true;
      tokenClass = isEx ? 'tok-ex' : 'tok-bin';
    } else if (/^--?[a-zA-Z0-9]/.test(part)) {
      tokenClass = 'tok-flag';
    } else if (/^(\|\||&&|\||>|>>|2>&1)$/.test(part)) {
      tokenClass = 'tok-op';
    } else if (/^(<[^>]+>|\[[^\]]+\]|%)$/.test(part)) {
      tokenClass = 'tok-var';
    }
    // Very long tokens (e.g. PowerShell .NET calls) may wrap; short ones never break mid-flag.
    const classes = part.length > LONG_TOKEN ? ['tok', tokenClass, 'tok-long'] : ['tok', tokenClass];
    return el('span', { className: classes }, [{ type: 'text', value: part }]);
  });
}

/**
 * Build a dark terminal command box with prompt, highlighted tokens and copy button.
 */
function buildCmdButton(rawCommand) {
  const command = rawCommand.trim();
  const isEx = command.startsWith(':');
  const prompt = isEx ? ':' : '$';
  const displayCmd = isEx ? command.slice(1).trimStart() : command;
  const tokens = tokenizeCommand(displayCmd, isEx);

  return el(
    'button',
    {
      type: 'button',
      className: ['cmd', isEx ? 'cmd-ex' : 'cmd-shell'],
      dataCopy: command,
      ariaLabel: `Copiar comando: ${command}`,
    },
    [
      el('span', { className: ['cmd-prompt'], ariaHidden: 'true' }, [
        { type: 'text', value: prompt },
      ]),
      el('code', { className: ['cmd-text'] }, tokens),
      el('span', { className: ['cmd-state'], ariaHidden: 'true' }, [
        svg([COPY_PATH], 'cmd-icon-copy'),
        svg([CHECK_PATH], 'cmd-icon-done'),
        el('span', { className: ['cmd-state-label'] }, [{ type: 'text', value: 'Copiar' }]),
        el('span', { className: ['cmd-state-done'] }, [{ type: 'text', value: '¡Copiado!' }]),
      ]),
    ],
  );
}

/** Split a key combo like "Ctrl + u" or "<leader> f E" into visual keycaps. */
function toKeycaps(codeNode) {
  const value = text(codeNode).trim();
  const isModifier = (tok) =>
    /^(<leader>|Ctrl|Alt|Shift|Espacio|Tab|Esc)$/i.test(tok);

  if (!/\s/.test(value)) {
    return el(
      'kbd',
      { className: isModifier(value) ? ['key', 'key-mod'] : ['key'] },
      [{ type: 'text', value }],
    );
  }
  const parts = value.split(/\s+/).map((token) =>
    token === '+'
      ? el('span', { className: ['key-plus'] }, [{ type: 'text', value: '+' }])
      : el(
          'kbd',
          { className: isModifier(token) ? ['key', 'key-mod'] : ['key'] },
          [{ type: 'text', value: token }],
        ),
  );
  return el('span', { className: ['key-combo'] }, parts);
}

/**
 * Determine whether a `<code>` node inside a shortcut/hybrid table is actually
 * a copyable command (e.g., Neovim `:ExCommand` or shell command) rather than a key press.
 */
function isCopyableCommandCode(codeNode) {
  const val = text(codeNode).trim();
  return val.startsWith(':') && val.length > 1;
}

function transformTable(table) {
  const headers = findAll(table, (n) => isEl(n, 'th')).map((th) => text(th).trim());
  const last = (headers[headers.length - 1] ?? '').toLowerCase();
  const kind = last === 'comando' ? 'cmd' : last.startsWith('atajo') ? 'key' : 'def';

  table.properties = { ...table.properties, className: ['not-prose', 'sheet-table', `${kind}-table`] };

  table.properties.role = 'table';
  findAll(table, (n) => isEl(n, 'tr')).forEach((n) => (n.properties = { ...n.properties, role: 'row' }));
  findAll(table, (n) => isEl(n, 'th')).forEach((n) => (n.properties = { ...n.properties, role: 'columnheader' }));
  findAll(table, (n) => isEl(n, 'td')).forEach((n) => (n.properties = { ...n.properties, role: 'cell' }));

  const rows = findAll(table, (n) => isEl(n, 'tr'));
  for (const row of rows) {
    const cells = row.children.filter((c) => isEl(c, 'td'));
    if (cells.length < 2) continue;
    const cell = cells[cells.length - 1];

    if (kind === 'key') {
      const codeNodes = findAll(cell, (n) => isEl(n, 'code'));
      // Hybrid behavior: if the cell contains copyable commands (e.g. `:Lazy sync`, `:KiroToggle`),
      // render it as a dark terminal command row with copy button!
      if (codeNodes.length > 0 && codeNodes.every(isCopyableCommandCode)) {
        row.properties.className = [...(row.properties.className ?? []), 'is-cmd-row'];
        const buttons = codeNodes.map((c) => buildCmdButton(text(c)));
        cell.children =
          buttons.length === 1 ? buttons : [el('div', { className: ['cmd-list'] }, buttons)];
        continue;
      }

      const walk = (node) => {
        node.children = (node.children ?? []).map((child) =>
          isEl(child, 'code')
            ? isCopyableCommandCode(child)
              ? buildCmdButton(text(child))
              : toKeycaps(child)
            : (walk(child), child),
        );
      };
      walk(cell);
      continue;
    }

    if (kind === 'cmd') {
      const codeNodes = findAll(cell, (n) => isEl(n, 'code'));
      if (codeNodes.length > 1) {
        // Multiple alternative commands in one cell (e.g. `ng serve` o `ng s`):
        // render each command as its own copyable terminal box.
        cell.children = [
          el(
            'div',
            { className: ['cmd-list'] },
            codeNodes.map((c) => buildCmdButton(text(c))),
          ),
        ];
      } else if (codeNodes.length === 1) {
        cell.children = [buildCmdButton(text(codeNodes[0]))];
      } else {
        cell.children = [buildCmdButton(text(cell))];
      }
    }
  }
}

/**
 * Detect the language of a `<pre>` block from Shiki's `data-language` attribute
 * or standard `language-*` classes.
 */
function detectLang(pre) {
  const dataLang = pre.properties?.dataLanguage ?? pre.properties?.['data-language'];
  if (typeof dataLang === 'string' && dataLang) return dataLang;

  const code = findAll(pre, (n) => isEl(n, 'code'))[0];
  const classes = [
    ...(Array.isArray(pre.properties?.className) ? pre.properties.className : []),
    ...(Array.isArray(code?.properties?.className) ? code.properties.className : []),
  ];
  for (const cls of classes) {
    if (typeof cls === 'string' && cls.startsWith('language-')) {
      return cls.slice('language-'.length);
    }
  }
  return 'terminal';
}

const LANG_LABELS = {
  bash: 'bash',
  sh: 'sh',
  zsh: 'zsh',
  lua: 'lua · neovim',
  json: 'json',
  css: 'css',
  ts: 'typescript',
  js: 'javascript',
  html: 'html',
  text: 'output',
  plaintext: 'output',
};

/** Code blocks longer than this start collapsed behind a "Ver todo" button. */
const COLLAPSE_AFTER_LINES = 16;

/**
 * Wrap every `<pre>` element in a `.term-window` with a dark terminal header bar
 * and an always-visible copy button.
 */
function wrapPreBlocks(node) {
  if (!node.children) return;
  node.children = node.children.map((child) => {
    if (isEl(child, 'pre')) {
      const rawCode = text(child).replace(/\n$/, '');
      const lang = detectLang(child);
      const label = LANG_LABELS[lang] ?? lang;
      const lines = rawCode.split('\n').length;
      const isLong = lines > COLLAPSE_AFTER_LINES;

      return el('div', { className: ['term-window', 'not-prose', ...(isLong ? ['is-long'] : [])] }, [
        el('div', { className: ['term-header'] }, [
          el('div', { className: ['term-title'] }, [
            el('span', { className: ['term-dots'], ariaHidden: 'true' }, [
              el('span', { className: ['term-dot', 'term-dot-red'] }),
              el('span', { className: ['term-dot', 'term-dot-amber'] }),
              el('span', { className: ['term-dot', 'term-dot-green'] }),
            ]),
            el('span', { className: ['term-lang'] }, [{ type: 'text', value: label }]),
          ]),
          el(
            'button',
            {
              type: 'button',
              className: ['copy-btn'],
              dataCode: rawCode,
              ariaLabel: 'Copiar código',
            },
            [
              svg([COPY_PATH], 'cmd-icon-copy'),
              svg([CHECK_PATH], 'cmd-icon-done'),
              el('span', { className: ['cmd-state-label'] }, [{ type: 'text', value: 'Copiar' }]),
              el('span', { className: ['cmd-state-done'] }, [{ type: 'text', value: '¡Copiado!' }]),
            ],
          ),
        ]),
        child,
        // Long blocks start collapsed (only when JS runs, see global.css) with a toggle.
        ...(isLong
          ? [
              el(
                'button',
                {
                  type: 'button',
                  className: ['term-expand'],
                  ariaExpanded: 'false',
                  dataLines: String(lines),
                },
                [{ type: 'text', value: `Ver todo (${lines} líneas)` }],
              ),
            ]
          : []),
      ]);
    }
    wrapPreBlocks(child);
    return child;
  });
}

const INFO_PATH =
  'M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2z';
const MODIFIER_KEY = /^(<leader>|Ctrl|Alt|Shift|Espacio|Tab|Esc|Enter|Cmd|Option)$/i;
const KEY_COMBO = /^(Ctrl|Alt|Shift|Cmd|Option)( \+ [^\s+]{1,6})+$/i;

/** Intro text before the first `##` becomes a "tip" callout; modifier keys render as keycaps. */
function buildIntro(nodes) {
  if (!nodes.some((n) => n.type === 'element')) return nodes;
  const walk = (node) => {
    node.children = (node.children ?? []).map((child) => {
      const value = isEl(child, 'code') ? text(child).trim() : '';
      if (value && MODIFIER_KEY.test(value)) {
        return el('kbd', { className: ['key', 'key-mod'] }, [{ type: 'text', value }]);
      }
      // Key combos such as "Shift + Tab" or "Ctrl + Shift + P".
      if (value && KEY_COMBO.test(value)) {
        return toKeycaps(child);
      }
      walk(child);
      return child;
    });
  };
  nodes.forEach(walk);
  return [
    el('aside', { className: ['sheet-intro', 'not-prose'] }, [
      el('span', { className: ['sheet-intro-icon'], ariaHidden: 'true' }, [svg([INFO_PATH], 'sheet-intro-svg')]),
      el('div', { className: ['sheet-intro-body'] }, nodes),
    ]),
  ];
}

function wrapSections(root) {
  const intro = [];
  const sections = [];
  let current = null;

  for (const node of root.children) {
    if (isEl(node, 'h2')) {
      current = el('section', { className: ['sheet-section'] }, [node]);
      sections.push(current);
    } else if (current) {
      current.children.push(node);
    } else {
      intro.push(node);
    }
  }

  if (sections.length === 0) return;
  root.children = [...buildIntro(intro), el('div', { className: ['sheet-grid'] }, sections)];
}

export default function rehypeCheatsheet() {
  return (tree) => {
    findAll(tree, (n) => isEl(n, 'table')).forEach(transformTable);
    wrapPreBlocks(tree);
    wrapSections(tree);
  };
}
