import glob
import os

models = [
    'Company', 'Client', 'Lead', 'Contract', 'Quotation',
    'Project', 'Milestone', 'Task', 'Bug', 'File',
    'Invoice', 'Payment', 'Expense',
    'Server', 'HostingAccount', 'Domain', 'SslCertificate',
    'Ticket', 'TicketMessage',
    'Employee', 'Attendance', 'Leave'
]

for model_path in glob.glob('app/Models/*.php'):
    basename = os.path.basename(model_path).replace('.php', '')
    if basename in models:
        with open(model_path, 'r') as f:
            content = f.read()
        
        if 'HasWorkspace' not in content:
            content = content.replace('use Illuminate\\Database\\Eloquent\\Model;', 'use Illuminate\\Database\\Eloquent\\Model;\nuse App\\Traits\\HasWorkspace;')
            content = content.replace('use HasFactory;', 'use HasFactory, HasWorkspace;')
            
            with open(model_path, 'w') as f:
                f.write(content)

print("Applied HasWorkspace trait to models")
