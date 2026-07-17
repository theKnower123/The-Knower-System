<?php
namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Services\CRM\ContactService;
use App\Http\Requests\CRM\StoreContactRequest;
use App\Http\Requests\CRM\UpdateContactRequest;
use App\Http\Resources\CRM\ContactResource;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

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
