from odoo import models, fields, api

class RoomBooking(models.Model):
    _name = 'room.booking'
    _description = 'حجز قاعة'

    reserver_name = fields.Char(string="اسم الحاجز", required=True)
    guests = fields.Many2many('res.partner', string="المدعوين")
    day = fields.Selection([
        ('sunday', 'الأحد'),
        ('monday', 'الإثنين'),
        ('tuesday', 'الثلاثاء'),
        ('wednesday', 'الأربعاء'),
        ('thursday', 'الخميس'),
        ('friday', 'الجمعة'),
        ('saturday', 'السبت'),
    ], string="اليوم", required=True)
    hour = fields.Char(string="الوقت", required=True)
    booking_date = fields.Datetime(string="تاريخ الحجز", default=fields.Datetime.now)
