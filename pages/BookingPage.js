const { expect } = require('@playwright/test');

class BookingPage {
    constructor(page) {
        this.page = page;
        //identifying form locators
        this.fullNameInput = page.getByPlaceholder('Your full name');////found by placeholder
        this.emailInput = page.getByPlaceholder('you@email.com');//found by placeholder
        this.phoneInput = page.getByPlaceholder('+91 98765 43210');
        this.confirmBtn = page.getByRole('button', { name: 'Confirm Booking' });//locator by role

        // Spinner & Result Locators
        this.spinner = page.locator('.spinner-border, .loading, [class*="spinner"]');
        // New Button from your screenshot
        this.viewMyBookingsBtn = page.getByRole('button', { name: 'View My Bookings' });//locator by role
        // --- Test 2 Quantity Locator ---
        this.incrementButton = page.getByRole('button', {name: /\+/});
    }

    // Method to fill out form fields
    async fillBookingDetails(fullName, email, phone){

        await this.fullNameInput.fill(fullName);
        await this.emailInput.fill(email);
        await this.phoneInput.fill(phone);
    }
    
    // Method to click confirm and wait for the backend submission to process
    async clickConfirmBooking(){
        // Intercept network call so we know when the booking finishes processing
        const responsePromise = this.page.waitForResponse(
            response => response.url().includes('/api/bookings') && response.request().method() === 'POST'
        );

        await this.confirmBtn.click();
        
        // Wait for server confirmation (this naturally lets the loading phase pass)
        await responsePromise;
    }

    // Method to click the next-step button seen on your screenshot
    async clickViewMyBookings() {
        // Ensure the button is fully visible/loadable before clicking
        await this.viewMyBookingsBtn.waitFor({ state: 'visible' });
        await this.viewMyBookingsBtn.click();
    }

    // --- New Method to change quantity for test 2---
    async incrementQuantity(times) {
        for (let i = 0; i < times; i++) {
            await this.incrementButton.click();
        }
        console.log(`Clicked increment button ${times} times.`);
    }

}
module.exports = { BookingPage };