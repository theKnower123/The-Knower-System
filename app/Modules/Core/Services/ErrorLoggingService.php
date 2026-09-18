<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Models\ErrorLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;
use Illuminate\Http\Request;

class ErrorLoggingService
{
    public static function logException(Throwable $e, ?Request $request = null)
    {
        try {
            $request = $request ?? request();
            $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
            
            // Generate or get Correlation ID
            $correlationId = $request->header('X-Correlation-ID', (string) Str::uuid());
            
            ErrorLog::create([
                'correlation_id' => $correlationId,
                'request_id' => (string) Str::uuid(), // simplified
                'status_code' => $statusCode,
                'message' => $e->getMessage(),
                'exception_type' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'stack_trace' => $e->getTraceAsString(),
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'ip' => $request->ip(),
                'browser' => $request->userAgent(),
                'user_id' => auth()->id(),
                'workspace_id' => session('workspace_id') ?? ($request->user() ? $request->user()->current_workspace_id : null),
                'module' => self::determineModule($request->path()),
                'request_payload' => $request->except(['password', 'password_confirmation']),
                'headers' => $request->headers->all(),
                'response_time' => defined('LARAVEL_START') ? (microtime(true) - LARAVEL_START) * 1000 : null,
                'log_channel' => 'application',
            ]);
            
            // Also log to standard Laravel log
            Log::error($e->getMessage(), ['exception' => $e]);
            
        } catch (\Exception $loggingException) {
            // Fallback if DB logging fails
            Log::critical('Failed to log exception to database: ' . $loggingException->getMessage());
        }
    }

    private static function determineModule(string $path): string
    {
        $segments = explode('/', ltrim($path, '/'));
        return ucfirst($segments[0] ?? 'Core');
    }
}
