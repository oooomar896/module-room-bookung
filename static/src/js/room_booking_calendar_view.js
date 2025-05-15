import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

// دالة مساعدة لحساب بداية الأسبوع الحالي (من اليوم)
function getWeekStart() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // قبل 6 أيام = أسبوع
}

export class RoomBookingCalendarView extends Component {
    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.state = useState({
            selectedSlot: null,
            reserver_name: "",
            department: "",
            email: "",
            isSubmitting: false,
            bookings: [], // الحجوزات للأسبوع الحالي
        });
        this.days = [
            { key: 'sunday', label: 'الأحد' },
            { key: 'monday', label: 'الإثنين' },
            { key: 'tuesday', label: 'الثلاثاء' },
            { key: 'wednesday', label: 'الأربعاء' },
            { key: 'thursday', label: 'الخميس' },
            { key: 'friday', label: 'الجمعة' },
            { key: 'saturday', label: 'السبت' },
        ];
        this.hours = ['09:00', '10:00', '11:00', '12:00', '01:00', '02:00'];

        onWillStart(async () => {
            await this.loadBookings();
        });
    }

    // تحميل الحجوزات للأسبوع الحالي فقط
    async loadBookings() {
        const weekStart = getWeekStart();
        const weekStartStr = weekStart.toISOString().slice(0, 19).replace('T', ' ');
        this.state.bookings = await this.orm.searchRead("room.booking", [
            ["booking_date", ">=", weekStartStr]
        ], ["day", "hour", "reserver_name"]);
    }

    // هل الخانة محجوزة؟
    isSlotBooked(dayKey, hour) {
        return this.state.bookings.some(
            b => b.day === dayKey && b.hour === hour
        );
    }

    // اسم الحاجز للخانة (إن وجد)
    getSlotReserver(dayKey, hour) {
        const booking = this.state.bookings.find(
            b => b.day === dayKey && b.hour === hour
        );
        return booking ? booking.reserver_name : "";
    }

    selectSlot(dayKey, hour) {
        // لا يمكن الحجز في خانة محجوزة
        if (this.isSlotBooked(dayKey, hour)) {
            this.notification.add("هذه الخانة محجوزة بالفعل!", { type: "danger" });
            return;
        }
        this.state.selectedSlot = { dayKey, hour };
        this.state.reserver_name = "";
        this.state.department = "";
        this.state.email = "";
    }

    onInput(ev, key) {
        this.state[key] = ev.target.value;
    }

    async submitBooking(ev) {
        ev.preventDefault();
        if (!this.state.reserver_name || !this.state.email) {
            this.notification.add("يرجى تعبئة الاسم والبريد الإلكتروني.", { type: "danger" });
            return;
        }
        this.state.isSubmitting = true;
        try {
            await this.orm.create("room.booking", [{
                reserver_name: this.state.reserver_name,
                department: this.state.department,
                email: this.state.email,
                day: this.state.selectedSlot.dayKey,
                hour: this.state.selectedSlot.hour,
            }]);
            this.notification.add("تم حفظ الحجز بنجاح!", { type: "success" });
            this.state.selectedSlot = null;
            await this.loadBookings(); // تحديث الجدول
        } catch (error) {
            this.notification.add("حدث خطأ أثناء حفظ الحجز!", { type: "danger" });
        } finally {
            this.state.isSubmitting = false;
        }
    }
}

RoomBookingCalendarView.template = "room_booking.RoomBookingCalendarView";
registry.category("actions").add("room_booking_calendar_view", RoomBookingCalendarView);
