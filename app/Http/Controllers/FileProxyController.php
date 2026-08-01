<?php

namespace App\Http\Controllers;

use App\Modules\Projects\Models\File as ProjectFile;
use App\Modules\Finance\Models\Expense;
use App\Modules\Finance\Models\Payment;
use App\Modules\HR\Models\JobApplication;
use App\Modules\HR\Models\Employee;
use App\Modules\Auth\Models\User;
use App\Modules\Marketing\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileProxyController extends Controller
{
    /**
     * Display/stream the file directly from storage without revealing R2/S3 URLs.
     */
    public function show($id)
    {
        $file = ProjectFile::find($id);

        if ($file && $file->file_path) {
            return $this->streamFile($file->file_path, $file->file_name);
        }

        abort(404, 'File not found');
    }

    /**
     * Display/stream files for other models by type and ID.
     */
    public function showByType(string $type, string|int $id)
    {
        $filePath = null;
        $fileName = null;

        switch ($type) {
            case 'expense':
                $expense = Expense::findOrFail($id);
                $filePath = $expense->receipt_path ?? $expense->transfer_proof;
                $fileName = 'expense_receipt_' . $id;
                break;

            case 'payment':
                $payment = Payment::findOrFail($id);
                $filePath = $payment->transfer_proof;
                $fileName = 'payment_proof_' . $id;
                break;

            case 'resume':
            case 'job_application':
                $app = JobApplication::findOrFail($id);
                $filePath = $app->resume_path;
                $fileName = 'resume_' . $app->first_name . '_' . $app->last_name;
                break;

            case 'avatar':
            case 'user':
                $user = User::findOrFail($id);
                $filePath = $user->avatar;
                $fileName = 'avatar_' . $id;
                break;

            case 'employee':
            case 'id_photo':
                $employee = Employee::findOrFail($id);
                $filePath = $employee->id_photo;
                $fileName = 'id_photo_' . $id;
                break;

            case 'post':
            case 'media':
                $post = Post::findOrFail($id);
                $filePath = $post->media_path;
                $fileName = 'media_' . $id;
                break;

            default:
                abort(404, 'Invalid file type');
        }

        if (empty($filePath)) {
            abort(404, 'File path not found');
        }

        return $this->streamFile($filePath, $fileName);
    }

    /**
     * Stream file from S3/R2 or fallback disks.
     */
    private function streamFile(string $filePath, ?string $downloadName = null)
    {
        $cleanPath = ltrim($filePath, '/');
        if (str_starts_with($cleanPath, 'storage/')) {
            $cleanPath = substr($cleanPath, 8);
        }

        // Try S3 / R2 disk first
        $disk = Storage::disk('s3');
        if (!$disk->exists($cleanPath)) {
            $disk = Storage::disk(config('filesystems.default', 'public'));
        }

        if (!$disk->exists($cleanPath)) {
            $disk = Storage::disk('public');
        }

        if (!$disk->exists($cleanPath)) {
            abort(404, 'File not found on storage server');
        }

        $filename = $downloadName ?? basename($cleanPath);

        return $disk->response($cleanPath, $filename);
    }
}
