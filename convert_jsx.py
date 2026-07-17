import os

html_path = 'UI/roles_permissions_management/code.html'
with open(html_path, 'r') as f:
    html = f.read()

# Extract body content roughly
body_start = html.find('<body')
body_start = html.find('>', body_start) + 1
body_end = html.rfind('</body>')
body_content = html[body_start:body_end]

# Basic JSX conversions
jsx = body_content.replace('class="', 'className="')
jsx = jsx.replace('for="', 'htmlFor="')
jsx = jsx.replace('<!--', '{/*')
jsx = jsx.replace('-->', '*/}')
jsx = jsx.replace('checked=""', 'defaultChecked')
jsx = jsx.replace('disabled=""', 'disabled')

# Fix self-closing tags
import re
jsx = re.sub(r'<input([^>]+?)(?<!/)>', r'<input\1 />', jsx)
jsx = re.sub(r'<img([^>]+?)(?<!/)>', r'<img\1 />', jsx)

react_component = f"""
import React from 'react';
import {{ Head }} from '@inertiajs/react';

export default function Roles() {{
    return (
        <>
            <Head title="Roles & Permissions" />
            <div className="flex h-screen overflow-hidden bg-obsidian-base font-body-md text-body-md text-on-background">
                {{/* Body Content Starts */}}
                {jsx}
                {{/* Body Content Ends */}}
            </div>
        </>
    );
}}
"""

os.makedirs('resources/js/Pages/Core', exist_ok=True)
with open('resources/js/Pages/Core/Roles.jsx', 'w') as f:
    f.write(react_component)

print("Converted HTML to JSX")
