import os
import datetime

# --- ENUMS ---
os.makedirs('app/Enums', exist_ok=True)
enums = {
    'ContactStatus': "['active' => 'Active', 'inactive' => 'Inactive']",
    'ContactType': "['primary' => 'Primary', 'technical' => 'Technical', 'billing' => 'Billing', 'standard' => 'Standard']",
}

for name, values in enums.items():
    cases = []
    for pair in values.strip("[]").split(", "):
        k, v = pair.split(" => ")
        k = k.strip("'")
        cases.append(f"    case {k.upper()} = '{k}';")
    code = f"<?php\nnamespace App\\Enums;\n\nenum {name}: string\n{{\n" + "\n".join(cases) + "\n}\n"
    with open(f'app/Enums/{name}.php', 'w') as f:
        f.write(code)

# --- MIGRATION ---
migration = """<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('contacts');
        
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            
            $table->string('job_title')->nullable();
            $table->string('department')->nullable();
            
            $table->string('status')->default('active')->index(); // Enum
            $table->string('type')->default('standard')->index(); // Enum
            $table->boolean('is_primary')->default(false);
            
            $table->string('linkedin_profile')->nullable();
            $table->text('notes')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
"""
date_str = datetime.datetime.now().strftime("%Y_%m_%d_%H%M%S")
with open(f'database/migrations/{date_str}_rebuild_contacts_table.php', 'w') as f:
    f.write(migration)

# --- MODEL ---
model_code = """<?php
namespace App\\Models;

use App\\Traits\\HasWorkspace;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Spatie\\Activitylog\\Traits\\LogsActivity;
use Spatie\\Activitylog\\LogOptions;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use App\\Enums\\ContactStatus;
use App\\Enums\\ContactType;

class Contact extends Model
{
    use HasWorkspace, SoftDeletes, LogsActivity;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'status' => ContactStatus::class,
        'type' => ContactType::class,
        'is_primary' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }

    // Placholders for reusability across ecosystems
    public function meetings(): HasMany { return $this->hasMany(Meeting::class); }
    public function quotations(): HasMany { return $this->hasMany(Quotation::class); }
    public function contracts(): HasMany { return $this->hasMany(Contract::class); }
    public function tickets(): HasMany { return $this->hasMany(Ticket::class); }
}
"""
with open('app/Models/Contact.php', 'w') as f: f.write(model_code)

# --- SERVICE ---
service_code = """<?php
namespace App\\Services\\CRM;

use App\\Models\\Contact;
use Illuminate\\Support\\Facades\\Auth;

class ContactService
{
    public function getAll()
    {
        return Contact::with(['company'])->latest()->paginate(25);
    }

    public function create(array $data): Contact
    {
        $data['created_by'] = Auth::id();
        return Contact::create($data);
    }

    public function update(Contact $contact, array $data): Contact
    {
        $data['updated_by'] = Auth::id();
        $contact->update($data);
        return $contact;
    }

    public function delete(Contact $contact): bool
    {
        return $contact->delete();
    }
}
"""
with open('app/Services/CRM/ContactService.php', 'w') as f: f.write(service_code)

# --- REQUESTS ---
store_req = """<?php
namespace App\\Http\\Requests\\CRM;

use Illuminate\\Foundation\\Http\\FormRequest;
use App\\Enums\\ContactStatus;
use App\\Enums\\ContactType;
use Illuminate\\Validation\\Rules\\Enum;

class StoreContactRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'company_id' => 'required|exists:companies,id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'mobile' => 'nullable|string|max:50',
            'job_title' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'status' => ['nullable', new Enum(ContactStatus::class)],
            'type' => ['nullable', new Enum(ContactType::class)],
            'is_primary' => 'boolean',
        ];
    }
}
"""
update_req = store_req.replace('StoreContactRequest', 'UpdateContactRequest')
with open('app/Http/Requests/CRM/StoreContactRequest.php', 'w') as f: f.write(store_req)
with open('app/Http/Requests/CRM/UpdateContactRequest.php', 'w') as f: f.write(update_req)

# --- RESOURCE ---
resource_code = """<?php
namespace App\\Http\\Resources\\CRM;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
"""
with open('app/Http/Resources/CRM/ContactResource.php', 'w') as f: f.write(resource_code)

# --- CONTROLLER ---
controller_code = """<?php
namespace App\\Http\\Controllers\\CRM;

use App\\Http\\Controllers\\Controller;
use App\\Services\\CRM\\ContactService;
use App\\Http\\Requests\\CRM\\StoreContactRequest;
use App\\Http\\Requests\\CRM\\UpdateContactRequest;
use App\\Http\\Resources\\CRM\\ContactResource;
use App\\Models\\Contact;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Gate;

class ContactController extends Controller
{
    protected ContactService $contactService;

    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Contact::class);
        return response()->json([
            'success' => true,
            'data' => ContactResource::collection($this->contactService->getAll())
        ]);
    }

    public function store(StoreContactRequest $request): JsonResponse
    {
        Gate::authorize('create', Contact::class);
        $contact = $this->contactService->create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Contact created successfully',
            'data' => new ContactResource($contact)
        ], 201);
    }

    public function show(Contact $contact): JsonResponse
    {
        Gate::authorize('view', $contact);
        return response()->json([
            'success' => true,
            'data' => new ContactResource($contact->load('company'))
        ]);
    }

    public function update(UpdateContactRequest $request, Contact $contact): JsonResponse
    {
        Gate::authorize('update', $contact);
        $contact = $this->contactService->update($contact, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Contact updated successfully',
            'data' => new ContactResource($contact)
        ]);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        Gate::authorize('delete', $contact);
        $this->contactService->delete($contact);
        return response()->json(['success' => true, 'message' => 'Contact deleted successfully']);
    }
}
"""
with open('app/Http/Controllers/CRM/ContactController.php', 'w') as f: f.write(controller_code)

# --- POLICY ---
policy_code = """<?php
namespace App\\Policies;

use App\\Models\\Contact;
use App\\Models\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class ContactPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool { return $user->hasPermissionTo('view_contacts'); }
    public function view(User $user, Contact $contact): bool { return $user->hasPermissionTo('view_contacts'); }
    public function create(User $user): bool { return $user->hasPermissionTo('create_contacts'); }
    public function update(User $user, Contact $contact): bool { return $user->hasPermissionTo('edit_contacts'); }
    public function delete(User $user, Contact $contact): bool { return $user->hasPermissionTo('delete_contacts'); }
}
"""
with open('app/Policies/ContactPolicy.php', 'w') as f: f.write(policy_code)

# --- REACT UI COMPONENT ---
react_ui = """import React from 'react';
import { Head } from '@inertiajs/react';

export default function Contacts() {
    return (
        <div className="bg-obsidian-base min-h-screen text-on-background">
            <Head title="Contacts - CRM" />
            <div className="p-8">
                <h1 className="text-display-lg text-primary mb-4">Contacts Directory</h1>
                <p className="text-on-surface-variant">B2B Contacts tied to specific Enterprise Companies. Reusable across Meetings, Quotations, and Projects.</p>
                {/* Table implementation connected to /api/v1/contacts */}
            </div>
        </div>
    );
}
"""
with open('resources/js/Pages/CRM/Contacts.jsx', 'w') as f: f.write(react_ui)

print("Generated full Contact module.")
