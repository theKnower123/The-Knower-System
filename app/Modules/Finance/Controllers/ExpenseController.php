<?php

namespace App\Modules\Finance\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finance\Requests\StoreExpenseRequest;
use App\Modules\Finance\Requests\UpdateExpenseRequest;
use App\Http\Resources\Finance\ExpenseResource;
use App\Modules\Finance\Models\Expense;
use App\Modules\Finance\Services\ExpenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ExpenseController extends Controller
{
    protected ExpenseService $expenseService;

    public function __construct(ExpenseService $expenseService)
    {
        $this->expenseService = $expenseService;
    }

    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Expense::class);

        $expenses = $this->expenseService->getAll();
        
        // Load relations if needed
        $expenses->load('creator');

        return response()->json([
            'success' => true,
            'message' => 'Expenses retrieved successfully.',
            'data' => ExpenseResource::collection($expenses)
        ]);
    }

    public function store(StoreExpenseRequest $request): JsonResponse
    {
        $expense = $this->expenseService->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Expense created successfully.',
            'data' => new ExpenseResource($expense)
        ], 201);
    }

    public function show(Expense $expense): JsonResponse
    {
        Gate::authorize('view', $expense);

        return response()->json([
            'success' => true,
            'message' => 'Expense retrieved successfully.',
            'data' => new ExpenseResource($expense)
        ]);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): JsonResponse
    {
        $expense = $this->expenseService->update($expense, $request->all());

        return response()->json([
            'success' => true,
            'message' => 'Expense updated successfully.',
            'data' => new ExpenseResource($expense)
        ]);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        Gate::authorize('delete', $expense);

        $this->expenseService->delete($expense);

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted successfully.',
            'data' => null
        ]);
    }
}
