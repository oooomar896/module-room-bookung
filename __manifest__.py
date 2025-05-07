{
    'name': 'حجز قاعة الاجتماعات',
    'version': '1.0',
    'category': 'Tools',
    'summary': 'Room Booking with Calendar View',
    'description': """
هذا الموديول يتيح للمستخدمين حجز قاعات الاجتماعات مع عرض تقويمي.

الخصائص:
---------
- اختيار الغرفة حسب الوقت المتاح.
- منع التعارض بين الحجوزات.
- دعم التكامل مع تقويم Odoo.
- إشعارات تلقائية عند إنشاء أو تعديل الحجوزات.

طريقة الاستخدام:
------------------
1. انتقل إلى قائمة "قاعة الاجتماعات".
2. اضغط على "إنشاء" لحجز جديد.
3. اختر الغرفة، التاريخ، والمدة الزمنية.
4. سيتم التحقق من التوفر ومنع الحجز المكرر.

المتطلبات:
------------
- base
- web

""",
    'author': 'عمر العديني / اسم المؤلف',
    'website': 'http://example.com',
    'depends': ['base', 'web'],
    'data': [
         'views/room_booking_views.xml',
         'views/room_booking_menu.xml',
         'security/ir.model.access.csv',
    ],
    'installable': True,
    'application': True,
}
