
from odoo import models, fields

class RoomBooking(models.Model):
    _name = 'room.booking'
    _description = 'حجز قاعة الاجتماعات'

    name = fields.Char(string="Subject", required=True)
    start_datetime = fields.Datetime(string='Start Time', required=True, index=True)
    end_datetime = fields.Datetime(string='End Time', required=True, index=True)
    room = fields.Char(string='Room')
    user_id = fields.Many2one(
        'res.users', 
        string='Booked By', 
        default=lambda self: self.env.user,
        readonly=True
    )
    description = fields.Text(string="Description")  # حقل الوصف الجديد

    state = fields.Selection(
        [
            ('draft', 'Draft'),
            ('confirmed', 'Confirmed'),
            ('done', 'Done'),
            ('cancelled', 'Cancelled'),
        ],
        string='Status',
        default='draft',
        readonly=True
    )
