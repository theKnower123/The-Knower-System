<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Finance\StoreInvoiceRequest;
use App\Http\Requests\Finance\UpdateInvoiceRequest;
use App\Http\Resources\Finance\InvoiceResource;
use App\Models\Invoice;
use App\Services\Finance\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class InvoiceController extends Controller
{
    protected InvoiceService $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Invoice::class);

        $invoices = $this->invoiceService->getAll();
        
        // Load relations if needed
        $invoices->load(['client', 'project']);

        return response()->json([
            'success' => true,
            'message' => 'Invoices retrieved successfully.',
            'data' => InvoiceResource::collection($invoices)
        ]);
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $invoice = $this->invoiceService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Invoice created successfully.',
            'data' => new InvoiceResource($invoice)
        ], 201);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        Gate::authorize('view', $invoice);
        $invoice->load(['client', 'project', 'payments']);

        return response()->json([
            'success' => true,
            'message' => 'Invoice retrieved successfully.',
            'data' => new InvoiceResource($invoice)
        ]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): JsonResponse
    {
        $invoice = $this->invoiceService->update($invoice, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Invoice updated successfully.',
            'data' => new InvoiceResource($invoice)
        ]);
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        Gate::authorize('delete', $invoice);

        $this->invoiceService->delete($invoice);

        return response()->json([
            'success' => true,
            'message' => 'Invoice deleted successfully.',
            'data' => null
        ]);
    }
}
