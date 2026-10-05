const fs = require("fs");
const path = require("path");
const vm = require("vm");

const pluginName = "FastTravelWorldMap";
const srcDir = path.join(__dirname, "src");
const outDir = path.resolve(process.argv[2] || path.join(__dirname, "dist"));

// load order matters: later files use what earlier ones define
const modules = [
    "params.js",
    "GameSystem.js",
    "Window_FastTravelList.js",
    "Window_FastTravelMarkers.js",
    "Scene_FastTravel.js",
    "commands.js"
];

const read = file => {
    return fs.readFileSync(path.join(srcDir, file), "utf8").replace(/\r\n/g, "\n").trimEnd();
};

const indent = text => {
    return text.split("\n").map(line => (line ? "    " + line : line)).join("\n");
};

const lines = read("header.js").split("\n");
lines.push("", "(() => {");

const ranges = [];
modules.forEach((file, index) => {
    if (index > 0) {
        lines.push("");
    }
    const body = indent(read(file)).split("\n");
    ranges.push({ file, from: lines.length + 1, to: lines.length + body.length });
    body.forEach(line => lines.push(line));
});
lines.push("})();", "");

const code = lines.join("\n");
const outFile = path.join(outDir, pluginName + ".js");

try {
    new vm.Script(code, { filename: outFile });
} catch (error) {
    // the stack's first lines point at the line number in the built file
    console.error("Syntax error in built file:\n" + error.stack.split("\n").slice(0, 4).join("\n"));
    console.error("\nLine ranges:");
    ranges.forEach(r => console.error(`  ${r.file}: ${r.from}-${r.to}`));
    process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, code);

console.log("Built " + outFile);
ranges.forEach(r => console.log(`  ${r.file}: lines ${r.from}-${r.to}`));
