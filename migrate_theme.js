import fs from 'fs';
import chroma from 'chroma-js';

const colors = {
    "on-primary": "#003739",
    "surface-container-low": "#131b2e",
    "surface-bright": "#31394d",
    "warning-amber": "#F59E0B",
    "obsidian-surface": "#0F172A",
    "secondary-fixed": "#62fae3",
    "on-tertiary": "#490080",
    "error-rose": "#F43F5E",
    "surface-tint": "#00dce5",
    "outline-variant": "#3a494a",
    "on-surface-variant": "#b9caca",
    "tertiary-container": "#edd4ff",
    "surface-container": "#171f33",
    "on-tertiary-fixed-variant": "#6900b3",
    "ai-purple": "#A855F7",
    "on-tertiary-fixed": "#2c0051",
    "primary-fixed-dim": "#00dce5",
    "surface-container-highest": "#2d3449",
    "on-secondary-container": "#004d44",
    "error": "#ffb4ab",
    "inverse-primary": "#00696e",
    "error-container": "#93000a",
    "on-tertiary-container": "#872fd5",
    "obsidian-base": "#020617",
    "on-secondary": "#003731",
    "secondary-fixed-dim": "#3cddc7",
    "on-secondary-fixed": "#00201c",
    "on-background": "#dae2fd",
    "outline": "#849495",
    "surface-container-lowest": "#060e20",
    "info-cyan": "#06B6D4",
    "on-error-container": "#ffdad6",
    "tertiary": "#fff8fd",
    "surface-variant": "#2d3449",
    "tertiary-fixed-dim": "#ddb7ff",
    "primary-fixed": "#63f7ff",
    "success-emerald": "#10B981",
    "on-surface": "#dae2fd",
    "background": "#0b1326",
    "secondary-container": "#03c6b2",
    "surface": "#0b1326",
    "surface-dim": "#0b1326",
    "obsidian-elevated": "#1E293B",
    "on-error": "#690005",
    "secondary": "#44e2cd",
    "primary": "#e9feff",
    "on-primary-fixed": "#002021",
    "surface-container-high": "#222a3d",
    "tertiary-fixed": "#f0dbff",
    "on-secondary-fixed-variant": "#005047",
    "on-primary-fixed-variant": "#004f53",
    "primary-container": "#00f5ff",
    "inverse-on-surface": "#283044",
    "on-primary-container": "#006c71",
    "inverse-surface": "#dae2fd"
};

let rootVars = '';
let darkVars = '';

for (const [key, value] of Object.entries(colors)) {
    darkVars += `    --${key}: ${value};\n`;

    let lightValue = value;
    const luma = chroma(value).luminance();

    if (key.includes('background') || key.includes('surface') || key.includes('base') || key.includes('elevated')) {
        // Invert backgrounds
        lightValue = chroma(value).luminance(0.95).hex();
        if (key.includes('elevated') || key.includes('high')) {
            lightValue = chroma(value).luminance(0.9).hex();
        }
    } else if (key.includes('on-')) {
        // Invert text/icons on backgrounds
        lightValue = chroma(value).luminance(0.05).hex();
    } else {
        // For accents, keep them relatively similar or slightly darker for contrast on light backgrounds
        lightValue = chroma(value).darken(0.5).hex();
    }

    // Special cases to ensure visibility
    if (key === 'primary') lightValue = '#006c71';
    if (key === 'on-primary') lightValue = '#ffffff';

    rootVars += `    --${key}: ${lightValue};\n`;
}

const cssAddition = `
@layer base {
  :root {
${rootVars}  }

  .dark {
${darkVars}  }
}
`;

let appCss = fs.readFileSync('resources/css/app.css', 'utf8');
appCss = appCss.replace('@import "tailwindcss";', '@import "tailwindcss";\n' + cssAddition);
fs.writeFileSync('resources/css/app.css', appCss);

let twConfig = fs.readFileSync('tailwind.config.js', 'utf8');
const regex = /colors:\s*\{[\s\S]*?\},/m;

let colorsReplacement = 'colors: {\n';
for (const key of Object.keys(colors)) {
    colorsReplacement += `                "${key}": "var(--${key})",\n`;
}
colorsReplacement += '            },';

twConfig = twConfig.replace(regex, colorsReplacement);
if (!twConfig.includes("darkMode: 'class'")) {
    twConfig = twConfig.replace('export default {', "export default {\n    darkMode: 'class',");
}
fs.writeFileSync('tailwind.config.js', twConfig);

console.log("Migration complete!");
