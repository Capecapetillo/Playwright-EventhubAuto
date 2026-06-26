const { expect } = require('@playwright/test');

class BookingDetailsPage {
    constructor(page) {
         this.page = page;
         // 1. Locator for the page title/heading
           // this.eventTitle = page.getByRole('heading', {name: 'Dilli Diwali Mela'});
        // 2. Playwright Best Practice: Target the text block that contains the alphanumeric booking reference format.
         // Grabs whatever main title is rendered on the page
         this.eventTitle = page.locator('h1, h2, .event-title').first();
        // We look for a string that matches the pattern (Letter-Number...) right on the page.
        this.bookingRefText = page.locator('text=/^[A-Z]-[A-Z0-9]+$/');
        // 3. Main identification section locator (Event Details header)
        this.eventDetailsHeading = page.getByRole('heading', { name: 'Event Details' });
         //4. following best practices
         this.checkEligibilityForRefund = page.getByRole('button', {name: 'Check eligibility for refund?'});
         this.spinner = page.locator('#refund-spinner');
         //step 6 - Locate result element by id #refund-result
         this.refundResult = page.locator('#refund-result');
        
      
      }


     async verifyBookingInfoVisible(){
        // Since "Booking Information" isn't explicitly written as a header on this view,
        // we assert that the main "Event Details" card header is visible instead.
        await expect(this.eventDetailsHeading).toBeVisible();
     }
       
     async validateBookingRefMatchesEventTitle() {
        // Read text elements safely
        const eventTitle = await this.eventTitle.innerText();
        const bookingRef = await this.bookingRefText.first().innerText();

        console.log(`Extracted Event Title: "${eventTitle}"`);
        console.log(`Extracted Booking Ref: "${bookingRef}"`);

        // Grab the first character of each string and make them uppercase
        const firstCharRef = bookingRef.trim().charAt(0).toUpperCase();
        const firstCharTitle = eventTitle.trim().charAt(0).toUpperCase();

        console.log(`Comparing characters: Reference ('${firstCharRef}') vs Title ('${firstCharTitle}')`);

        // Assert: "D" from D-8K0O3E equals "D" from Dilli Diwali Mela
        expect(firstCharRef).toBe(firstCharTitle);
    }
    
    async checkRefundEligibility() {
      // 1. Click the eligibility button
      await this.checkEligibilityForRefund.click();
      // 2. Assert: spinner element is immediately visible
      // We set a short timeout (e.g., 2 seconds) to ensure it appears "immediately"
      await expect(this.spinner).toBeVisible({ timeout: 2000 });
      console.log('Assertion Passed: Spinner is immediately visible.');
      // 3. Assert: spinner is no longer visible within 6 seconds
      // Playwright defaults to 5s, so passing a 6000ms timeout overrides it perfectly
      await expect(this.spinner).toBeHidden({ timeout: 6000 });
        console.log('Assertion Passed: Spinner disappeared within 6 seconds.');
    }

    async validateFullRefundMessage () {
      // 1. Assert the result container element is visible
         await expect(this.refundResult).toBeVisible();
         console.log('Assertion Passed: Refund result container is visible.');
      // Check for the substrings sequentially on the single block
        await expect(this.refundResult).toContainText('Eligible for refund');
        await expect(this.refundResult).toContainText('Single-ticket bookings qualify for a full refund.');
        
          console.log('Assertion Passed: All valid refund status phrases verified.');
    }

    // Add this inside your BookingDetailsPage class file
   async validateRefundFailureResult() {
    // 1. Assert the result container element is visible
    await expect(this.refundResult).toBeVisible();
    console.log('Assertion Passed: Refund result container is visible.');

    // 2. Assert it contains the negative validation phrases
    await expect(this.refundResult).toContainText('Not eligible for refund');
    await expect(this.refundResult).toContainText('Group bookings (3 tickets) are non-refundable');
    console.log('Assertion Passed: Non-eligible group refund text matches criteria perfectly.');
   }
}
module.exports = { BookingDetailsPage };