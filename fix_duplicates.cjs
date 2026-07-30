const fs = require('fs');
const path = require('path');

const dir = '/home/omar/Desktop/projects/Web Projects/The-Knower-System/resources/js/Pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // if it has both `const { hasPermission, user } = useAuth();` AND `const { user } = useAuth();`
  if (content.match(/const \{ hasPermission, user \} = useAuth\(\);/) && content.match(/const \{ user \} = useAuth\(\);/)) {
      content = content.replace(/const \{ user \} = useAuth\(\);\n?/, '');
      changed = true;
  }
  
  if (content.match(/const \{ user, hasPermission \} = useAuth\(\);/) && content.match(/const \{ user \} = useAuth\(\);/)) {
      content = content.replace(/const \{ user \} = useAuth\(\);\n?/, '');
      changed = true;
  }
  
  // same for const { hasPermission } = useAuth();
  if (content.match(/const \{ hasPermission \} = useAuth\(\);/) && content.match(/const \{ user \} = useAuth\(\);/)) {
      content = content.replace(/const \{ hasPermission \} = useAuth\(\);\n?/, '');
      content = content.replace(/const \{ user \} = useAuth\(\);/, 'const { hasPermission, user } = useAuth();');
      changed = true;
  }

  // Also remove duplicated canEdit manually defined just in case
  const matches = content.match(/const canEdit = /g);
  if (matches && matches.length > 1) {
      console.log('Multiple canEdit found in', file);
      // I'll leave multiple canEdit for manual fix if there are any left.
  }

  if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Cleaned up', file);
  }
}
