import os
import re

html_path = 'UI/workspace_team_management/code.html'
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
jsx = re.sub(r'<input([^>]+?)(?<!/)>', r'<input\1 />', jsx)
jsx = re.sub(r'<img([^>]+?)(?<!/)>', r'<img\1 />', jsx)

react_component = f"""
import React from 'react';
import {{ Head }} from '@inertiajs/react';

export default function Workspaces() {{
    return (
        <>
            <Head title="Workspace Management" />
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
with open('resources/js/Pages/Core/Workspaces.jsx', 'w') as f:
    f.write(react_component)

print("Converted HTML to JSX")
