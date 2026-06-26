const { expect } = require('@playwright/test');

class EventsPage {
    constructor(page){
        this.page = page;
        // Locators
        // 1. Target all event cards
        this.eventCards = page.locator('[data-testid="event-card"]');
        // 2. Explicitly isolate the first event card's Book Now button
        this.firstBookNowButton = this.eventCards.first().locator('[data-testid="book-now-btn"]');
    }
        async clickFirstBookNow(){
            // 1. Wait for the event cards to render and become visible
            await this.eventCards.first().waitFor({state: 'visible'});
            // 2. Click the Book Now button on the first card
            await this.firstBookNowButton.click();
        }
    }
module.exports = { EventsPage };
