// @ts-nocheck
/**
 * Rehype plugin that turns plain Markdown cheat sheets into a mobile-first
 * layout at build time (no client-side layout shift):
 *
 *  - Every `## Heading` and the content after it is wrapped in a
 *    `<section class="sheet-section">` so it can be laid out as a panel.
 *  - Tables are classified by their last header cell:
 *      "Comando"          -> `cmd-table`: each command becomes a tap-to-copy strip.
 *      "Atajo" (o ...)    -> `key-table`: shortcuts are rendered as keycaps.
 *      anything else      -> `def-table`: simple term / description rows.
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
    { viewBox: '0 0 24 24', width: 18, height: 18, ariaHidden: 'true', className: [className] },
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

/** Split a key combo like "Ctrl + u" or "<leader> f E" into keycaps. */
function toKeycaps(codeNode) {
  const value = text(codeNode).trim();
  // Ex commands (":Lazy sync", ":!ls -la") stay as a single mono chip.
  if (value.startsWith(':') || !/\s/.test(value)) {
    return el('kbd', { className: ['key'] }, [{ type: 'text', value }]);
  }
  const parts = value.split(/\s+/).map((token) =>
    token === '+'
      ? el('span', { className: ['key-plus'] }, [{ type: 'text', value: '+' }])
      : el('kbd', { className: ['key'] }, [{ type: 'text', value: token }]),
  );
  return el('span', { className: ['key-combo'] }, parts);
}

function transformTable(table) {
  const headers = findAll(table, (n) => isEl(n, 'th')).map((th) => text(th).trim());
  const last = (headers[headers.length - 1] ?? '').toLowerCase();
  const kind = last === 'comando' ? 'cmd' : last.startsWith('atajo') ? 'key' : 'def';

  table.properties = { ...table.properties, className: ['not-prose', 'sheet-table', `${kind}-table`] };

  // Rows are laid out with display:block/flex, which drops native table
  // semantics in some browsers, so restore them explicitly.
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
      const walk = (node) => {
        node.children = (node.children ?? []).map((child) =>
          isEl(child, 'code') ? toKeycaps(child) : (walk(child), child),
        );
      };
      walk(cell);
      continue;
    }

    if (kind === 'cmd') {
      const firstCode = findAll(cell, (n) => isEl(n, 'code'))[0];
      const command = firstCode ? text(firstCode) : text(cell).trim();
      // Keep every flag / argument unbreakable so lines only wrap at spaces.
      const tokenize = (node) => {
        node.children = (node.children ?? []).flatMap((child) => {
          if (isEl(child, 'code')) {
            const parts = text(child).split(/(\s+)/).filter(Boolean);
            child.children = parts.map((part) =>
              /^\s+$/.test(part)
                ? { type: 'text', value: part }
                : el('span', { className: ['tok'] }, [{ type: 'text', value: part }]),
            );
          }
          return [child];
        });
      };
      tokenize(cell);
      const original = cell.children;
      cell.children = [
        el(
          'button',
          {
            type: 'button',
            className: ['cmd'],
            dataCopy: command,
            ariaLabel: `Copiar comando: ${command}`,
          },
          [
            el('span', { className: ['cmd-text'] }, original),
            el('span', { className: ['cmd-state'], ariaHidden: 'true' }, [
              svg([COPY_PATH], 'cmd-icon-copy'),
              svg([CHECK_PATH], 'cmd-icon-done'),
            ]),
          ],
        ),
      ];
    }
  }
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
  root.children = [...intro, el('div', { className: ['sheet-grid'] }, sections)];
}

export default function rehypeCheatsheet() {
  return (tree) => {
    findAll(tree, (n) => isEl(n, 'table')).forEach(transformTable);
    wrapSections(tree);
  };
}
