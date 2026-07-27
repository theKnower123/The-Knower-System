const fs = require('fs');
const path = require('path');

function replaceAlerts(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceAlerts(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('alert(') && !fullPath.includes('node_modules')) {
                // Replace alert("...") with toast.error("...") or toast.info
                // We'll just map all alerts to toast()
                content = content.replace(/alert\(/g, 'toast(');
                
                // Add import if needed
                if (!content.includes('from "sonner"') && !content.includes("from 'sonner'")) {
                    content = "import { toast } from 'sonner';\n" + content;
                }
                
                fs.writeFileSync(fullPath, content);
                console.log('Fixed:', fullPath);
            }
        }
    }
}

replaceAlerts('resources/js');
