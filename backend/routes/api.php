<?php

/**
 * SIAP POLNES REST API Route Manifest
 * Blueprint endpoint sesuai PRD_SIAP_Lengkap.md Bagian 15
 */

use Illuminate\Support\Facades\Route;

// Health Check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'SIAP POLNES Backend API',
        'timestamp' => now()->toIso8601String()
    ]);
});

// v1 API Routes
Route::prefix('v1')->group(function () {

    // 1. Auth & Session (Core)
    Route::prefix('auth')->group(function () {
        Route::post('/login', 'AuthController@login');
        Route::post('/logout', 'AuthController@logout')->middleware('auth:sanctum');
        Route::get('/me', 'AuthController@me')->middleware('auth:sanctum');
        Route::post('/refresh', 'AuthController@refresh');
    });

    // Protected Routes
    Route::middleware(['auth:sanctum'])->group(function () {

        // 2. Modul Akademik
        Route::prefix('academic')->group(function () {
            Route::get('/krs/active', 'KrsController@getActiveKrs');
            Route::post('/krs/submit', 'KrsController@submitKrs');
            Route::get('/khs', 'KhsController@getKhs');
            Route::get('/transkrip', 'KhsController@getTranscript');
            Route::post('/grades/import-excel', 'GradeController@importExcel');
            Route::post('/grades/submit', 'GradeController@submitGrade');
        });

        // 3. Modul Layanan Administrasi
        Route::prefix('administration')->group(function () {
            Route::get('/services', 'ServiceController@listServices');
            Route::post('/requests', 'ServiceController@createRequest');
            Route::get('/requests/{id}/tracking', 'ServiceController@trackRequest');
            Route::post('/requests/{id}/verify', 'ServiceController@verifyDocument');
        });

        // 4. Modul Magang & Karir
        Route::prefix('internship')->group(function () {
            Route::get('/vacancies', 'InternshipController@listVacancies');
            Route::post('/vacancies/{id}/apply', 'InternshipController@applyVacancy');
            Route::post('/cv/parse', 'InternshipController@parseCv');
            Route::get('/logbook', 'InternshipController@getLogbook');
            Route::post('/logbook', 'InternshipController@submitLogbook');
        });

        // 5. Modul Pengaduan Mahasiswa
        Route::prefix('complaints')->group(function () {
            Route::post('/tickets', 'ComplaintController@createTicket');
            Route::get('/tickets', 'ComplaintController@listTickets');
            Route::get('/tickets/{id}', 'ComplaintController@getTicket');
            Route::post('/tickets/{id}/disposition', 'ComplaintController@dispositionTicket');
            Route::post('/tickets/{id}/respond', 'ComplaintController@respondTicket');
        });

        // 6. Modul Beasiswa Cerdas
        Route::prefix('scholarships')->group(function () {
            Route::get('/programs', 'ScholarshipController@listPrograms');
            Route::get('/match', 'ScholarshipController@scanEligibility');
            Route::post('/apply', 'ScholarshipController@applyProgram');
            Route::post('/verify-document', 'ScholarshipController@verifyDocumentOCR');
        });

        // 7. Notifikasi Terpadu
        Route::prefix('notifications')->group(function () {
            Route::get('/', 'NotificationController@index');
            Route::patch('/{id}/read', 'NotificationController@markAsRead');
            Route::patch('/read-all', 'NotificationController@markAllAsRead');
        });
    });
});
