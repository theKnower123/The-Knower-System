import os
import glob

models = [
    'Client', 'Contract', 'Quotation',
    'Project', 'Milestone', 'Task', 'Bug', 'File',
    'Invoice', 'Payment', 'Expense',
    'Server', 'HostingAccount', 'Domain', 'SslCertificate',
    'Ticket', 'TicketMessage',
    'Employee', 'Attendance', 'Leave'
]

corrupted_string = """    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
}"""

for model_path in glob.glob('app/Models/*.php'):
    basename = os.path.basename(model_path).replace('.php', '')
    if basename in models:
        with open(model_path, 'r') as f:
            content = f.read()
        
        # Restore original state by replacing the corrupted string with }
        if corrupted_string in content:
            content = content.replace(corrupted_string, '}')
            
            # Now properly insert the method before the very last }
            # Find the last occurrence of }
            last_brace_idx = content.rfind('}')
            
            if last_brace_idx != -1:
                proper_method = """
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }
"""
                content = content[:last_brace_idx] + proper_method + content[last_brace_idx:]
            
            with open(model_path, 'w') as f:
                f.write(content)

print("Fixed model syntax errors")
