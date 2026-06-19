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
 * with a per-module scope, using `:where(.cs-<name>-root)`. The `:where()`
 * wrapper has ZERO specificity, so a scoped utility keeps the exact same
 * specificity it had vanilla (e.g. `.p-4` stays 0,1,0). That matters: it means
 * each module renders identically to how it did standalone — utilities don't
 * suddenly start beating the module's own component CSS. Isolation comes purely
 * from the scope MATCHING (a module's utilities only match inside its own
 * subtree), not from raised specificity.
 *
 * Cross-module overrides are eliminated because remote A's utilities can never
 * match remote B's elements. The host shell stays global and loads first, so
 * for any remote element the remote's (later, equal-specificity) utilities win
 * over the host's by document order. preflight (`base` layer) and theme tokens
 * (`:root` vars) stay global on purpose — identical across modules.
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
            sel.includes(scope) ? sel : `:where(${scope}) ${sel}`
          );
        });
      });
    },
  };
}
export const postcss = true;
