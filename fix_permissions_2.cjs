const fs = require('fs');
const path = require('path');

const map = {
  'CmsServices.tsx': 'cms.manage',
  'HrLeaves.tsx': 'leave.manage',
  'CmsBlog.tsx': 'cms.manage',
  'HrDepartments.tsx': 'hr.manage',
  'CrmMeetings.tsx': 'client.manage',
  'CmsTestimonials.tsx': 'cms.manage',
  'CrmClients.tsx': 'client.manage',
  'HostingServers.tsx': 'server.manage',
  'CrmLeads.tsx': 'lead.manage',
  'HrAttendance.tsx': 'attendance.manage',
  'FinanceInvoices.tsx': 'invoice.manage',
  'HostingAccounts.tsx': 'hosting.manage',
  'Bugs.tsx': 'bug.manage',
  'FinanceExpenses.tsx': 'expense.manage',
  'SupportTicketsIndex.tsx': 'ticket.manage',
  'HrEmployees.tsx': 'hr.manage',
  'CrmContracts.tsx': 'contract.manage',
  'CmsPricing.tsx': 'cms.manage',
  'HostingSsl.tsx': 'ssl.manage',
  'CmsFaqs.tsx': 'cms.manage',
  'HostingDomains.tsx': 'domain.manage',
  'FinancePayments.tsx': 'payment.manage',
  'CrmQuotations.tsx': 'quotation.manage',
  'ProjectsIndex.tsx': 'project.manage'
};

for (const [filename, permission] of Object.entries(map)) {
  const filePath = path.join('/home/omar/Desktop/projects/Web Projects/The-Knower-System/resources/js/Pages', filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix custom canEdit definitions
  content = content.replace(/const canEdit = \[.*?\]\.includes\(.*?\);/, '');
  content = content.replace(/const canEdit = hasPermission\(".*?"\);/, '');

  if (!content.includes('const { hasPermission')) {
    if (!content.includes('import { useAuth }')) {
        content = content.replace(/(import .* from ['"]@\/components\/resource-page['"];?)/, "$1\nimport { useAuth } from \"@/store/auth\";");
    }
    const match = content.match(/export default function \w+\(.*\) \{/);
    if (match) {
      content = content.replace(match[0], `${match[0]}\n  const { hasPermission } = useAuth();\n  const canEdit = hasPermission("${permission}");\n`);
    } else {
        const match2 = content.match(/const \w+ = \(.*\) => \{/);
        if (match2) {
            content = content.replace(match2[0], `${match2[0]}\n  const { hasPermission } = useAuth();\n  const canEdit = hasPermission("${permission}");\n`);
        }
    }
  } else {
      content = content.replace(/const { hasPermission.*} = useAuth\(\);/, "const { hasPermission, user } = useAuth();\n  const canEdit = hasPermission(\"" + permission + "\");");
  }

  // Inject hideNewButton and hideTrashButton if not present
  if (content.includes('<ResourcePage')) {
    if (!content.includes('hideNewButton')) {
        content = content.replace(/collectionKey="/, `hideNewButton={!canEdit}\n      hideTrashButton={!canEdit}\n      collectionKey="`);
    } else {
        // Just make sure it says hideNewButton={!canEdit}
        content = content.replace(/hideNewButton=\{.*?\}/, 'hideNewButton={!canEdit}');
        content = content.replace(/hideTrashButton=\{.*?\}/, 'hideTrashButton={!canEdit}');
    }
  }

  fs.writeFileSync(filePath, content);
  console.log('Fixed', filename);
}
