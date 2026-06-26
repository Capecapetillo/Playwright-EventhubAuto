const { test } = require('@playwright/test');
const { POMManager } = require('../pages/POMManager');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const USERNAME = process.env.TEST_USERNAME;
const PASSWORD = process.env.TEST_PASSWORD;

// Reusable login helper function
async function loginAndGoToBooking(page){
        const pm = new POMManager(page);
       const loginPage = pm.getLoginPage();
    const dashboardPage = pm.getDashboardPage();

    // 1. Navigate and log in
    await loginPage.goTo(BASE_URL);
    await loginPage.login(USERNAME, PASSWORD);

    // 2. Confirm Browse Events link is visible
    await dashboardPage.verifyDashboardLoaded();
    return pm; // Returning the manager so the test can continue using it
}
test.describe('Booking Refund Eligibility Tests', () => {

    test('Test 1 — Single ticket booking is eligible for refund', async ({ page }) => {
        // Step 1 — Login using the helper
        const pm = await loginAndGoToBooking(page);
        console.log('Login successful and verified via POM!');
        //Step 2 — Navigate to Events and Click Book Now
        const dashboardPage = pm.getDashboardPage();
        const eventsPage = pm.getEventsPage();
        const bookingPage = pm.getBookingPage();
        const bookingsListPage = pm.getBookingsListPage();
        const bookingDetailsPage = pm.getBookingDetailsPage();
        //1. Navigate via UI click
        await dashboardPage.clickBrowseEvents();
        console.log('Navigated to Events page.');
        
        // 2. Click the Book Now button on the first card
        await eventsPage.clickFirstBookNow();
        console.log('Clicked Book Now on the first event successfully!');
        await page.waitForURL('**/events/*');
        //Fill form fields using your custom getByPlaceholder locators
        await bookingPage.fillBookingDetails('Eduardo Leon', 'test1@test.com', '1234567890');
        console.log('Form inputs populated.');

        // Click confirm booking and wait safely for backend network processing
        await bookingPage.clickConfirmBooking();
        console.log('Booking confirmed, backend processing finished.');

        // Click the final redirection button from your screenshot
        await bookingPage.clickViewMyBookings();
        console.log('Clicked View My Bookings. Redirecting to /bookings...');
        
        // The script is now ready to interface with your upcoming BookingsListPage object!
        // Interact with the list page to click the first item
        await bookingsListPage.clickFirstViewDetails();
        console.log('Clicked the first View Details link.');
        // Step 4 — Validate booking reference logic
        await bookingDetailsPage.verifyBookingInfoVisible();
        console.log('Assertion Passed: "Booking Information" text is visible on the page.');
        // 2. Read booking ref, read event title, and assert validation rule
        await bookingDetailsPage.validateBookingRefMatchesEventTitle();
        console.log('Assertion Passed: First character of booking ref equals first character of event title!');
        // Step 5 — Check refund eligibility
        console.log('Triggering Step 5: Checking refund eligibility...');
        await bookingDetailsPage.checkRefundEligibility();
        console.log('Step 5 completed successfully!');
        //Step 6 - Validate result
        await bookingDetailsPage.validateFullRefundMessage();
        console.log('Step 6 completed successfully! Test Passed.');
    
    });

    test('Test 2 — Group ticket booking is NOT eligible for refund', async ({ page }) => {
        // Step 1 — Login using the helper
        const pm = await loginAndGoToBooking(page);
        console.log('Login successful and verified via POM!');

        // Step 2 — Navigate to Events
        const dashboardPage = pm.getDashboardPage();
        const eventsPage = pm.getEventsPage();
        const bookingPage = pm.getBookingPage();
        const bookingsListPage = pm.getBookingsListPage();
        const bookingDetailsPage = pm.getBookingDetailsPage();

        await dashboardPage.clickBrowseEvents();
        await eventsPage.clickFirstBookNow();
        await page.waitForURL('**/events/*');

        // NEW: Click the + button twice to increase quantity to 3
        await bookingPage.incrementQuantity(2);

        // Step 3 — Fill form fields and confirm booking
        await bookingPage.fillBookingDetails('Eduardo Group', 'group1@test.com', '1234567890');
        await bookingPage.clickConfirmBooking();
        await bookingPage.clickViewMyBookings();
        
        // Step 4 — Go to details and validate reference format
        await bookingsListPage.clickFirstViewDetails();
        await bookingDetailsPage.verifyBookingInfoVisible();
        await bookingDetailsPage.validateBookingRefMatchesEventTitle();

        // Step 5 — Check refund eligibility (Spinner behavior is identical)
        console.log('Triggering Step 5: Checking refund eligibility for group...');
        await bookingDetailsPage.checkRefundEligibility();

        // Step 6 — Validate negative result
        console.log('Triggering Step 6: Validating refund failure details...');
        await bookingDetailsPage.validateRefundFailureResult();
        console.log('Test 2 completed successfully! Group block is non-refundable.');
    });

});

