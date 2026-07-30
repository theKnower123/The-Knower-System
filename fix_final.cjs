const fs = require('fs');
const path = require('path');

const dir = '/home/omar/Desktop/projects/Web Projects/The-Knower-System/resources/js/Pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Remove `hasPermission, ` from `useAuth()`
  if (content.match(/const \{ hasPermission, user \} = useAuth\(\);/)) {
      content = content.replace(/const \{ hasPermission, user \} = useAuth\(\);/g, 'const { user } = useAuth();');
      changed = true;
  }
  if (content.match(/const \{ user, hasPermission \} = useAuth\(\);/)) {
      content = content.replace(/const \{ user, hasPermission \} = useAuth\(\);/g, 'const { user } = useAuth();');
      changed = true;
  }
  
  if (content.match(/const \{ hasPermission \} = useAuth\(\);/)) {
      content = content.replace(/const \{ hasPermission \} = useAuth\(\);.*\n/g, '');
      changed = true;
  }

  // 2. Replace `const canEdit = hasPermission("...");` with `roleHas`
  const canEditMatch = content.match(/const canEdit = hasPermission\("(.*?)"\);/);
  if (canEditMatch) {
      const permission = canEditMatch[1];
      content = content.replace(canEditMatch[0], `const canEdit = user ? roleHas(user.role as Role, "${permission}") : false;`);
      
      // Ensure import { roleHas, type Role } from "@/lib/permissions"; is present
      if (!content.includes('import { roleHas')) {
          content = content.replace(/(import .* from ['"]@\/store\/auth['"];?)/, "$1\nimport { roleHas, type Role } from \"@/lib/permissions\";");
      }
      changed = true;
  }

  // Ensure user is declared BEFORE canEdit if possible.
  // We'll just move `const { user } = useAuth();` to the top of the component
  const userMatch = content.match(/const \{ user \} = useAuth\(\);\s*\n/);
  if (userMatch && content.includes('const canEdit = user ? roleHas(')) {
      const userIndex = content.indexOf(userMatch[0]);
      const canEditIndex = content.indexOf('const canEdit = user ? roleHas(');
      
      if (userIndex > canEditIndex) {
          content = content.replace(userMatch[0], '');
          content = content.replace(/(\s*)(const canEdit = user \? roleHas)/, `$1const { user } = useAuth();$1$2`);
          changed = true;
      }
  }

  if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed auth correctly in', file);
  }
}
