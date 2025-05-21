import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

// دالة مساعدة لحساب بداية الأسبوع الحالي (من اليوم)
function getWeekStart(offset) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now.getTime() + offset * 7 * 24 * 60 * 60 * 1000); // Adjust for the offset
    return new Date(startOfWeek.getTime() - startOfWeek.getDay() * 24 * 60 * 60 * 1000); // Get the start of the week
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
            guests: [], // New state for guests
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
        this.hours = ['08:00','09:00', '10:00', '11:00', '12:00', '01:00', '02:00', '03:00', '04:00', '05:00'];

        onWillStart(async () => {
            await this.loadBookings();
        });
    }

    // تحميل الحجوزات للأسبوع الحالي فقط
    async loadBookings() {
        const weekStart = getWeekStart(0); // Always get the current week
        const numberOfWeeks = 2; // Change this to the number of weeks you want to allow
        const weekEnd = new Date(weekStart.getTime() + numberOfWeeks * 7 * 24 * 60 * 60 * 1000); // Calculate end date

        const weekStartStr = weekStart.toISOString().slice(0, 19).replace('T', ' ');
        const weekEndStr = weekEnd.toISOString().slice(0, 19).replace('T', ' ');

        this.state.bookings = await this.orm.searchRead("room.booking", [
            ["booking_date", ">=", weekStartStr],
            ["booking_date", "<=", weekEndStr]
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
        if (!this.state.reserver_name) {
            this.notification.add("يرجى تعبئة الاسم.", { type: "danger" });
            return;
        }
        this.state.isSubmitting = true; // Show loading state
        try {
            const bookingData = {
                reserver_name: this.state.reserver_name,
                guests: this.state.guests,
                day: this.state.selectedSlot.dayKey,
                hour: this.state.selectedSlot.hour,
            };
            await this.orm.create("room.booking", [bookingData]);
            this.notification.add("تم حفظ الحجز بنجاح!", { type: "success" });
            this.state.selectedSlot = null;
            this.state.guests = [];
            await this.loadBookings();
        } catch (error) {
            // Improved error handling
            const errorMessage = error.message || "حدث خطأ أثناء حفظ الحجز!";
            this.notification.add(errorMessage, { type: "danger" });
        } finally {
            this.state.isSubmitting = false; // Hide loading state
        }
    }

    // Method to handle guest input
    onGuestInput(ev) {
        this.state.guests = ev.target.value.split(',').map(guest => guest.trim()); // Split input by commas
    }
}

RoomBookingCalendarView.template = "room_booking.RoomBookingCalendarView";
registry.category("actions").add("room_booking_calendar_view", RoomBookingCalendarView);
