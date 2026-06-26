const { LoginPage } = require('./LoginPage');
const { DashboardPage } = require('./DashboardPage');
const { EventsPage } = require('./EventsPage');
const { BookingPage } = require('./BookingPage');
const { BookingsListPage } = require('./BookingsListPage');
const { BookingDetailsPage } = require('./BookingDetailsPage');

class POMManager {
    constructor(page) { 
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.eventsPage = new EventsPage(this.page);
        this.bookingPage = new BookingPage(this.page);
        this.bookingsListPage = new BookingsListPage(this.page);
        this.bookingDetailsPage = new BookingDetailsPage(this.page);
    }

    getLoginPage(){
        return this.loginPage;
    }

    getDashboardPage(){
        return this.dashboardPage;
    }

    getEventsPage(){
        return this.eventsPage;
    }

    getBookingPage(){
        return this.bookingPage;
    }

    getBookingsListPage(){
        return this.bookingsListPage;
    }

    getBookingDetailsPage(){
        return this.bookingDetailsPage;
    }

}
module.exports = { POMManager };