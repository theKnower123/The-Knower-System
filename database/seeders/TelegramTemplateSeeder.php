<?php

namespace Database\Seeders;

use App\Modules\Telegram\Models\TelegramTemplate;
use Illuminate\Database\Seeder;

class TelegramTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds (Arabic-only templates covering all system events).
     */
    public function run(): void
    {
        $templates = [
            // ==========================================
            // --- 1. User & Client Notifications ---
            // ==========================================
            [
                'key' => 'account_linked',
                'label' => 'تأكيد ربط الحساب (Account Linked)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "🎉 *مرحباً بك، {{user_name}}!*\n\nتم ربط حساب تيليجرام الخاص بك بنجاح مع *The Knower OS*.\n\nستصلك الآن كافة الإشعارات الفورية، تحديثات المشاريع، والتنبيهات الأمنية هنا مباشرة.",
                'available_variables' => ['user_name', 'platform_name'],
            ],
            [
                'key' => 'connection_test',
                'label' => 'رسالة اختبار الاتصال (Connection Test)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "⚡ *إشعار اختبار الاتصال - The Knower OS*\n\nمرحباً بك *{{user_name}}*!\nتم فحص وتأكيد اتصال حسابك مع بوت تيليجرام بنجاح.\nيعمل البوت بكامل كفاءته لتلقي التنبيهات الفورية وإشعارات المشاريع والرموز الأمنية لحسابك.\n\n⏱️ وقت الفحص: *{{timestamp}}*",
                'available_variables' => ['user_name', 'platform_name', 'timestamp'],
            ],
            [
                'key' => 'graduation_project_confirmation',
                'label' => 'تأكيد استلام مشروع التخرج (Graduation Project Received)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "🎓 *مرحباً {{contact_name}}!*\n\nتم استلام طلب تسجيل مشروع التخرج الخاص بفريقكم *{{team_name}}* بنجاح في *The Knower OS*.\n\n📌 *رقم المرجع الخاص بكم:* `{{reference_id}}`\n\nيقوم فريقنا الأكاديمي والتقني بمراجعة متطلبات وتفاصيل المشروع بعناية، وسنتواصل معكم قريباً عبر الهاتف أو البريد لتزويدكم بعرض السعر المخصص وخطة التنفيذ! ✨",
                'available_variables' => ['contact_name', 'team_name', 'reference_id', 'platform_name'],
            ],
            [
                'key' => 'password_reset',
                'label' => 'رابط استعادة كلمة المرور (Password Reset)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "🔐 *طلب إعادة تعيين كلمة المرور*\n\nمرحباً {{user_name}}،\n\nتم استلام طلب لإعادة تعيين كلمة مرور حسابك في *The Knower OS*.\n\nاضغط على الرابط التالي لتعيين كلمة مرور جديدة. الرابط صالح لمدة *5 دقائق فقط* وللاستخدام لمرة واحدة:\n{{reset_link}}\n\n⚠️ *إذا لم تقم بهذا الطلب، يرجى التواصل مع مدير النظام فوراً.*",
                'available_variables' => ['user_name', 'reset_link', 'expires_in'],
            ],
            [
                'key' => 'project_assigned',
                'label' => 'تعيين مشروع جديد (Project Assigned)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "🚀 *تعيين مشروع جديد*\n\nمرحباً {{user_name}}،\n\nتم تعيينك في مشروع جديد: *{{project_name}}*.\nالدور: *{{role}}*\n\nعرض التفاصيل: {{project_url}}",
                'available_variables' => ['user_name', 'project_name', 'role', 'project_url'],
            ],
            [
                'key' => 'task_assigned',
                'label' => 'إسناد مهمة جديدة (Task Assigned)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "📋 *مهمة جديدة مسندة إليك*\n\nمرحباً {{user_name}}،\n\nتم إسناد مهمة جديدة لك: *{{task_title}}*\nالمشروع: *{{project_name}}*\nالأولوية: *{{priority}}*\nتاريخ الاستحقاق: *{{due_date}}*\n\nعرض المهمة: {{task_url}}",
                'available_variables' => ['user_name', 'task_title', 'project_name', 'priority', 'due_date', 'task_url'],
            ],
            [
                'key' => 'task_status_changed',
                'label' => 'تحديث حالة المهمة (Task Status Changed)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "🔄 *تحديث حالة المهمة*\n\nالمهمة: *{{task_title}}*\nالحالة الجديدة: *{{new_status}}*\nتم التحديث بواسطة: *{{updated_by}}*\nالمشروع: *{{project_name}}*\n\nتفاصيل المهمة: {{task_url}}",
                'available_variables' => ['task_title', 'new_status', 'updated_by', 'project_name', 'task_url'],
            ],
            [
                'key' => 'invoice_created',
                'label' => 'إصدار فاتورة جديدة (Invoice Issued)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "🧾 *فاتورة جديدة صادرة*\n\nعزيزنا {{client_name}}،\n\nتم إصدار الفاتورة رقم *#{{invoice_number}}* بقيمة *{{amount}}*.\nتاريخ الاستحقاق: *{{due_date}}*\n\nالمعاينة والسداد: {{invoice_url}}",
                'available_variables' => ['client_name', 'invoice_number', 'amount', 'due_date', 'invoice_url'],
            ],
            [
                'key' => 'ticket_replied',
                'label' => 'رد على تذكرة دعم فني (Ticket Reply)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "💬 *رد جديد على التذكرة #{{ticket_id}}*\n\nالموضوع: *{{ticket_subject}}*\nالرد بواسطة: *{{agent_name}}*\n\nنص الرد: _{{message_preview}}_\n\nعرض المحادثة كاملة: {{ticket_url}}",
                'available_variables' => ['ticket_id', 'ticket_subject', 'agent_name', 'message_preview', 'ticket_url'],
            ],
            [
                'key' => 'timesheet_approved',
                'label' => 'اعتماد سجل الدوام (Timesheet Approved)',
                'category' => 'user',
                'body_en' => '',
                'body_ar' => "✅ *تمت الموافقة على سجل الدوام*\n\nمرحباً {{user_name}}،\n\nتمت الموافقة على سجل ساعات العمل للفترة *{{period}}* (الإجمالي: *{{hours}} ساعة*) من قبل *{{approver_name}}*.",
                'available_variables' => ['user_name', 'period', 'hours', 'approver_name'],
            ],

            // ==========================================
            // --- 2. Admin & Management Messages ---
            // ==========================================
            [
                'key' => 'graduation_project_registered',
                'label' => 'تسجيل مشروع تخرج جديد (Graduation Project Registered)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "🎓 *تسجيل مشروع تخرج جديد وارد للمراجعة!*\n\n📌 *رقم المرجع:* `{{reference_id}}`\n👥 *اسم الفريق:* *{{team_name}}*\n🏛️ *الجامعة:* {{university}} - {{college}}\n🔢 *عدد الأعضاء:* {{team_size}}\n🛠️ *نوع المشروع:* {{project_type}}\n💼 *نوع الخدمة:* {{service_type}}\n\n👤 *المسؤول:* {{primary_contact_name}}\n📞 *الهاتف:* {{primary_contact_phone}}\n✉️ *البريد:* {{primary_contact_email}}\n\n📝 *وصف المشروع:*\n_{{description}}_\n\n🔗 *مراجعة المشروع في الإدارة:*\n{{project_url}}",
                'available_variables' => [
                    'reference_id', 'team_name', 'university', 'college', 'team_size',
                    'project_type', 'service_type', 'primary_contact_name',
                    'primary_contact_phone', 'primary_contact_email', 'description', 'project_url'
                ],
            ],
            [
                'key' => 'contact_form_submitted',
                'label' => 'نموذج تواصل واستفسار جديد (Contact Form Submission)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "📬 *رسالة تواصل واستفسار جديدة عبر الموقع!*\n\n👤 *الاسم:* *{{name}}*\n🏢 *الشركة:* {{company}}\n✉️ *البريد الإلكتروني:* {{email}}\n📞 *الهاتف:* {{phone}}\n💬 *واتساب:* {{whatsapp}}\n🏷️ *نوع الاستفسار:* {{inquiry_type}}\n📦 *الخطة المهتم بها:* {{plan}}\n\n📝 *نص الرسالة:*\n_{{message}}_\n\n🔗 *عرض الاستفسار في إدارة العملاء:*\n{{inquiry_url}}",
                'available_variables' => ['name', 'company', 'email', 'phone', 'whatsapp', 'inquiry_type', 'plan', 'message', 'inquiry_url'],
            ],
            [
                'key' => 'project_inquiry_received',
                'label' => 'استفسار عن مشروع محدد (Specific Project Inquiry)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "💼 *طلب واستفسار عن مشروع جديد!*\n\n👤 *العميل:* *{{name}}*\n✉️ *البريد الإلكتروني:* {{email}}\n📞 *رقم الهاتف:* {{phone}}\n🏢 *الشركة:* {{company}}\n🎯 *المشروع / الخدمة المعنية:* *{{project_name}}*\n\n📝 *تفاصيل الطلب:*\n_{{message}}_\n\n🔗 *رابط المتابعة في لوحة التحكم:*\n{{inquiry_url}}",
                'available_variables' => ['name', 'email', 'phone', 'company', 'project_name', 'message', 'inquiry_url'],
            ],
            [
                'key' => 'demo_request_received',
                'label' => 'طلب عرض توضيحي جديد (Demo Request Received)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "🖥️ *طلب جديد لحجز عرض توضيحي للمنصة (Demo Request)!*\n\n👤 *الاسم:* *{{name}}*\n✉️ *البريد الإلكتروني:* {{email}}\n⏰ *وقت الطلب:* {{timestamp}}\n\nيرجى التواصل مع العميل لترتيب موعد العرض التوضيحي.",
                'available_variables' => ['name', 'email', 'timestamp'],
            ],
            [
                'key' => 'job_application_received',
                'label' => 'طلب توظيف جديد وارد (Job Application Received)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "💼 *طلب توظيف جديد وارد عبر الموقع!*\n\n👤 *اسم المتقدم:* *{{applicant_name}}*\n✉️ *البريد الإلكتروني:* {{email}}\n📞 *رقم الهاتف:* {{phone}}\n🎯 *الوظيفة الشاغرة:* *{{job_title}}*\n\n🔗 *رابط مراجعة الطلب:*\n{{application_url}}",
                'available_variables' => ['applicant_name', 'email', 'phone', 'job_title', 'application_url'],
            ],
            [
                'key' => 'user_registered',
                'label' => 'تسجيل مستخدم جديد (New User)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "👤 *تسجيل مستخدم جديد*\n\nالاسم: *{{user_name}}*\nالبريد: *{{user_email}}*\nالدور: *{{role}}*\nوقت التسجيل: *{{registered_at}}*",
                'available_variables' => ['user_name', 'user_email', 'role', 'registered_at'],
            ],
            [
                'key' => 'client_registered',
                'label' => 'إضافة عميل جديد (New Client)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "🏢 *إضافة عميل جديد*\n\nاسم العميل: *{{client_name}}*\nالشركة: *{{company_name}}*\nالبريد: *{{client_email}}*\nالهاتف: *{{client_phone}}*",
                'available_variables' => ['client_name', 'company_name', 'client_email', 'client_phone'],
            ],
            [
                'key' => 'project_created',
                'label' => 'إطلاق مشروع جديد (New Project)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "📁 *إطلاق مشروع جديد*\n\nالمشروع: *{{project_name}}*\nالعميل: *{{client_name}}*\nالميزانية: *{{budget}}*\nبواسطة: *{{created_by}}*",
                'available_variables' => ['project_name', 'client_name', 'budget', 'created_by'],
            ],
            [
                'key' => 'payment_received',
                'label' => 'استلام دفعة مالية (Payment Received)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "💰 *تأكيد استلام دفعة مالية!*\n\nالمبلغ: *{{amount}}*\nالعميل: *{{client_name}}*\nالفاتورة: *#{{invoice_number}}*\nطريقة الدفع: *{{payment_method}}*",
                'available_variables' => ['amount', 'client_name', 'invoice_number', 'payment_method'],
            ],
            [
                'key' => 'ticket_created',
                'label' => 'تذكرة دعم فني جديدة (New Ticket)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "🎫 *تذكرة دعم فني جديدة #{{ticket_id}}*\n\nالموضوع: *{{ticket_subject}}*\nمقدم التذكرة: *{{user_name}}*\nالأولوية: *{{priority}}*\n\nرابط التذكرة: {{ticket_url}}",
                'available_variables' => ['ticket_id', 'ticket_subject', 'user_name', 'priority', 'ticket_url'],
            ],
            [
                'key' => 'timesheet_submitted',
                'label' => 'سجل دوام بانتظار الموافقة (Timesheet Review)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "⏱️ *سجل دوام بانتظار الموافقة*\n\nالموظف: *{{user_name}}*\nالفترة: *{{period}}*\nإجمالي الساعات: *{{hours}} ساعة*\n\nمراجعة السجل: {{timesheet_url}}",
                'available_variables' => ['user_name', 'period', 'hours', 'timesheet_url'],
            ],
            [
                'key' => 'test_notification',
                'label' => 'تنبيه إداري تجريبي (Admin Test Alert)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "🚀 *[The Knower OS] تنبيه تجريبي لبوت تيليجرام*\n\nمرحباً {{user_name}}!\n\nهذا إشعار تجريبي مباشر من لوحة التحكم في خادم تيليجرام.\nالاتصال تم التحقق منه ويعمل بكفاءة كاملة! ✨\n\nتوقيت الخادم: *{{server_time}}*",
                'available_variables' => ['user_name', 'server_time'],
            ],
            [
                'key' => 'system_alert',
                'label' => 'تنبيه نظام عام (General System Alert)',
                'category' => 'admin',
                'body_en' => '',
                'body_ar' => "⚠️ *تنبيه النظام: {{title}}*\n\n{{message}}\n\nالوقت: *{{timestamp}}*",
                'available_variables' => ['title', 'message', 'timestamp'],
            ],
        ];

        foreach ($templates as $data) {
            TelegramTemplate::updateOrCreate(
                ['key' => $data['key']],
                [
                    'label' => $data['label'],
                    'category' => $data['category'],
                    'body_en' => '',
                    'body_ar' => $data['body_ar'],
                    'available_variables' => $data['available_variables'],
                ]
            );
        }
    }
}
