const fs = require('fs');
const path = require('path');

const dir = '/home/omar/Desktop/projects/Web Projects/The-Knower-System/resources/js/Pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // We need to find `const canEdit = hasPermission("...");` and ensure `const { hasPermission, user } = useAuth();` is BEFORE it.
  
  if (content.includes('const canEdit = hasPermission') && content.includes('const { hasPermission, user } = useAuth();')) {
      const authMatch = content.match(/const \{ hasPermission, user \} = useAuth\(\);\s*\n/);
      if (authMatch) {
          // Check if authMatch is after canEdit
          const authIndex = content.indexOf(authMatch[0]);
          const canEditIndex = content.indexOf('const canEdit =');
          
          if (authIndex > canEditIndex) {
              // Remove authMatch from its current position
              content = content.replace(authMatch[0], '');
              // Insert it right before canEdit
              content = content.replace(/(\s*)(const canEdit = hasPermission)/, `$1const { hasPermission, user } = useAuth();$1$2`);
              changed = true;
          }
      }
  }

  if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed order in', file);
  }
}
