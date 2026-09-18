<?php

use Illuminate\Database\Migrations\Migration;

// NOTE: This is a code-fix reminder migration, not a schema change.
// The bug: 'support_manager' role exists in frontend permissions but is
// missing from the backend User::getAllPermissions() match block.
// Action required in app/Models/User.php -> getAllPermissions():
// add a case for 'support_manager' returning its permission set,
// mirroring the same role key used in the frontend permissions map.
return new class extends Migration
{
    public function up(): void
    {
        // No schema change. See note above — fix User::getAllPermissions().
    }

    public function down(): void
    {
        //
    }
};
