from odoo import models, fields

class User(models.Model):
    _inherit = 'res.users'  # Inherit from the existing users model

    partner_ids = fields.Many2many('res.partner', string="Partners")  # New field for partners
