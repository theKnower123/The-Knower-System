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
  'CrmQuotations.tsx': 'quotation.manage'
};

for (const [filename, permission] of Object.entries(map)) {
  const filePath = path.join('/home/omar/Desktop/projects/Web Projects/The-Knower-System/resources/js/Pages', filename);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Ensure useAuth is imported
  if (!content.includes('import { useAuth }')) {
    content = content.replace(/(import .* from ['"]@\/components\/resource-page['"];?)/, "$1\nimport { useAuth } from \"@/store/auth\";");
  }

  // Inject canEdit definition
  if (!content.includes('const canEdit =') && !content.includes('const { hasPermission')) {
    // Find component start
    const match = content.match(/export default function \w+\(.*\) \{/);
    if (match) {
      content = content.replace(match[0], `${match[0]}\n  const { hasPermission, user } = useAuth();\n  const canEdit = hasPermission("${permission}");\n`);
    } else {
        const match2 = content.match(/const \w+ = \(.*\) => \{/);
        if (match2) {
            content = content.replace(match2[0], `${match2[0]}\n  const { hasPermission, user } = useAuth();\n  const canEdit = hasPermission("${permission}");\n`);
        }
    }
  }

  // Inject hideNewButton and hideTrashButton
  const rpMatch = content.match(/<ResourcePage([^]*?)columns=\[/);
  if (rpMatch && !rpMatch[0].includes('hideNewButton')) {
    const replacement = rpMatch[0].replace('columns=[', `hideNewButton={!canEdit}\n      hideTrashButton={!canEdit}\n      columns=[`);
    content = content.replace(rpMatch[0], replacement);
  }

  fs.writeFileSync(filePath, content);
  console.log('Fixed', filename);
}
