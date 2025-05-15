{
    'name': 'حجز قاعات الاجتماعات',
    'version': '1.0',
    'category': 'Productivity',
    'summary': 'واجهة حجز قاعات بشكل جدول أيام وأوقات',
    'depends': ['base', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/room_booking_views.xml',
        'views/room_booking_calendar.xml',  # أضف هذا إذا كان لديك 
    ],
    'assets': {
        'web.assets_backend': [
            'room_booking_calendar2/static/src/js/room_booking_calendar_view.js',
            'room_booking_calendar2/static/src/xml/room_booking_calendar_view.xml',
        ],
    },
    'installable': True,
    'application': True,
}
