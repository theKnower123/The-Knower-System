<?php

namespace App\Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finance\Requests\StorePaymentRequest;
use App\Modules\Finance\Requests\UpdatePaymentRequest;
use App\Http\Resources\Finance\PaymentResource;
use App\Modules\Finance\Models\Payment;
use App\Modules\Finance\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Payment::class);

        $payments = $this->paymentService->getAll();
        
        // Load relations if needed
        $payments->load('invoice.client');

        return response()->json([
            'success' => true,
            'message' => 'Payments retrieved successfully.',
            'data' => PaymentResource::collection($payments)
        ]);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $payment = $this->paymentService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Payment created successfully.',
            'data' => new PaymentResource($payment)
        ], 201);
    }

    public function show(Payment $payment): JsonResponse
    {
        Gate::authorize('view', $payment);

        return response()->json([
            'success' => true,
            'message' => 'Payment retrieved successfully.',
            'data' => new PaymentResource($payment)
        ]);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): JsonResponse
    {
        $payment = $this->paymentService->update($payment, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully.',
            'data' => new PaymentResource($payment)
        ]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        Gate::authorize('delete', $payment);

        $this->paymentService->delete($payment);

        return response()->json([
            'success' => true,
            'message' => 'Payment deleted successfully.',
            'data' => null
        ]);
    }
}
