import os
import re
import glob

def get_files():
    return glob.glob('app/Http/Controllers/*/*.php')

def generate_service(module, model):
    content = f"""<?php

namespace App\\Services\\{module};

use App\\Models\\{model};
use Illuminate\\Database\\Eloquent\\Collection;

class {model}Service
{{
    public function getAll(): Collection
    {{
        return {model}::latest()->get(); // Add default relations if needed
    }}

    public function create(array $data): {model}
    {{
        return {model}::create($data);
    }}

    public function update({model} ${model.lower()}, array $data): {model}
    {{
        ${model.lower()}->update($data);
        return ${model.lower()};
    }}

    public function delete({model} ${model.lower()}): ?bool
    {{
        return ${model.lower()}->delete();
    }}
}}
"""
    os.makedirs(f'app/Services/{module}', exist_ok=True)
    with open(f'app/Services/{module}/{model}Service.php', 'w') as f:
        f.write(content)

def generate_request(module, model, type_name, validation_rules):
    # Ensure validation rules are nicely formatted string
    if not validation_rules:
        validation_rules = "            // TODO: Add rules\n"
    
    # Default gate authorization string
    auth_str = f"return $this->user()->can('{type_name.lower()}', \\App\\Models\\{model}::class);"
    if type_name == 'Update':
        auth_str = f"return $this->user()->can('update', $this->route('{model.lower()}'));"

    content = f"""<?php

namespace App\\Http\\Requests\\{module};

use Illuminate\\Foundation\\Http\\FormRequest;

class {type_name}{model}Request extends FormRequest
{{
    public function authorize(): bool
    {{
        {auth_str}
    }}

    public function rules(): array
    {{
        return [
{validation_rules}
        ];
    }}
}}
"""
    os.makedirs(f'app/Http/Requests/{module}', exist_ok=True)
    with open(f'app/Http/Requests/{module}/{type_name}{model}Request.php', 'w') as f:
        f.write(content)

def generate_policy(model):
    content = f"""<?php

namespace App\\Policies;

use App\\Models\\{model};
use App\\Models\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class {model}Policy
{{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {{
        return $user->hasPermissionTo('view_{model.lower()}s');
    }}

    public function view(User $user, {model} ${model.lower()}): bool
    {{
        return $user->hasPermissionTo('view_{model.lower()}s');
    }}

    public function create(User $user): bool
    {{
        return $user->hasPermissionTo('create_{model.lower()}s');
    }}

    public function update(User $user, {model} ${model.lower()}): bool
    {{
        return $user->hasPermissionTo('edit_{model.lower()}s');
    }}

    public function delete(User $user, {model} ${model.lower()}): bool
    {{
        return $user->hasPermissionTo('delete_{model.lower()}s');
    }}
}}
"""
    os.makedirs(f'app/Policies', exist_ok=True)
    with open(f'app/Policies/{model}Policy.php', 'w') as f:
        f.write(content)

def generate_resource(module, model):
    content = f"""<?php

namespace App\\Http\\Resources\\{module};

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class {model}Resource extends JsonResource
{{
    public function toArray(Request $request): array
    {{
        return parent::toArray($request);
    }}
}}
"""
    os.makedirs(f'app/Http/Resources/{module}', exist_ok=True)
    with open(f'app/Http/Resources/{module}/{model}Resource.php', 'w') as f:
        f.write(content)

def modify_controller(path, module, model, content):
    lower_model = model.lower()
    
    # Try to find relationships loaded in index
    with_relations = ""
    with_match = re.search(r'::with\((.*?)\)', content)
    if with_match:
        with_relations = with_match.group(1)

    load_relations = ""
    load_match = re.search(fr'\${lower_model}->load\((.*?)\)', content)
    if load_match:
        load_relations = load_match.group(1)
        
    replacement = f"""<?php

namespace App\\Http\\Controllers\\{module};

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\{module}\\Store{model}Request;
use App\\Http\\Requests\\{module}\\Update{model}Request;
use App\\Http\\Resources\\{module}\\{model}Resource;
use App\\Models\\{model};
use App\\Services\\{module}\\{model}Service;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Gate;

class {model}Controller extends Controller
{{
    protected {model}Service ${lower_model}Service;

    public function __construct({model}Service ${lower_model}Service)
    {{
        $this->{lower_model}Service = ${lower_model}Service;
    }}

    public function index(): JsonResponse
    {{
        Gate::authorize('viewAny', {model}::class);

        ${lower_model}s = $this->{lower_model}Service->getAll();
        
        // Load relations if needed
"""
    if with_relations:
        replacement += f"        ${lower_model}s->load({with_relations});\n"
        
    replacement += f"""
        return response()->json([
            'success' => true,
            'message' => '{model}s retrieved successfully.',
            'data' => {model}Resource::collection(${lower_model}s)
        ]);
    }}

    public function store(Store{model}Request $request): JsonResponse
    {{
        ${lower_model} = $this->{lower_model}Service->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => '{model} created successfully.',
            'data' => new {model}Resource(${lower_model})
        ], 201);
    }}

    public function show({model} ${lower_model}): JsonResponse
    {{
        Gate::authorize('view', ${lower_model});
"""
    if load_relations:
        replacement += f"        ${lower_model}->load({load_relations});\n"

    replacement += f"""
        return response()->json([
            'success' => true,
            'message' => '{model} retrieved successfully.',
            'data' => new {model}Resource(${lower_model})
        ]);
    }}

    public function update(Update{model}Request $request, {model} ${lower_model}): JsonResponse
    {{
        ${lower_model} = $this->{lower_model}Service->update(${lower_model}, $request->validated());

        return response()->json([
            'success' => true,
            'message' => '{model} updated successfully.',
            'data' => new {model}Resource(${lower_model})
        ]);
    }}

    public function destroy({model} ${lower_model}): JsonResponse
    {{
        Gate::authorize('delete', ${lower_model});

        $this->{lower_model}Service->delete(${lower_model});

        return response()->json([
            'success' => true,
            'message' => '{model} deleted successfully.',
            'data' => null
        ]);
    }}
}}
"""
    with open(path, 'w') as f:
        f.write(replacement)

def process_controller(path):
    with open(path, 'r') as f:
        content = f.read()

    # Skip LeadController as it was manually done
    if 'LeadController' in path:
        return

    # Extract module and model
    ns_match = re.search(r'namespace App\\Http\\Controllers\\([^;]+);', content)
    if not ns_match: return
    module = ns_match.group(1)

    model_match = re.search(r'class ([A-Za-z0-9_]+)Controller extends Controller', content)
    if not model_match: return
    model = model_match.group(1)

    # Make sure we're not touching AiController, ReportController, DashboardController
    if model in ['Ai', 'Report', 'Settings', 'Dashboard', 'Profile', 'Auth']:
        return

    # Extract store validation rules
    store_rules = ""
    store_match = re.search(r'store\(.*?\).*?\$request->validate\(\[(.*?)\]\);', content, re.DOTALL)
    if store_match:
        store_rules = store_match.group(1)

    # Extract update validation rules
    update_rules = ""
    update_match = re.search(r'update\(.*?\).*?\$request->validate\(\[(.*?)\]\);', content, re.DOTALL)
    if update_match:
        update_rules = update_match.group(1)

    print(f"Processing {module} / {model}")
    
    generate_service(module, model)
    generate_request(module, model, 'Store', store_rules)
    generate_request(module, model, 'Update', update_rules)
    generate_policy(model)
    generate_resource(module, model)
    modify_controller(path, module, model, content)

def main():
    files = get_files()
    for f in files:
        process_controller(f)
    print("Done")

if __name__ == "__main__":
    main()
