/**
 * postcss-scope-tailwind
 *
 * Micro-frontend fix: every federated module ships its own full Tailwind
 * utilities sheet into the shared document <head>. Because all those sheets
 * have equal specificity, a later-loaded module's base utility (e.g. `.flex`)
 * silently overrides an earlier module's responsive utility (e.g. `.md:block`)
 * — document order decides the winner, so responsive layout breaks when you
 * switch modules.
 *
 * This plugin runs AFTER @tailwindcss/postcss has expanded the sheet and
 * prefixes every selector inside the `utilities` / `components` cascade layers
 * with a per-module scope class (e.g. `.cs-tickets-root`). The scope is added
 * as an ancestor combinator, so a module's utilities only ever match elements
 * inside that module's own subtree. preflight (`base` layer) and theme tokens
 * (`:root` vars) stay global on purpose — they're identical across modules and
 * harmless to share.
 *
 * The module's root component must render a wrapper with the scope class.
 */
export default function scopeTailwind({ scope }) {
  if (!scope) throw new Error("scopeTailwind: `scope` is required");

  const isInsideKeyframes = (node) => {
    for (let p = node.parent; p; p = p.parent) {
      if (p.type === "atrule" && /keyframes$/.test(p.name)) return true;
    }
    return false;
  };

  return {
    postcssPlugin: "postcss-scope-tailwind",
    OnceExit(root) {
      root.walkAtRules("layer", (layer) => {
        if (layer.params !== "utilities" && layer.params !== "components") return;
        layer.walkRules((rule) => {
          if (isInsideKeyframes(rule)) return;
          rule.selectors = rule.selectors.map((sel) =>
            sel.includes(scope) ? sel : `${scope} ${sel}`
          );
        });
      });
    },
  };
}
export const postcss = true;
