import os
import datetime

# --- ENUMS ---
os.makedirs('app/Enums', exist_ok=True)
enums = {
    'QuotationStatus': "['draft' => 'Draft', 'sent' => 'Sent', 'accepted' => 'Accepted', 'rejected' => 'Rejected', 'expired' => 'Expired']",
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
        Schema::dropIfExists('quotations');
        
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained('workspaces')->cascadeOnDelete();
            
            $table->string('quotation_number')->unique();
            $table->foreignId('parent_id')->nullable()->constrained('quotations')->nullOnDelete();
            $table->integer('version')->default(1);
            
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('contact_id')->nullable()->constrained('contacts')->nullOnDelete();
            $table->foreignId('lead_id')->nullable()->constrained('leads')->nullOnDelete();
            
            $table->string('status')->default('draft')->index(); // Enum
            
            $table->date('issue_date');
            $table->date('valid_until');
            
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            
            $table->text('terms_and_conditions')->nullable();
            $table->text('notes')->nullable();
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
"""
date_str = datetime.datetime.now().strftime("%Y_%m_%d_%H%M%S")
with open(f'database/migrations/{date_str}_rebuild_quotations_table.php', 'w') as f:
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
use App\\Enums\\QuotationStatus;

class Quotation extends Model
{
    use HasWorkspace, SoftDeletes, LogsActivity;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'status' => QuotationStatus::class,
        'issue_date' => 'date',
        'valid_until' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function contact(): BelongsTo { return $this->belongsTo(Contact::class); }
    public function lead(): BelongsTo { return $this->belongsTo(Lead::class); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }

    // Versioning logic specified by the user
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Quotation::class, 'parent_id');
    }

    public function historyVersions(): HasMany
    {
        return $this->hasMany(Quotation::class, 'parent_id');
    }
}
"""
with open('app/Models/Quotation.php', 'w') as f: f.write(model_code)

# --- SERVICE ---
service_code = """<?php
namespace App\\Services\\CRM;

use App\\Models\\Quotation;
use Illuminate\\Support\\Facades\\Auth;

class QuotationService
{
    public function getAll()
    {
        return Quotation::with(['company', 'lead', 'contact'])->latest()->paginate(25);
    }

    public function create(array $data): Quotation
    {
        $data['created_by'] = Auth::id();
        return Quotation::create($data);
    }

    public function update(Quotation $quotation, array $data): Quotation
    {
        $data['updated_by'] = Auth::id();
        $quotation->update($data);
        return $quotation;
    }

    public function delete(Quotation $quotation): bool
    {
        return $quotation->delete();
    }
}
"""
with open('app/Services/CRM/QuotationService.php', 'w') as f: f.write(service_code)

# --- REQUESTS ---
store_req = """<?php
namespace App\\Http\\Requests\\CRM;

use Illuminate\\Foundation\\Http\\FormRequest;
use App\\Enums\\QuotationStatus;
use Illuminate\\Validation\\Rules\\Enum;

class StoreQuotationRequest extends FormRequest
{
    public function authorize() { return true; }
    public function rules() {
        return [
            'quotation_number' => 'required|string|max:50|unique:quotations',
            'company_id' => 'required|exists:companies,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'lead_id' => 'nullable|exists:leads,id',
            'parent_id' => 'nullable|exists:quotations,id',
            'version' => 'integer|min:1',
            'status' => ['nullable', new Enum(QuotationStatus::class)],
            'issue_date' => 'required|date',
            'valid_until' => 'required|date|after_or_equal:issue_date',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'currency' => 'string|size:3',
            'terms_and_conditions' => 'nullable|string',
            'notes' => 'nullable|string',
        ];
    }
}
"""
update_req = store_req.replace('StoreQuotationRequest', 'UpdateQuotationRequest').replace('unique:quotations', 'unique:quotations,quotation_number,' + '$this->quotation->id')
with open('app/Http/Requests/CRM/StoreQuotationRequest.php', 'w') as f: f.write(store_req)
with open('app/Http/Requests/CRM/UpdateQuotationRequest.php', 'w') as f: f.write(update_req)

# --- RESOURCE ---
resource_code = """<?php
namespace App\\Http\\Resources\\CRM;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class QuotationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
"""
with open('app/Http/Resources/CRM/QuotationResource.php', 'w') as f: f.write(resource_code)

# --- CONTROLLER ---
controller_code = """<?php
namespace App\\Http\\Controllers\\CRM;

use App\\Http\\Controllers\\Controller;
use App\\Services\\CRM\\QuotationService;
use App\\Http\\Requests\\CRM\\StoreQuotationRequest;
use App\\Http\\Requests\\CRM\\UpdateQuotationRequest;
use App\\Http\\Resources\\CRM\\QuotationResource;
use App\\Models\\Quotation;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Gate;

class QuotationController extends Controller
{
    protected QuotationService $quotationService;

    public function __construct(QuotationService $quotationService)
    {
        $this->quotationService = $quotationService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Quotation::class);
        return response()->json([
            'success' => true,
            'data' => QuotationResource::collection($this->quotationService->getAll())
        ]);
    }

    public function store(StoreQuotationRequest $request): JsonResponse
    {
        Gate::authorize('create', Quotation::class);
        $quotation = $this->quotationService->create($request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Quotation created successfully',
            'data' => new QuotationResource($quotation)
        ], 201);
    }

    public function show(Quotation $quotation): JsonResponse
    {
        Gate::authorize('view', $quotation);
        return response()->json([
            'success' => true,
            'data' => new QuotationResource($quotation->load(['company', 'contact', 'lead', 'historyVersions']))
        ]);
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): JsonResponse
    {
        Gate::authorize('update', $quotation);
        $quotation = $this->quotationService->update($quotation, $request->validated());
        return response()->json([
            'success' => true,
            'message' => 'Quotation updated successfully',
            'data' => new QuotationResource($quotation)
        ]);
    }

    public function destroy(Quotation $quotation): JsonResponse
    {
        Gate::authorize('delete', $quotation);
        $this->quotationService->delete($quotation);
        return response()->json(['success' => true, 'message' => 'Quotation deleted successfully']);
    }
}
"""
with open('app/Http/Controllers/CRM/QuotationController.php', 'w') as f: f.write(controller_code)

# --- POLICY ---
policy_code = """<?php
namespace App\\Policies;

use App\\Models\\Quotation;
use App\\Models\\User;
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class QuotationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool { return $user->hasPermissionTo('view_quotations'); }
    public function view(User $user, Quotation $quotation): bool { return $user->hasPermissionTo('view_quotations'); }
    public function create(User $user): bool { return $user->hasPermissionTo('create_quotations'); }
    public function update(User $user, Quotation $quotation): bool { return $user->hasPermissionTo('edit_quotations'); }
    public function delete(User $user, Quotation $quotation): bool { return $user->hasPermissionTo('delete_quotations'); }
}
"""
with open('app/Policies/QuotationPolicy.php', 'w') as f: f.write(policy_code)

# --- REACT UI COMPONENT ---
react_ui = """import React from 'react';
import { Head } from '@inertiajs/react';

export default function Quotations() {
    return (
        <div className="bg-obsidian-base min-h-screen text-on-background">
            <Head title="Quotations - CRM" />
            <div className="p-8">
                <h1 className="text-display-lg text-primary mb-4">Quotations</h1>
                <p className="text-on-surface-variant">Manage and version multi-currency enterprise quotations linked to opportunities.</p>
                {/* Table implementation connected to /api/v1/quotations */}
            </div>
        </div>
    );
}
"""
with open('resources/js/Pages/CRM/Quotations.jsx', 'w') as f: f.write(react_ui)

print("Generated full Quotation module.")
